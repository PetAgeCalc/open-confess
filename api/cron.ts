import type { VercelRequest, VercelResponse } from '@vercel/node';

const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'open-confess';
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || '';

const LOCATIONS = [
  { city: 'Kolkata', country: 'India', lang: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', lang: 'Bengali' },
  { city: 'Delhi', country: 'India', lang: 'Hindi' },
  { city: 'Mumbai', country: 'India', lang: 'Hindi' },
  { city: 'Lucknow', country: 'India', lang: 'Hindi' },
  { city: 'London', country: 'UK', lang: 'English' }
];

const USERNAMES: Record<string, string[]> = {
  Bengali: ['KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik', 'Nil_Kabbo', 'EkaPothik'],
  Hindi: ['KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj', 'AlfaazMere', 'NeendUdi'],
  English: ['SilentVoyager', 'MidnightEcho', 'QuietRebel', 'UrbanSoul', 'AuraSeeker', 'SolitaryThinker']
};

const PHOTOS = [
  'photo-1558431382-27e303142255', 'photo-1609137144822-263a2339d6e4',
  'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
  'photo-1524504388940-b1c1722653e1', 'photo-1517841905240-472988babdf9',
  'photo-1506744038136-46273834b3fb', 'photo-1518199266791-5375a83190b7',
  'photo-1492562080023-ab3db95bfbce', 'photo-1470246973918-29a93221c455',
  'photo-1506126613408-eca07ce68773', 'photo-1542751371-adc38448a05e'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const names = USERNAMES[loc.lang] || USERNAMES.English;
    const author = names[Math.floor(Math.random() * names.length)];

    let langRule = 'Write strictly in modern English.';
    if (loc.lang === 'Bengali') langRule = 'Write strictly in authentic, emotional Bengali (বাংলা লিপি).';
    if (loc.lang === 'Hindi') langRule = 'Write strictly in emotional, conversational Hindi (देवनागरी लिपि).';

    const randomSeed = Math.random().toString(36).substring(2, 7);

    // 1. Groq AI Call
    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `Write an authentic, deeply moving confession about life, regret, or hidden feelings. City: ${loc.city}. ${langRule} Length: exactly 90-100 words. No hashtags, no quotes, no title. Seed: ${randomSeed}`
        }],
        temperature: 0.9
      })
    });

    const aiData = await aiRes.json();
    const confessionText = aiData.choices?.[0]?.message?.content?.trim();

    if (!confessionText) {
      return res.status(500).json({ error: 'AI generation failed' });
    }

    // 2. Guaranteed 45-50KB CDN Image
    const photoId = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
    const imageUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&h=420&q=70&fm=jpg&v=${Date.now()}`;

    // 3. Direct Firestore REST API Push (No SDK needed, instant cloud write)
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/confessions`;
    
    const docData = {
      fields: {
        authorName: { stringValue: author },
        text: { stringValue: confessionText },
        imageUrl: { stringValue: imageUrl },
        city: { stringValue: loc.city },
        country: { stringValue: loc.country },
        category: { stringValue: 'Raw Confessions' },
        likesCount: { integerValue: '0' },
        commentsCount: { integerValue: '0' },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    };

    const fsRes = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });

    if (!fsRes.ok) {
      const errText = await fsRes.text();
      return res.status(500).json({ error: 'Firestore write failed', details: errText });
    }

    return res.status(200).json({
      success: true,
      message: `Posted successfully from ${loc.city} (${loc.lang})`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

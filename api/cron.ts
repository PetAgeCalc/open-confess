import type { VercelRequest, VercelResponse } from '@vercel/node';

// Exact Firebase Project ID from your postsConfig
const FIREBASE_PROJECT_ID = 'open-confees';
const FIREBASE_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

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
    if (loc.lang === 'Bengali') langRule = 'Write strictly in authentic, emotional Bengali script (বাংলা লিপি).';
    if (loc.lang === 'Hindi') langRule = 'Write strictly in emotional, heartfelt Hindi script (देवनागरी लिपि).';

    const seed = Date.now();
    const systemPrompt = `You are a real person sharing an anonymous, emotional confession. City: ${loc.city}. ${langRule} Length: exactly 90-100 words. No intro, no title, no hashtags, no quotes. Output only the confession paragraph.`;

    // 1. Free AI Generator
    let confessionText = '';
    try {
      const aiUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?seed=${seed}&model=openai`;
      const aiRes = await fetch(aiUrl);
      confessionText = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
    } catch (e) {}

    // Fallback if AI is slow
    if (!confessionText || confessionText.length < 50) {
      if (loc.lang === 'Bengali') {
        confessionText = `${loc.city} শহরের এই কোলাহলের মাঝে প্রতিদিন নিজের ভেতরের একাকিত্বকে আড়াল করে বাঁচা খুব কঠিন হয়ে উঠছে। পরিবারের সবাইকে ভালো রাখতে গিয়ে নিজের ভালোলাगाগুলোকে কবে হারিয়ে ফেলেছি জানি না। হাসিমুখের পেছনে কতটা না-বলা কান্না জমে থাকে, তা কাউকে বোঝানো যায় না। মাঝে মাঝে ভীষণ ক্লান্ত লাগে, কিন্তু পথচলা থামানোর কোনো উপায় নেই।`;
      } else if (loc.lang === 'Hindi') {
        confessionText = `${loc.city} में रहते हुए बाहर से सब कुछ सामान्य नजर आता है, लेकिन कमरे की चारदीवारी में हर शाम एक अजीब सा अधूरापन घेर लेता है। घर पर फोन करके हमेशा कहता हूँ कि मैं बहुत खुश हूँ, लेकिन असल में जिम्मेदारियों का बोझ इतना भारी हो चुका है कि खुलकर हंसना भूल गया हूँ। खुद से हारने का डर सबसे ज्यादा तकलीफ देता है।`;
      } else {
        confessionText = `Living in ${loc.city} looks like an exciting life from the outside, but the silent weight of pretending to have everything together is exhausting. Every phone call back home feels like an audition where I act cheerful to keep my family proud. Carrying unspoken burdens alone in a crowded room is a lonely battle I fight every day.`;
      }
    }

    // 2. 50KB CDN Image
    const photoId = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
    const imageUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&h=420&q=70&fm=jpg&v=${seed}`;

    // 3. Firestore REST API with YOUR EXACT PROJECT & API KEY
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/confessions?key=${FIREBASE_API_KEY}`;

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

    const savedDoc = await fsRes.json();

    return res.status(200).json({
      success: true,
      id: savedDoc.name?.split('/').pop(),
      message: `Posted successfully from ${loc.city} (${loc.lang})`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Client config fallback
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'open-confess',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

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
    const systemPrompt = `You are an anonymous real person writing a heartfelt, emotional confession. City: ${loc.city}. ${langRule} Length: exactly 90-100 words. No intro, no title, no hashtags, no quotes. Just the raw confession.`;

    const aiUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?seed=${seed}&model=openai`;
    const aiRes = await fetch(aiUrl);
    let confessionText = await aiRes.text();
    confessionText = confessionText.trim().replace(/^["']|["']$/g, '');

    if (!confessionText || confessionText.length < 50) {
      if (loc.lang === 'Bengali') {
        confessionText = `${loc.city} শহরের এই চার দেয়ালে প্রতিদিন কত স্বপ্ন যে নিঃশব্দে হারিয়ে যায়। পরিবারের মুখে হাসি ফোটাতে গিয়ে নিজের ভালোলাগাগুলোকে কবে যেন বিসর্জন দিয়েছি। কাজের ব্যস্ততায় দিন কেটে যায় ঠিকই, কিন্তু রাতের নিস্তব্ধতায় মনে হয় আমি কি সত্যিই বাঁচছি নাকি কেবল টিকে থাকার অভিনয় করছি? বুকের ভেতর চেপে রাখা একরাশ না-বলা কথা কাউকেই বলা হয় না।`;
      } else if (loc.lang === 'Hindi') {
        confessionText = `${loc.city} की इस भागदौड़ में बाहर से सब ठीक नजर आता है, लेकिन कमरे के अकेलेपन में हर शाम एक अधूरापन घेर लेता है। घर पर फोन करके हमेशा कहता हूँ कि मैं बहुत खुश हूँ, लेकिन असल में जिम्मेदारियों का बोझ इतना भारी हो चुका है कि खुलकर मुस्कुराना भूल गया हूँ। कभी-कभी लगता है कि सब छोड़कर वापस चला जाऊँ, पर उम्मीदें रोक लेती हैं।`;
      } else {
        confessionText = `Living in ${loc.city} looks picturesque on social media, but the silent exhaustion of meeting endless expectations is slowly breaking me. Every call back home is a performance where I act cheerful so nobody worries. Carrying hidden anxiety while maintaining a composed smile is the heaviest price I pay each day.`;
      }
    }

    const photoId = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
    const imageUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&h=420&q=70&fm=jpg&v=${seed}`;

    // Direct Firebase SDK write
    const docRef = await addDoc(collection(db, 'confessions'), {
      authorName: author,
      text: confessionText,
      imageUrl: imageUrl,
      city: loc.city,
      country: loc.country,
      category: 'Raw Confessions',
      likesCount: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      id: docRef.id,
      message: `Posted successfully from ${loc.city} (${loc.lang})`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

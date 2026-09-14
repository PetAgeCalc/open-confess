import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  Bengali: ['KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik', 'Nil_Kabbo', 'EkaPothik', 'ShohorerChithi', 'ChokherJol'],
  Hindi: ['KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj', 'AlfaazMere', 'NeendUdi', 'RasteKeMusafir', 'YaadonKiDukaan'],
  English: ['SilentVoyager', 'MidnightEcho', 'QuietRebel', 'UrbanSoul', 'AuraSeeker', 'SolitaryThinker', 'CityLightsSoul', 'CandidNotes']
};

const PHOTOS = [
  'photo-1558431382-27e303142255', 'photo-1609137144822-263a2339d6e4',
  'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
  'photo-1524504388940-b1c1722653e1', 'photo-1517841905240-472988babdf9',
  'photo-1506744038136-46273834b3fb', 'photo-1518199266791-5375a83190b7',
  'photo-1492562080023-ab3db95bfbce', 'photo-1470246973918-29a93221c455',
  'photo-1506126613408-eca07ce68773', 'photo-1542751371-adc38448a05e'
];

const BENGALI_STORIES = [
  "শহরের এই চার দেয়ালের মাঝে প্রতিদিন কত স্বপ্ন যে নিঃশব্দে হারিয়ে যায়, তার হিসাব কেউ রাখে না। পরিবারের সবাইকে খুশি রাখতে গিয়ে নিজের ভালোলাগাগুলোকে কবে যেন বিসর্জন দিয়েছি। কাজের ব্যস্ততায় দিন কেটে যায় ঠিকই, কিন্তু রাতের বেলা নিস্তব্ধ ঘরের জানলায় দাঁড়িয়ে মনে হয় আমি কি সত্যিই বাঁচছি নাকি কেবল সাধারণ টিকে থাকার অভিনয় করে যাচ্ছি? কাউকে বলার মতো সাহস নেই, শুধু বুকের ভেতর চেপে রাখা একরাশ না-বলা কথা।",
  "আজ হঠাৎ পুরোনো ডায়েরির পাতা ওল্টাতে গিয়ে তোর দেওয়া সেই শুকনো গোলাপটা চোখে পড়ল। কত বছর কেটে গেল, শহর বদলে গেল, ব্যস্ততা বাড়ল, কিন্তু মনের কোণে জমে থাকা সেই না-বলা অভিমানটুকু আজও মুছে গেল না। তোর সাথে শেষ দেখা হওয়ার দিন যদি আর একটু সময় চাইতাম, হয়তো আজ গল্পটা অন্যরকম হতো। কিছু ভুল সারাজীবন বুকের গভীরে পাথর হয়ে থেকে যায়।",
  "বাইরে থেকে সবাই দেখে আমি খুব হাসিখুশি, ক্যারিয়ারে সফল একজন মানুষ। কিন্তু এই ফ্ল্যাটের বন্ধ দরজার ওপাশে যে কতটা নিঃসঙ্গতা আমাকে প্রতিদিন ঘিরে ধরে, সেটা কাউকে বোঝাতে পারব না। বাড়ি ফোন করে বলি খুব ভালো আছি, অথচ গলার কান্না চেপে কথা বলা যে কতটা যন্ত্রণার, তা শুধু আমি আর এই শূন্য ঘরটাই জানে। সবকিছু পেয়েও যেন ভেতরটা একেবারে ফাঁকা হয়ে গেছে।",
  "একটা ভুল সিদ্ধান্তের মাশুল যে মানুষকে এত বছর ধরে একা একা বয়ে বেড়াতে হয়, তা আগে বুঝিনি। ভালোবেসেও ছেড়ে এসেছিলাম ক্যারিয়ারের লোভে, আজ ব্যাংক ব্যালেন্স আছে কিন্তু মনের শান্তি নেই। ভিড়ের মাঝেও নিজেকে অচেনা লাগে।"
];

const HINDI_STORIES = [
  "शहर की इस भागदौड़ में बाहर से सब कुछ सामान्य नजर आता है, लेकिन इस फ्लैट के अकेलेपन में हर शाम एक अधूरापन घेर लेता है। घर पर फोन करके हमेशा कहता हूँ कि मैं बहुत खुश हूँ, लेकिन असल में जिम्मेदारियों का बोझ इतना भारी हो चुका है कि खुलकर मुस्कुराना भूल गया हूँ। कभी-कभी लगता है कि सब छोड़कर वापस चला जाऊँ, पर परिवार की उम्मीदें मुझे रोक लेती हैं। खुद से हारने का डर सबसे ज्यादा तकलीफ देता है।",
  "कॉर्पोरेट की इस चमक-दमक वाली जिंदगी में हर महीने सैलरी तो आ जाती है, लेकिन अंदर का सुकून कब खो गया पता ही नहीं चला। बचपन में सोचा था कि बड़े होकर अपनी मर्जी से जियूँगा, आज अपनी ही बनाई चारदीवारी का कैदी बन चुका हूँ। रोज़ सुबह झूठी मुस्कान ओढ़कर निकलना और रात को बिस्तर पर खालीपन से बातें करना, यही मेरी रोज़मर्रा की सच्चाई बन चुकी है।",
  "आज सालों बाद उसकी तस्वीर सोशल मीडिया पर देखी, वो अपनी ज़िंदगी में बहुत आगे बढ़ चुका है। दिल आज भी उसी मोड़ पर खड़ा है जहाँ उसने कहा था कि कभी-कभी अलग होना ही सही होता है। काश उस रोज़ थोड़ी सी ज़िद कर ली होती, शायद आज इस तरह अधूरी यादों के सहारे रातों को जागना न पड़ता। कुछ लोग दिल से कभी रुखसत नहीं होते।",
  "घर का बड़ा बेटा होने का दर्द सिर्फ वही समझ सकता है जो हर रोज़ अपने सपनों का गला घोंटकर अपनों की उम्मीदों को ज़िंदा रखता है। कोई नहीं पूछता कि तू कैसा है, सब बस यही पूछते हैं कि कितना कमा लेता है।"
];

const ENGLISH_STORIES = [
  "Living alone in a crowded metropolis looks exciting from the outside, but the silent weight of routine is slowly eroding who I used to be. Every call with my parents feels like a rehearsed performance of pretending everything is perfect when I am barely holding things together. Carrying expectations quietly while battling internal exhaustion is the hardest price of adult life, and I wonder when I will finally feel at peace again.",
  "I saw you across the subway platform this morning after three long years. For a fleeting second, our eyes met, and the entire world froze. You looked away, adjusted your coat, and walked onto the train as if we never shared late-night secrets on quiet rooftops. It is strange how two people who once knew everything about each other can turn into complete strangers with memories.",
  "I climbed the corporate ladder, secured the promotion, and moved into the high-rise apartment everyone dream about. Yet, standing by the panoramic window tonight, I have never felt more hollow. I traded away every genuine friendship and raw passion for a title that brings no warmth. Success feels terribly cold when there is nobody around to celebrate the small victories with.",
  "I smile in every team meeting, lead the presentations, and crack jokes over lunch. But the moment the door clicks shut in my empty apartment, the heavy silence rushes in. Social anxiety masked as confident professionalism is an exhausting way to survive, and nobody ever suspects a thing."
];

function getRandomFallback(lang: string, city: string): string {
  if (lang === 'Bengali') {
    const text = BENGALI_STORIES[Math.floor(Math.random() * BENGALI_STORIES.length)];
    return text.replace('শহরের', `${city} শহরের`);
  }
  if (lang === 'Hindi') {
    const text = HINDI_STORIES[Math.floor(Math.random() * HINDI_STORIES.length)];
    return text.replace('शहर की', `${city} की`);
  }
  const text = ENGLISH_STORIES[Math.floor(Math.random() * ENGLISH_STORIES.length)];
  return text.replace('a crowded metropolis', city);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const names = USERNAMES[loc.lang] || USERNAMES.English;
    const author = names[Math.floor(Math.random() * names.length)];

    let confessionText = '';

    // 1. Try AI generation with strict error & JSON checking
    try {
      const seed = Date.now();
      const langRule = loc.lang === 'Bengali' ? 'Bengali (বাংলা)' : loc.lang === 'Hindi' ? 'Hindi (हिंदी)' : 'English';
      const prompt = `Write an authentic first-person confession about regret or loneliness in ${loc.city}. Language: ${langRule}. Exactly 90-100 words. Output raw plain text only, no formatting, no quotes.`;

      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}&model=openai`, {
        signal: AbortSignal.timeout(6000)
      });

      if (aiRes.ok) {
        const raw = await aiRes.text();
        // Check: ensure it's not an error response or JSON dump
        if (raw && !raw.includes('"error"') && !raw.includes('deprecat') && raw.length >= 70) {
          confessionText = raw.trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (e) {
      // AI timeout or failure -> seamlessly falls through
    }

    // 2. Guaranteed high-quality emotional fallback if AI returns anything faulty
    if (!confessionText || confessionText.length < 60) {
      confessionText = getRandomFallback(loc.lang, loc.city);
    }

    // 3. Reliable 50KB CDN Image
    const photoId = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
    const imageUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&h=420&q=70&fm=jpg&v=${Date.now()}`;

    // 4. Firestore Direct REST Write
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

// Dual Firebase Configuration (Same as your verified Vercel backend)
const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';

const CLOUD_NAME = 'xjdv4l6v';
const BOT_STORAGE_LOCK = 'openconfess_bot_last_post_time_v2';
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'Hindi' | 'English';
}

const LOCATIONS: LocationProfile[] = [
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },
  { city: 'Delhi', country: 'India', langGroup: 'Hindi' },
  { city: 'Mumbai', country: 'India', langGroup: 'Hindi' },
  { city: 'Jaipur', country: 'India', langGroup: 'Hindi' },
  { city: 'Lucknow', country: 'India', langGroup: 'Hindi' },
  { city: 'Pune', country: 'India', langGroup: 'Hindi' },
  { city: 'London', country: 'UK', langGroup: 'English' },
  { city: 'New York', country: 'USA', langGroup: 'English' },
  { city: 'Los Angeles', country: 'USA', langGroup: 'English' },
  { city: 'Paris', country: 'France', langGroup: 'English' },
  { city: 'Tokyo', country: 'Japan', langGroup: 'English' },
  { city: 'Sydney', country: 'Australia', langGroup: 'English' },
  { city: 'Melbourne', country: 'Australia', langGroup: 'English' },
  { city: 'Berlin', country: 'Germany', langGroup: 'English' },
  { city: 'Toronto', country: 'Canada', langGroup: 'English' },
  { city: 'Dubai', country: 'UAE', langGroup: 'English' },
  { city: 'Singapore', country: 'Singapore', langGroup: 'English' },
  { city: 'Amsterdam', country: 'Netherlands', langGroup: 'English' },
  { city: 'Chicago', country: 'USA', langGroup: 'English' }
];

const BENGALI_USERNAMES = [
  'KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik',
  'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'Nil_Kabbo',
  'EkaPothik', 'SondhaTara', 'BristirGaan', 'HariyeJawaMon'
];

const HINDI_USERNAMES = [
  'KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj',
  'RasteKeMusafir', 'ZindagiDiary', 'NeendUdi', 'AlfaazMere',
  'BefikraRooh', 'YaadonKiDukaan'
];

const GLOBAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel',
  'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 'UrbanSoul',
  'WanderlustWren', 'GreySkyDiary', 'PixelNomad'
];

interface CategoryDef {
  category: string;
  photoIds: string[];
  bengali: string;
  hindi: string;
  english: string;
  tags: string;
  comments: { bengali: string[]; hindi: string[]; english: string[] };
}

const CATEGORIES: CategoryDef[] = [
  {
    category: 'True Love & Soul Connections',
    photoIds: ['photo-1518199266791-5375a83190b7', 'photo-1529333166437-7750a6dd5a70', 'photo-1516589178581-6cd7833ae3b2'],
    bengali: 'খাঁটি ভালোবাসার গভীর টান, নিঃস্বার্থ অনুভূতি এবং আজীবন পাশে থাকার নীরব প্রতিশ্রুতি',
    hindi: 'सच्चा प्यार, रूहानी रिश्ता और हर मुश्किल घड़ी में बिना शर्त साथ निभाने का एहसास',
    english: 'pure unconditional love, deep emotional connection and finding home in a person',
    tags: '#TrueLove #Soulmate #UnconditionalLove',
    comments: {
      bengali: ['এই লেখাটা পড়ে চোখে জল চলে এলো, খুব সুন্দর লিখেছো।', 'ভালোবাসা এমনই হওয়া উচিত।'],
      hindi: ['काश हर किसी को ऐसा प्यार मिले, दिल छू गया।', 'सच्चे प्यार की ताकत ही अलग होती है।'],
      english: ['This is what real love looks like, beautifully written.', 'Made me believe in love stories again.']
    }
  },
  {
    category: 'Motivational Quotes & Resilience',
    photoIds: ['photo-1499209974431-9dddcece7f88', 'photo-1470246973918-29a93221c455', 'photo-1500530855697-b586d89ba3ee'],
    bengali: 'হেরে না যাওয়ার প্রেরণা, জীবনের কঠিন পরিস্থিতিতে ঘুরে দাঁড়ানো এবং নিজের ওপর অটুট বিশ্বাস',
    hindi: 'हालातों से लड़कर उठ खड़े होने की प्रेरणा, हौसलों की उड़ान और खुद पर अटूट यकीन',
    english: 'unbreakable resilience, rising from rock bottom and conquering personal fears',
    tags: '#Motivation #NeverGiveUp #Resilience',
    comments: {
      bengali: ['ঠিক সময়ে এই পোস্টটা পড়লাম, ধন্যবাদ।', 'হাল ছাড়লে তো আর কিছুই নেই, এগিয়ে চলো।'],
      hindi: ['बहुत जरूरी बात लिखी है, शुक्रिया।', 'हार मान ली तो सब खत्म, लड़ते रहो।'],
      english: ['Exactly what I needed to hear today.', 'Never quit, this post says it all.']
    }
  },
  {
    category: 'Work & Corporate Hustle',
    photoIds: ['photo-1486312338219-ce68d2c6f44d', 'photo-1498050108023-c5249f4df085', 'photo-1519389950473-47ba0277781c'],
    bengali: 'অফিসের অমানবিক প্রেশার, বসের টক্সিক রাজনীতি আর ক্যারিয়ারের ক্লান্তিকর লড়াই',
    hindi: 'कॉर्पोरेट की 9-to-5 गुलामी, टॉक्सिक बॉस और ईएमआई के चक्कर में पिसती जिंदगी',
    english: 'corporate burnout, impossible deadlines and pretending to love a toxic job',
    tags: '#CorporateLife #Burnout #9to5Hustle',
    comments: {
      bengali: ['অফিসের এই গল্পটা যেন আমারটাই।', 'মাস শেষে ব্যাংক ব্যালান্স দেখলে কাঁদতে ইচ্ছে করে।'],
      hindi: ['ये तो मेरी ही कहानी लग रही है।', 'सैलरी आते ही EMI खा जाती है।'],
      english: ['This is literally my daily routine.', 'Salary arrives and the bills swallow it instantly.']
    }
  }
];

const BENGALI_FALLBACKS = [
  "যখন সব পথ বন্ধ মনে হয়, তখনই বিশ্বাস রাখতে হয় যে ভাঙা মন দিয়েই জীবনের সেরা গল্পটা শুরু হয়। হেরে যাওয়া কোনো লজ্জা নয়, কিন্তু আবার ঘুরে না দাঁড়ানোই সবচেয়ে বড় পরাজয়। #Motivation #NeverGiveUp #StayStrong",
  "মেট্রোর ভিড়ে আজও তোর পরিচিত গন্ধটা যেন বাতাসে ভেসে আসে। সম্পর্ক শেষ হয়েছে ঠিকই, কিন্তু বুকের ভেতরের অনুভূতিটা মলিন হয়নি। #TrueLove #Soulmate #UnspokenLove"
];

const HINDI_FALLBACKS = [
  "जिंदगी जब इम्तिहान लेती है, तो रास्ता खुद ढूंढना पड़ता है। ठोकरें हमें गिराने के लिए नहीं, बल्कि संभलकर चलना सिखाने के लिए आती हैं। #Motivation #NeverGiveUp #StayStrong",
  "सच्चा प्यार वो नहीं जो सिर्फ हासिल करने की ख्वाहिश रखे, बल्कि वो है जो दूर रहकर भी उसकी खुशियों की दुआ मांगे। #TrueLove #Soulmate #PureLove"
];

const ENGLISH_FALLBACKS = [
  "You did not survive all those silent battles just to give up now. Rock bottom will always teach you lessons that success never could. Keep your head up. #Motivation #NeverGiveUp #Resilience",
  "Adult life is just sitting in traffic after a ten-hour shift realizing how easily childhood happiness was taken for granted. #CorporateLife #Burnout #AdultingHard"
];

function getUsername(lang: 'Bengali' | 'Hindi' | 'English'): string {
  if (Math.random() < 0.35) return 'Anonymous';
  if (lang === 'Bengali') return BENGALI_USERNAMES[Math.floor(Math.random() * BENGALI_USERNAMES.length)];
  if (lang === 'Hindi') return HINDI_USERNAMES[Math.floor(Math.random() * HINDI_USERNAMES.length)];
  return GLOBAL_USERNAMES[Math.floor(Math.random() * GLOBAL_USERNAMES.length)];
}

// Main Runner Function
export async function runAutoFeedBot(force = false): Promise<boolean> {
  try {
    const now = Date.now();
    const lastPosted = localStorage.getItem(BOT_STORAGE_LOCK);

    // Agar force nahi hai aur 15 minute poore nahi hue to skip
    if (!force && lastPosted && now - Number(lastPosted) < FIFTEEN_MINUTES_MS) {
      return false;
    }

    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    let targetLang: 'Bengali' | 'Hindi' | 'English' = 'English';
    if (loc.langGroup === 'Bengali') targetLang = 'Bengali';
    else if (loc.langGroup === 'Hindi') targetLang = Math.random() < 0.7 ? 'Hindi' : 'English';

    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const author = getUsername(targetLang);
    const nowIso = new Date().toISOString();

    // 1. AI Post Generation (pollinations with fast timeout)
    let postText = '';
    const promptTopic = targetLang === 'Bengali' ? cat.bengali : targetLang === 'Hindi' ? cat.hindi : cat.english;
    const langRule = targetLang === 'Bengali' ? 'Bengali (বাংলা)' : targetLang === 'Hindi' ? 'Hindi (हिंदी)' : 'English';

    const prompt = `Write an authentic short social confession post about: "${promptTopic}".
Location: ${loc.city}, ${loc.country}.
Language: Strictly ${langRule}.
Length: 75 to 95 words.
Must append hashtags at end: ${cat.tags} #${loc.city.replace(/\s+/g, '')}.
Plain text only.`;

    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${now}&model=openai`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const text = (await res.text()).trim().replace(/^["']|["']$/g, '');
        if (text && !text.includes('error') && text.length > 50) {
          postText = text;
        }
      }
    } catch {}

    // Fallback if AI is slow
    if (!postText) {
      if (targetLang === 'Bengali') {
        postText = BENGALI_FALLBACKS[Math.floor(Math.random() * BENGALI_FALLBACKS.length)];
      } else if (targetLang === 'Hindi') {
        postText = HINDI_FALLBACKS[Math.floor(Math.random() * HINDI_FALLBACKS.length)];
      } else {
        postText = ENGLISH_FALLBACKS[Math.floor(Math.random() * ENGLISH_FALLBACKS.length)];
      }
    }

    // 2. Cloudinary Optimized Image
    const photoId = cat.photoIds[Math.floor(Math.random() * cat.photoIds.length)];
    const rawSourceUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&h=420&q=75`;
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_600,h_420,c_fill/${encodeURIComponent(rawSourceUrl)}`;

    // 3. Post to 'open-confees' Firestore (Standard REST Payload)
    const postRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?key=${POSTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            authorName: { stringValue: author },
            author: { stringValue: author },
            text: { stringValue: postText },
            body: { stringValue: postText },
            content: { stringValue: postText },
            imageUrl: { stringValue: imageUrl },
            image: { stringValue: imageUrl },
            city: { stringValue: loc.city },
            country: { stringValue: loc.country },
            category: { stringValue: cat.category },
            likesCount: { integerValue: '0' },
            likes: { integerValue: '0' },
            commentsCount: { integerValue: '0' },
            comments: { integerValue: '0' },
            createdAt: { stringValue: nowIso },
            createdA: { stringValue: nowIso },
            timestamp: { integerValue: String(now) }
          }
        })
      }
    );

    if (postRes.ok) {
      localStorage.setItem(BOT_STORAGE_LOCK, String(now));
      // Feed cache clear karte hain taaki fresh post screen par turant aaye
      localStorage.removeItem('open_confess_feed_cache_instant_v1');
      console.log('✅ AutoFeedBot: Successfully published new post from', loc.city);
      return true;
    } else {
      console.error('❌ AutoFeedBot: Firebase rejected post', await postRes.text());
      return false;
    }
  } catch (err) {
    console.error('❌ AutoFeedBot Error:', err);
    return false;
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================================
// DUAL FIREBASE SETUP
// ============================================================
const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';

// Cloudinary Cloud Name
const CLOUD_NAME = 'xjdv4l6v';

// ============================================================
// FULL 15 CATEGORIES — REAL HANDLES (English, Hindi, Bangla)
// ============================================================
interface FeedTarget {
  handle: string;
  category: string;
  lang: 'English' | 'Hindi' | 'Bengali';
  city: string;
  country: string;
}

const X_FEEDS: FeedTarget[] = [
  // 1. News & Breaking Headlines
  { handle: 'BBCBreaking', category: 'News & Breaking Headlines', lang: 'English', city: 'London', country: 'UK' },
  { handle: 'aajtak', category: 'News & Breaking Headlines', lang: 'Hindi', city: 'Delhi', country: 'India' },
  { handle: 'abpanandatv', category: 'News & Breaking Headlines', lang: 'Bengali', city: 'Kolkata', country: 'India' },

  // 2. Politics & Public Debate
  { handle: 'Reuters', category: 'Politics & Public Debate', lang: 'English', city: 'Washington', country: 'USA' },
  { handle: 'ZeeNews', category: 'Politics & Public Debate', lang: 'Hindi', city: 'Lucknow', country: 'India' },
  { handle: 'ProthomAlo', category: 'Politics & Public Debate', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh' },

  // 3. Cricket Mania
  { handle: 'ICC', category: 'Cricket Mania', lang: 'English', city: 'Dubai', country: 'UAE' },
  { handle: 'BCCI', category: 'Cricket Mania', lang: 'Hindi', city: 'Mumbai', country: 'India' },
  { handle: 'BCBtigers', category: 'Cricket Mania', lang: 'Bengali', city: 'Chittagong', country: 'Bangladesh' },

  // 4. Football & World Sports
  { handle: 'FabrizioRomano', category: 'Football & World Sports', lang: 'English', city: 'Rome', country: 'Italy' },
  { handle: 'Goal_India', category: 'Football & World Sports', lang: 'Hindi', city: 'Kolkata', country: 'India' },
  { handle: 'premierleague', category: 'Football & World Sports', lang: 'English', city: 'Manchester', country: 'UK' },

  // 5. Entertainment, Cinema & Pop Culture
  { handle: 'Variety', category: 'Entertainment, Cinema & Pop Culture', lang: 'English', city: 'Los Angeles', country: 'USA' },
  { handle: 'filmfare', category: 'Entertainment, Cinema & Pop Culture', lang: 'Hindi', city: 'Mumbai', country: 'India' },
  { handle: 'SangbadPratidin', category: 'Entertainment, Cinema & Pop Culture', lang: 'Bengali', city: 'Kolkata', country: 'India' },

  // 6. Funny, Memes & Sarcasm
  { handle: '9GAG', category: 'Funny, Memes & Sarcasm', lang: 'English', city: 'New York', country: 'USA' },
  { handle: 'sagarcasm', category: 'Funny, Memes & Sarcasm', lang: 'Hindi', city: 'Pune', country: 'India' },
  { handle: 'BengaliMemes', category: 'Funny, Memes & Sarcasm', lang: 'Bengali', city: 'Howrah', country: 'India' },

  // 7. True Love & Soul Connections
  { handle: 'LoveNotes', category: 'True Love & Soul Connections', lang: 'English', city: 'Paris', country: 'France' },
  { handle: 'PyaarKiBaatein', category: 'True Love & Soul Connections', lang: 'Hindi', city: 'Jaipur', country: 'India' },
  { handle: 'KobitarSondha', category: 'True Love & Soul Connections', lang: 'Bengali', city: 'Kolkata', country: 'India' },

  // 8. Heartbreak & Pain
  { handle: 'BrokenQuotes', category: 'Heartbreak & Pain', lang: 'English', city: 'Chicago', country: 'USA' },
  { handle: 'Dard_E_Dil', category: 'Heartbreak & Pain', lang: 'Hindi', city: 'Delhi', country: 'India' },
  { handle: 'EkaMonerChithi', category: 'Heartbreak & Pain', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh' },

  // 9. Motivational Quotes & Resilience
  { handle: 'DailyWisdom', category: 'Motivational Quotes & Resilience', lang: 'English', city: 'Toronto', country: 'Canada' },
  { handle: 'PrernaQuotes', category: 'Motivational Quotes & Resilience', lang: 'Hindi', city: 'Mumbai', country: 'India' },
  { handle: 'Anuronon', category: 'Motivational Quotes & Resilience', lang: 'Bengali', city: 'Kolkata', country: 'India' },

  // 10. Real Life Struggles & Stories
  { handle: 'HumansOfNY', category: 'Real Life Struggles & Stories', lang: 'English', city: 'New York', country: 'USA' },
  { handle: 'ZindagiNama', category: 'Real Life Struggles & Stories', lang: 'Hindi', city: 'Patna', country: 'India' },
  { handle: 'ManusherKotha', category: 'Real Life Struggles & Stories', lang: 'Bengali', city: 'Siliguri', country: 'India' },

  // 11. Work & Corporate Hustle
  { handle: 'CorporateLife', category: 'Work & Corporate Hustle', lang: 'English', city: 'Singapore', country: 'Singapore' },
  { handle: 'CorporateDost', category: 'Work & Corporate Hustle', lang: 'Hindi', city: 'Bengaluru', country: 'India' },
  { handle: 'ChakriJibon', category: 'Work & Corporate Hustle', lang: 'Bengali', city: 'Kolkata', country: 'India' },

  // 12. Family & Home Bonds
  { handle: 'FamilyMemories', category: 'Family & Home Bonds', lang: 'English', city: 'Melbourne', country: 'Australia' },
  { handle: 'GharParivar', category: 'Family & Home Bonds', lang: 'Hindi', city: 'Bhopal', country: 'India' },
  { handle: 'ParibarKotha', category: 'Family & Home Bonds', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh' },

  // 13. Travel & Global Adventures
  { handle: 'NatGeoTravel', category: 'Travel & Global Adventures', lang: 'English', city: 'San Francisco', country: 'USA' },
  { handle: 'MusafirBharat', category: 'Travel & Global Adventures', lang: 'Hindi', city: 'Manali', country: 'India' },
  { handle: 'BhromonKatha', category: 'Travel & Global Adventures', lang: 'Bengali', city: 'Darjeeling', country: 'India' },

  // 14. Tech, AI & Future World
  { handle: 'TechCrunch', category: 'Tech, AI & Future World', lang: 'English', city: 'San Francisco', country: 'USA' },
  { handle: 'Gadgets360', category: 'Tech, AI & Future World', lang: 'Hindi', city: 'Noida', country: 'India' },
  { handle: 'TechBanglaNews', category: 'Tech, AI & Future World', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh' },

  // 15. Fitness, Health & Lifestyle
  { handle: 'FitLifeDaily', category: 'Fitness, Health & Lifestyle', lang: 'English', city: 'Sydney', country: 'Australia' },
  { handle: 'SwasthyaTips', category: 'Fitness, Health & Lifestyle', lang: 'Hindi', city: 'Chandigarh', country: 'India' },
  { handle: 'SusthoJibon', category: 'Fitness, Health & Lifestyle', lang: 'Bengali', city: 'Kolkata', country: 'India' }
];

// ============================================================
// STRICT CATEGORY & LANGUAGE MATCHED COMMENTS
// ============================================================
const CATEGORY_COMMENTS: Record<string, { English: string[]; Hindi: string[]; Bengali: string[] }> = {
  'News & Breaking Headlines': {
    English: ['Following this breaking situation closely.', 'Hope the authorities take immediate action.', 'Thanks for the timely update.'],
    Hindi: ['सुबह से इस खबर की चर्चा चल रही है।', 'प्रशासन को तुरंत ध्यान देना चाहिए।', 'सटीक और जरूरी अपडेट भाई।'],
    Bengali: ['সকাল থেকেই এই খবরটা নিয়ে তোলপাড় চলছে।', 'প্রশাসনের দ্রুত ব্যবস্থা নেওয়া দরকার।', 'সঠিক সময় লাইভ আপডেট দেওয়ার জন্য ধন্যবাদ।']
  },
  'Politics & Public Debate': {
    English: ['A very rational and balanced viewpoint on this policy.', 'Ground reality is always different from promises.', 'Spot on analysis.'],
    Hindi: ['वादे बड़े होते हैं पर जमीनी हकीकत कुछ और है।', 'बिल्कुल निष्पक्ष राय रखी है आपने।', 'इस मुद्दे पर बात होना बहुत जरूरी था।'],
    Bengali: ['রাজনীতিতে সাধারণ মানুষের স্বার্থটাই হারিয়ে যায়।', 'যুক্তিপূর্ণ বিশ্লেষণ, একমত হলাম।', 'এই বিষয়ে আলোচনা হওয়া প্রয়োজন ছিল।']
  },
  'Cricket Mania': {
    English: ['What an absolute nail-biting encounter!', 'That over was pure cinema.', 'Cricket at its absolute peak!'],
    Hindi: ['क्या गजब का मैच हुआ भाई!', 'लास्ट ओवर में दिल की धड़कनें तेज हो गई थीं।', 'ये खिलाड़ी सच में मैच विनर है।'],
    Bengali: ['কী রোমাঞ্চকর ম্যাচ ছিল কালকের!', 'এই ওভারটা ইতিহাস হয়ে থাকবে।', 'পরের ম্যাচটায় জিততেই হবে আমাদের।']
  },
  'Football & World Sports': {
    English: ['Pure class and determination on the pitch.', 'That goal was unbelievable!', 'The stadium atmosphere was electric.'],
    Hindi: ['क्या शानदार खेल दिखाया टीम ने!', 'रोंगटे खड़े कर देने वाला मैच था।', 'फुटबॉल का असली रोमांच यही है।'],
    Bengali: ['ইনজুরি টাইমের গোলটা অবিশ্বাস্য ছিল!', 'স্টেডিয়ামের পরিবেশটা দেখার মতো ছিল।', 'দারুণ ট্যাকটিকাল গেম খেলেছে।']
  },
  'Entertainment, Cinema & Pop Culture': {
    English: ['Loved the visual direction and acting!', 'Booking tickets for this weekend for sure.', 'Truly worth all the hype.'],
    Hindi: ['फर्स्ट डे देखा था, पूरा पैसा वसूल!', 'अभिनय सच में काबिले तारीफ था।', 'गाने भी बहुत कमाल के बने हैं।'],
    Bengali: ['সিনেমাটা অসাধারণ হয়েছে, সবার দেখা উচিত!', 'ব্যাকগ্রাউন্ড মিউজিকটা পুরো গায়ে কাঁটা দিল।', 'উইকএন্ডের প্ল্যান রেডি হয়ে গেল।']
  },
  'Funny, Memes & Sarcasm': {
    English: ['I cannot stop laughing at this!', 'The accuracy in this hurts.', 'Shared to my group chat immediately!'],
    Hindi: ['हंसते-हंसते लोटपोट हो गए!', 'ये तो मेरे ही दोस्त की हरकत लग रही है।', 'सेंस ऑफ ह्यूमर कमाल है भाई आपका।'],
    Bengali: ['হাসতে হাসতে পেট ব্যথা হয়ে গেল ভাই!', 'একদম নিখুঁত কমেডি টাইমিং।', 'বন্ধুদের গ্রুপে এখনই পাঠাচ্ছি হাসির জন্য।']
  },
  'True Love & Soul Connections': {
    English: ['Beautifully written and deeply moving.', 'Pure love stories like this are rare now.', 'Made me smile so genuinely.'],
    Hindi: ['सच्ची मोहब्बत की बात ही अलग होती है।', 'दिल को छू लेने वाले सच्चे शब्द हैं।', 'काश हर किसी को ऐसा प्यार मिले।'],
    Bengali: ['পড়ে চোখে জল চলে এলো, খুব সুন্দর লিখেছো।', 'ভালোবাসা এমনই অমূল্য হওয়া উচিত।', 'নিজের মিষ্টি স্মৃতিগুলোর কথা মনে পড়ে গেল।']
  },
  'Heartbreak & Pain': {
    English: ['Healing takes time, stay strong.', 'Felt every single word of this.', 'Better days are ahead, hang in there.'],
    Hindi: ['वक्त हर जख्म भर देता है भाई, हिम्मत रखो।', 'अधूरी मोहब्बत का दर्द सबसे गहरा होता है।', 'महसूस हुआ तुम्हारा हर एक लफ्ज।'],
    Bengali: ['শক্ত হও বন্ধু, সময় সব ক্ষত সারিয়ে দেবে।', 'আমরা সবাই কোনো না কোনো রাতে এভাবে ভেঙেছি।', 'লেখাটা মনের গভীরে দাগ কেটে গেল।']
  },
  'Motivational Quotes & Resilience': {
    English: ['Exactly the motivation I needed today.', 'Never back down, keep grinding.', 'Solid perspective, respect.'],
    Hindi: ['दिन की शुरुआत के लिए यही हौसला चाहिए था!', 'हार मानना कोई विकल्प नहीं है।', 'बहुत ही शानदार और हिम्मत देने वाला पोस्ट।'],
    Bengali: ['ঠিক এই কথাটাই আজ শোনার খুব দরকার ছিল!', 'হাল ছাড়া যাবে না, লড়াই চলবে।', 'দারুণ প্রেরণাদায়ক লেখা, ধন্যবাদ।']
  },
  'Real Life Struggles & Stories': {
    English: ['The raw honesty in this story is unmatched.', 'Reminds me of my family struggles.', 'Respect for everyone fighting silent battles.'],
    Hindi: ['यही तो असल जिंदगी की जमीनी सच्चाई है।', 'मध्यम वर्ग का दर्द कोई नहीं समझता।', 'दिल को छू लेने वाली सच्ची बात।'],
    Bengali: ['একদম আমাদের জীবনের বাস্তব রূপ ফুটে উঠেছে।', 'লড়াইটাই সাধারণ মানুষের আসল পরিচয়।', 'সত্যি কথা সাহসের সাথে তুলে ধরেছো।']
  },
  'Work & Corporate Hustle': {
    English: ['Every corporate employee felt this deep in their soul.', 'Work life balance has become completely fictional.', 'Counting down the hours until Friday night.'],
    Hindi: ['ये तो मेरी ही ऑफिस लाइफ की कहानी है।', 'सैलरी आते ही बिल भरने में उड़ जाती है।', 'वीकेंड कब आएगा बस इसी का इंतजार रहता है।'],
    Bengali: ['অফিসে বসে এই পোস্টটা পড়তে গিয়ে দীর্ঘশ্বাস বেরোল।', 'ছুটির দিনটাও অফিস মেইল চেক করতে করতে যায়।', 'কাজের চাপে নিজের জীবনটাই হারিয়ে গেছে।']
  },
  'Family & Home Bonds': {
    English: ['Nothing in this world replaces family warmth.', 'Calling my parents right now after reading this.', 'Cherishing these precious memories forever.'],
    Hindi: ['मां-बाप के बिना घर सूना लगता है।', 'परिवार की अहमियत हर सुख से ऊपर है।', 'पढ़कर मन बहुत भावुक हो गया।'],
    Bengali: ['পোস্টটা পড়ে মায়ের হাতের রান্নার কথা খুব মনে পড়ল।', 'পরিবারের চেয়ে বড় শান্তির আশ্রয় আর কিছু নেই।', 'খুব মিষ্টি আর আবেগঘন একটা লেখা।']
  },
  'Travel & Global Adventures': {
    English: ['Adding this location to my bucket list right now!', 'Breathtaking visual and great trip notes.', 'Traveling keeps the human spirit alive.'],
    Hindi: ['तस्वीर देखकर ही दिल खुश हो गया!', 'अगली ट्रिप की प्लानिंग अब पक्की है।', 'सफर का असली आनंद ऐसे ही अनछुए रास्तों में है।'],
    Bengali: ['ছবিটা দেখে এখনই ব্যাগ গুছিয়ে বেরিয়ে পড়তে ইচ্ছে করছে!', 'এই জায়গাটার বিস্তারিত রুট ম্যাপটা দিও।', 'ভ্রমণের অনুভূতি নিখুঁত বর্ণনা করেছো।']
  },
  'Tech, AI & Future World': {
    English: ['AI pace is truly mind-boggling right now.', 'Continuous learning is the only shield.', 'Insightful perspective on modern tech culture.'],
    Hindi: ['AI जिस तेजी से बढ़ रहा है, अपडेट रहना जरूरी है।', 'टेक्नोलॉजी ने काम आसान किया है पर नई चुनौतियां भी हैं।', 'बेहतरीन और उपयोगी टेक अपडेट।'],
    Bengali: ['প্রযুক্তি যে গতিতে এগোচ্ছে তাতে তৈরি থাকতেই হবে।', 'এআই নিয়ে আলোচনাটা বর্তমান সময়ের জন্য খুবই প্রাসঙ্গিক।', 'নতুন টেকনোলজি সত্যিই চমৎকার।']
  },
  'Fitness, Health & Lifestyle': {
    English: ['Consistency is the key to healthy living.', 'Setting goals and smashing them every single day.', 'Great daily reminder!'],
    Hindi: ['सेहत ही असली दौलत है, सही बात कही।', 'रोज अनुशासन बनाए रखना सबसे जरूरी है।', 'शानदार फिटनेस मोटिवेशन!'],
    Bengali: ['শারীরিক সুস্থতাই জীবনের সবচেয়ে বড় সম্পদ।', 'নিয়ম মেনে চলাই দীর্ঘমেয়াদী উন্নতির চাবিকাঠি।', 'দারুণ পোস্ট, ধন্যবাদ।']
  }
};

const BENGALI_USERNAMES = ['ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'KolkataMemes', 'EkaPothik', 'PadmaPar', 'AddaMaster'];
const HINDI_USERNAMES = ['DilliWalaShayar', 'MemeBoiIndia', 'ZindagiDiary', 'ChaiLoverAmit', 'SapnoKaShehar', 'KhamoshMusafir'];
const GLOBAL_USERNAMES = ['SilentVoyager', 'MidnightEcho', 'CityLightsSoul', 'PixelNomad', 'DailyByte', 'CafeHopperJoe'];

function getUsername(lang: 'English' | 'Hindi' | 'Bengali'): string {
  if (Math.random() < 0.35) return 'Anonymous';
  if (lang === 'Bengali') return BENGALI_USERNAMES[Math.floor(Math.random() * BENGALI_USERNAMES.length)];
  if (lang === 'Hindi') return HINDI_USERNAMES[Math.floor(Math.random() * HINDI_USERNAMES.length)];
  return GLOBAL_USERNAMES[Math.floor(Math.random() * GLOBAL_USERNAMES.length)];
}

function detectLang(text: string): 'English' | 'Hindi' | 'Bengali' {
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  return 'English';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Shuffled Real Target Feed
    const target = X_FEEDS[Math.floor(Math.random() * X_FEEDS.length)];

    // 2. Fetch live real X (Twitter) RSS Feed via Nitter instances
    const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://nitter.net/${target.handle}/rss`;
    let postText = '';
    let realTweetPhoto = '';

    try {
      const rssRes = await fetch(rssJsonUrl, { signal: AbortSignal.timeout(5000) });
      if (rssRes.ok) {
        const rssData = await rssRes.json();
        if (rssData.items && rssData.items.length > 0) {
          // Strictly find a post that has an original image attached (Filter out pure text & videos)
          for (const item of rssData.items) {
            const desc = item.description || '';
            const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/i);

            // Skip if video tag found
            if (desc.includes('<video') || desc.includes('.mp4')) continue;

            if (imgMatch && imgMatch[1]) {
              postText = (item.title || desc.replace(/<[^>]+>/g, '')).trim();
              realTweetPhoto = imgMatch[1];
              break;
            }
          }
        }
      }
    } catch (e) {}

    // Safeguard: Agar X RSS temporarily slow ho, toh verified dynamic topic candid photo
    if (!realTweetPhoto) {
      const fallbackTag = encodeURIComponent(target.category.split(' ')[0].toLowerCase());
      realTweetPhoto = `https://loremflickr.com/720/480/${fallbackTag}?random=${Date.now() % 1000}`;
    }

    if (!postText) {
      postText = `Breaking updates and live community reactions coming in from ${target.city}, ${target.country} regarding ongoing trends. #${target.category.replace(/[^a-zA-Z0-9]/g, '')} #${target.city.replace(/\s+/g, '')} #TrendingNow`;
    }

    // 3. Compress original image to ~45-50KB WebP/JPG via Cloudinary
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(realTweetPhoto)}`;

    // 4. Save Main Real Post to 'open-confees' DB
    const nowIso = new Date().toISOString();
    const nowTime = Date.now();
    const author = getUsername(target.lang);

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
            city: { stringValue: target.city },
            country: { stringValue: target.country },
            category: { stringValue: target.category },
            likesCount: { integerValue: '0' },
            likes: { integerValue: '0' },
            commentsCount: { integerValue: '0' },
            comments: { integerValue: '0' },
            createdAt: { stringValue: nowIso },
            createdA: { stringValue: nowIso },
            timestamp: { integerValue: String(nowTime) }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // ============================================================
    // 5. SLOW ORGANIC ENGAGEMENT (Matching Category & Realistic Growth)
    // ============================================================
    try {
      const listRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?pageSize=15&key=${POSTS_API_KEY}`
      );
      const listData = await listRes.json();
      const documents = listData.documents || [];

      for (const doc of documents) {
        const pId = doc.name?.split('/').pop();
        if (!pId || pId === newPostId) continue;

        const fields = doc.fields || {};
        const pText = fields.text?.stringValue || fields.body?.stringValue || '';
        const pCategory = fields.category?.stringValue || 'News & Breaking Headlines';
        const currentComments = parseInt(fields.commentsCount?.integerValue || fields.comments?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || fields.likes?.integerValue || '0', 10);
        const pLang = detectLang(pText);

        // Sirf 22% chance taaki har post ekdum se na bhare (Natural slow growth)
        if (Math.random() < 0.22 && currentComments < 15) {
          // STRICT RULE: Post ki matching category aur matching language se hi comment pick hoga
          const catPool = CATEGORY_COMMENTS[pCategory] || CATEGORY_COMMENTS['News & Breaking Headlines'];
          const commentPool = catPool[pLang] || catPool['English'];
          const commentContent = commentPool[Math.floor(Math.random() * commentPool.length)];
          const commenterName = getUsername(pLang);

          // Save comment to interactions DB
          await fetch(
            `https://firestore.googleapis.com/v1/projects/${INTERACTIONS_PROJECT_ID}/databases/(default)/documents/comments?key=${INTERACTIONS_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  confessionId: { stringValue: pId },
                  postId: { stringValue: pId },
                  authorName: { stringValue: commenterName },
                  author: { stringValue: commenterName },
                  text: { stringValue: commentContent },
                  body: { stringValue: commentContent },
                  createdAt: { stringValue: new Date().toISOString() }
                }
              })
            }
          ).catch(() => {});

          // Natural increment: Likes sirf +1 ya +2, comments +1
          const addedLikes = Math.random() < 0.6 ? 1 : 2;
          const newLikes = currentLikes + addedLikes;
          const newComments = currentComments + 1;

          await fetch(
            `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${pId}?updateMask.fieldPaths=commentsCount&updateMask.fieldPaths=comments&updateMask.fieldPaths=likesCount&updateMask.fieldPaths=likes&key=${POSTS_API_KEY}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  commentsCount: { integerValue: String(newComments) },
                  comments: { integerValue: String(newComments) },
                  likesCount: { integerValue: String(newLikes) },
                  likes: { integerValue: String(newLikes) }
                }
              })
            }
          ).catch(() => {});
          break; // Ek cron cycle me sirf 1 previous post update hogi
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: target.category,
      language: target.lang,
      location: `${target.city}, ${target.country}`,
      imageUrl,
      message: `Direct X post and real photo copied from @${target.handle}`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

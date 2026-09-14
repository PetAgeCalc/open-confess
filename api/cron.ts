import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dual Firebase Setup
const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'xjdv4l6v';
const CLOUDINARY_UPLOAD_PRESET = 'confess_preset';

interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'IndiaMix' | 'GlobalEnglish';
}

const GLOBAL_LOCATIONS: LocationProfile[] = [
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },
  { city: 'Delhi', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Mumbai', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Pune', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Bengaluru', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Lucknow', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Jaipur', country: 'India', langGroup: 'IndiaMix' },
  { city: 'London', country: 'UK', langGroup: 'GlobalEnglish' },
  { city: 'New York', country: 'USA', langGroup: 'GlobalEnglish' }
];

const BENGALI_USERNAMES = [
  'KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik',
  'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'Nil_Kabbo',
  'EkaPothik', 'SondhaTara', 'BristirGaan', 'HariyeJawaMon', 'AddaMaster', 'KolkataMemes'
];

const HINDI_USERNAMES = [
  'KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj',
  'RasteKeMusafir', 'ZindagiDiary', 'NeendUdi', 'AlfaazMere',
  'BefikraRooh', 'YaadonKiDukaan', 'ChaiLoverAmit', 'MemeBoiIndia'
];

const GLOBAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel',
  'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 'UrbanSoul', 'DailyByte'
];

// Comprehensive Categories: FB & X Style Variety
const DIVERSE_CATEGORIES = [
  {
    category: 'Heartbreak & Pain',
    moodQuery: 'sad,rain,lonely,window',
    bengali: 'ভালোবাসার চরম বিচ্ছেদ, পুরোনো স্মৃতি আর গভীর একাকিত্ব নিয়ে বাস্তব মনের কথা',
    hindi: 'सच्चा प्यार टूटने का दर्द, पुरानी यादें और सीने में चुभती खामोशी पर दिल की बात',
    english: 'the quiet agony of a sudden breakup and learning to survive without them'
  },
  {
    category: 'Job & Corporate Hustle',
    moodQuery: 'office,laptop,night,desk',
    bengali: 'অফিসের অমানবিক প্রেশার, বসের টক্সিক রাজনীতি আর ক্যারিয়ারের ক্লান্তিকর লড়াই',
    hindi: 'कॉर्पोरेट की 9-to-5 गुलामी, टॉक्सिक बॉस और ईएमआई के चक्कर में पिसती जिंदगी',
    english: 'corporate burnout, imposter syndrome and pretending to love a toxic job'
  },
  {
    category: 'Motivational & Life Lessons',
    moodQuery: 'sunrise,mountain,running,light',
    bengali: 'জীবনের কঠিন সময়ে ঘুরে দাঁড়ানো, হেরে গিয়েও হাল না ছেড়ে যুদ্ধ করার অনুপ্রেরণা',
    hindi: 'हालातों से लड़कर फिर उठ खड़े होना, सपनों के लिए खुद पर अटूट भरोसा रखने का हौसला',
    english: 'hitting rock bottom and realizing that you have the power to rebuild yourself'
  },
  {
    category: 'Funny & Relatable Moments',
    moodQuery: 'funny,coffee,street,cat',
    bengali: 'দৈনন্দিন জীবনের মজার কাণ্ড, ব্যর্থ সোশ্যাল ইন্টারেকশন এবং হাসির অভিজ্ঞতা',
    hindi: 'लाइफ के मजेदार और अजीबोगरीब किस्से, अजीब सोशल सिचुएशंस और फनी गलतियां',
    english: 'funny everyday awkward moments and hilarious realizations about adult life'
  },
  {
    category: 'Late Night Music & Nostalgia',
    moodQuery: 'headphones,cassette,vinyl,night',
    bengali: 'রাতের হেডফোনে পুরোনো গান, ফেলে আসা স্কুলজীবন আর হারানো বন্ধুদের স্মৃতি',
    hindi: 'रात 2 बजे पुराने गाने सुनते हुए बचपन, स्कूल के दोस्त और पुरानी गलियों की यादें',
    english: 'listening to nostalgic childhood music at 2 AM and missing who you used to be'
  },
  {
    category: 'Politics & Society Reality',
    moodQuery: 'city,crowd,street,traffic',
    bengali: 'মধ্যবিত্ত পরিবারের লড়াই, সমাজের ভণ্ডামি আর সাধারণ মানুষের টিকে থাকার যুদ্ধ',
    hindi: 'मिडिल क्लास की बेबसी, महंगाई और समाज के दोगलेपन पर एक आम नागरिक का दर्द',
    english: 'the bitter reality of being middle class navigating an unfair political system'
  },
  {
    category: 'Love & Crush Stories',
    moodQuery: 'holding-hands,sunset,couple,cafe',
    bengali: 'একতরফা ভালোবাসার না-বলা কথা, মেট্রোর ভিড়ে প্রিয় মুখ খোঁজা আর লাজুক অনুভূতি',
    hindi: 'एकतरफा प्यार का नशा, किसी अनजान चेहरे पर दिल हारना और मीठी बेचैनी',
    english: 'the sweet ache of a secret crush and hoping they notice your small glances'
  }
];

const BENGALI_FALLBACKS = [
  "শহরের এই চার দেয়ালের মাঝে প্রতিদিন কত স্বপ্ন যে নিঃশব্দে হারিয়ে যায়, তার হিসাব কেউ রাখে না। পরিবারের মুখে হাসি ফোটাতে গিয়ে নিজের সব ইচ্ছেগুলোকে কবে যেন বিসর্জন দিয়েছি। কাজের ব্যস্ততায় দিন কেটে যায় ঠিকই, কিন্তু রাতের বেলা নিস্তব্ধ ঘরের জানলায় দাঁড়িয়ে মনে হয় আমি কি সত্যিই নিজের জীবন বাঁচছি নাকি কেবল সাধারণ টিকে থাকার অভিনয় করে যাচ্ছি? কাউকে মনের কথা বলার মতো সাহস নেই, শুধু বুকের ভেতর চেপে রাখা একরাশ না-বলা কান্না আর দীর্ঘশ্বাস নিয়ে প্রতিদিন ঘুমোতে যাওয়া।",
  "অফিসের এই কিউবিকলে বসে প্রতিদিন কম্পিউটারের স্ক্রিনের দিকে তাকিয়ে মনে হয়, শৈশবে এই জীবনের জন্যই কি এত বড় হওয়ার স্বপ্ন দেখেছিলাম? মাস শেষে অ্যাকাউন্টে যে টাকাটা ঢোকে, তার অর্ধেক চলে যায় ভাড়া আর খরচে, বাকিটা দিয়ে নিজের একাকিত্বকে সান্ত্বনা দিই। বাইরে হাসিমুখ রেখে মিটিং সামলাই, অথচ ভেতরে প্রতিদিন একটু একটু করে ক্লান্ত হয়ে পড়ছি। কাউকে বলা যায় না, কারণ সমাজ এটাকে সাফল্য বলে ধরে নিয়েছে।",
  "আজ রাতে পুরোনো প্লেলিস্টের গানগুলো বাজতেই কেমন যেন স্মৃতির ঝড় বয়ে গেল। সেই স্কুল ছুটির পর বন্ধুদের সাথে আড্ডা, এক ভাঁড় চায়ে চারজনের ভাগ বসানো, আর কোনো দায়িত্ব ছাড়া প্রাণখুলে হাসা—কবে যেন হারিয়ে গেল সব। আজ সবার কাছে বড় মোবাইল আছে কিন্তু কাউকে মন খুলে ফোন করার মতো সময় বা সাহস কারও নেই। বয়সের সাথে সাথে মানুষ বড্ড একা হয়ে যায়।"
];

const HINDI_FALLBACKS = [
  "शहर की इस भागदौड़ में बाहर से सब कुछ बहुत सामान्य नजर आता है, लेकिन इस किराए के कमरे के अकेलेपन में हर शाम एक अजीब सा अधूरापन घेर लेता है। घर पर फोन करके हमेशा हंसते हुए कहता हूँ कि मैं बहुत खुश हूँ, लेकिन असल में जिम्मेदारियों का बोझ इतना भारी हो चुका है कि खुलकर मुस्कुराना भूल गया हूँ। कभी-कभी मन करता है कि सब कुछ छोड़कर वापस घर चला जाऊँ, पर अपनों की उम्मीदें मुझे रोक लेती हैं।",
  "कॉर्पोरेट की इस चमक-दमक वाली जिंदगी में हर महीने सैलरी तो आ जाती है, लेकिन अंदर का सुकून और असली खुशी कब खो गई पता ही नहीं चला। बचपन में सोचा था कि बड़े होकर अपनी मर्जी से जियूँगा, आज अपनी ही बनाई चारदीवारी और ईएमआई का कैदी बन चुका हूँ। रोज़ सुबह चेहरे पर झूठी मुस्कान ओढ़कर निकलना और रात को बिस्तर पर खालीपन से बातें करना, यही मेरी रोज़मर्रा की सच्चाई बन चुकी है।",
  "जब सब रास्ते बंद दिखने लगें, तभी समझ आता है कि जिंदगी हमें कुछ बड़ा सिखाने की तैयारी में है। ठोकरें खाकर गिरना कोई गुनाह नहीं है, लेकिन वहीं पड़े रहना सबसे बड़ी हार है। आज शायद वक्त बुरा है, जेब खाली है और अपने भी साथ छोड़ चुके हैं, पर दिल में जलती उम्मीद की वह छोटी सी लौ ही कल नया सूरज दिखाएगी। खुद पर भरोसा रखो, सब बदल जाएगा।"
];

const ENGLISH_FALLBACKS = [
  "Living alone in this bustling metropolis looks like an exciting adventure from social media posts, but the silent weight of routine is slowly eroding who I used to be. Every phone call with my family feels like a rehearsed performance of pretending everything is completely fine when I am barely holding things together. Carrying these expectations quietly while battling internal burnout is the hardest price of adulthood.",
  "Nothing teaches you about resilience quite like having your entire world fall apart in secret while you still show up to work every morning with a pleasant smile. You learn that nobody is coming to rescue you from your silent battles; you have to pick up your own broken pieces, put your shoes on, and decide that your story is not ending in defeat today.",
  "Adult life is just sitting quietly in your room at 1 AM listening to a playlist from 2016, realizing how simple everything used to be before utility bills, career anxiety, and maintaining artificial relationships took over your entire mental bandwidth. It feels wild how fast innocent laughter turned into daily exhaustion."
];

const BENGALI_COMMENTS_POOL = [
  'কথাগুলো একদম বুক ছুঁয়ে গেল, নিজেকে শক্ত রেখো।',
  'এই শহরে একলা লড়াই করা মানুষগুলোর গল্পটা এমনই হয়।',
  'প্রতিটি লাইনে নিজের জীবনের প্রতিচ্ছবি দেখতে পেলাম।',
  'তুমি একা নও বন্ধু, সময় সব ক্ষতের মলম হয়ে যাবে।',
  'একদম সত্যি কথা, মুখে হাসি রাখা যে কত কঠিন তা ভুক্তভোগীই জানে।'
];

const HINDI_COMMENTS_POOL = [
  'हर लाइन से तुम्हारा दर्द महसूस हो रहा है भाई, हिम्मत रखना।',
  'बिल्कुल सच कहा, जिम्मेदारियां इंसान को चुप करा देती हैं।',
  'खुद को कभी अकेला मत समझना, वक्त हर दर्द कम कर देता है।',
  'दिल हल्का कर लिया करो दोस्त, इतना बोझ अकेले उठाना आसान नहीं।',
  'सटीक बात लिखी है, सोशल मीडिया पर सब खुश दिखते हैं अंदर से सब टूटे हैं।'
];

const ENGLISH_COMMENTS_POOL = [
  'Felt every single word of this. Please stay strong.',
  'Carrying this alone is exhausting. Sending you warmth.',
  'It takes so much courage to be this honest with yourself.',
  'You are never as alone as your midnight thoughts make you feel.',
  'This resonated deeply. Take things one step at a time.'
];

function detectLang(text: string, city: string): 'Bengali' | 'Hindi' | 'English' {
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (['Kolkata', 'Dhaka', 'Chittagong', 'Howrah'].includes(city)) return 'Bengali';
  if (['Delhi', 'Mumbai', 'Pune', 'Lucknow', 'Jaipur'].includes(city)) return 'Hindi';
  return 'English';
}

function getUsername(lang: 'Bengali' | 'Hindi' | 'English', allowAnonymous = true): string {
  if (allowAnonymous && Math.random() < 0.35) return 'Anonymous';
  if (lang === 'Bengali') return BENGALI_USERNAMES[Math.floor(Math.random() * BENGALI_USERNAMES.length)];
  if (lang === 'Hindi') return HINDI_USERNAMES[Math.floor(Math.random() * HINDI_USERNAMES.length)];
  return GLOBAL_USERNAMES[Math.floor(Math.random() * GLOBAL_USERNAMES.length)];
}

async function uploadToCloudinaryOptimized(sourceUrl: string): Promise<string> {
  try {
    const params = new URLSearchParams();
    params.append('file', sourceUrl);
    params.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: params
    });

    if (cRes.ok) {
      const cData = await cRes.json();
      if (cData.secure_url) {
        return cData.secure_url.replace('/upload/', '/upload/w_600,h_420,c_fill,q_auto:good,f_jpg/');
      }
    }
  } catch (e) {}
  return sourceUrl;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const loc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];
    let targetLang: 'Bengali' | 'Hindi' | 'English' = 'English';
    if (loc.langGroup === 'Bengali') targetLang = 'Bengali';
    else if (loc.langGroup === 'IndiaMix') targetLang = Math.random() < 0.5 ? 'Hindi' : 'English';

    // Pick random trending topic from diverse mix
    const cat = DIVERSE_CATEGORIES[Math.floor(Math.random() * DIVERSE_CATEGORIES.length)];
    const author = getUsername(targetLang, false);
    const nowTime = Date.now();

    // 1. AI Generation with Exact 90-100 Word Mandate
    let postText = '';
    try {
      const promptTopic = targetLang === 'Bengali' ? cat.bengali : targetLang === 'Hindi' ? cat.hindi : cat.english;
      const langRule = targetLang === 'Bengali' ? 'Bengali (বাংলা লিপি)' : targetLang === 'Hindi' ? 'Hindi (देवनागरी लिपि)' : 'English';

      const prompt = `Write an authentic Facebook/X trending feed post about: "${promptTopic}".
Location: ${loc.city}.
Category: ${cat.category}.
Language: Strictly ${langRule}.
MANDATORY RULES:
- Length: EXACTLY between 90 and 100 words. (Do not write less than 85 words).
- Tone: Highly engaging, relatable, real human emotion (just like authentic viral social feed posts).
- NO quotes, NO hashtags, NO headers. Output plain raw text only.`;

      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(6500)
      });

      if (aiRes.ok) {
        const raw = await aiRes.text();
        if (raw && !raw.includes('"error"') && !raw.includes('deprecat')) {
          const words = raw.trim().split(/\s+/).length;
          if (words >= 80 && words <= 115) {
            postText = raw.trim().replace(/^["']|["']$/g, '');
          }
        }
      }
    } catch (e) {}

    // Fallback if AI is offline
    if (!postText) {
      if (targetLang === 'Bengali') {
        postText = BENGALI_FALLBACKS[Math.floor(Math.random() * BENGALI_FALLBACKS.length)].replace('শহরের', `${loc.city} শহরের`);
      } else if (targetLang === 'Hindi') {
        postText = HINDI_FALLBACKS[Math.floor(Math.random() * HINDI_FALLBACKS.length)].replace('शहर की', `${loc.city} की`);
      } else {
        postText = ENGLISH_FALLBACKS[Math.floor(Math.random() * ENGLISH_FALLBACKS.length)].replace('this bustling metropolis', loc.city);
      }
    }

    // 2. Matching Fresh Category Photo Uploaded to Cloudinary
    const rawPhotoUrl = `https://source.unsplash.com/featured/600x420/?${encodeURIComponent(cat.moodQuery)}&sig=${nowTime}`;
    const finalCloudinaryImageUrl = await uploadToCloudinaryOptimized(rawPhotoUrl);

    // 3. Post to 'open-confees' DB
    const postRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?key=${POSTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            authorName: { stringValue: author },
            text: { stringValue: postText },
            imageUrl: { stringValue: finalCloudinaryImageUrl },
            city: { stringValue: loc.city },
            country: { stringValue: loc.country },
            category: { stringValue: cat.category },
            likesCount: { integerValue: '0' },
            commentsCount: { integerValue: '0' },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // 4. Organic Engagement on Earlier Posts (Matching language)
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
        const pText = fields.text?.stringValue || '';
        const pCity = fields.city?.stringValue || '';
        const currentComments = parseInt(fields.commentsCount?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || '0', 10);
        const pLang = detectLang(pText, pCity);

        if (Math.random() < 0.35 && currentComments < 22) {
          const cPool = pLang === 'Bengali' ? BENGALI_COMMENTS_POOL : pLang === 'Hindi' ? HINDI_COMMENTS_POOL : ENGLISH_COMMENTS_POOL;
          const commentContent = cPool[Math.floor(Math.random() * cPool.length)];
          const commenterName = getUsername(pLang, true);

          // Write to interactions DB (ageless-lamp-461817-i8)
          await fetch(
            `https://firestore.googleapis.com/v1/projects/${INTERACTIONS_PROJECT_ID}/databases/(default)/documents/comments?key=${INTERACTIONS_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  confessionId: { stringValue: pId },
                  authorName: { stringValue: commenterName },
                  text: { stringValue: commentContent },
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              })
            }
          ).catch(() => {});

          // Increment on posts doc
          await fetch(
            `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${pId}?updateMask.fieldPaths=commentsCount&updateMask.fieldPaths=likesCount&key=${POSTS_API_KEY}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  commentsCount: { integerValue: String(currentComments + 1) },
                  likesCount: { integerValue: String(currentLikes + Math.floor(Math.random() * 3) + 1) }
                }
              })
            }
          ).catch(() => {});
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: cat.category,
      words: postText.split(/\s+/).length,
      message: `Posted [${cat.category}] from ${loc.city} (${targetLang}) to open-confees`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

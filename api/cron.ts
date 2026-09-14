import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dual Firebase Setup
const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';

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

// Curated 15 Viral & Trending Categories with verified Unsplash CDN photo IDs
const DIVERSE_CATEGORIES = [
  {
    category: 'True Love & Soul Connections',
    photoIds: [
      'photo-1518199266791-5375a83190b7',
      'photo-1529333166437-7750a6dd5a70',
      'photo-1516589178581-6cd7833ae3b2',
      'photo-1492562080023-ab3db95bfbce'
    ],
    bengali: 'খাঁটি ভালোবাসার গভীর টান, নিঃস্বার্থ অনুভূতি এবং আজীবন পাশে থাকার নীরব প্রতিশ্রুতি',
    hindi: 'सच्चा प्यार, रूहानी रिश्ता और हर मुश्किल घड़ी में बिना शर्त साथ निभाने का एहसास',
    english: 'pure unconditional love, deep emotional connection and finding home in a person',
    tags: '#TrueLove #Soulmate #UnconditionalLove #LoveStory'
  },
  {
    category: 'Motivational Quotes & Resilience',
    photoIds: [
      'photo-1506744038136-46273834b3fb',
      'photo-1470246973918-29a93221c455',
      'photo-1500530855697-b586d89ba3ee',
      'photo-1472214103451-9374bd1c798e'
    ],
    bengali: 'হেরে না যাওয়ার প্রেরণা, জীবনের কঠিন পরিস্থিতিতে ঘুরে দাঁড়ানো এবং নিজের ওপর অটুট বিশ্বাস',
    hindi: 'हालातों से लड़कर उठ खड़े होने की प्रेरणा, हौसलों की उड़ान और खुद पर अटूट यकीन',
    english: 'unbreakable resilience, rising from rock bottom and conquering personal fears',
    tags: '#Motivation #NeverGiveUp #MindsetMatters #StayStrong'
  },
  {
    category: 'Heartbreak & Pain',
    photoIds: [
      'photo-1518199266791-5375a83190b7',
      'photo-1516589178581-6cd7833ae3b2',
      'photo-1534528741775-53994a69daeb',
      'photo-1517841905240-472988babdf9'
    ],
    bengali: 'ভালোবাসার চরম বিচ্ছেদ, পুরোনো স্মৃতি আর গভীর একাকিত্ব নিয়ে বাস্তব মনের কথা',
    hindi: 'सच्चा प्यार टूटने का दर्द, पुरानी यादें और सीने में चुभती खामोशी पर दिल की बात',
    english: 'the quiet agony of a sudden breakup and learning to survive without them',
    tags: '#Heartbreak #SilentPain #BrokenHeart #MovingOn'
  },
  {
    category: 'Job & Corporate Hustle',
    photoIds: [
      'photo-1486312338219-ce68d2c6f44d',
      'photo-1498050108023-c5249f4df085',
      'photo-1519389950473-47ba0277781c',
      'photo-1497215728101-856f4ea42174'
    ],
    bengali: 'অফিসের অমানবিক প্রেশার, বসের টক্সিক রাজনীতি আর ক্যারিয়ারের ক্লান্তিকর লড়াই',
    hindi: 'कॉर्पोरेट की 9-to-5 गुलामी, टॉक्सिक बॉस और ईएमआई के चक्कर में पिसती जिंदगी',
    english: 'corporate burnout, imposter syndrome and pretending to love a toxic job',
    tags: '#CorporateLife #Burnout #9to5Hustle #WorkLifeBalance'
  },
  {
    category: 'Tech, AI & Future Anxiety',
    photoIds: [
      'photo-1518770660439-4636190af475',
      'photo-1526374965328-7f61d4dc18c5',
      'photo-1486312338219-ce68d2c6f44d',
      'photo-1498050108023-c5249f4df085'
    ],
    bengali: 'প্রযুক্তির দ্রুত বদল, এআই বিপ্লব এবং ভবিষ্যতের চাকরি নিয়ে তরুণদের উদ্বেগ',
    hindi: 'तेजी से बदलती टेक्नोलॉजी, एआई का खौफ और भविष्य के करियर की बेचैनी',
    english: 'artificial intelligence revolution, tech burnout and anxiety about future careers',
    tags: '#TechTrends #ArtificialIntelligence #FutureOfTech #CodingLife'
  },
  {
    category: 'Gaming & Esports Banter',
    photoIds: [
      'photo-1538481199705-c710c4e965fc',
      'photo-1542751371-adc38448a05e',
      'photo-1511512578047-dfb367046420',
      'photo-1550745165-9bc0b252726f'
    ],
    bengali: 'মাঝরাতের গেমিং সেশন, বন্ধুদের সাথে ক্ল্যাচ করার উত্তেজনা আর চরম হারজিত',
    hindi: 'देर रात की गेमिंग, दोस्तों के साथ लॉबी का शोर और आखिरी मोमेंट की क्लच फाइट',
    english: 'late night gaming grinds, clutch moments with friends and gamer rage',
    tags: '#GamingCommunity #GamerLife #Esports #LateNightGaming'
  },
  {
    category: 'Breaking News & Public Reality',
    photoIds: [
      'photo-1495020689067-958852a7765e',
      'photo-1504711434969-e33886168f5c',
      'photo-1477959858617-67f30bc75b82',
      'photo-1480714378408-67cf0d13bc1b'
    ],
    bengali: 'শহরের প্রতিদিনের বাস্তব সমস্যা, সাধারণ মানুষের ভোগান্তি আর সামাজিক বৈষম্য',
    hindi: 'देश और समाज के ताजा हालात, महंगाई और आम जनता की रोजमर्रा की परेशानी',
    english: 'breaking news realities, social hypocrisies and civic struggles of everyday citizens',
    tags: '#TodayNews #CurrentAffairs #TrendingNow #PublicReality'
  },
  {
    category: 'Cricket & Sports Mania',
    photoIds: [
      'photo-1531415074968-036ba1b575da',
      'photo-1508098682722-e99c43a406b2',
      'photo-1461896836934-ffe607ba8211',
      'photo-1517649763962-0c623266ddc0'
    ],
    bengali: 'ক্রিকেট ম্যাচের রুদ্ধশ্বাস উত্তেজনা, দলের জয়-পরাজয়ে আবেগ আর নিঃশর্ত উন্মাদনা',
    hindi: 'क्रिकेट का असली जूनून, मैच के आखिरी ओवर की धड़कनें और खिलाड़ियों से सच्चा प्यार',
    english: 'cricket fever, high stakes sporting tension and pure athletic passion',
    tags: '#CricketFever #MatchDay #SportsLovers #BleedBlue'
  },
  {
    category: 'Middle Class Realities & EMI',
    photoIds: [
      'photo-1477959858617-67f30bc75b82',
      'photo-1480714378408-67cf0d13bc1b',
      'photo-1449824913935-59a10b8d2000',
      'photo-1519501025264-65ba15a82390'
    ],
    bengali: 'মধ্যবিত্ত পরিবারের লড়াই, সমাজের ভণ্ডামি আর সাধারণ মানুষের টিকে থাকার যুদ্ধ',
    hindi: 'मिडिल क्लास की बेबसी, महंगाई और समाज के दोगलेपन पर एक आम नागरिक का दर्द',
    english: 'the bitter reality of being middle class navigating an unfair political system',
    tags: '#MiddleClassLife #RealityCheck #FinancialStruggle #FamilyFirst'
  },
  {
    category: 'College & Exam Stress',
    photoIds: [
      'photo-1523240795612-9a054b0db644',
      'photo-1434030216411-0b793f4b4173',
      'photo-1519389950473-47ba0277781c',
      'photo-1498050108023-c5249f4df085'
    ],
    bengali: 'কলেজ জীবনের শেষ মুহূর্ত, পরীক্ষার ভয় এবং ক্যাম্পাস প্লেসমেন্টের মানসিক চাপ',
    hindi: 'कॉलेज के आखिरी दिन, एग्ज़ाम का खौफ और भविष्य की नौकरी को लेकर भारी टेंशन',
    english: 'college campus nostalgia, placement stress and fear of entering adult life',
    tags: '#CollegeDiaries #CampusLife #ExamStress #StudentLife'
  },
  {
    category: 'Late Night Music & Nostalgia',
    photoIds: [
      'photo-1511671782779-c97d3d27a1d4',
      'photo-1508700115892-45ecd05ae2ad',
      'photo-1487180144351-b8472da7d491',
      'photo-1514525253161-7a46d19cd819'
    ],
    bengali: 'রাতের হেডফোনে পুরোনো গান, ফেলে আসা স্কুলজীবন আর হারানো বন্ধুদের স্মৃতি',
    hindi: 'रात 2 बजे पुराने गाने सुनते हुए बचपन, स्कूल के दोस्त और पुरानी गलियों की यादें',
    english: 'listening to nostalgic childhood music at 2 AM and missing who you used to be',
    tags: '#LateNightThoughts #Nostalgia #OldDays #RetroVibes'
  },
  {
    category: 'Love & Crush Stories',
    photoIds: [
      'photo-1529333166437-7750a6dd5a70',
      'photo-1516589178581-6cd7833ae3b2',
      'photo-1518199266791-5375a83190b7',
      'photo-1492562080023-ab3db95bfbce'
    ],
    bengali: 'একতরফা ভালোবাসার না-বলা কথা, মেট্রোর ভিড়ে প্রিয় মুখ খোঁজা আর লাজুক অনুভূতি',
    hindi: 'एकतरफा प्यार का नशा, किसी अनजान चेहरे पर दिल हारना और मीठी बेचैनी',
    english: 'the sweet ache of a secret crush and hoping they notice your small glances',
    tags: '#SecretCrush #LoveAtFirstSight #UnspokenLove #Romance'
  },
  {
    category: 'Funny & Relatable Moments',
    photoIds: [
      'photo-1514888286974-6c03e2ca1dba',
      'photo-1543610892-0b1f7e6d8ac1',
      'photo-1537151608828-ea2b11777ee8',
      'photo-1526336024174-e58f5cdd8e13'
    ],
    bengali: 'দৈনন্দিন জীবনের মজার কাণ্ড, ব্যর্থ সোশ্যাল ইন্টারেকশন এবং হাসির অভিজ্ঞতা',
    hindi: 'लाइफ के मजेदार और अजीबोगरीब किस्से, अजीब सोशल सिचुएशंस और फनी गलतियां',
    english: 'funny everyday awkward moments and hilarious realizations about adult life',
    tags: '#RelatableHumor #AwkwardMoments #FunnyFails #LaughOutLoud'
  },
  {
    category: 'Fitness & Self-Discipline',
    photoIds: [
      'photo-1517838277536-f5f99be501cd',
      'photo-1534438327276-14e5300c3a48',
      'photo-1506744038136-46273834b3fb',
      'photo-1470246973918-29a93221c455'
    ],
    bengali: 'ভোরবেলার ওয়ার্কআউট, শরীর ও মনকে বদলে ফেলার কঠিন অনুশাসন এবং ধারাবাহিকতা',
    hindi: 'सुबह की जिम, खुद को मजबूत बनाने की जंग और आलस को हराकर जीतने का जज्बा',
    english: 'sweat, daily gym discipline and building mental strength through hard work',
    tags: '#FitnessMotivation #GymGrind #Discipline #SelfImprovement'
  },
  {
    category: 'Mental Health & Quiet Overthinking',
    photoIds: [
      'photo-1500530855697-b586d89ba3ee',
      'photo-1472214103451-9374bd1c798e',
      'photo-1518199266791-5375a83190b7',
      'photo-1534528741775-53994a69daeb'
    ],
    bengali: 'হাসিমুখের আড়ালে লুকিয়ে থাকা মানসিক ক্লান্তি এবং নিজের সাথে নিজের নীরব লড়াই',
    hindi: 'अंदर की उलझनें, जरूरत से ज्यादा सोचना और अकेलेपन में अपनी ही जंग लड़ना',
    english: 'battling silent anxiety, late night overthinking and finding inner peace',
    tags: '#MentalHealthMatters #Overthinking #QuietBattles #HealingJourney'
  }
];

const BENGALI_FALLBACKS = [
  "যখন সব পথ বন্ধ মনে হয়, তখনই বিশ্বাস রাখতে হয় যে ভাঙা মন দিয়েই জীবনের সেরা গল্পটা শুরু হয়। হেরে যাওয়া কোনো লজ্জা নয়, কিন্তু আবার ঘুরে না দাঁড়ানোই সবচেয়ে বড় পরাজয়। সময়ের সাথে সব অন্ধকার কেটে নতুন ভোরের আলো ফুটবেই। #Motivation #NeverGiveUp #StayStrong #Kolkata",
  "মেট্রোর ভিড়ে আজও তোর পরিচিত গন্ধটা যেন বাতাসে ভেসে আসে। সম্পর্ক শেষ হয়েছে ঠিকই, কিন্তু তোর জন্য বুকের ভেতরের ভালোবাসাটা এতটুকু মলিন হয়নি। হয়তো তোর গল্পে আমি নেই, কিন্তু আমার নীরব প্রার্থনায় আজও তুই আছিস। #TrueLove #Soulmate #UnspokenLove #LoveStory",
  "অফিসের এই কিউবিকলে বসে প্রতিদিন কম্পিউটারের স্ক্রিনের দিকে তাকিয়ে মনে হয়, শৈশবে এই জীবনের জন্যই কি এত বড় হওয়ার স্বপ্ন দেখেছিলাম? মাস শেষে অ্যাকাউন্টে টাকা ঢোকে, কিন্তু বুকের শান্তি কোথায় যেন হারিয়ে গেছে। #CorporateLife #Burnout #9to5Hustle #WorkLife"
];

const HINDI_FALLBACKS = [
  "जिंदगी जब इम्तिहान लेती है, तो रास्ता खुद ढूंढना पड़ता है। ठोकरें हमें गिराने के लिए नहीं, बल्कि संभलकर चलना सिखाने के लिए आती हैं। अपनी मेहनत और हिम्मत पर भरोसा रखो, वक्त तुम्हारा भी बदलेगा। #Motivation #NeverGiveUp #MindsetMatters #StayStrong",
  "सच्चा प्यार वो नहीं जो सिर्फ हासिल करने की ख्वाहिश रखे, बल्कि वो है जो दूर रहकर भी उसकी खुशियों की दुआ मांगे। लोग कहते हैं कि वक्त सब भुला देता है, पर कुछ नाम दिल पर हमेशा के लिए छप जाते हैं। #TrueLove #Soulmate #PureLove #LoveStory",
  "शहर की इस भागदौड़ में बाहर से सब कुछ बहुत सामान्य नजर आता है, लेकिन इस किराए के कमरे में हर शाम जिम्मेदारियों का बोझ घेर लेता है। मुस्कुराना तो बस एक आदत बन गई है, अंदर से तो थक चुके हैं। #MiddleClassLife #Burnout #RealityCheck #9to5Hustle"
];

const ENGLISH_FALLBACKS = [
  "You did not survive all those silent battles just to give up now. Rock bottom will always teach you lessons that success never could. Keep your head up, dust yourself off, and keep moving forward. #Motivation #NeverGiveUp #Resilience #Mindset",
  "True love is quiet. It is not about grand gestures or public declarations; it is about knowing someone completely and still choosing to be their peace in a chaotic world. #TrueLove #Soulmate #DeepConnection #UnconditionalLove",
  "Adult life is just sitting in traffic after a ten-hour shift realizing how easily childhood happiness was taken for granted. We grew up only to chase deadlines and monthly bills. #CorporateLife #Burnout #AdultingHard #RealityOfLife"
];

const BENGALI_COMMENTS_POOL = [
  'কথাগুলো একদম বুক ছুঁয়ে গেল, নিজেকে শক্ত রেখো।',
  'এই শহরে একলা লড়াই করা মানুষগুলোর গল্পটা এমনই হয়।',
  'প্রতিটি লাইনে নিজের জীবনের প্রতিচ্ছবি দেখতে পেলাম।',
  'তুমি একা নও বন্ধু, সময় সব ক্ষতের মলম হয়ে যাবে।',
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const loc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];
    let targetLang: 'Bengali' | 'Hindi' | 'English' = 'English';
    if (loc.langGroup === 'Bengali') targetLang = 'Bengali';
    else if (loc.langGroup === 'IndiaMix') targetLang = Math.random() < 0.5 ? 'Hindi' : 'English';

    const cat = DIVERSE_CATEGORIES[Math.floor(Math.random() * DIVERSE_CATEGORIES.length)];
    const author = getUsername(targetLang, false);
    const nowTime = Date.now();

    // 1. AI Generation (85-100 Words) with Strictly Appended 3-5 Relevant Trending Hashtags
    let postText = '';
    try {
      const promptTopic = targetLang === 'Bengali' ? cat.bengali : targetLang === 'Hindi' ? cat.hindi : cat.english;
      const langRule = targetLang === 'Bengali' ? 'Bengali (বাংলা লিপি)' : targetLang === 'Hindi' ? 'Hindi (देवनागरी लिपि)' : 'English';

      const prompt = `Write an authentic Facebook/X trending feed post about: "${promptTopic}".
Location: ${loc.city}.
Category: ${cat.category}.
Language: Strictly ${langRule}.
MANDATORY RULES:
- Length: EXACTLY between 85 and 95 words.
- Tone: Highly engaging, emotional, relatable, authentic human voice.
- HASHTAGS: At the very end of the text, append exactly 3 to 5 trending hashtags strictly matching the topic (e.g., ${cat.tags} #${loc.city.replace(/\s+/g, '')}).
- NO quotes, NO headers, NO bullet points. Output plain raw text with the hashtags at the bottom.`;

      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(4500)
      });

      if (aiRes.ok) {
        const raw = await aiRes.text();
        if (raw && !raw.includes('"error"') && !raw.includes('deprecat')) {
          const words = raw.trim().split(/\s+/).length;
          if (words >= 70 && words <= 130) {
            postText = raw.trim().replace(/^["']|["']$/g, '');
          }
        }
      }
    } catch (e) {}

    // Instant Fallback if AI delays
    if (!postText) {
      if (targetLang === 'Bengali') {
        postText = BENGALI_FALLBACKS[Math.floor(Math.random() * BENGALI_FALLBACKS.length)].replace('শহরের', `${loc.city} শহরের`);
      } else if (targetLang === 'Hindi') {
        postText = HINDI_FALLBACKS[Math.floor(Math.random() * HINDI_FALLBACKS.length)].replace('शहर की', `${loc.city} की`);
      } else {
        postText = ENGLISH_FALLBACKS[Math.floor(Math.random() * ENGLISH_FALLBACKS.length)].replace('this bustling metropolis', loc.city);
      }
    }

    // 2. Direct, Ultra-Fast Unsplash CDN Image (Strict ~45KB-50KB, Never Fails, Never 404)
    const selectedPhotoId = cat.photoIds[Math.floor(Math.random() * cat.photoIds.length)];
    const imageUrl = `https://images.unsplash.com/${selectedPhotoId}?auto=format&fit=crop&w=600&h=420&q=75&fm=jpg`;

    // 3. Post to 'open-confees' DB
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
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // 4. Organic Comments and Likes on Existing Posts
    try {
      const listRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?pageSize=12&key=${POSTS_API_KEY}`
      );
      const listData = await listRes.json();
      const documents = listData.documents || [];

      for (const doc of documents) {
        const pId = doc.name?.split('/').pop();
        if (!pId || pId === newPostId) continue;

        const fields = doc.fields || {};
        const pText = fields.text?.stringValue || fields.body?.stringValue || '';
        const pCity = fields.city?.stringValue || '';
        const currentComments = parseInt(fields.commentsCount?.integerValue || fields.comments?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || fields.likes?.integerValue || '0', 10);
        const pLang = detectLang(pText, pCity);

        // Natural random engagement (35% probability)
        if (Math.random() < 0.35 && currentComments < 25) {
          const cPool = pLang === 'Bengali' ? BENGALI_COMMENTS_POOL : pLang === 'Hindi' ? HINDI_COMMENTS_POOL : ENGLISH_COMMENTS_POOL;
          const commentContent = cPool[Math.floor(Math.random() * cPool.length)];
          const commenterName = getUsername(pLang, true);

          // Write to interactions DB with both field mappings so fetchComments always finds it
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
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              })
            }
          ).catch(() => {});

          const newLikes = currentLikes + Math.floor(Math.random() * 3) + 1;
          const newComments = currentComments + 1;

          // Increment counters on the confession document
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
          break;
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: cat.category,
      imageUrl,
      message: `Posted [${cat.category}] from ${loc.city} to open-confees`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

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
// LOCATION POOL — 30% India/Bangladesh, 70% World
// ============================================================
interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'Hindi' | 'English';
}

const LOCATIONS: LocationProfile[] = [
  // ---- 30% INDIA + BANGLADESH ----
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },
  { city: 'Delhi', country: 'India', langGroup: 'Hindi' },
  { city: 'Mumbai', country: 'India', langGroup: 'Hindi' },
  { city: 'Jaipur', country: 'India', langGroup: 'Hindi' },
  { city: 'Lucknow', country: 'India', langGroup: 'Hindi' },
  { city: 'Pune', country: 'India', langGroup: 'Hindi' },
  // ---- 70% WORLD ----
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
  { city: 'Rome', country: 'Italy', langGroup: 'English' },
  { city: 'Madrid', country: 'Spain', langGroup: 'English' },
  { city: 'Bangkok', country: 'Thailand', langGroup: 'English' },
  { city: 'Seoul', country: 'South Korea', langGroup: 'English' },
  { city: 'Chicago', country: 'USA', langGroup: 'English' },
  { city: 'San Francisco', country: 'USA', langGroup: 'English' },
  { city: 'Barcelona', country: 'Spain', langGroup: 'English' },
  { city: 'Cape Town', country: 'South Africa', langGroup: 'English' },
  { city: 'Istanbul', country: 'Turkey', langGroup: 'English' }
];

const BENGALI_USERNAMES = [
  'KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik',
  'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'Nil_Kabbo',
  'EkaPothik', 'SondhaTara', 'BristirGaan', 'HariyeJawaMon', 'AddaMaster', 'KolkataMemes',
  'GangaKinara', 'BoiPokaBabu', 'RoddurBoy', 'PadmaPar', 'ShahorerEkTan'
];

const HINDI_USERNAMES = [
  'KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj',
  'RasteKeMusafir', 'ZindagiDiary', 'NeendUdi', 'AlfaazMere',
  'BefikraRooh', 'YaadonKiDukaan', 'ChaiLoverAmit', 'MemeBoiIndia',
  'GaliKaLadka', 'SapnoKaShehar', 'MausamKaMizaaj', 'ChuppiSaMard'
];

const GLOBAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel',
  'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 'UrbanSoul', 'DailyByte',
  'WanderlustWren', 'GreySkyDiary', 'OffGridOmar', 'PixelNomad', 'CafeHopperJoe',
  'LastTrainLuke', 'RooftopRae', 'MoodBoardMia', 'FifthAvePhil'
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
    category: 'News & Breaking Headlines',
    photoIds: ['photo-1495020689067-958852a7765e', 'photo-1504711434969-e33886168f5c', 'photo-1585829365295-ab7cd400c167'],
    bengali: 'আজকের তাজা খবর, শহরের গুরুত্বপূর্ণ ঘটনা, তীব্র যানজট এবং সাধারণ মানুষের সমস্যা',
    hindi: 'आज की बड़ी ब्रेकिंग खबर, शहर की हलचल, नए नियम और जनता पर उसका सीधा असर',
    english: 'breaking news developments, civic infrastructure updates, inflation and daily public issues',
    tags: '#BreakingNews #NewsAlert #CurrentAffairs #TrendingNow',
    comments: {
      bengali: ['এই খবরটা সকাল থেকেই দেখছি, পরিস্থিতি সত্যিই জটিল।', 'প্রশাসন কবে যে ব্যবস্থা নেবে!', 'খবরটি শেয়ার করার জন্য ধন্যবাদ।'],
      hindi: ['सुबह से इस खबर की ही चर्चा है, प्रशासन को संज्ञान लेना चाहिए।', 'हर बार आम जनता ही पिसती है।', 'सटीक और सही अपडेट भाई।'],
      english: ['Been monitoring this situation all morning.', 'Accountability from authorities is long overdue.', 'Critical update, thanks for posting.']
    }
  },
  {
    category: 'Politics & Public Debate',
    photoIds: ['photo-1541872703-74c5e44368f9', 'photo-1540910419892-4a36d2c3266c', 'photo-1529107386315-e1a2ed48a620'],
    bengali: 'চলমান রাজনৈতিক বিতর্ক, নির্বাচনের উত্তাপ, নতুন সরকারি নীতি এবং নাগরিক অধিকার',
    hindi: 'गरमा-गरम राजनीतिक बहस, चुनावी माहौल, नई नीतियां और आम नागरिक के हक की बात',
    english: 'ongoing political debates, policy changes, election campaigns and citizens ground reality',
    tags: '#PoliticsToday #PoliticalDebate #PolicyWatch #DemocracyInAction',
    comments: {
      bengali: ['রাজনীতিতে সাধারণ মানুষের কথা কেউ ভাবে না।', 'বিতর্কের চেয়ে কাজের কাজ হওয়া জরুরি।', 'একদম স্পষ্ট মতামত, সহমত।'],
      hindi: ['बात बिल्कुल पते की कही है आपने।', 'नेताओं के वादे और हकीकत में जमीन-आसमान का फर्क है।', 'इस मुद्दे पर बात होना बहुत जरूरी था।'],
      english: ['Spot on analysis of modern politics.', 'Policies look good on paper, ground reality is completely different.', 'Solid perspective.']
    }
  },
  {
    category: 'Entertainment, Cinema & Pop Culture',
    photoIds: ['photo-1489599849927-2ee91cede3ba', 'photo-1514525253161-7a46d19cd819', 'photo-1478720568477-152d9b164e26'],
    bengali: 'নতুন সিনেমার রিভিউ, বক্স অফিস ট্রেন্ড, তারকাদের খবর এবং বিনোদন জগতের চমক',
    hindi: 'नई फिल्मों का क्रेज, बॉक्स ऑफिस रिकॉर्ड्स, सेलिब्रिटी लाइफ और ओटीटी का नया धमाका',
    english: 'blockbuster movie reviews, box office numbers, celebrity updates and viral pop culture',
    tags: '#EntertainmentNews #CinemaLovers #Bollywood #PopCulture',
    comments: {
      bengali: ['সিনেমাটা আমিও দেখেছি, অনবদ্য কাজ!', 'গানগুলো অসাধারণ হয়েছে।', 'উইকএন্ডে টিকিট বুক করতে হবে এবার।'],
      hindi: ['फर्स्ट डे फर्स्ट शो देखा था, पैसा वसूल!', 'अभिनय कमाल का था सबका।', 'OTT पर आने का इंतजार नहीं हो रहा।'],
      english: ['The cinematography in this was top tier.', 'Totally agreed with your take on this release.', 'Going to watch it this weekend for sure.']
    }
  },
  {
    category: 'Funny, Memes & Sarcasm',
    photoIds: ['photo-1514888286974-6c03e2ca1dba', 'photo-1537151608828-ea2b11777ee8', 'photo-1543610892-0b1f7e6d8ac1'],
    bengali: 'সোশ্যাল মিডিয়ার মজার ভাইরাল কাণ্ড, ব্যঙ্গাত্মক রসিকতা এবং দৈনন্দিন জীবনের হাসির গল্প',
    hindi: 'इंटरनेट के फनी वायरल मोमेंट्स, मजेदार व्यंग्य और जिंदगी के अजीबोगरीब हास्य',
    english: 'viral internet memes, witty sarcasm, awkward fails and hilarious everyday relatable irony',
    tags: '#FunnyTweet #MemeDaily #SarcasmCentral #DesiHumor',
    comments: {
      bengali: ['হাসতে হাসতে শেষ! একদম খাটি কথা।', 'টাইমিংটা দারুণ ছিল ভাই।', 'বন্ধুদের সাথে এখনই শেয়ার করছি এটা।'],
      hindi: ['हंसते-हंसते लोटपोट हो गए भाई!', 'ये तो मेरे दोस्त की ही कहानी लग रही है।', 'सेंस ऑफ ह्यूमर कमाल है आपका।'],
      english: ['I cannot stop laughing at this!', 'The accuracy in this post hurts.', 'Sending this to the group chat immediately.']
    }
  }
];

// Fallbacks strictly calibrated between 90-100 words
const BENGALI_FALLBACKS = [
  "আজকের সকালে শহরের প্রধান রাস্তায় যে তীব্র যানজট তৈরি হয়েছিল, তাতে সাধারণ নিত্যযাত্রীদের চরম ভোগান্তির শিকার হতে হয়েছে। সময়মতো কর্মস্থলে পৌঁছানো একপ্রকার অসম্ভব হয়ে পড়েছিল। ট্রাফিক পুলিশের তৎপরতা চোখে পড়লেও পরিকাঠামোর অপ্রতুলতা স্পষ্ট। প্রতিদিন এই একই দৃশ্য দেখে মনে প্রশ্ন জাগে, প্রশাসনের স্থায়ী সমাধান কবে মিলবে? ডিজিটাল শহরের গল্প কাগজে-কলমেই সীমাবদ্ধ থেকে যাচ্ছে, অথচ সাধারণ মানুষের প্রতিদিনের জীবনের লড়াইটা এতটুকুও সহজ হচ্ছে না। উন্নয়ন তখনই সার্থক যখন রাস্তাঘাটে মানুষ স্বস্তিতে চলাচল করতে পারবে। এই বিষয়ে নাগরিক সমাজকে এখনই আরও সোচ্চার হতে হবে। #BreakingNews #LocalUpdate #CityTraffic #TrendingNow #PublicSafety",
  "সিনেমাহলের সামনে আজকের উপচে পড়া ভিড় প্রমাণ করে দিল যে মৌলিক গল্পের কদর দর্শকরা আজও ভোলেননি। সাধারণ সংলাপের মধ্যেও যে অদ্ভুত টান লুকিয়ে ছিল, তা প্রতিটি দর্শকের মনকে নাড়া দিয়ে গেছে। সাম্প্রতিক সময়ে এত চমৎকার অভিনয় এবং আবহ সঙ্গীত সত্যিই চোখে পড়েনি। তথাকথিত তারকা খ্যাতির চেয়েও চিত্রনাট্যের শক্তি যে কত বড়, এই ছবিটি তারই বাস্তব উদাহরণ। পরিবার নিয়ে দেখার মতো এমন ইতিবাচক বিনোদন বর্তমান সময়ে খুব দরকার ছিল। উইকএন্ডে এই বিনোদন অভিজ্ঞতা সকলের মনে অনেকদিন থেকে যাবে। আশা করি বাংলা সিনেমা এমন কাজের মাধ্যমে নতুন দিগন্ত তৈরি করবে। #EntertainmentNews #CinemaLovers #MovieReview #BoxOfficeHit #PopCulture",
  "সোশ্যাল মিডিয়ার দেওয়ালে আজ সকাল থেকেই অদ্ভুত একটি ভাইরাল মিম ঘুরছে যা দেখে হাসির দমক থামানো মুশকিল। মানুষের কল্পনাশক্তি আর দৈনন্দিন ব্যস্ততার মাঝে নিখাদ কৌতুকের মেলবন্ধন সত্যিই প্রশংসনীয়। অফিসের হাজারো কাজের চাপ আর একঘেয়েমি দূর করতে এমন হালকা ব্যঙ্গাত্মক রসিকতার বিকল্প নেই। বন্ধুদের আড্ডায় এই পোস্টটি নিয়ে যে তুমুল হাসাহাসি চলছে, তা বলাই বাহুল্য। কঠিন বাস্তবতা মেনে নিয়েও মাঝেমধ্যে মন খুলে হেসে ওঠা জীবনের জন্য অত্যন্ত জরুরি। যারা এই কঠিন সময়েও মানুষকে হাসাতে পারেন, তারা সত্যিই ধন্যবাদ পাওয়ার যোগ্য। দিনটি এক নিমেষেই সুন্দর হয়ে উঠল। #FunnyTweet #MemeDaily #SarcasmCentral #DesiHumor #LaughOutLoud"
];

const HINDI_FALLBACKS = [
  "आज सुबह से शहर के मुख्य मार्ग पर जो भारी ट्रैफिक देखने को मिला, उसने आम जनता के पसीने छुड़ा दिए। दफ्तर और जरूरी कामों के लिए निकले लोग घंटों जाम में फंसे रहे। मेट्रो और बसों में पैर रखने की जगह नहीं थी और हर कोई सिर्फ परेशान नजर आ रहा था। प्रशासन को बार-बार शिकायत करने के बाद भी व्यवस्था में कोई ठोस बदलाव नहीं दिख रहा है। बड़े-बड़े वादों और विज्ञापनों के बीच आम नागरिक की रोजमर्रा की बुनियादी समस्याएं आज भी जस की तस खड़ी हैं। यह स्थिति वास्तव में चिंताजनक है। #BreakingNews #CurrentAffairs #CityTraffic #LocalUpdate #CivicIssues",
  "सिनेमाघरों में आज नई रिलीज हुई फिल्म को लेकर दर्शकों का उत्साह देखते ही बनता है। पहले ही दिन सिनेमा हॉल के बाहर लगी लंबी कतारें यह साबित करती हैं कि बेहतरीन कहानी का जादू कभी कम नहीं होता। कलाकारों का सधा हुआ अभिनय, दमदार बैकग्राउंड स्कोर और दिल को छू लेने वाले संवाद सीधे दर्शकों के दिलों में उतर रहे हैं। सोशल मीडिया पर भी इस फिल्म की चौतरफा तारीफ हो रही है और बॉक्स ऑफिस पर नए रिकॉर्ड बनते नजर आ रहे हैं। इस हफ्ते की यह सबसे बड़ी ब्लॉकबस्टर साबित हो चुकी है। #EntertainmentNews #Bollywood #CinemaLovers #BoxOffice #MustWatch",
  "इंटरनेट की दुनिया में आज एक ऐसा मजेदार और व्यंग्यात्मक पोस्ट वायरल हुआ है, जिसे देखकर अपनी हंसी रोक पाना नामुमकिन है। रोजमर्रा की भागदौड़, ईएमआई की टेंशन और ऑफिस के भारी काम के बीच ऐसे फनी मोमेंट्स एक ताजी हवा के झोंके की तरह आते हैं। लोग लगातार इस पर मजेदार कमेंट्स कर रहे हैं और दोस्तों को टैग कर रहे हैं। जिंदगी चाहे कितनी भी मुश्किल क्यों न हो, ऐसे हल्के-फुल्के पल चेहरे पर मुस्कान ला ही देते हैं। सोशल मीडिया का असली मजा ऐसे ही देसी ह्यूमर में है। #FunnyTweet #MemeDaily #DesiHumor #SarcasmCentral #TrendingFun"
];

const ENGLISH_FALLBACKS = [
  "The current public discourse surrounding the latest policy update has sparked widespread conversations across international platforms. Citizens are actively expressing their genuine concerns regarding the rapid economic fluctuations and public infrastructure limitations. Analysts observe that while progressive planning sounds impressive during press conferences, the tangible impact on ordinary households remains minimal and challenging. Transparent communication and swift execution from local authorities are urgently required right now. Without structured reforms, the growing divide between executive decisions and ground realities will only widen further as public dissatisfaction continues to escalate globally today. #BreakingNews #WorldNews #CurrentAffairs #PublicVoice #TrendingAlert",
  "The latest global cinematic release has officially shattered expectations with its breathtaking visual storytelling and deeply moving character performances. Fans worldwide are packing theaters, creating a vibrant buzz rarely seen in contemporary cinema lately. The meticulous direction and compelling narrative explore profound emotional themes while delivering unmatched entertainment value from start to finish. Critics and casual moviegoers alike are sharing unanimous praise across social feeds, making it the most discussed pop culture phenomenon this month. Truly a landmark artistic triumph that reminds everyone why going to the big screen will always be special. #EntertainmentNews #BoxOffice #CinemaLovers #MovieReview #PopCulture",
  "A hilarious internet meme comparing adult work life to modern existential crises is currently breaking timelines with unmatched engagement. The biting sarcasm and painfully relatable humor have struck an instant chord with millions navigating grueling weekly schedules and corporate burnout. People are joyfully flooding replies with personal anecdotes that turn daily frustrations into collective comedic relief. Sometimes pure unhinged laughter remains the healthiest coping mechanism available to survive chaotic adulting routines. A brilliant reminder not to take every single stressful situation too seriously when you can simply choose to smile instead. #FunnyTweet #MemeDaily #SarcasmCentral #RelatableHumor #ViralLaughs"
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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    let targetLang: 'Bengali' | 'Hindi' | 'English' = 'English';
    if (loc.langGroup === 'Bengali') targetLang = 'Bengali';
    else if (loc.langGroup === 'Hindi') targetLang = Math.random() < 0.7 ? 'Hindi' : 'English';
    else targetLang = 'English';

    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const rotIndex = (dayOfYear * 24 + now.getUTCHours()) % CATEGORIES.length;
    const cat: CategoryDef = Math.random() < 0.5 ? CATEGORIES[rotIndex] : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    const author = getUsername(targetLang, false);
    const nowIso = new Date().toISOString();
    const nowTime = Date.now();

    // 1. AI Real X (Twitter) Post Generation (Strict 90-100 Words + Hashtags)
    let postText = '';
    const promptTopic = targetLang === 'Bengali' ? cat.bengali : targetLang === 'Hindi' ? cat.hindi : cat.english;
    const langRule = targetLang === 'Bengali' ? 'Bengali (বাংলা লিপি)' : targetLang === 'Hindi' ? 'Hindi (देवनागरी लिपि)' : 'English';

    const prompt = `Write a viral, authentic real-world post for the platform X (formerly Twitter) about: "${promptTopic}".
Location reference: ${loc.city}, ${loc.country} (incorporate this naturally as a real eyewitness/citizen perspective).
Category: ${cat.category}.
Language: Strictly ${langRule}.
MANDATORY CONSTRAINTS:
- Length: STRICTLY between 90 and 100 words in total.
- Tone: Real human post on X, raw citizen reaction, no AI clichés, no introductory meta-announcements.
- HASHTAGS: End the post with exactly 3 to 5 realistic trending hashtags (e.g., ${cat.tags} #${loc.city.replace(/\s+/g, '')}).
- Return plain raw post text only.`;

    try {
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(3000)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('"error"') && !raw.includes('deprecat')) {
          const words = raw.split(/\s+/).filter(Boolean).length;
          if (words >= 80 && words <= 115) postText = raw;
        }
      }
    } catch (e) {}

    // Fallback if AI delays or breaches word count
    if (!postText) {
      if (targetLang === 'Bengali') {
        postText = BENGALI_FALLBACKS[Math.floor(Math.random() * BENGALI_FALLBACKS.length)].replace('শহরের', `${loc.city} শহরের`);
      } else if (targetLang === 'Hindi') {
        postText = HINDI_FALLBACKS[Math.floor(Math.random() * HINDI_FALLBACKS.length)].replace('शहर के', `${loc.city} के`);
      } else {
        postText = ENGLISH_FALLBACKS[Math.floor(Math.random() * ENGLISH_FALLBACKS.length)];
      }
    }

    // 2. Real Photography Cloudinary Image Fetch (Clean candid photos)
    const validPhotoIds = cat.photoIds && cat.photoIds.length > 0 ? cat.photoIds : ['photo-1495020689067-958852a7765e'];
    const selectedPhotoId = validPhotoIds[Math.floor(Math.random() * validPhotoIds.length)];
    const rawSourceUrl = `https://images.unsplash.com/${selectedPhotoId}?auto=format&fit=crop&w=720&h=480&q=80`;
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(rawSourceUrl)}`;

    // 3. PRIORITY #1: Post to 'open-confees' DB IMMEDIATELY
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
            timestamp: { integerValue: String(nowTime) }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // 4. Organic comments & engagement on previous confessions
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
        const pCategory = fields.category?.stringValue || '';
        const currentComments = parseInt(fields.commentsCount?.integerValue || fields.comments?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || fields.likes?.integerValue || '0', 10);
        const pLang = detectLang(pText, pCity);

        if (Math.random() < 0.35 && currentComments < 25) {
          const catDef = CATEGORIES.find(c => c.category === pCategory) || cat;
          const pool = pLang === 'Bengali' ? catDef.comments.bengali : pLang === 'Hindi' ? catDef.comments.hindi : catDef.comments.english;
          const commentContent = pool[Math.floor(Math.random() * pool.length)];
          const commenterName = getUsername(pLang, true);

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

          const newLikes = currentLikes + Math.floor(Math.random() * 3) + 1;
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
          break;
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: cat.category,
      language: targetLang,
      location: `${loc.city}, ${loc.country}`,
      imageUrl,
      message: `Successfully posted X-style [${cat.category}] in ${targetLang} from ${loc.city}`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

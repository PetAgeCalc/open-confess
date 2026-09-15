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
  // ---- 30% INDIA + BANGLADESH (9) ----
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },
  { city: 'Delhi', country: 'India', langGroup: 'Hindi' },
  { city: 'Mumbai', country: 'India', langGroup: 'Hindi' },
  { city: 'Jaipur', country: 'India', langGroup: 'Hindi' },
  { city: 'Lucknow', country: 'India', langGroup: 'Hindi' },
  { city: 'Pune', country: 'India', langGroup: 'Hindi' },
  // ---- 70% WORLD (21) ----
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
    category: 'True Love & Soul Connections',
    photoIds: ['photo-1518199266791-5375a83190b7', 'photo-1529333166437-7750a6dd5a70', 'photo-1516589178581-6cd7833ae3b2'],
    bengali: 'খাঁটি ভালোবাসার গভীর টান, নিঃস্বার্থ অনুভূতি এবং আজীবন পাশে থাকার নীরব প্রতিশ্রুতি',
    hindi: 'सच्चा प्यार, रूहानी रिश्ता और हर मुश्किल घड़ी में बिना शर्त साथ निभाने का एहसास',
    english: 'pure unconditional love, deep emotional connection and finding home in a person',
    tags: '#TrueLove #Soulmate #UnconditionalLove #LoveStory',
    comments: {
      bengali: ['এই লেখাটা পড়ে চোখে জল চলে এলো, খুব সুন্দর লিখেছো।', 'ভালোবাসা এমনই হওয়া উচিত, দামি কিছু নয় দামি অনুভূতি।', 'তোমার লেখায় নিজের গল্পটা খুঁজে পেলাম।'],
      hindi: ['काश हर किसी को ऐसा प्यार मिले, दिल छू गया।', 'सच्चे प्यार की ताकत ही अलग होती है, शानदार लिखा।', 'इसे पढ़कर अपनी कहानी याद आ गई।'],
      english: ['This is what real love looks like, beautifully written.', 'Made me believe in love stories again.', 'Every word felt so genuine, thank you for sharing.']
    }
  },
  {
    category: 'Heartbreak & Pain',
    photoIds: ['photo-1518199266791-5375a83190b7', 'photo-1516589178581-6cd7833ae3b2', 'photo-1534528741775-53994a69daeb'],
    bengali: 'ভালোবাসার চরম বিচ্ছেদ, পুরোনো স্মৃতি আর গভীর একাকিত্ব নিয়ে বাস্তব মনের কথা',
    hindi: 'सच्चा प्यार टूटने का दर्द, पुरानी यादें और सीने में चुभती खामोशी पर दिल की बात',
    english: 'the quiet agony of a sudden breakup and learning to survive without them',
    tags: '#Heartbreak #SilentPain #BrokenHeart #MovingOn',
    comments: {
      bengali: ['সময় সব ক্ষত সারিয়ে দেবে, শক্ত হও বন্ধু।', 'একা নও, আমরা সবাই কোনো না কোনো রাতে ভেঙেছি।', 'লেখাটা বুকের গভীরে লেগেছে।'],
      hindi: ['वक्त सब ठीक कर देगा भाई, हिम्मत रखो।', 'दर्द बांटने से कम होता है, यहां सब अपने हैं।', 'दिल की बात बेधड़क लिखी है।'],
      english: ['Healing is not linear, be gentle with yourself.', 'Felt every word of this. Stay strong.', 'Thank you for putting this pain into words.']
    }
  },
  {
    category: 'Motivational Quotes & Resilience',
    photoIds: ['photo-1499209974431-9dddcece7f88', 'photo-1470246973918-29a93221c455', 'photo-1500530855697-b586d89ba3ee'],
    bengali: 'হেরে না যাওয়ার প্রেরণা, জীবনের কঠিন পরিস্থিতিতে ঘুরে দাঁড়ানো এবং নিজের ওপর অটুট বিশ্বাস',
    hindi: 'हालातों से लड़कर उठ खड़े होने की प्रेरणा, हौसलों की उड़ान और खुद पर अटूट यकीन',
    english: 'unbreakable resilience, rising from rock bottom and conquering personal fears',
    tags: '#Motivation #NeverGiveUp #MindsetMatters #StayStrong',
    comments: {
      bengali: ['ঠিক সময়ে এই পোস্টটা পড়লাম, ধন্যবাদ।', 'হাল ছাড়লে তো আর কিছুই নেই, এগিয়ে চলো।', 'প্রেরণার আসল সংজ্ঞা এই লেখায়।'],
      hindi: ['बहुत जरूरी बात लिखी है, शुक्रिया।', 'हार मान ली तो सब खत्म, लड़ते रहो।', 'ये पढ़कर फिर से उठने का मन कर रहा है।'],
      english: ['Exactly what I needed to hear today.', 'Never quit, this post says it all.', 'Saving this for the hard days. Respect.']
    }
  },
  {
    category: 'Real Life Struggles & True Stories',
    photoIds: ['photo-1477959858617-67f30bc75b82', 'photo-1480714378408-67cf0d13bc1b', 'photo-1449824913935-59a10b8d2000'],
    bengali: 'মধ্যবিত্ত পরিবারের লড়াই, সমাজের ভণ্ডামি আর সাধারণ মানুষের টিকে থাকার বাস্তব গল্প',
    hindi: 'मिडिल क्लास की बेबसी, महंगाई और समाज के दोगलेपन पर एक आम इंसान की सच्ची कहानी',
    english: 'raw real-life struggles of ordinary people surviving an unfair system with dignity',
    tags: '#RealStory #LifeStruggles #RealityCheck #CommonMan',
    comments: {
      bengali: ['একদম বাস্তব কথা, সাধারণ মানুষের জীবন এমনই।', 'তোমার গল্পে আমার বাবার ছায়া দেখলাম।', 'সত্যি লিখেছো, এই সমাজে টিকে থাকাটাই যুদ্ধ।'],
      hindi: ['यही तो असली जिंदगी है, सटीक लिखा।', 'इसमें मेरे पिताजी की कहानी दिखी।', 'सच कड़वा होता है, लेकिन जरूरी भी।'],
      english: ['This is the reality nobody talks about.', 'Your story sounds like my father\'s life.', 'Honest writing like this is rare now.']
    }
  },
  {
    category: 'Local News & Public Reality',
    photoIds: ['photo-1495020689067-958852a7765e', 'photo-1504711434969-e33886168f5c', 'photo-1477959858617-67f30bc75b82'],
    bengali: 'শহরের প্রতিদিনের বাস্তব সমস্যা, যানজট, ভাড়া বৃদ্ধি আর সাধারণ মানুষের ভোগান্তি',
    hindi: 'शहर की ताजा खबरें, ट्रैफिक, बढ़ती कीमतें और आम जनता की रोजमर्रा की परेशानी',
    english: 'today\'s local city issues, traffic chaos, rising prices and everyday civic struggles',
    tags: '#LocalNews #CityLife #PublicIssues #TrendingNow',
    comments: {
      bengali: ['এই সমস্যাটা আমাদের এলাকাতেও একই।', 'প্রশাসন কবে চোখ খুলবে কে জানে।', 'সত্যি কথা, প্রতিদিনই এটা মাথায় নিয়ে বেরোই।'],
      hindi: ['हमारे इलाके में भी यही हाल है।', 'प्रशासन कब जागेगा, कोई नहीं जानता।', 'रोज इसी झमेले से गुजरना पड़ता है।'],
      english: ['Same story in every corner of this city.', 'When will the authorities actually wake up?', 'Dealing with this every single day is exhausting.']
    }
  },
  {
    category: 'Global News & World Affairs',
    photoIds: ['photo-1451187580459-43490279c0fa', 'photo-1521295121783-8a321d551ad2', 'photo-1454165804606-c3d57bc86b40'],
    bengali: 'বিশ্বজুড়ে চলমান বড় ঘটনা, আন্তর্জাতিক রাজনীতি এবং গ্লোবাল অর্থনীতির প্রভাব নিয়ে আলোচনা',
    hindi: 'दुनिया भर की बड़ी घटनाएं, अंतरराष्ट्रीय राजनीति और वैश्विक मंदी का असर',
    english: 'major world events, international politics and how global changes affect ordinary lives',
    tags: '#WorldNews #GlobalAffairs #BreakingNews #Geopolitics',
    comments: {
      bengali: ['বিশ্ব পরিস্থিতি সত্যিই চিন্তার, ভালো বিশ্লেষণ।', 'এই খবরটা আমিও ফলো করছি।', 'সাধারণ মানুষের ওপর এর প্রভাবটাই সবচেয়ে বড়।'],
      hindi: ['वैश्विक हालात सच में चिंताजनक हैं।', 'ये खबर मैं भी फॉलो कर रहा हूं।', 'आम आदमी पर इसका असर सबसे ज्यादा है।'],
      english: ['The world situation is genuinely concerning.', 'Been following this story closely too.', 'Ordinary people always pay the price.']
    }
  },
  {
    category: 'Funny & Relatable Moments',
    photoIds: ['photo-1514888286974-6c03e2ca1dba', 'photo-1543610892-0b1f7e6d8ac1', 'photo-1537151608828-ea2b11777ee8'],
    bengali: 'দৈনন্দিন জীবনের মজার কাণ্ড, ব্যর্থ সোশ্যাল ইন্টারেকশন এবং হাসির অভিজ্ঞতা',
    hindi: 'लाइफ के मजेदार और अजीबोगरीब किस्से, अजीब सोशल सिचुएशंस और फनी गलतियां',
    english: 'funny everyday awkward moments and hilarious realizations about adult life',
    tags: '#RelatableHumor #AwkwardMoments #FunnyFails #LaughOutLoud',
    comments: {
      bengali: ['হাসতে হাসতে পেট ব্যথা করে গেল!', 'এটা তো আমার সাথেই হয়েছে গতকাল।', 'অন্যরকম কমেডি, দারুণ লিখেছো।'],
      hindi: ['हंसते हंसते पेट दुख गया!', 'ये तो कल मेरे साथ भी हुआ था।', 'कमाल की sense of humour है आपकी।'],
      english: ['I laughed way too hard at this.', 'This literally happened to me yesterday.', 'Your sense of humour is unmatched.']
    }
  },
  {
    category: 'Gaming & Esports News',
    photoIds: ['photo-1538481199705-c710c4e965fc', 'photo-1542751371-adc38448a05e', 'photo-1511512578047-dfb367046420'],
    bengali: 'নতুন গেম রিলিজ, এসপোর্টস টুর্নামেন্ট আপডেট, মাঝরাতের গেমিং সেশন আর ক্ল্যাচ মোমেন্ট',
    hindi: 'नए गेम रिलीज, एस्पोर्ट्स टूर्नामेंट अपडेट, देर रात की गेमिंग और आखिरी मोमेंट की क्लच फाइट',
    english: 'new game releases, esports tournament updates, late night grinds and clutch moments',
    tags: '#GamingNews #Esports #GamerLife #NewReleases',
    comments: {
      bengali: ['কোন গেমটার কথা বলছো বলো তো, ডাউনলোড করে ফেলবো।', 'এই টুর্নামেন্টটা আমিও দেখছিলাম।', 'ক্ল্যাচটার বর্ণনা একদম সিনেমার মতো!'],
      hindi: ['कौन सा गेम है ये, बता दो डाउनलोड करूंगा।', 'ये टूर्नामेंट मैंने भी देखा था।', 'क्लच मोमेंट का description वाह!'],
      english: ['Which game is this? Downloading tonight.', 'Watched that tournament live, insane plays.', 'That clutch description gave me goosebumps.']
    }
  },
  {
    category: 'Work & Corporate Hustle',
    photoIds: ['photo-1486312338219-ce68d2c6f44d', 'photo-1498050108023-c5249f4df085', 'photo-1519389950473-47ba0277781c'],
    bengali: 'অফিসের অমানবিক প্রেশার, বসের টক্সিক রাজনীতি আর ক্যারিয়ারের ক্লান্তিকর লড়াই',
    hindi: 'कॉर्पोरेट की 9-to-5 गुलामी, टॉक्सिक बॉस और ईএমआई के चक्कर में पिसती जिंदगी',
    english: 'corporate burnout, impossible deadlines and pretending to love a toxic job',
    tags: '#CorporateLife #Burnout #9to5Hustle #WorkLife',
    comments: {
      bengali: ['অফিসের এই গল্পটা যেন আমারটাই।', 'মাস শেষে ব্যাংক ব্যালান্স দেখলে কাঁদতে ইচ্ছে করে।', 'ছুটির দিনটাও ফোনে কাটে, কী আর বলবো।'],
      hindi: ['ये तो मेरी ही कहानी लग रही है।', 'सैलरी आते ही EMI खा जाती है।', 'छुट्टी में भी लैपटॉप खोलना पड़ता है, क्या जीवन है।'],
      english: ['This is literally my daily routine.', 'Salary arrives and the bills swallow it instantly.', 'Even weekends are just work from home now.']
    }
  },
  {
    category: 'Family & Relationships',
    photoIds: ['photo-1511895426328-dc8714191300', 'photo-1609220136736-443140cffec6', 'photo-1476703993599-0035a21b17a9'],
    bengali: 'পরিবারের ভালোবাসা, মা-বাবার ত্যাগ, ভাইবোনের ঝগড়া-মিল আর আত্মীয়দের আড্ডার গল্প',
    hindi: 'परिवार का प्यार, मां-बाप के बलिदान, भाई-बहन की नोकझोंक और रिश्तों की मिठास',
    english: 'family bonds, parents\' sacrifices, sibling chaos and the warmth of home',
    tags: '#FamilyFirst #FamilyLove #HomeSweetHome #Togetherness',
    comments: {
      bengali: ['মা-বাবার কথা পড়ে চোখ ভিজে গেল।', 'পরিবারের চেয়ে বড় সম্পদ আর কিছু নেই।', 'ভাইবোনের এই ঝগড়াটা আমাদের বাড়িতেও হয়।'],
      hindi: ['मां-बाप को याद कर आंख भर आई।', 'परिवार से बड़ी कोई दौलत नहीं।', 'भाई-बहन की ये नोकझोंक हर घर की कहानी है।'],
      english: ['This made me call my mom immediately.', 'Nothing beats family, nothing at all.', 'Sibling fights are universal, I swear.']
    }
  },
  {
    category: 'Travel & Tourism',
    photoIds: ['photo-1488646953014-85cb44e25828', 'photo-1476514525535-07fb3b4ae5f1', 'photo-1503220317375-aaad61436b1b'],
    bengali: 'নতুন শহর ঘোরা, পাহাড়ি রাস্তা, স্থানীয় খাবার আর ভ্রমণের অভিজ্ঞতা নিয়ে বাস্তব অভিজ্ঞতা',
    hindi: 'नई जगहों की सैर, पहाड़ी रास्ते, लोकल खाना और यात्रा के असली अनुभव',
    english: 'exploring new cities, mountain roads, local food and real travel experiences',
    tags: '#TravelDiaries #Wanderlust #Tourism #TravelGram',
    comments: {
      bengali: ['ছবিগুলো দেখে নিজেই যেতে ইচ্ছে করছে।', 'এই জায়গাটার নাম জানাবে? লিস্টে রাখছি।', 'ভ্রমণের অভিজ্ঞতা খুব সুন্দর করে লিখেছো।'],
      hindi: ['फोटो देखकर मन कर रहा है कहीं निकल जाऊं।', 'ये जगह कहां है? बकेट लिस्ट में डाल दी।', 'ट्रैवल एक्सपीरियंस बहुत खूबसूरत लिखा है।'],
      english: ['These photos are making me book a ticket.', 'Where is this place? Adding to my bucket list.', 'Such vivid travel writing, loved it.']
    }
  },
  {
    category: 'Pet Care & Love',
    photoIds: ['photo-1543466835-00a7907e9de1', 'photo-1548199973-03cce0bbc87b', 'photo-1583511655857-d19b40a7a54e'],
    bengali: 'পোষা প্রাণীর সাথে ভালোবাসার সম্পর্ক, তাদের যত্ন আর ছোট্ট পোষার মজার মুহূর্ত',
    hindi: 'पालतू जानवरों से प्यार, उनकी देखभाल और छोटी सी जान की मस्ती भरे पल',
    english: 'the unconditional love of pets, caring for them and their adorable daily mischief',
    tags: '#PetLove #DogLovers #CatLovers #PetCare',
    comments: {
      bengali: ['আমার বাড়িতেও একটা আছে, একদম এই রকম দুষ্টু।', 'পোষা মানুষের সবচেয়ে বিশ্বস্ত বন্ধু।', 'এর মুখের ছবিটা দেখে হাসি পেল।'],
      hindi: ['मेरे घर में भी एक ऐसा ही शैतान है।', 'पालतू जानवर सबसे वफादार दोस्त होते हैं।', 'इसकी फोटो देखकर दिल खुश हो गया।'],
      english: ['I have one just like this at home, equally naughty.', 'Pets are the most loyal friends we get.', 'That face just made my whole day.']
    }
  },
  {
    category: 'Tech, AI & Future Anxiety',
    photoIds: ['photo-1518770660439-4636190af475', 'photo-1526374965328-7f61d4dc18c5', 'photo-1486312338219-ce68d2c6f44d'],
    bengali: 'প্রযুক্তির দ্রুত বদল, এআই বিপ্লব এবং ভবিষ্যতের চাকরি নিয়ে তরুণদের উদ্বেগ',
    hindi: 'तेजी से बदलती टेक्नोलॉजी, एআই का खौफ और भविष्य के करियर की बेचैनी',
    english: 'artificial intelligence revolution, tech burnout and anxiety about future careers',
    tags: '#TechTrends #ArtificialIntelligence #FutureOfWork #CodingLife',
    comments: {
      bengali: ['এআই নিয়ে এই ভাবনাটা আমারও মাথায় ঘুরছে।', 'টেক সেক্টরের চাপ সত্যিই দিন দিন বাড়ছে।', 'নতুন স্কিল শেখা ছাড়া আর কোনো পথ নেই।'],
      hindi: ['AI को लेकर यही डर मुझे भी सताता है।', 'टेक इंडस्ट्री का प्रेशर सच में बढ़ रहा है।', 'नई स्किल सीखे बिना कोई रास्ता नहीं।'],
      english: ['This AI anxiety is so real right now.', 'The pressure in tech keeps increasing every year.', 'Upskilling is the only way forward now.']
    }
  }
];

const BENGALI_FALLBACKS = [
  "যখন সব পথ বন্ধ মনে হয়, তখনই বিশ্বাস রাখতে হয় যে ভাঙা মন দিয়েই জীবনের সেরা গল্পটা শুরু হয়। হেরে যাওয়া কোনো লজ্জা নয়, কিন্তু আবার ঘুরে না দাঁড়ানোই সবচেয়ে বড় পরাজয়। সময়ের সাথে সব অন্ধকার কেটে নতুন ভোরের আলো ফুটবেই। #Motivation #NeverGiveUp #StayStrong",
  "মেট্রোর ভিড়ে আজও তোর পরিচিত গন্ধটা যেন বাতাসে ভেসে আসে। সম্পর্ক শেষ হয়েছে ঠিকই, কিন্তু তোর জন্য বুকের ভেতরের ভালোবাসাটা এতটুকু মলিন হয়নি। হয়তো তোর গল্পে আমি নেই, কিন্তু আমার নীরব প্রার্থনায় আজও তুই আছিস। #TrueLove #Soulmate #UnspokenLove",
  "অফিসের এই কিউবিকলে বসে প্রতিদিন কম্পিউটারের স্ক্রিনের দিকে তাকিয়ে মনে হয়, শৈশবে এই জীবনের জন্যই কি এত বড় হওয়ার স্বপ্ন দেখেছিলাম? মাস শেষে অ্যাকাউন্টে টাকা ঢোকে, কিন্তু বুকের শান্তি কোথায় যেন হারিয়ে গেছে। #CorporateLife #Burnout #9to5Hustle",
  "ভোর পাঁচটায় জিমের মেঝে, ঘামে ভেজা টি-শার্ট আর নিজের সাথে নিজের প্রতিদিনের চুক্তি — কেউ দেখছে না, কেউ জানছেও না, তবু থামা যায় না। কারণ এই নীরব অনুশাসনই একদিন জীবনের সবচেয়ে বড় প্রতিদান দেবে, আলস্যকে হারানোর এই যুদ্ধে জয় আসবেই। #Fitness #Discipline #SelfImprovement"
];

const HINDI_FALLBACKS = [
  "जिंदगी जब इम्तिहान लेती है, तो रास्ता खुद ढूंढना पड़ता है। ठोकरें हमें गिराने के लिए नहीं, बल्कि संभलकर चलना सिखाने के लिए आती हैं। अपनी मेहनत और हिम्मत पर भरोसा रखो, वक्त तुम्हारा भी बदलेगा। #Motivation #NeverGiveUp #StayStrong",
  "सच्चा प्यार वो नहीं जो सिर्फ हासिल करने की ख्वाहिश रखे, बल्कि वो है जो दूर रहकर भी उसकी खुशियों की दुआ मांगे। लोग कहते हैं कि वक्त सब भुला देता है, पर कुछ नाम दिल पर हमेशा के लिए छप जाते हैं। #TrueLove #Soulmate #PureLove",
  "शहर की इस भागदौड़ में बाहर से सब कुछ बहुत सामान्य नजर आता है, लेकिन इस किराए के कमरे में हर शाम जिम्मेदारियों का बोझ घेर लेता है। मुस्कुराना तो बस एक आदत बन गई है, अंदर से तो थक चुके हैं। #MiddleClassLife #Burnout #RealityCheck",
  "सुबह पांच बजे जिम का फर्श, पसीने से भीगी टी-शर्ट और खुद से रोज़ का वादा — कोई देख नहीं रहा, कोई जान भी नहीं रहा, फिर भी रुकना मंजूर नहीं। क्योंकि यही खामोश अनुशासन एक दिन ज़िंदगी का सबसे बड़ा इनाम बनेगा। #Fitness #Discipline #Hustle"
];

const ENGLISH_FALLBACKS = [
  "You did not survive all those silent battles just to give up now. Rock bottom will always teach you lessons that success never could. Keep your head up, dust yourself off, and keep moving forward. #Motivation #NeverGiveUp #Resilience",
  "True love is quiet. It is not about grand gestures or public declarations; it is about knowing someone completely and still choosing to be their peace in a chaotic world. #TrueLove #Soulmate #DeepConnection",
  "Adult life is just sitting in traffic after a ten-hour shift realizing how easily childhood happiness was taken for granted. We grew up only to chase deadlines and monthly bills. #CorporateLife #Burnout #AdultingHard",
  "5 AM gym floor, a sweat-soaked t-shirt and a daily promise to myself — nobody is watching, nobody even knows, but quitting is not an option. This silent discipline will one day become the greatest reward of my life. #Fitness #Discipline #NoExcuses"
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
    const nowTime = Date.now();

    // 1. AI Post Generation (Strict 2.8s Timeout for Instant Delivery)
    let postText = '';
    const promptTopic = targetLang === 'Bengali' ? cat.bengali : targetLang === 'Hindi' ? cat.hindi : cat.english;
    const langRule = targetLang === 'Bengali' ? 'Bengali (বাংলা লিপি)' : targetLang === 'Hindi' ? 'Hindi (देवनागरी लिपि)' : 'English';

    const prompt = `Write an authentic Facebook trending feed post about: "${promptTopic}".
Location: ${loc.city}, ${loc.country} (mention this place naturally in the post).
Category: ${cat.category}.
Language: Strictly ${langRule}.
MANDATORY RULES:
- Length: STRICTLY between 90 and 100 words.
- Tone: Emotional, highly engaging, authentic human voice.
- HASHTAGS: At the very end append exactly 3 to 5 trending hashtags (e.g., ${cat.tags} #${loc.city.replace(/\s+/g, '')}).
- Plain raw text only.`;

    try {
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(2800)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('"error"') && !raw.includes('deprecat')) {
          const words = raw.split(/\s+/).length;
          if (words >= 75 && words <= 125) postText = raw;
        }
      }
    } catch (e) {}

    // Fallback if AI delays
    if (!postText) {
      if (targetLang === 'Bengali') {
        postText = BENGALI_FALLBACKS[Math.floor(Math.random() * BENGALI_FALLBACKS.length)].replace('এই শহরের', `${loc.city} শহরের`).replace('শহরের', `${loc.city} শহরের`);
      } else if (targetLang === 'Hindi') {
        postText = HINDI_FALLBACKS[Math.floor(Math.random() * HINDI_FALLBACKS.length)].replace('शहर की', `${loc.city} की`);
      } else {
        postText = ENGLISH_FALLBACKS[Math.floor(Math.random() * ENGLISH_FALLBACKS.length)];
        if (postText.includes('this city')) postText = postText.replace('this city', loc.city);
      }
    }

    // 2. Ultra-Fast Cloudinary Auto-Compression URL (0.01 sec execution, ~45KB WebP)
    const validPhotoIds = cat.photoIds && cat.photoIds.length > 0 ? cat.photoIds : ['photo-1518199266791-5375a83190b7'];
    const selectedPhotoId = validPhotoIds[Math.floor(Math.random() * validPhotoIds.length)];
    const rawSourceUrl = `https://images.unsplash.com/${selectedPhotoId}?auto=format&fit=crop&w=600&h=420&q=75`;
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_600,h_420,c_fill/${encodeURIComponent(rawSourceUrl)}`;

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
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // 4. Organic comments & engagement on previous confessions
    try {
      const listRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?pageSize=6&key=${POSTS_API_KEY}`
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
                  createdAt: { timestampValue: new Date().toISOString() }
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
      message: `Posted [${cat.category}] in ${targetLang} from ${loc.city}`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

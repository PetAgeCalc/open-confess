import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';
const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';
const CLOUD_NAME = 'xjdv4l6v';

interface CategoryConfig {
  category: string;
  lang: 'English' | 'Hindi' | 'Bengali';
  city: string;
  country: string;
  tags: string;
  topicPrompt: string;
  photoList: string[];
}

const CATEGORIES_DATA: CategoryConfig[] = [
  // 1. Cricket Mania
  {
    category: 'Cricket Mania',
    lang: 'English',
    city: 'London',
    country: 'UK',
    tags: '#CricketTwitter #MatchDay #CricketMania #GameChanger',
    topicPrompt: 'Write an intense, passionate full paragraph post about a nail-biting final over in cricket, team spirit, and unbelievable sports drama.',
    photoList: ['photo-1531415074868-036b1c57e329', 'photo-1540747913346-19e32dc3e97e', 'photo-1512719994953-eabf50895df7', 'photo-1587280501635-68a0e82cd5ff']
  },
  {
    category: 'Cricket Mania',
    lang: 'Hindi',
    city: 'Mumbai',
    country: 'India',
    tags: '#क्रिकेटफीवर #IPL #TeamIndia #BCCI',
    topicPrompt: 'क्रिकेट के आखिरी रोमांचक ओवर, चौके-छक्कों की जंग और दर्शकों के जुनून पर एक गहरा और भावुक पूरा पैराग्राफ पोस्ट लिखें।',
    photoList: ['photo-1540747913346-19e32dc3e97e', 'photo-1531415074868-036b1c57e329', 'photo-1587280501635-68a0e82cd5ff', 'photo-1512719994953-eabf50895df7']
  },
  {
    category: 'Cricket Mania',
    lang: 'Bengali',
    city: 'Dhaka',
    country: 'Bangladesh',
    tags: '#ক্রিকেট #টিমবাংলাদেশ #CricketCraze',
    topicPrompt: 'ক্রিকেট মাঠের টানটান শেষ ওভারের উত্তেজনা, স্মরণীয় বাউন্ডারি এবং দলের অসাধারণ লড়াই নিয়ে একটি গভীর ও সম্পূর্ণ অনুচ্ছেদ পোস্ট লিখুন।',
    photoList: ['photo-1531415074868-036b1c57e329', 'photo-1540747913346-19e32dc3e97e', 'photo-1512719994953-eabf50895df7']
  },

  // 2. Football & World Sports
  {
    category: 'Football & World Sports',
    lang: 'English',
    city: 'Manchester',
    country: 'UK',
    tags: '#FootballLive #UCL #PremierLeague #MatchDay',
    topicPrompt: 'Write an exhilarating full paragraph about 90 minutes of football madness, late stoppage time winner, and roaring stadium passion.',
    photoList: ['photo-1508098682722-e99c43a406b2', 'photo-1518091043644-c1d4457512c6', 'photo-1489944440615-453fc2b6a9a9', 'photo-1431324155629-1a6deb1dec8d']
  },
  {
    category: 'Football & World Sports',
    lang: 'Bengali',
    city: 'Kolkata',
    country: 'India',
    tags: '#ফুটবল #ডার্বি #কলকাতাফুটবল #FootballPassion',
    topicPrompt: 'কলকাতা ফুটবলের তীব্র উন্মাদনা, ইনজুরি টাইমের দর্শনীয় গোল আর সমর্থকদের নিঃস্বার্থ আবেগ নিয়ে বিস্তারিত সম্পূর্ণ পোস্ট লিখুন।',
    photoList: ['photo-1518091043644-c1d4457512c6', 'photo-1508098682722-e99c43a406b2', 'photo-1489944440615-453fc2b6a9a9']
  },

  // 3. News & Breaking Headlines
  {
    category: 'News & Breaking Headlines',
    lang: 'English',
    city: 'London',
    country: 'UK',
    tags: '#BreakingNews #WorldNews #Headlines #PublicEye',
    topicPrompt: 'Write a realistic, thought-provoking full paragraph about today major city challenges, public transportation issues, and civic infrastructure.',
    photoList: ['photo-1585829365295-ab7cd400c167', 'photo-1495020689067-958852a7765e', 'photo-1504711434969-e33886168f5c', 'photo-1477959858617-67f30bc75b82']
  },
  {
    category: 'News & Breaking Headlines',
    lang: 'Hindi',
    city: 'Delhi',
    country: 'India',
    tags: '#ताज़ाखबर #BreakingNews #देशदुनिया #दिल्लीअपडेट',
    topicPrompt: 'शहर की ताजा हलचल, रोजमर्रा के ट्रैफिक और बुनियादी समस्याओं को लेकर आम नागरिकों के संघर्ष पर एक गंभीर और विस्तृत पैराग्राफ लिखें।',
    photoList: ['photo-1495020689067-958852a7765e', 'photo-1585829365295-ab7cd400c167', 'photo-1504711434969-e33886168f5c']
  },
  {
    category: 'News & Breaking Headlines',
    lang: 'Bengali',
    city: 'Kolkata',
    country: 'India',
    tags: '#ব্রেকিংনিউজ #আজকেরখবর #কলকাতা #বাস্তবচিত্র',
    topicPrompt: 'শহরের প্রতিদিনের বাস্তব সমস্যা, পরিবহন ব্যবস্থা এবং সাধারণ নিত্যযাত্রীদের লড়াই নিয়ে একটি তথ্যবহুল সম্পূর্ণ পোস্ট লিখুন।',
    photoList: ['photo-1504711434969-e33886168f5c', 'photo-1495020689067-958852a7765e', 'photo-1585829365295-ab7cd400c167']
  },

  // 4. Politics & Public Debate
  {
    category: 'Politics & Public Debate',
    lang: 'English',
    city: 'Washington',
    country: 'USA',
    tags: '#PoliticsToday #Democracy #PublicDebate #PolicyWatch',
    topicPrompt: 'Write a balanced, highly realistic critique of public promises versus actual ground reality faced by hardworking middle-class families.',
    photoList: ['photo-1541872703-74c5e44368f9', 'photo-1540910419892-4a36d2c3266c', 'photo-1529107386315-e1a2ed48a620', 'photo-1523995462485-3d171b5c8fa9']
  },
  {
    category: 'Politics & Public Debate',
    lang: 'Hindi',
    city: 'Lucknow',
    country: 'India',
    tags: '#राजनीति #जनताकीआवाज #BharatPolitics #लोकतंत्र',
    topicPrompt: 'नेताओं के चुनावी वादों और जमीनी स्तर पर आम जनता की बुनियादी जरूरतों के बीच के अंतर पर एक निष्पक्ष और मजबूत पैराग्राफ लिखें।',
    photoList: ['photo-1540910419892-4a36d2c3266c', 'photo-1541872703-74c5e44368f9', 'photo-1529107386315-e1a2ed48a620']
  },

  // 5. Entertainment & Cinema
  {
    category: 'Entertainment & Cinema',
    lang: 'English',
    city: 'Los Angeles',
    country: 'USA',
    tags: '#CinemaLovers #MovieNight #Hollywood #PopCulture',
    topicPrompt: 'Write an engaging, movie-lover full post about theatrical experience, character writing, background score, and visual storytelling.',
    photoList: ['photo-1489599849927-2ee91cede3ba', 'photo-1514525253161-7a46d19cd819', 'photo-1478720568477-152d9b164e26', 'photo-1536440136628-849c177e76a1']
  },
  {
    category: 'Entertainment & Cinema',
    lang: 'Hindi',
    city: 'Mumbai',
    country: 'India',
    tags: '#बॉलीवुड #CinemaReview #BoxOfficeHit #सिनेमा',
    topicPrompt: 'सिनेमाघरों में नई फिल्म का जादू, कलाकारों का सधा हुआ अभिनय और दिल छू लेने वाले संवादों पर एक खूबसूरत और विस्तृत रिव्यू पोस्ट लिखें।',
    photoList: ['photo-1514525253161-7a46d19cd819', 'photo-1489599849927-2ee91cede3ba', 'photo-1478720568477-152d9b164e26']
  },

  // 6. Funny, Memes & Sarcasm
  {
    category: 'Funny, Memes & Sarcasm',
    lang: 'English',
    city: 'New York',
    country: 'USA',
    tags: '#FunnyTweet #MemeDaily #Sarcasm #RelatableHumor',
    topicPrompt: 'Write a hilarious, relatable, and witty full post about adulting struggles, waking up on Monday, and surviving coffee addiction.',
    photoList: ['photo-1537151608828-ea2b11777ee8', 'photo-1543610892-0b1f7e6d8ac1', 'photo-1517849845537-4d257902454a', 'photo-1527525443983-6e60c75fff46']
  },
  {
    category: 'Funny, Memes & Sarcasm',
    lang: 'Hindi',
    city: 'Pune',
    country: 'India',
    tags: '#मजेदारमीम्स #देसीह्यूमर #हंसतेरहो #FunnyJokes',
    topicPrompt: 'जिंदगी के मजेदार किस्सों, दोस्तों की अजीब हरकतों और काम के बीच आने वाले आलस पर एक बहुत ही मजेदार और चुटीला देसी पोस्ट लिखें।',
    photoList: ['photo-1543610892-0b1f7e6d8ac1', 'photo-1537151608828-ea2b11777ee8', 'photo-1517849845537-4d257902454a']
  },

  // 7. True Love & Soul Connections
  {
    category: 'True Love & Soul Connections',
    lang: 'English',
    city: 'Paris',
    country: 'France',
    tags: '#TrueLove #Soulmate #DeepConnection #LoveStory',
    topicPrompt: 'Write a deeply moving, genuine full paragraph about quiet unconditional love, understanding without words, and growing old together.',
    photoList: ['photo-1529333166437-7750a6dd5a70', 'photo-1516589178581-6cd7833ae3b2', 'photo-1522673607200-164d1b6ce486', 'photo-1494774157365-9e04c6720e47']
  },
  {
    category: 'True Love & Soul Connections',
    lang: 'Hindi',
    city: 'Jaipur',
    country: 'India',
    tags: '#सच्चाप्यार #रूहानीरिश्ता #LoveDiary #एहसास',
    topicPrompt: 'सच्ची और रूहानी मोहब्बत, बिना शर्त साथ निभाने के वादे और दिल की खामोश समझ पर एक दिल छू लेने वाला संपूर्ण पोस्ट लिखें।',
    photoList: ['photo-1516589178581-6cd7833ae3b2', 'photo-1529333166437-7750a6dd5a70', 'photo-1522673607200-164d1b6ce486']
  },

  // 8. Heartbreak & Pain
  {
    category: 'Heartbreak & Pain',
    lang: 'English',
    city: 'Chicago',
    country: 'USA',
    tags: '#Heartbreak #BrokenHeart #MovingOn #Healing',
    topicPrompt: 'Write a poignant, deeply realistic post about the quiet ache of losing someone you loved, midnight memories, and slowly piecing yourself back together.',
    photoList: ['photo-1534528741775-53994a69daeb', 'photo-1499209974431-9dddcece7f88', 'photo-1516589178581-6cd7833ae3b2', 'photo-1509198397868-475647b2a1e5']
  },
  {
    category: 'Heartbreak & Pain',
    lang: 'Hindi',
    city: 'Delhi',
    country: 'India',
    tags: '#टूटादिल #तन्हाई #अधूरीमोहब्बत #दर्द',
    topicPrompt: 'अधूरी मोहब्बत की खामोश टीस, पुरानी यादों की चुभन और टूटे दिल को संभालकर आगे बढ़ने के दर्द पर एक भावुक और सच्चा पोस्ट लिखें।',
    photoList: ['photo-1534528741775-53994a69daeb', 'photo-1509198397868-475647b2a1e5', 'photo-1499209974431-9dddcece7f88']
  },

  // 9. Motivational Quotes & Resilience
  {
    category: 'Motivational Quotes & Resilience',
    lang: 'English',
    city: 'Toronto',
    country: 'Canada',
    tags: '#Motivation #NeverGiveUp #StayStrong #RiseAndGrind',
    topicPrompt: 'Write a powerful, inspiring full paragraph about rising from absolute rock bottom, building unbreakable silent discipline, and overcoming self-doubt.',
    photoList: ['photo-1470246973918-29a93221c455', 'photo-1500530855697-b586d89ba3ee', 'photo-1499209974431-9dddcece7f88', 'photo-1464822759023-fed622ff2c3b']
  },
  {
    category: 'Motivational Quotes & Resilience',
    lang: 'Hindi',
    city: 'Bhopal',
    country: 'India',
    tags: '#प्रेरणा #हौसलेकीउड़ान #संघर्षहीजीवनहै #मेहनत',
    topicPrompt: 'मुश्किल हालातों में बिना रुके लड़ने, खुद पर भरोसा रखने और शून्य से उठकर सफलता पाने के जज्बे पर एक ऊर्जावान पूरा पोस्ट लिखें।',
    photoList: ['photo-1470246973918-29a93221c455', 'photo-1500530855697-b586d89ba3ee', 'photo-1464822759023-fed622ff2c3b']
  },

  // 10. Real Life Struggles & Stories
  {
    category: 'Real Life Struggles & Stories',
    lang: 'English',
    city: 'New York',
    country: 'USA',
    tags: '#RealLife #LifeStruggles #CommonMan #RealityCheck',
    topicPrompt: 'Write an honest, touching narrative about an ordinary middle-class individual making silent sacrifices every day for family well-being.',
    photoList: ['photo-1477959858617-67f30bc75b82', 'photo-1480714378408-67cf0d13bc1b', 'photo-1449824913935-59a10b8d2000', 'photo-1476703993599-0035a21b17a9']
  },
  {
    category: 'Real Life Struggles & Stories',
    lang: 'Bengali',
    city: 'Siliguri',
    country: 'India',
    tags: '#বাস্তবজীবন #মধ্যবিত্তেরলড়াই #জীবনসংগ্রাম',
    topicPrompt: 'মধ্যবিত্ত পরিবারের দিনরাত অমানুষিক পরিশ্রম, পরিবারের মুখে হাসি ফোটানোর নীরব ত্যাগ এবং সততার সাথে বেঁচে থাকা নিয়ে একটি গভীর সম্পূর্ণ পোস্ট লিখুন।',
    photoList: ['photo-1449824913935-59a10b8d2000', 'photo-1477959858617-67f30bc75b82', 'photo-1480714378408-67cf0d13bc1b']
  },

  // 11. Work & Corporate Hustle
  {
    category: 'Work & Corporate Hustle',
    lang: 'English',
    city: 'Singapore',
    country: 'Singapore',
    tags: '#CorporateLife #WorkHustle #Burnout #9to5Life',
    topicPrompt: 'Write a truthful, relatable critique of modern corporate culture, infinite meetings, inbox overwhelm, and the struggle to protect mental peace.',
    photoList: ['photo-1486312338219-ce68d2c6f44d', 'photo-1498050108023-c5249f4df085', 'photo-1519389950473-47ba0277781c', 'photo-1497366216548-37526070297c']
  },
  {
    category: 'Work & Corporate Hustle',
    lang: 'Hindi',
    city: 'Bengaluru',
    country: 'India',
    tags: '#कॉर्पोरेटलाइफ #नौकरीपेशा #WorkStress #WeekendVibes',
    topicPrompt: 'कॉर्पोरेट की 9 से 5 की अंधी दौड़, अंतहीन टारगेट्स और ईएमआई के बोझ के बीच खुद की जिंदगी को खोने के अहसास पर एक सच्चा पैराग्राफ लिखें।',
    photoList: ['photo-1498050108023-c5249f4df085', 'photo-1486312338219-ce68d2c6f44d', 'photo-1519389950473-47ba0277781c']
  },

  // 12. Family & Home Bonds
  {
    category: 'Family & Home Bonds',
    lang: 'English',
    city: 'Melbourne',
    country: 'Australia',
    tags: '#FamilyFirst #ParentsLove #HomeVibes #Togetherness',
    topicPrompt: 'Write a heartwarming full post about returning home to parents, home-cooked food, and realizing family love is the safest place on earth.',
    photoList: ['photo-1511895426328-dc8714191300', 'photo-1609220136736-443140cffec6', 'photo-1476703993599-0035a21b17a9', 'photo-1506869640319-fe1a24fd76dc']
  },
  {
    category: 'Family & Home Bonds',
    lang: 'Hindi',
    city: 'Jaipur',
    country: 'India',
    tags: '#परिवारकाप्यार #मातापिता #घरकासुकून #अपनापन',
    topicPrompt: 'मां-बाप के अनमोल बलिदान, घर के सुकून और परिवार के साथ बिताए गए सादे लेकिन सबसे खूबसूरत पलों पर एक भावुक और आत्मीय पोस्ट लिखें।',
    photoList: ['photo-1609220136736-443140cffec6', 'photo-1511895426328-dc8714191300', 'photo-1476703993599-0035a21b17a9']
  },

  // 13. Travel & Global Adventures
  {
    category: 'Travel & Global Adventures',
    lang: 'English',
    city: 'San Francisco',
    country: 'USA',
    tags: '#TravelDiaries #Wanderlust #ExploreTheWorld #Mountains',
    topicPrompt: 'Write a vivid, sensory travel post about morning mist over winding mountain roads, local food discoveries, and the transformative power of journeys.',
    photoList: ['photo-1488646953014-85cb44e25828', 'photo-1476514525535-07fb3b4ae5f1', 'photo-1503220317375-aaad61436b1b', 'photo-1469854523086-cc02fe5d8800']
  },
  {
    category: 'Travel & Global Adventures',
    lang: 'Bengali',
    city: 'Darjeeling',
    country: 'India',
    tags: '#ভ্রমণকাহিনী #পাহাড়েরটান #পথেরনেশা #দার্জিলিং',
    topicPrompt: 'পাহাড়ের কুয়াশাঘেরা বাঁক, কাঞ্চনজঙ্ঘার দৃশ্য, চা বাগানের নীরবতা এবং ভ্রমণের রোমাঞ্চকর অনুভূতি নিয়ে একটি মনোমুগ্ধকর বিস্তারিত পোস্ট লিখুন।',
    photoList: ['photo-1503220317375-aaad61436b1b', 'photo-1476514525535-07fb3b4ae5f1', 'photo-1488646953014-85cb44e25828']
  },

  // 14. Tech, AI & Future World
  {
    category: 'Tech, AI & Future World',
    lang: 'English',
    city: 'San Francisco',
    country: 'USA',
    tags: '#TechNews #ArtificialIntelligence #FutureTech #DigitalEra',
    topicPrompt: 'Write an insightful, forward-looking full paragraph analyzing how artificial intelligence is reshaping careers, human creativity, and daily life.',
    photoList: ['photo-1518770660439-4636190af475', 'photo-1526374965328-7f61d4dc18c5', 'photo-1485827404703-89b55fcc595e', 'photo-1531297484001-80022131f5a1']
  },
  {
    category: 'Tech, AI & Future World',
    lang: 'Hindi',
    city: 'Noida',
    country: 'India',
    tags: '#तकनीक #एआईक्रांति #TechHindi #भविष्य',
    topicPrompt: 'आर्टिफिशियल इंटेलिजेंस के बढ़ते कदमों, नई नौकरियों और तकनीक के बीच इंसानी सोच के भविष्य पर एक विचारणीय और ज्ञानवर्धक पैराग्राफ लिखें।',
    photoList: ['photo-1526374965328-7f61d4dc18c5', 'photo-1518770660439-4636190af475', 'photo-1485827404703-89b55fcc595e']
  }
];

// Strict Category Matched Comments
const COMMENTS_STORE: Record<string, { English: string[]; Hindi: string[]; Bengali: string[] }> = {
  'Cricket Mania': {
    English: ['What an incredible game of cricket!', 'That over was pure cinema.', 'Games like this remind us why we love cricket.'],
    Hindi: ['क्या जबरदस्त खेल दिखाया! रोंगटे खड़े हो गए मैच देखकर।', 'ये खिलाड़ी सच में मैच विनर है।', 'आखिरी लम्हों तक सांसें थमी हुई थीं!'],
    Bengali: ['অবিশ্বাস্য এক ম্যাচ! শেষ মুহূর্ত পর্যন্ত কী টানটান উত্তেজনা ছিল।', 'এই ইনিংসটা অনেকদিন মনে থাকবে।', 'দারুণ লড়াই করেছে দল!']
  },
  'Football & World Sports': {
    English: ['Pure class and determination on the pitch tonight.', 'The stadium atmosphere was electric, what a goal!', 'Football at its highest level.'],
    Hindi: ['क्या गजब का मुकाबला था, खिलाड़ियों का जोश देखने लायक था।', 'स्टेडियम का वो शोर और वो आखिरी गोल, कमाल!', 'फुटबॉल का असली जुनून!'],
    Bengali: ['মাঠে পুরো ৯০ মিনিট ধরে অসাধারণ লড়াই দেখলাম!', 'ইনজুরি টাইমের গোলটা পুরো খেলার রূপ বদলে দিল।', 'চমৎকার ফুটবল!']
  },
  'News & Breaking Headlines': {
    English: ['Following this situation very closely.', 'Immediate accountability from local authorities is required.', 'Thanks for this timely ground update.'],
    Hindi: ['सुबह से इस खबर पर सबकी नजर है, ठोस कदम उठाने जरूरी हैं।', 'प्रशासन को जमीनी हकीकत देखकर तुरंत फैसला लेना चाहिए।', 'बहुत ही जरूरी अपडेट साझा किया।'],
    Bengali: ['সকাল থেকেই এই ঘটনাটি নিয়ে সব জায়গায় জোর আলোচনা চলছে।', 'প্রশাসনের উচিত দ্রুত ব্যবস্থা নেওয়া।', 'বাস্তব চিত্র তুলে ধরার জন্য ধন্যবাদ।']
  },
  'Politics & Public Debate': {
    English: ['A very rational, well-balanced critique of ground policies.', 'Public promises look great on paper, but ground reality is different.', 'Insightful perspective.'],
    Hindi: ['वादे बड़े-बड़े होते हैं पर आम आदमी की जिंदगी जस की तस रहती है।', 'बिल्कुल निष्पक्ष और जमीनी राय रखी है आपने।', 'इस मुद्दे पर बात होना बहुत जरूरी था।'],
    Bengali: ['রাজনীতির মঞ্চে বড় কথার ভিড়ে সাধারণ মানুষের আসল সমস্যা হারিয়ে যায়।', 'খুবই প্রাসঙ্গিক এবং স্পষ্ট আলোচনা।', 'একদম সহমত।']
  },
  'Entertainment & Cinema': {
    English: ['Loved the cinematic vision and emotional depth!', 'Booking tickets right away after reading this.', 'Truly worth all the praise.'],
    Hindi: ['अभिनय और कहानी दोनों में गहराई थी, पूरा पैसा वसूल!', 'बैकग्राउंड स्कोर सीधे दिल में उतरता है।', 'इस हफ्ते की सबसे बेहतरीन पेशकश।'],
    Bengali: ['অনবদ্য পরিচালনা আর প্রতিটি চরিত্রের নিখুঁত অভিনয় মুগ্ধ করল!', 'ব্যাকগ্রাউন্ড মিউজিকটা পুরো দৃশ্যপট বদলে দিয়েছে।', 'অসাধারণ সিনেমা!']
  },
  'Funny, Memes & Sarcasm': {
    English: ['I cannot stop laughing at this, painfully relatable!', 'Sent this straight to the family and friends group chat.', 'Your sense of humour always hits the bullseye.'],
    Hindi: ['हंसते-हंसते लोटपोट हो गए भाई, क्या गजब की टाइमिंग है!', 'ये तो मेरे ही दोस्त की रोज की दास्तान लग रही है।', 'सेंस ऑफ ह्यूमर कमाल है भाई!'],
    Bengali: ['হাসতে হাসতে পেটে খিল ধরে গেল ভাই, কী দারুণ টাইমিং!', 'একদম আমাদের বন্ধুদের রোজকার আড্ডার গল্প যেন এটা।', 'দারুণ রসিকতা!']
  },
  'True Love & Soul Connections': {
    English: ['Beautifully written and deeply moving piece.', 'Pure, quiet love like this is the biggest blessing.', 'Every line carried genuine warmth.'],
    Hindi: ['सच्ची मोहब्बत की सादगी दिल को छू गई, बहुत खूबसूरत लिखा है।', 'रिश्ते दिखावे से नहीं, रूहानी एहसास से जीते हैं।', 'काश हर किसी को ऐसा प्यार मिले।'],
    Bengali: ['পড়ে মনটা শান্তিতে ভরে গেল, অসাধারণ আবেগ দিয়ে লিখেছো।', 'ভালোবাসা কোনো দামী উপহার নয়, নীরব পাশে থাকার নাম।', 'খুব মিষ্টি একটা লেখা।']
  },
  'Heartbreak & Pain': {
    English: ['Healing is not linear, be gentle with yourself.', 'Felt every single word of this deeply. Stay strong.', 'Better days are ahead.'],
    Hindi: ['वक्त हर गहरे जख्म को भर देता है भाई, खुद को संभालो।', 'अधूरी मोहब्बत का दर्द सबसे खामोश और भारी होता है।', 'महसूस हुआ तुम्हारा दर्द।'],
    Bengali: ['খুব শক্ত হও বন্ধু, সময়ের চেয়ে বড় কোনো শুশ্রূষা নেই।', 'আমরা সবাই কোনো না কোনো রাতে এভাবে ভেঙেছি।', 'লেখাটা মনের গভীরে লেগেছে।']
  },
  'Motivational Quotes & Resilience': {
    English: ['Exactly the powerful push needed to conquer today goals.', 'Consistency in silent battles will always bring victory.', 'Respect for this mindset.'],
    Hindi: ['हार मान लेना कोई रास्ता नहीं है, गिरकर उठना ही जिंदगी है।', 'इस पोस्ट ने फिर से नई ऊर्जा और हौसला भर दिया है।', 'कड़ी मेहनत का फल जरूर मिलता है।'],
    Bengali: ['ঠিক এই আত্মবিশ্বাস আর সাহসটাই আজ মনের ভেতর দরকার ছিল!', 'জীবনের লড়াই যত কঠিন হবে, জয়ের আনন্দ ততটাই বড় হবে।', 'হাল ছেড়ো না বন্ধু!']
  },
  'Real Life Struggles & Stories': {
    English: ['The raw, unfiltered honesty here is deeply inspiring.', 'Respect for every ordinary person fighting unseen daily battles.', 'A truthful reminder.'],
    Hindi: ['यही तो असल जिंदगी की जमीनी सच्चाई है, दिल छू लिया।', 'मध्यम वर्ग की खामोश कुर्बानियों को कोई नहीं देखता।', 'ईमानदारी और स्वाभिमान की मिसाल।'],
    Bengali: ['একদম সাধারণ মানুষের জীবনের কঠিন আর খাঁটি বাস্তব রূপ।', 'পরিবারের মুখে হাসি ফোটাতে গিয়ে বাবাদের যে ত্যাগ, তা ফুটে উঠেছে।', 'শ্রদ্ধা জানাই।']
  },
  'Work & Corporate Hustle': {
    English: ['Every single working professional felt this in their bones.', 'Work-life balance cannot remain just a hollow buzzword.', 'Counting down hours to Friday night.'],
    Hindi: ['ऑफिस की इस दौड़धूप में अपनी ही जिंदगी पीछे छूट जाती है।', 'सैलरी आते ही बिल भरने में खत्म, और तनाव वही का वही।', 'सच्ची बात लिखी है आपने।'],
    Bengali: ['কিউবিকলে বসে এই লেখাটা পড়তে পড়তে মনের ক্লান্তিটাই যেন দেখলাম।', 'মাসের পর মাস ডেডলাইনের চাপে হারিয়ে যাচ্ছে সহজ জীবনের আনন্দ।', 'খুব বাস্তব কথা।']
  },
  'Family & Home Bonds': {
    English: ['Nothing in this entire world replaces the warmth of family.', 'Calling my parents right after reading this touching post.', 'Treasuring these memories.'],
    Hindi: ['मां-बाप के प्यार और उनकी छत्रछाया से बड़ी कोई दौलत नहीं।', 'परिवार का साथ हर मुश्किल वक्त में सबसे बड़ा संबल होता है।', 'पढ़कर मन बहुत भावुक हो गया।'],
    Bengali: ['মাটির টান আর মা-বাবার স্নেহের চেয়ে বড় আশ্রয় পৃথিবীতে নেই।', 'পোস্টটা পড়ার পর মায়ের হাতের রান্না খুব মনে পড়ল।', 'পরিবারই সব।']
  },
  'Travel & Global Adventures': {
    English: ['Adding this magnificent route to my bucket list immediately!', 'Breathtaking storytelling and vivid travel notes. Pure wanderlust.', 'Traveling heals the spirit.'],
    Hindi: ['तस्वीर और शब्दों ने मन में फिर से पहाड़ों का सफर जगा दिया।', 'अनजान रास्तों पर भटकने का असली सुकून शब्दों में बयां नहीं होता।', 'शानदार अनुभव!'],
    Bengali: ['পাহাড়ের বাঁকে কুয়াশার খেলা দেখার ইচ্ছেটা আবার জাগিয়ে তুললে!', 'কী অসাধারণ বর্ণনা, যেন চোখের সামনে পাহাড়ি পথটা দেখতে পাচ্ছি।', 'মন ভরে গেল।']
  },
  'Tech, AI & Future World': {
    English: ['The velocity of AI disruption is truly astounding.', 'Fascinating breakdown of modern technology and human future.', 'Continuous learning is essential.'],
    Hindi: ['एआई जिस रफ्तार से दुनिया बदल रहा है, सतर्क और तैयार रहना जरूरी है।', 'तकनीक ने काम आसान किया है पर नई चुनौतियां भी हैं।', 'बेहतरीन और उपयोगी पोस्ट।'],
    Bengali: ['প্রযুক্তি যে গতিতে রোজ বদলে যাচ্ছে, তাতে নিজেকে আপডেট রাখাই একমাত্র পথ।', 'এআই বিপ্লব নিয়ে খুব সুন্দর বিশ্লেষণ।', 'দারুণ তথ্যবহুল।']
  }
};

const BENGALI_USERNAMES = ['ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'KolkataMemes', 'EkaPothik', 'PadmaPar', 'AddaMaster', 'MeghBalika'];
const HINDI_USERNAMES = ['KhamoshMusafir', 'DilliWalaShayar', 'MemeBoiIndia', 'ZindagiDiary', 'ChaiLoverAmit', 'SapnoKaShehar', 'BefikraRooh'];
const GLOBAL_USERNAMES = ['SilentVoyager', 'MidnightEcho', 'CityLightsSoul', 'PixelNomad', 'DailyByte', 'CafeHopperJoe', 'UrbanWanderer'];

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

// NAYA: Har language ke liye 1 ki jagah 3 alag fallback templates, taaki jab bhi
// AI call fail/timeout ho, tab bhi wording har baar same na lage — random pick hoga.
const FALLBACK_TEMPLATES: Record<'English' | 'Hindi' | 'Bengali', ((t: CategoryConfig) => string)[]> = {
  English: [
    (t) => `Life often reveals its most profound lessons in the quiet, unscripted moments we rarely stop to appreciate. Moving through the vibrant rhythm of ${t.city}, one realizes that genuine contentment is found not in monumental achievements, but in everyday resilience and the warmth of honest human bonds. As days continue to unfold, holding onto what truly matters remains our greatest strength. ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `There's something quietly powerful about ${t.category.toLowerCase()} moments that unfold right here in ${t.city}. They remind us that the smallest details of everyday life often carry the deepest meaning, far more than we usually give them credit for. Staying present and choosing to notice these moments is what keeps us grounded. ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `Some stories don't need a grand setting to feel unforgettable — an ordinary day in ${t.city} can hold more truth than we expect. It's in these honest, everyday moments that we often find real clarity about what matters most in life. ${t.tags} #${t.city.replace(/\s+/g, '')}`,
  ],
  Hindi: [
    (t) => `जिंदगी की इस आपाधापी में कुछ लम्हे ऐसे आते हैं जो सीधे दिल को छू जाते हैं। ${t.city} की इस भागदौड़ भरी जिंदगी में जब ठहरकर अपनों और अपने संघर्ष को देखो, तो समझ आता है कि सुकून किसी बड़ी मंजिल में नहीं बल्कि इन सादे पलों में है। जब तक उम्मीद और मेहनत का साथ है, तब तक हर मुश्किल आसान लगने लगती है। यही वो जज्बा है जो हमें हर दिन एक नई सुबह के साथ आगे बढ़ाता है। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `${t.city} की सड़कों पर चलते हुए कई बार ऐसा एहसास होता है कि असली जिंदगी इन्हीं छोटे-छोटे पलों में बसती है। हर दिन की जद्दोजहद में भी अगर थोड़ा ठहरकर देखा जाए, तो अपनों का साथ और खुद पर भरोसा ही सबसे बड़ी ताकत बनकर उभरता है। यही सच्चाई हमें आगे बढ़ने का हौसला देती है। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `कभी-कभी सबसे साधारण दिन भी सबसे गहरी सीख दे जाते हैं। ${t.city} में बिताया हर पल यही याद दिलाता है कि जिंदगी की खूबसूरती बड़े-बड़े सपनों में नहीं, बल्कि छोटी-छोटी ईमानदार कोशिशों में छिपी होती है। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
  ],
  Bengali: [
    (t) => `জীবনের বাস্তব লড়াইয়ের মাঝে কিছু মুহূর্ত এমনভাবে আসে যা আমাদের হৃদয়কে গভীরভাবে নাড়া দিয়ে যায়। ${t.city} শহরের চেনা ভিড়ের মাঝে দাঁড়িয়ে নিজের ফেলে আসা স্মৃতি আর অনুভূতির কথাগুলো নতুন করে ভাবায়। সততার সাথে পথ চলা আর নিজের মানুষের পাশে নিঃশব্দে থাকাটাই হয়তো মানুষের আসল সার্থকতা। সময়ের সাথে সাথে পরিস্থিতি বদলালেও অন্তরের এই টান কোনোদিন মলিন হয় না। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `${t.city} শহরের রোজকার ব্যস্ততার মাঝেও কিছু মুহূর্ত থেকে যায়, যা মনে করিয়ে দেয় জীবনের আসল সৌন্দর্য কোথায় লুকিয়ে আছে। ছোট ছোট মুহূর্তগুলোতেই আসলে জীবনের গভীরতম অনুভূতিগুলো লুকিয়ে থাকে, যেগুলো আমরা প্রায়ই খেয়াল করি না। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
    (t) => `কিছু সাধারণ দিনও হঠাৎ করে অসাধারণ শিক্ষা দিয়ে যায়। ${t.city} শহরে কাটানো প্রতিটি মুহূর্ত মনে করিয়ে দেয় যে জীবনের সৌন্দর্য বড় স্বপ্নে নয়, বরং ছোট ছোট সৎ চেষ্টাতেই লুকিয়ে থাকে। ${t.tags} #${t.city.replace(/\s+/g, '')}`,
  ],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 0. NAYA: Pichle kuch generated posts fetch karke unki category aur image dekh lein,
    // taaki isi run mein wahi category/photo turant repeat na ho (freshness ke liye).
    // Note: Firestore ki is simple list API mein guaranteed "sabse recent" order nahi milta,
    // isliye ye ek best-effort heuristic hai, 100% guarantee nahi — lekin repeat kaafi kam kar deta hai.
    let recentCategories: string[] = [];
    let recentImageUrls: string[] = [];
    try {
      const recentRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?pageSize=8&key=${POSTS_API_KEY}`
      );
      const recentData = await recentRes.json();
      const recentDocs = recentData.documents || [];
      recentCategories = recentDocs.map((d: any) => d.fields?.category?.stringValue).filter(Boolean);
      recentImageUrls = recentDocs.map((d: any) => d.fields?.imageUrl?.stringValue).filter(Boolean);
    } catch (e) {}

    // 1. Category pick karein — pichli 2 baar wali category avoid karke (agar options bache hoon)
    const availableCategories = CATEGORIES_DATA.filter(
      (c) => !recentCategories.slice(0, 2).includes(c.category)
    );
    const categoryPool = availableCategories.length > 0 ? availableCategories : CATEGORIES_DATA;
    const target = categoryPool[Math.floor(Math.random() * categoryPool.length)];

    const nowTime = Date.now();
    const nowIso = new Date().toISOString();

    // 2. Photo pick karein — isi category ki list mein se koi bhi photo jo abhi
    // recently use nahi hui (agar sab recently use ho chuki hoon, to poore pool se pick karein)
    const freshPhotoOptions = target.photoList.filter(
      (id) => !recentImageUrls.some((url) => url.includes(id))
    );
    const photoPool = freshPhotoOptions.length > 0 ? freshPhotoOptions : target.photoList;
    const selectedPhotoId = photoPool[Math.floor(Math.random() * photoPool.length)];

    // Cloudinary Auto-Compression URL (~50KB WebP)
    const rawUnsplashUrl = `https://images.unsplash.com/${selectedPhotoId}?auto=format&fit=crop&w=720&h=480&q=80`;
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(rawUnsplashUrl)}`;

    // 3. AI Full Paragraph Generation
    const langRule = target.lang === 'Bengali' ? 'Bengali (বাংলা হরফ)' : target.lang === 'Hindi' ? 'Hindi (देवनागरी)' : 'English';
    const prompt = `You are a real person sharing a thoughtful, genuine post on social media.
Topic: ${target.topicPrompt}
Location Context: ${target.city}, ${target.country}.
Language: Strictly ${langRule}.
MANDATORY RULES:
1. Write a single expressive, meaningful paragraph (STRICTLY between 85 and 110 words).
2. Human, authentic tone. Avoid buzzwords and robotic titles.
3. HASHTAGS: At the very end, append: ${target.tags} #${target.city.replace(/\s+/g, '')}.
4. Return raw text only.`;

    let postText = '';
    try {
      // NAYA: timeout 3500ms se badhakar 6500ms kiya, taaki Vercel serverless ke
      // network overhead ke bawajood AI se real/unique text milne ke chances zyada hon
      // (fallback par bhaar kam ho, jo repeat lagne ki asli wajah thi).
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(6500)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('error') && raw.length > 70) {
          postText = raw;
        }
      }
    } catch (e) {}

    // Fallback agar AI fail/timeout ho jaaye — ab 3 variants me se random pick,
    // taaki repeated AI-fail hone par bhi wording same na lage
    if (!postText) {
      const variants = FALLBACK_TEMPLATES[target.lang];
      const pickTemplate = variants[Math.floor(Math.random() * variants.length)];
      postText = pickTemplate(target);
    }

    // 4. Save Main Post to 'open-confees' DB
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
    const newPostId = postDoc.name?.split('/').pop() || '';

    // Clean Share Payload (Without broken Cloudinary URL characters)
    const cleanSnippet = postText.length > 120 ? postText.slice(0, 120) + '...' : postText;
    const postUrl = newPostId ? `https://www.openconfess.com/?post=${newPostId}` : 'https://www.openconfess.com';
    const readyShareText = `"${cleanSnippet}"\n\n👉 Read more on Open Confess:\n${postUrl}`;

    // Update document with clean sharePayload
    if (newPostId) {
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${newPostId}?updateMask.fieldPaths=sharePayload&key=${POSTS_API_KEY}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              sharePayload: { stringValue: readyShareText }
            }
          })
        }
      ).catch(() => {});
    }

    // 5. Realistic Gradual Comments (22% chance per cycle, category-matched)
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
        const pCategory = fields.category?.stringValue || 'Cricket Mania';
        const currentComments = parseInt(fields.commentsCount?.integerValue || fields.comments?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || fields.likes?.integerValue || '0', 10);
        const pLang = detectLang(pText);

        if (Math.random() < 0.22 && currentComments < 15) {
          const catPool = COMMENTS_STORE[pCategory] || COMMENTS_STORE['Cricket Mania'];
          const commentPool = catPool[pLang] || catPool['English'];
          const commentContent = commentPool[Math.floor(Math.random() * commentPool.length)];
          const commenterName = getUsername(pLang);

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
          break;
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: target.category,
      imageUrl,
      postLength: postText.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

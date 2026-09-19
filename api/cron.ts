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
// COMPLETE 15 CATEGORIES REGISTRY (World-Way)
// ============================================================
interface FeedConfig {
  category: string;
  lang: 'English' | 'Hindi' | 'Bengali';
  city: string;
  country: string;
  query: string;
  imageTag: string;
  tags: string;
}

const FEEDS_REGISTRY: FeedConfig[] = [
  // 1. News & Breaking Headlines
  { category: 'News & Breaking Headlines', lang: 'English', city: 'London', country: 'UK', query: 'world+breaking+news', imageTag: 'breaking-news', tags: '#BreakingNews #WorldNews #Headlines #GlobalUpdate' },
  { category: 'News & Breaking Headlines', lang: 'Hindi', city: 'Delhi', country: 'India', query: 'bharat+samachar+breaking', imageTag: 'press-conference', tags: '#ताज़ाखबर #BreakingNews #देशदुनिया #TrendingHindi' },
  { category: 'News & Breaking Headlines', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'kolkata+khobor+breaking', imageTag: 'newspaper', tags: '#ব্রেকিংনিউজ #আজকেরখবর #কলকাতা #TrendingBangla' },

  // 2. Politics & Public Debate
  { category: 'Politics & Public Debate', lang: 'English', city: 'Washington', country: 'USA', query: 'world+politics+elections', imageTag: 'parliament-building', tags: '#PoliticsToday #Democracy #PublicDebate' },
  { category: 'Politics & Public Debate', lang: 'Hindi', city: 'Lucknow', country: 'India', query: 'rajneeti+chunav+neta', imageTag: 'political-crowd', tags: '#राजनीति #जनताकीआवाज #BharatPolitics' },
  { category: 'Politics & Public Debate', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'bangladesh+rajniti+khobor', imageTag: 'parliament', tags: '#রাজনীতি #জনমত #গণতন্ত্র' },

  // 3. Cricket Mania
  { category: 'Cricket Mania', lang: 'English', city: 'Dubai', country: 'UAE', query: 'international+cricket+icc', imageTag: 'cricket-stadium', tags: '#CricketTwitter #MatchDay #ICC #CricketFever' },
  { category: 'Cricket Mania', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'cricket+ipl+bcci+match', imageTag: 'cricket-match', tags: '#CricketHindi #IPL #BCCI #TeamIndia' },
  { category: 'Cricket Mania', lang: 'Bengali', city: 'Chittagong', country: 'Bangladesh', query: 'cricket+khela+live', imageTag: 'cricket-pitch', tags: '#ক্রিকেট #টিমবাংলাদেশ #CricketCraze' },

  // 4. Football & World Sports
  { category: 'Football & World Sports', lang: 'English', city: 'Manchester', country: 'UK', query: 'premier+league+football', imageTag: 'football-stadium', tags: '#FootballLive #UCL #PremierLeague #MatchDay' },
  { category: 'Football & World Sports', lang: 'Hindi', city: 'Kolkata', country: 'India', query: 'football+match+isl+tournament', imageTag: 'soccer-match', tags: '#भारतीयफुटबॉल #ISL #FootballFever' },

  // 5. Entertainment, Cinema & Pop Culture
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'English', city: 'Los Angeles', country: 'USA', query: 'hollywood+movies+box+office', imageTag: 'cinema-premiere', tags: '#CinemaLovers #Hollywood #PopCulture' },
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'bollywood+cinema+box+office', imageTag: 'movie-theater', tags: '#बॉलीवुड #CinemaReview #BoxOfficeHit' },
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'tollywood+bangla+cinema', imageTag: 'movie-film', tags: '#টলিউড #বাংলাসিনেমা #বিনোদনবার্তা' },

  // 6. Funny, Memes & Sarcasm
  { category: 'Funny, Memes & Sarcasm', lang: 'English', city: 'New York', country: 'USA', query: 'funny+jokes+memes+viral', imageTag: 'funny-meme', tags: '#FunnyTweet #MemeDaily #Sarcasm' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Hindi', city: 'Pune', country: 'India', query: 'desi+jokes+memes+funny', imageTag: 'laughing', tags: '#मजेदारमीम्स #देसीह्यूमर #हंसतेरहो' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Bengali', city: 'Howrah', country: 'India', query: 'bangla+comedy+memes+viral', imageTag: 'funny-laugh', tags: '#মজারপোস্ট #হাসিরট্রিক #বাঙালিমিমস' },

  // 7. True Love & Soul Connections
  { category: 'True Love & Soul Connections', lang: 'English', city: 'Paris', country: 'France', query: 'true+love+relationship+emotions', imageTag: 'couple-love', tags: '#TrueLove #Soulmate #DeepConnection #LoveStory' },
  { category: 'True Love & Soul Connections', lang: 'Hindi', city: 'Jaipur', country: 'India', query: 'sachha+pyar+khamosh+rishte', imageTag: 'romantic-couple', tags: '#सच्चाप्यार #रूहानीरिश्ता #LoveDiary' },
  { category: 'True Love & Soul Connections', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'valobasha+onubhuti+golpo', imageTag: 'love-romance', tags: '#খাঁটিভালোবাসা #ভালোবাসারগল্প #অনুভূতি' },

  // 8. Heartbreak & Pain
  { category: 'Heartbreak & Pain', lang: 'English', city: 'Chicago', country: 'USA', query: 'heartbreak+pain+breakup', imageTag: 'sadness-alone', tags: '#Heartbreak #BrokenHeart #MovingOn #PainfulMemories' },
  { category: 'Heartbreak & Pain', lang: 'Hindi', city: 'Delhi', country: 'India', query: 'dard+tanhai+judai+yaadein', imageTag: 'lonely-rain', tags: '#टूटादिल #तन्हाई #अधूरीमोहब्बत #Dard' },
  { category: 'Heartbreak & Pain', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'biroho+kosto+sritikotha', imageTag: 'alone-crying', tags: '#হৃদয়ভাঙ্গা #বিরহবেদনা #স্মৃতি' },

  // 9. Motivational Quotes & Resilience
  { category: 'Motivational Quotes & Resilience', lang: 'English', city: 'Toronto', country: 'Canada', query: 'resilience+hardwork+motivation', imageTag: 'mountain-climb', tags: '#Motivation #NeverGiveUp #StayStrong #RiseAndGrind' },
  { category: 'Motivational Quotes & Resilience', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'prerna+sangharsh+safalta', imageTag: 'fitness-grind', tags: '#प्रेरणा #हौसलेकीउड़ान #संघर्षहीजीवनहै' },
  { category: 'Motivational Quotes & Resilience', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'prerona+safollo+porishrom', imageTag: 'sunrise-path', tags: '#অনুপ্রেরণা #লড়াইকরো #হালছেড়োনা' },

  // 10. Real Life Struggles & Stories
  { category: 'Real Life Struggles & Stories', lang: 'English', city: 'New York', country: 'USA', query: 'ordinary+people+struggles', imageTag: 'street-workers', tags: '#RealLife #LifeStruggles #CommonMan #RealityCheck' },
  { category: 'Real Life Struggles & Stories', lang: 'Hindi', city: 'Patna', country: 'India', query: 'aam+aadmi+sangharsh+mehnat', imageTag: 'hard-labor', tags: '#मध्यमवर्ग #आमइंसान #जिंदगीकीसच्चाई' },
  { category: 'Real Life Struggles & Stories', lang: 'Bengali', city: 'Siliguri', country: 'India', query: 'sadharan+manusher+jibon', imageTag: 'street-life', tags: '#বাস্তবজীবন #মধ্যবিত্তেরলড়াই #জীবনসংগ্রাম' },

  // 11. Work & Corporate Hustle
  { category: 'Work & Corporate Hustle', lang: 'English', city: 'Singapore', country: 'Singapore', query: 'corporate+burnout+workplace', imageTag: 'corporate-office', tags: '#CorporateLife #WorkHustle #Burnout #9to5Life' },
  { category: 'Work & Corporate Hustle', lang: 'Hindi', city: 'Bengaluru', country: 'India', query: 'office+life+corporate+burnout', imageTag: 'office-desk', tags: '#कॉर्पोरेटलाइफ #नौकरीपेशा #WorkStress' },
  { category: 'Work & Corporate Hustle', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'chakri+jibon+office+pressure', imageTag: 'busy-office', tags: '#অফিসজীবন #চাকরিরচাপ #কর্মব্যস্ততা' },

  // 12. Family & Home Bonds
  { category: 'Family & Home Bonds', lang: 'English', city: 'Melbourne', country: 'Australia', query: 'family+love+parents+sacrifice', imageTag: 'family-dinner', tags: '#FamilyFirst #ParentsLove #HomeVibes #Togetherness' },
  { category: 'Family & Home Bonds', lang: 'Hindi', city: 'Bhopal', country: 'India', query: 'parivar+ka+pyar+mata+pita', imageTag: 'family-together', tags: '#परिवारकाप्यार #मातापिता #घरकासुकून' },
  { category: 'Family & Home Bonds', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'paribarer+valobasha+mayar+tann', imageTag: 'family-home', tags: '#পারিবারিকভালোবাসা #মাটিরমায়া #আপনজন' },

  // 13. Travel & Global Adventures
  { category: 'Travel & Global Adventures', lang: 'English', city: 'San Francisco', country: 'USA', query: 'travel+adventure+valleys', imageTag: 'travel-backpack', tags: '#TravelDiaries #Wanderlust #ExploreTheWorld #TravelGram' },
  { category: 'Travel & Global Adventures', lang: 'Hindi', city: 'Manali', country: 'India', query: 'travel+yatra+pahadon+ki+sair', imageTag: 'himalayan-road', tags: '#यात्राडायरी #पहाड़ोंकासफर #घुमक्कड़ी' },
  { category: 'Travel & Global Adventures', lang: 'Bengali', city: 'Darjeeling', country: 'India', query: 'bhromon+pahad+ghora', imageTag: 'mountain-tea', tags: '#ভ্রমণকাহিনী #পাহাড়েরটান #পথেরনেশা' },

  // 14. Tech, AI & Future World
  { category: 'Tech, AI & Future World', lang: 'English', city: 'San Francisco', country: 'USA', query: 'artificial+intelligence+tech', imageTag: 'futuristic-technology', tags: '#TechNews #ArtificialIntelligence #FutureTech #Innovation' },
  { category: 'Tech, AI & Future World', lang: 'Hindi', city: 'Noida', country: 'India', query: 'ai+technology+smartphones', imageTag: 'coding-screen', tags: '#तकनीक #एआईक्रांति #TechHindi' },
  { category: 'Tech, AI & Future World', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'projukti+ai+notun+gadgets', imageTag: 'digital-ai', tags: '#প্রযুক্তি #কৃত্রিমবুদ্ধিমত্তা #ডিজিটালবিশ্ব' },

  // 15. Fitness, Health & Lifestyle
  { category: 'Fitness, Health & Lifestyle', lang: 'English', city: 'Sydney', country: 'Australia', query: 'fitness+workout+wellness', imageTag: 'gym-workout', tags: '#FitnessMotivation #HealthyLiving #WorkoutDaily #Wellness' },
  { category: 'Fitness, Health & Lifestyle', lang: 'Hindi', city: 'Chandigarh', country: 'India', query: 'sehat+fitness+vyayam', imageTag: 'fitness-exercise', tags: '#स्वास्थ्य #फिटनेसकीबात #स्वस्थरहो' },
  { category: 'Fitness, Health & Lifestyle', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'shastho+byayam+fitness', imageTag: 'healthy-jogging', tags: '#সুস্বাস্থ্য #ব্যায়াম #শরীরচর্চা' }
];

// ============================================================
// REALISTIC CATEGORY-SPECIFIC COMMENTS (15 Categories)
// ============================================================
const CATEGORY_COMMENTS: Record<string, { English: string[]; Hindi: string[]; Bengali: string[] }> = {
  'News & Breaking Headlines': {
    English: ['Following this breaking development closely.', 'Immediate accountability from authorities is needed.', 'Thanks for sharing this timely ground update.'],
    Hindi: ['सुबह से इस खबर की चर्चा चल रही है।', 'प्रशासन को इस पर तुरंत संज्ञान लेना चाहिए।', 'सटीक और जरूरी अपडेट भाई।'],
    Bengali: ['সকাল থেকেই এই খবরটা নিয়ে তোলপাড় চলছে।', 'প্রশাসনের দ্রুত ব্যবস্থা নেওয়া দরকার।', 'সঠিক সময় লাইভ আপডেট দেওয়ার জন্য ধন্যবাদ।']
  },
  'Politics & Public Debate': {
    English: ['A very rational and balanced viewpoint on this policy.', 'Ground realities are vastly different from public promises.', 'Spot on political analysis.'],
    Hindi: ['वादे बड़े-बड़े होते हैं पर जमीनी हकीकत कुछ और है।', 'बिल्कुल निष्पक्ष और सटीक राय रखी है।', 'इस मुद्दे पर बात होना बहुत जरूरी था।'],
    Bengali: ['রাজনীতিতে সাধারণ মানুষের স্বার্থটাই হারিয়ে যায়।', 'যুক্তিপূর্ণ বিশ্লেষণ, সহমত হলাম।', 'এই বিষয়ে খোলামেলা আলোচনা হওয়া জরুরি ছিল।']
  },
  'Cricket Mania': {
    English: ['What an absolute nail-biting encounter!', 'That last over was pure cinema.', 'Cricket at its absolute peak!'],
    Hindi: ['क्या गजब का मैच हुआ भाई!', 'लास्ट ओवर में दिल की धड़कनें तेज हो गई थीं।', 'ये खिलाड़ी सच में मैच विनर है।'],
    Bengali: ['কী রোমাঞ্চকর ম্যাচ ছিল কালকের!', 'এই ওভারটা ইতিহাস হয়ে থাকবে।', 'পরের ম্যাচটায় জিততেই হবে আমাদের।']
  },
  'Football & World Sports': {
    English: ['Pure class and determination on the pitch.', 'That goal was unbelievable!', 'The stadium atmosphere was electric.'],
    Hindi: ['क्या शानदार खेल दिखाया टीम ने!', 'रोंगटे खड़े कर देने वाला मैच था।', 'फुटबॉल का असली रोमांच यही है।'],
    Bengali: ['ইনজুরি টাইমের গোলটা অবিশ্বাস্য ছিল!', 'স্টেডিয়ামের পরিবেশটা দেখার মতো ছিল।', 'দারুণ ট্যাকটিকাল গেম খেলেছে দল।']
  },
  'Entertainment, Cinema & Pop Culture': {
    English: ['Loved the visual direction and performances!', 'Booking tickets for this weekend for sure.', 'Truly worth all the hype.'],
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
    Bengali: ['পড়ে চোখে জল চলে এলো, খুব সুন্দর লিখেছো।', 'ভালোবাসা এমনই অমূল্য হওয়া উচিত।', 'নিজের ফেলে আসা মিষ্টি দিনের কথা মনে পড়ে গেল।']
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
    // 1. Pick target from 15 categories
    const target = FEEDS_REGISTRY[Math.floor(Math.random() * FEEDS_REGISTRY.length)];
    
    // Live Topic Fetching via Google News
    const hlCode = target.lang === 'Bengali' ? 'bn' : target.lang === 'Hindi' ? 'hi' : 'en-IN';
    const glCode = target.lang === 'English' ? 'US' : 'IN';
    const rssUrl = `https://news.google.com/rss/search?q=${target.query}+when:24h&hl=${hlCode}&gl=${glCode}&ceid=${glCode}:${hlCode}`;
    const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    let realHeadline = '';
    let rawPhotoUrl = '';

    try {
      const feedRes = await fetch(rssJsonUrl, { signal: AbortSignal.timeout(4500) });
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        const items = feedData.items || [];
        for (const item of items) {
          if (item.title && item.title.length > 20) {
            realHeadline = item.title.split(' - ')[0];
            
            if (item.enclosure && item.enclosure.link && !item.enclosure.link.endsWith('.mp4')) {
              rawPhotoUrl = item.enclosure.link;
            } else if (item.description) {
              const m = item.description.match(/src="([^"]+)"/i);
              if (m && m[1]) rawPhotoUrl = m[1];
            }
            if (realHeadline) break;
          }
        }
      }
    } catch (e) {}

    // Category-specific real photo (Strictly matching category keywords)
    if (!rawPhotoUrl) {
      rawPhotoUrl = `https://loremflickr.com/720/480/${target.imageTag}?random=${Date.now() % 1000}`;
    }

    // 2. Full Post Generation (NO word count limits, complete detailed post)
    const topicText = realHeadline || `${target.category} updates in ${target.city}`;
    const langRule = target.lang === 'Bengali' ? 'Bengali (বাংলা হরফ)' : target.lang === 'Hindi' ? 'Hindi (देवनागरी)' : 'English';

    const prompt = `Write a comprehensive, authentic, and complete viral social media post for X (formerly Twitter) about: "${topicText}".
Location context: ${target.city}, ${target.country} (written from natural citizen eyewitness perspective).
Category: ${target.category}.
Language: Strictly ${langRule}.
RULES:
1. Write a COMPLETE FULL POST with detailed thoughts, emotional depth, context, and clear perspective. Do NOT write brief 1-2 liners.
2. Tone: Highly relatable everyday citizen voice, natural internet discourse, absolutely no AI greetings or robotic setup.
3. HASHTAGS: At the very end, append realistic trending hashtags: ${target.tags} #${target.city.replace(/\s+/g, '')}.
4. Return raw clean post text only.`;

    let postText = '';
    try {
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${Date.now()}&model=openai`, {
        signal: AbortSignal.timeout(6500)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('error') && raw.length > 80) {
          postText = raw;
        }
      }
    } catch (e) {}

    // Complete Full Post Fallbacks if AI delays
    if (!postText) {
      if (target.lang === 'Bengali') {
        postText = `আজকের দিনে ${target.city} শহরের মাটিতে দাঁড়িয়ে "${topicText}" নিয়ে সাধারণ মানুষের মধ্যে যে উন্মাদনা আর কৌতূহল লক্ষ্য করা যাচ্ছে, তা সত্যিই অতুলনীয়। প্রত্যেকেই নিজ নিজ দৃষ্টিভঙ্গি থেকে এই ঘটনার গভীরতা বোঝার চেষ্টা করছেন। চায়ের দোকানের আড্ডা থেকে শুরু করে সোশ্যাল মিডিয়ার প্রতিটি প্ল্যাটফর্মে কেবল এই একটি বিষয় নিয়েই জোর আলোচনা চলছে। বাস্তব অভিজ্ঞতা এবং অনুভূতির যে প্রকাশ এখানে ফুটে উঠেছে, তা প্রতিটি সচেতন নাগরিককে নতুন করে ভাবতে বাধ্য করে। সময়ের সাথে সাথে এই পরিস্থিতির আরও নতুন রূপ সামনে আসবে বলেই মনে করা হচ্ছে। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else if (target.lang === 'Hindi') {
        postText = `आज ${target.city} से सामने आई इस बड़ी बात "${topicText}" को लेकर हर तरफ गहरी चर्चा देखने को मिल रही है। लोग सिर्फ इस पर बात ही नहीं कर रहे हैं, बल्कि जमीनी हकीकत और इसके असर को भी बहुत संजीदगी से महसूस कर रहे हैं। सोशल मीडिया से लेकर आम लोगों की बातचीत में यह मुद्दा पूरी तरह से छाया हुआ है। जब कोई बात सीधे जनता की भावनाओं और उनके रोजमर्रा के जीवन से जुड़ती है, तो उसकी गूंज दूर तक सुनाई देती है। आने वाले दिनों में यह देखना दिलचस्प होगा कि यह स्थिति किस दिशा में आगे बढ़ती है। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else {
        postText = `Substantial discussions are currently taking place across ${target.city} regarding "${topicText}", drawing active interest from communities and online observers alike. Eyewitness perspectives and local reactions reveal a multi-layered reality that resonates deeply beyond superficial headlines. As developments continue to unfold across platforms, citizens are genuinely engaging with the core essence of this topic rather than passing observations. A compelling reminder of how shared real-world moments bring public conversations straight to the forefront today. ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      }
    }

    // 3. Cloudinary Auto-Compression to ~50KB
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(rawPhotoUrl)}`;

    // 4. Save Main Post to 'open-confees' DB
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

    // 5. Gradual Organic Comments & Likes on Previous Confessions
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

        // Slow organic growth: 22% chance per cycle
        if (Math.random() < 0.22 && currentComments < 18) {
          const catPool = CATEGORY_COMMENTS[pCategory] || CATEGORY_COMMENTS['News & Breaking Headlines'];
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
      headline: realHeadline,
      fullPostLength: postText.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

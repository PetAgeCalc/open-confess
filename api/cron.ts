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
// EXACT 14 CATEGORIES (English, Hindi, Bangla - World Way)
// ============================================================
interface CategorySource {
  category: string;
  lang: 'English' | 'Hindi' | 'Bengali';
  city: string;
  country: string;
  query: string;
  photoKeywords: string[];
  tags: string;
}

const CATEGORIES_POOL: CategorySource[] = [
  // 1. Cricket Mania
  { category: 'Cricket Mania', lang: 'English', city: 'Dubai', country: 'UAE', query: 'cricket+match+icc+thriller', photoKeywords: ['cricket-pitch', 'cricket-stadium', 'cricket-bat-ball'], tags: '#CricketTwitter #MatchDay #CricketMania' },
  { category: 'Cricket Mania', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'cricket+match+ipl+bcci', photoKeywords: ['cricket-players', 'cricket-stadium-lights', 'cricket-ground'], tags: '#CricketHindi #IPL #BCCI #CricketFever' },
  { category: 'Cricket Mania', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'cricket+khela+bangladesh', photoKeywords: ['cricket-action', 'cricket-crowd', 'cricket-sports'], tags: '#ক্রিকেট #টিমবাংলাদেশ #CricketCraze' },

  // 2. Football & World Sports
  { category: 'Football & World Sports', lang: 'English', city: 'Manchester', country: 'UK', query: 'premier+league+football+champions', photoKeywords: ['football-stadium', 'soccer-pitch', 'football-match'], tags: '#FootballLive #UCL #PremierLeague #MatchDay' },
  { category: 'Football & World Sports', lang: 'Hindi', city: 'Kolkata', country: 'India', query: 'football+isl+tournament', photoKeywords: ['soccer-game', 'football-players', 'football-field'], tags: '#भारतीयफुटबॉल #ISL #FootballFever' },

  // 3. News & Breaking Headlines
  { category: 'News & Breaking Headlines', lang: 'English', city: 'London', country: 'UK', query: 'world+breaking+news+headlines', photoKeywords: ['press-conference', 'broadcast-camera', 'city-journalism'], tags: '#BreakingNews #WorldNews #Headlines' },
  { category: 'News & Breaking Headlines', lang: 'Hindi', city: 'Delhi', country: 'India', query: 'bharat+samachar+breaking+khabar', photoKeywords: ['indian-press', 'news-reporter', 'delhi-street'], tags: '#ताज़ाखबर #BreakingNews #देशदुनिया' },
  { category: 'News & Breaking Headlines', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'kolkata+khobor+breaking+update', photoKeywords: ['kolkata-city', 'newspaper-press', 'city-crowd'], tags: '#ব্রেকিংনিউজ #আজকেরখবর #কলকাতা' },

  // 4. Politics & Public Debate
  { category: 'Politics & Public Debate', lang: 'English', city: 'Washington', country: 'USA', query: 'world+politics+democracy+policy', photoKeywords: ['parliament-building', 'political-speech', 'government-capitol'], tags: '#PoliticsToday #Democracy #PublicDebate' },
  { category: 'Politics & Public Debate', lang: 'Hindi', city: 'Lucknow', country: 'India', query: 'rajneeti+chunav+samiksha', photoKeywords: ['election-rally', 'assembly-hall', 'politicians-crowd'], tags: '#राजनीति #जनताकीआवाज #BharatPolitics' },
  { category: 'Politics & Public Debate', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'bangladesh+rajniti+khobor', photoKeywords: ['parliament-bangladesh', 'public-rally', 'national-press'], tags: '#রাজনীতি #জনমত #গণতন্ত্র' },

  // 5. Entertainment & Cinema
  { category: 'Entertainment & Cinema', lang: 'English', city: 'Los Angeles', country: 'USA', query: 'hollywood+cinema+movie+review', photoKeywords: ['cinema-premiere', 'movie-theater', 'film-camera'], tags: '#CinemaLovers #Hollywood #PopCulture' },
  { category: 'Entertainment & Cinema', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'bollywood+cinema+filmy+review', photoKeywords: ['bollywood-theater', 'film-screen', 'movie-poster'], tags: '#बॉलीवुड #CinemaReview #BoxOfficeHit' },
  { category: 'Entertainment & Cinema', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'tollywood+bangla+cinema+review', photoKeywords: ['theatre-hall', 'cinema-lights', 'kolkata-cinema'], tags: '#টলিউড #বাংলাসিনেমা #বিনোদনবার্তা' },

  // 6. Funny, Memes & Sarcasm
  { category: 'Funny, Memes & Sarcasm', lang: 'English', city: 'New York', country: 'USA', query: 'funny+jokes+viral+humor', photoKeywords: ['funny-laugh', 'comedy-stage', 'humor-street'], tags: '#FunnyTweet #MemeDaily #Sarcasm' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Hindi', city: 'Pune', country: 'India', query: 'desi+jokes+hasya+funny', photoKeywords: ['laughing-friends', 'desi-chai-adda', 'comedy-smiles'], tags: '#मजेदारमीम्स #देसीह्यूमर #हंसतेरहो' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Bengali', city: 'Howrah', country: 'India', query: 'bangla+comedy+hasir+kotha', photoKeywords: ['adda-friends', 'smiling-group', 'funny-moment'], tags: '#মজারপোস্ট #হাসিরট্রিক #বাঙালিমিমস' },

  // 7. True Love & Soul Connections
  { category: 'True Love & Soul Connections', lang: 'English', city: 'Paris', country: 'France', query: 'true+love+deep+relationship', photoKeywords: ['couple-hands', 'love-sunset', 'romantic-walk'], tags: '#TrueLove #Soulmate #DeepConnection' },
  { category: 'True Love & Soul Connections', lang: 'Hindi', city: 'Jaipur', country: 'India', query: 'sachha+pyar+khamosh+rishte', photoKeywords: ['holding-hands-couple', 'heritage-couple', 'love-memories'], tags: '#सच्चाप्यार #रूहानीरिश्ता #LoveDiary' },
  { category: 'True Love & Soul Connections', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'valobasha+onubhuti+sondha', photoKeywords: ['princep-ghat-love', 'couple-silhouettes', 'monsoon-love'], tags: '#খাঁটিভালোবাসা #ভালোবাসারগল্প #অনুভূতি' },

  // 8. Heartbreak & Pain
  { category: 'Heartbreak & Pain', lang: 'English', city: 'Chicago', country: 'USA', query: 'heartbreak+painful+memories', photoKeywords: ['alone-window', 'lonely-bench', 'rain-drops-glass'], tags: '#Heartbreak #BrokenHeart #MovingOn' },
  { category: 'Heartbreak & Pain', lang: 'Hindi', city: 'Delhi', country: 'India', query: 'dard+tanhai+judai+khamoshi', photoKeywords: ['lonely-evening', 'empty-street-night', 'sad-thought'], tags: '#टूटादिल #तन्हाई #अधूरीमोहब्बत' },
  { category: 'Heartbreak & Pain', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'biroho+kosto+sritikotha', photoKeywords: ['sad-window-rain', 'alone-river-side', 'dark-evening'], tags: '#হৃদয়ভাঙ্গা #বিরহবেদনা #স্মৃতি' },

  // 9. Motivational Quotes & Resilience
  { category: 'Motivational Quotes & Resilience', lang: 'English', city: 'Toronto', country: 'Canada', query: 'success+resilience+discipline', photoKeywords: ['mountain-peak-sunrise', 'hardwork-workout', 'climbing-path'], tags: '#Motivation #NeverGiveUp #StayStrong' },
  { category: 'Motivational Quotes & Resilience', lang: 'Hindi', city: 'Bhopal', country: 'India', query: 'sangharsh+safalta+mehnat', photoKeywords: ['running-sunrise', 'focus-eyes', 'determined-path'], tags: '#प्रेरणा #हौसलेकीउड़ान #संघर्षहीजीवनहै' },
  { category: 'Motivational Quotes & Resilience', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'prerona+safollo+porishrom', photoKeywords: ['sunrise-sky-path', 'discipline-grind', 'focused-journey'], tags: '#অনুপ্রেরণা #লড়াইকরো #হালছেড়োনা' },

  // 10. Real Life Struggles & Stories
  { category: 'Real Life Struggles & Stories', lang: 'English', city: 'New York', country: 'USA', query: 'ordinary+people+real+life+struggles', photoKeywords: ['street-commuter', 'working-hands', 'subway-life'], tags: '#RealLife #LifeStruggles #CommonMan' },
  { category: 'Real Life Struggles & Stories', lang: 'Hindi', city: 'Patna', country: 'India', query: 'aam+aadmi+sangharsh+parivar', photoKeywords: ['middle-class-journey', 'hard-working-man', 'evening-commute'], tags: '#मध्यमवर्ग #आमइंसान #जिंदगीकीसच्चाई' },
  { category: 'Real Life Struggles & Stories', lang: 'Bengali', city: 'Siliguri', country: 'India', query: 'sadharan+manusher+jibon+songram', photoKeywords: ['common-man-street', 'tea-worker-lifestyle', 'busy-bazaar'], tags: '#বাস্তবজীবন #মধ্যবিত্তেরলড়াই #জীবনসংগ্রাম' },

  // 11. Work & Corporate Hustle
  { category: 'Work & Corporate Hustle', lang: 'English', city: 'Singapore', country: 'Singapore', query: 'corporate+burnout+office+life', photoKeywords: ['corporate-desk', 'office-laptop-night', 'modern-office-tower'], tags: '#CorporateLife #WorkHustle #Burnout' },
  { category: 'Work & Corporate Hustle', lang: 'Hindi', city: 'Bengaluru', country: 'India', query: 'office+life+corporate+job', photoKeywords: ['tech-park-bangalore', 'laptop-coffee-work', 'office-corridor'], tags: '#कॉर्पोरेटलाइफ #नौकरीपेशा #WorkStress' },
  { category: 'Work & Corporate Hustle', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'chakri+jibon+sector-five', photoKeywords: ['sector-five-kolkata', 'office-traffic', 'late-work-desk'], tags: '#অফিসজীবন #চাকরিরচাপ #কর্মব্যস্ততা' },

  // 12. Family & Home Bonds
  { category: 'Family & Home Bonds', lang: 'English', city: 'Melbourne', country: 'Australia', query: 'family+togetherness+home+love', photoKeywords: ['family-dinner-table', 'home-living-room', 'parents-hug'], tags: '#FamilyFirst #ParentsLove #HomeVibes' },
  { category: 'Family & Home Bonds', lang: 'Hindi', city: 'Jaipur', country: 'India', query: 'parivar+ka+pyar+ghar', photoKeywords: ['indian-family-gathering', 'home-courtyard', 'sweet-home-tea'], tags: '#परिवारकाप्यार #मातापिता #घरकासुकून' },
  { category: 'Family & Home Bonds', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'paribarer+valobasha+shanti', photoKeywords: ['village-home-warmth', 'family-together', 'home-rooftop'], tags: '#পারিবারিকভালোবাসা #মাটিরমায়া #আপনজন' },

  // 13. Travel & Global Adventures
  { category: 'Travel & Global Adventures', lang: 'English', city: 'San Francisco', country: 'USA', query: 'travel+adventure+scenic+valleys', photoKeywords: ['travel-backpack-view', 'mountain-lake-scenery', 'winding-road-travel'], tags: '#TravelDiaries #Wanderlust #ExploreTheWorld' },
  { category: 'Travel & Global Adventures', lang: 'Hindi', city: 'Manali', country: 'India', query: 'travel+yatra+pahad+himalaya', photoKeywords: ['himalaya-valley-snow', 'manali-wooden-cabin', 'mountain-river-trek'], tags: '#यात्राडायरी #पहाड़ोंकासफर #घुमक्कड़ी' },
  { category: 'Travel & Global Adventures', lang: 'Bengali', city: 'Darjeeling', country: 'India', query: 'bhromon+darjeeling+pahad', photoKeywords: ['darjeeling-tea-garden', 'kanchenjunga-view', 'toy-train-hills'], tags: '#ভ্রমণকাহিনী #পাহাড়েরটান #পথেরনেশা' },

  // 14. Tech, AI & Future World
  { category: 'Tech, AI & Future World', lang: 'English', city: 'San Francisco', country: 'USA', query: 'artificial+intelligence+tech+future', photoKeywords: ['digital-network-abstract', 'futuristic-coding-screen', 'ai-chip-hardware'], tags: '#TechNews #ArtificialIntelligence #FutureTech' },
  { category: 'Tech, AI & Future World', lang: 'Hindi', city: 'Noida', country: 'India', query: 'ai+technology+future+smart', photoKeywords: ['modern-datacenter', 'coding-dual-monitors', 'robotics-lab'], tags: '#तकनीक #एआईक्रांति #TechHindi' },
  { category: 'Tech, AI & Future World', lang: 'Bengali', city: 'Dhaka', country: 'Bangladesh', query: 'projukti+ai+notun+avishkar', photoKeywords: ['tech-workspace-dark', 'digital-code-interface', 'cyber-ai-network'], tags: '#প্রযুক্তি #কৃত্রিমবুদ্ধিমত্তা #ডিজিটালবিশ্ব' }
];

// ============================================================
// STRICT REALISTIC COMMENTS FOR ALL 14 CATEGORIES
// ============================================================
const CATEGORY_COMMENTS: Record<string, { English: string[]; Hindi: string[]; Bengali: string[] }> = {
  'Cricket Mania': {
    English: ['What an extraordinary match! That performance will be remembered.', 'Cricket at its absolute best, pure adrenaline.', 'Such games remind us why we love this sport so much.'],
    Hindi: ['क्या जबरदस्त खेल दिखाया! रोंगटे खड़े हो गए मैच देखकर।', 'ये खिलाड़ी सच में मैच विनर है, कमाल कर दिया।', 'आखिरी लम्हों तक सांसें थमी हुई थीं, शानदार!'],
    Bengali: ['অবিশ্বাস্য এক ম্যাচ! মাঠে খেলোয়াড়দের লড়াই চোখে লেগে থাকার মতো।', 'এই ইনিংসটা ক্রিকেট ইতিহাসে চিরকাল লেখা থাকবে।', 'পরের ম্যাচটায় ঠিক এই মানসিকতা নিয়েই নামতে হবে।']
  },
  'Football & World Sports': {
    English: ['Pure class and determination on the pitch tonight.', 'The stadium atmosphere was electric, what a finish!', 'Tactical masterpiece from the manager and players.'],
    Hindi: ['क्या गजब का मुकाबला था, खिलाड़ियों का जोश देखने लायक था।', 'स्टेडियम का वो शोर और वो आखिरी गोल, कमाल का खेल!', 'फुटबॉल का असली जुनून इसी को कहते हैं।'],
    Bengali: ['মাঠে পুরো ৯০ মিনিট ধরে যে লড়াই হলো, তা অবিশ্বাস্য!', 'ইনজুরি টাইমের ওই আক্রমণটাই পুরো খেলার মোড় ঘুরিয়ে দিল।', 'দল যেভাবে নিজেদের উজাড় করে দিয়েছে, তা সত্যিই প্রশংসনীয়।']
  },
  'News & Breaking Headlines': {
    English: ['Following this breaking situation very closely.', 'Immediate accountability and ground action are needed.', 'Thanks for putting together this detailed ground reality.'],
    Hindi: ['सुबह से इस खबर पर सबकी नजर है, कड़े कदम उठाने जरूरी हैं।', 'प्रशासन को जमीनी हकीकत देखकर तुरंत फैसला लेना चाहिए।', 'बहुत ही जरूरी और सटीक अपडेट साझा किया है भाई।'],
    Bengali: ['সকাল থেকেই এই ঘটনাটি নিয়ে সব জায়গায় জোর আলোচনা চলছে।', 'প্রশাসনের উচিত অবিলম্বে সাধারণ মানুষের পাশে দাঁড়িয়ে ব্যবস্থা নেওয়া।', 'সঠিক সময়ে এমন বাস্তব চিত্র তুলে ধরার জন্য ধন্যবাদ।']
  },
  'Politics & Public Debate': {
    English: ['A very rational, well-balanced critique of ground policies.', 'Public promises look great on paper, but reality is different.', 'Insightful perspective on today political landscape.'],
    Hindi: ['वादे बड़े-बड़े होते हैं पर आम आदमी की जिंदगी जस की तस रहती है।', 'बिल्कुल निष्पक्ष और जमीनी राय रखी है आपने।', 'लोकतंत्र में आम जनता के सरोकारों पर बात होना सबसे जरूरी है।'],
    Bengali: ['রাজনীতির মঞ্চে বড় বড় কথার ভিড়ে সাধারণ মানুষের আসল চাওয়া হারিয়ে যায়।', 'খুবই প্রাসঙ্গিক এবং তথ্যপূর্ণ আলোচনা তুলে ধরেছো।', 'এই বিষয়গুলো নিয়ে খোলামেলা বিতর্ক হওয়াই সুস্থ গণতন্ত্রের লক্ষণ।']
  },
  'Entertainment & Cinema': {
    English: ['Loved the cinematic vision and emotional performances!', 'Booking tickets for this weekend right away after reading this.', 'Truly worth every bit of the anticipation and praise.'],
    Hindi: ['अभिनय और कहानी दोनों में गहराई थी, पूरा पैसा वसूल!', 'बैकग्राउंड स्कोर और डायलॉग्स सीधे दिल में उतरते हैं।', 'इस हफ्ते की सबसे बेहतरीन और यादगार प्रस्तुति।'],
    Bengali: ['অনবদ্য পরিচালনা আর প্রতিটি চরিত্রের নিখুঁত অভিনয় মুগ্ধ করল!', 'ব্যাকগ্রাউন্ড মিউজিকটা পুরো দৃশ্যপটকে অনন্য উচ্চতায় নিয়ে গেছে।', 'উইকএন্ডে পরিবার নিয়ে হলে গিয়ে দেখার মতো অসাধারণ ছবি।']
  },
  'Funny, Memes & Sarcasm': {
    English: ['I cannot stop laughing at this, painfully relatable!', 'Sent this straight to the family and friends group chat.', 'Your sense of humour always hits the bullseye.'],
    Hindi: ['हंसते-हंसते लोटपोट हो गए भाई, क्या गजब की टाइमिंग है!', 'ये तो मेरे ही दोस्त की रोज की दास्तान लग रही है।', 'सेंस ऑफ ह्यूमर कमाल का है आपका, दिन बन गया!'],
    Bengali: ['হাসতে হাসতে পেটে খিল ধরে গেল ভাই, কী দারুণ টাইমিং!', 'একদম আমাদের বন্ধুদের রোজকার আড্ডার গল্প যেন এটা।', 'কাজের চাপের মাঝে এমন হালকা রসিকতা সত্যি মন ভালো করে দেয়।']
  },
  'True Love & Soul Connections': {
    English: ['Beautifully written and deeply moving piece.', 'Pure, quiet love like this is the biggest blessing.', 'Every line carried a gentle, genuine warmth.'],
    Hindi: ['सच्ची मोहब्बत की सादगी दिल को छू गई, बहुत खूबसूरत लिखा है।', 'रिश्ते दिखावे से नहीं, रूहानी एहसास से जीते हैं।', 'काश हर किसी को जिंदगी में ऐसा गहरा साथ मिले।'],
    Bengali: ['পড়ে মনটা শান্তিতে ভরে গেল, অসাধারণ আবেগ দিয়ে লিখেছো।', 'ভালোবাসা কোনো দামী উপহার নয়, নীরব পাশে থাকার নাম।', 'নিজের ফেলে আসা মিষ্টি আর প্রিয় দিনগুলোর কথা মনে পড়ে গেল।']
  },
  'Heartbreak & Pain': {
    English: ['Healing is not linear, be gentle with yourself.', 'Felt every single word of this deeply. Stay strong.', 'Pain teaches us resilience when nothing else can.'],
    Hindi: ['वक्त हर गहरे जख्म को भर देता है भाई, खुद को संभालो।', 'अधूरी मोहब्बत का दर्द सबसे खामोश और भारी होता है।', 'तुम्हारी इस बात में हर टूटे दिल का दर्द झलक रहा है।'],
    Bengali: ['খুব শক্ত হও বন্ধু, সময়ের চেয়ে বড় কোনো শুশ্রূষা নেই।', 'আমরা সবাই কোনো না কোনো নিস্তব্ধ রাতে এভাবে ভেঙেছি।', 'লেখাটার প্রতিটি শব্দ বুকের ভেতর একটা চাপা কষ্ট জাগিয়ে দেয়।']
  },
  'Motivational Quotes & Resilience': {
    English: ['Exactly the powerful push needed to conquer today goals.', 'Rock bottom teaches lessons success never could. Respect.', 'Consistency in silent battles will always bring victory.'],
    Hindi: ['हार मान लेना कोई रास्ता नहीं है, गिरकर उठना ही जिंदगी है।', 'इस पोस्ट ने फिर से नई ऊर्जा और हौसला भर दिया है।', 'कड़ी मेहनत और अनुशासन का फल एक दिन जरूर मिलता है।'],
    Bengali: ['ঠিক এই আত্মবিশ্বাস আর সাহসটাই আজ মনের ভেতর দরকার ছিল!', 'জীবনের লড়াই যত কঠিন হবে, জয়ের আনন্দ ততটাই বড় হবে।', 'হাল ছেড়ো না বন্ধু, নিজের ওপর ভরসা রেখে এগিয়ে চলো।']
  },
  'Real Life Struggles & Stories': {
    English: ['The raw, unfiltered honesty here is deeply inspiring.', 'Respect for every ordinary person fighting unseen daily battles.', 'A truthful reminder of what resilience actually means.'],
    Hindi: ['यही तो असल जिंदगी की जमीनी सच्चाई है, दिल छू लिया।', 'मध्यम वर्ग की खामोश कुर्बानियों को कोई नहीं देखता।', 'ईमानदारी और स्वाभिमान से जीने की यह कहानी बहुत बड़ी सीख है।'],
    Bengali: ['একদম সাধারণ মানুষের জীবনের কঠিন আর খাঁটি বাস্তব রূপ।', 'পরিবারের মুখে হাসি ফোটাতে গিয়ে বাবাদের যে ত্যাগ, তা ফুটে উঠেছে।', 'সম্মানের সাথে বেঁচে থাকার এই নীরব সংগ্রামকে কুর্নিশ জানাই।']
  },
  'Work & Corporate Hustle': {
    English: ['Every single working professional felt this in their bones.', 'Work-life balance cannot remain just a hollow buzzword.', 'Counting down the hours until this exhausting week wraps up.'],
    Hindi: ['ऑफिस की इस दौड़धूप में अपनी ही जिंदगी पीछे छूट जाती है।', 'सैलरी आते ही बिल भरने में खत्म, और तनाव वही का वही।', 'सच्ची बात लिखी है, खुद के स्वास्थ्य के लिए समय निकालना ही होगा।'],
    Bengali: ['কিউবিকলে বসে এই লেখাটা পড়তে পড়তে মনের ভেতরের ক্লান্তিটাই যেন দেখলাম।', 'মাসের পর মাস ডেডলাইনের চাপে হারিয়ে যাচ্ছে সহজ জীবনের আনন্দ।', 'কাজের পাশাপাশি নিজের মানসিক শান্তিকে প্রাধান্য দেওয়া এখন খুব দরকার।']
  },
  'Family & Home Bonds': {
    English: ['Nothing in this entire world replaces the warmth of family.', 'Calling my parents right after reading this touching post.', 'Treasuring these heartfelt home moments forever.'],
    Hindi: ['मां-बाप के प्यार और उनकी छत्रछाया से बड़ी कोई दौलत नहीं।', 'परिवार का साथ हर मुश्किल वक्त में सबसे बड़ा संबल होता है।', 'पढ़कर मन बहुत भावुक हो गया, अपनों की बहुत याद आई।'],
    Bengali: ['মাটির টান আর মা-বাবার স্নেহের চেয়ে বড় আশ্রয় পৃথিবীতে নেই।', 'পোস্টটা পড়ার পর মায়ের হাতের রান্না আর মিষ্টি ডাকটা খুব মনে পড়ল।', 'পরিবারের ভালোবাসাই মানুষকে সব প্রতিকূলতায় বাঁচিয়ে রাখে।']
  },
  'Travel & Global Adventures': {
    English: ['Adding this magnificent route to my bucket list immediately!', 'Breathtaking storytelling and vivid travel notes. Pure wanderlust.', 'Traveling heals and rejuvenates the human spirit.'],
    Hindi: ['तस्वीर और शब्दों ने मन में फिर से पहाड़ों का सफर जगा दिया।', 'अनजान रास्तों पर भटकने का असली सुकून शब्दों में बयां नहीं होता।', 'शानदार अनुभव, अगली यात्रा की योजना अब पक्की है!'],
    Bengali: ['পাহাড়ের বাঁকে কুয়াশার খেলা দেখার ইচ্ছেটা আবার নতুন করে জাগিয়ে তুললে!', 'কী অসাধারণ বর্ণনা, যেন চোখের সামনে পাহাড়ি পথটা দেখতে পাচ্ছি।', 'ভ্রমণের এই অদম্য টানটাই মানুষের মনকে সতেজ করে তোলে।']
  },
  'Tech, AI & Future World': {
    English: ['The velocity of AI disruption is truly astounding.', 'Fascinating breakdown of modern technology and human future.', 'Continuous learning is our only anchor in this digital era.'],
    Hindi: ['एआई जिस रफ्तार से दुनिया बदल रहा है, सतर्क और तैयार रहना जरूरी है।', 'तकनीक ने काम आसान किया है पर इंसानी समझ की जगह कोई नहीं ले सकता।', 'भविष्य की चुनौतियों पर बहुत ही सटीक और विचारणीय पोस्ट।'],
    Bengali: ['প্রযুক্তি যে গতিতে রোজ বদলে যাচ্ছে, তাতে নিজেকে আপডেট রাখাই একমাত্র পথ।', 'এআই বিপ্লব আর মানবিক মেধার মেলবন্ধন নিয়ে খুব সুন্দর বিশ্লেষণ।', 'ভবিষ্যতের ডিজিটাল দুনিয়া নিয়ে এক গভীর ও বাস্তববাদী দৃষ্টিভঙ্গি।']
  }
};

const BENGALI_USERNAMES = ['KolkataGhumonto', 'MeghBalika', 'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'EkaPothik', 'PadmaPar', 'AddaMaster'];
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Pick 1 category strictly from the 14 categories pool
    const target = CATEGORIES_POOL[Math.floor(Math.random() * CATEGORIES_POOL.length)];
    const nowTime = Date.now();
    const nowIso = new Date().toISOString();

    // 2. Fetch Live Headline from Verified Google News RSS
    const hlCode = target.lang === 'Bengali' ? 'bn' : target.lang === 'Hindi' ? 'hi' : 'en-IN';
    const glCode = target.lang === 'English' ? 'US' : 'IN';
    const rssUrl = `https://news.google.com/rss/search?q=${target.query}+when:48h&hl=${hlCode}&gl=${glCode}&ceid=${glCode}:${hlCode}`;
    const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    let realHeadline = '';
    let liveArticlePhoto = '';

    try {
      const feedRes = await fetch(rssJsonUrl, { signal: AbortSignal.timeout(4500) });
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        const items = feedData.items || [];
        for (const item of items) {
          if (item.title && item.title.length > 15) {
            realHeadline = item.title.split(' - ')[0].trim();
            if (item.enclosure && item.enclosure.link && !item.enclosure.link.endsWith('.mp4')) {
              liveArticlePhoto = item.enclosure.link;
            } else if (item.description) {
              const m = item.description.match(/src="([^"]+)"/i);
              if (m && m[1]) liveArticlePhoto = m[1];
            }
            if (realHeadline) break;
          }
        }
      }
    } catch (e) {}

    // 3. ZERO DUPLICATE IMAGE ENGINE (Unsplash Dynamic Direct Source with Random Hash)
    // Agar RSS image na mile, toh keyword specific dynamic photo (Never repeats the same photo)
    let finalRawPhoto = liveArticlePhoto;
    if (!finalRawPhoto) {
      const randomKeyword = target.photoKeywords[Math.floor(Math.random() * target.photoKeywords.length)];
      const uniqueSeed = `${nowTime}_${Math.floor(Math.random() * 99999)}`;
      finalRawPhoto = `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=720&h=480&q=80`; // safe fallback
      // Dynamic Unsplash source by verified keyword and unique signature
      finalRawPhoto = `https://source.unsplash.com/720x480/?${encodeURIComponent(randomKeyword)}&sig=${uniqueSeed}`;
    }

    // Cloudinary dynamic compression to ~50KB WebP/JPG
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(finalRawPhoto)}`;

    // 4. FACEBOOK / X STYLE ENGAGING FULL PARAGRAPH POST (NO SHORT WORD LIMIT)
    const topic = realHeadline || `${target.category} ground reality and public reactions in ${target.city}`;
    const langRule = target.lang === 'Bengali' ? 'Bengali (বাংলা হরফ)' : target.lang === 'Hindi' ? 'Hindi (देवनागरी)' : 'English';

    const prompt = `Write a viral, compelling, and complete social media post (like an engaging Facebook/X post) about: "${topic}".
Context & Location: ${target.city}, ${target.country} (written from real citizen/eyewitness perspective).
Category: ${target.category}.
Language: Strictly ${langRule}.
MANDATORY WRITING RULES:
1. Write a complete, comprehensive full-length post (around 100 to 140 words, rich in narrative and details).
2. TONE: Passionate, deeply relatable, real human thoughts with vivid personal context. Absolutely no AI cliches like "In today's fast-paced world" or robotic setups.
3. HASHTAGS: At the very bottom, include 3 to 5 trending hashtags: ${target.tags} #${target.city.replace(/\s+/g, '')}.
4. Return raw clean post text only.`;

    let postText = '';
    try {
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${nowTime}&model=openai`, {
        signal: AbortSignal.timeout(6500)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('error') && raw.length > 90) {
          postText = raw;
        }
      }
    } catch (e) {}

    // Complete Full-Paragraph Fallbacks if AI takes time
    if (!postText) {
      if (target.lang === 'Bengali') {
        postText = `আজকের দিনে দাঁড়িয়ে ${target.city} শহরের বুকে "${topic}" নিয়ে সাধারণ মানুষের মধ্যে যে গভীর আবেগ আর বাস্তব অনুভূতি দেখা যাচ্ছে, তা সত্যি চোখে পড়ার মতো। চায়ের টেবিলের আড্ডা থেকে শুরু করে সোশ্যাল মিডিয়ার প্রতিটি পাতায় এই ঘটনার নানা দিক নিয়ে আলোচনা চলছে। জীবনের জটিল বাস্তবতার মাঝে দাঁড়িয়ে এমন ঘটনা আমাদের নতুন করে ভাবতে বাধ্য করে। প্রশাসন এবং সমাজ যদি এই সাধারণ চাওয়াগুলোকে গুরুত্ব দেয়, তবেই প্রতিটি মানুষের দৈনন্দিন লড়াই সার্থক হবে। সময়ের সাথে এই অভিজ্ঞতা সকলের স্মৃতিতে এক অনন্য ছাপ রেখে যাবে। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else if (target.lang === 'Hindi') {
        postText = `आज ${target.city} की सड़कों और गलियों में "${topic}" को लेकर एक बहुत ही संजीदा और गहरी चर्चा देखने को मिल रही है। आम नागरिकों की आंखों में उम्मीद और रोजमर्रा की परेशानियों का जो मेल नजर आ रहा है, वह किसी भी संवेदनशील इंसान के दिल को छू लेगा। सोशल मीडिया पर बड़े-बड़े बयानों से इतर, असल जिंदगी में आम जनता जिन परिस्थितियों से गुजरती है, वही सबसे बड़ी सच्चाई है। जब तक बुनियादी मुद्दों को दिल से नहीं समझा जाएगा, तब तक बदलाव अधूरा रहेगा। यह सिर्फ एक खबर नहीं, बल्कि हम सबकी साझा जिंदगी का एक अहम हिस्सा है। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else {
        postText = `Substantial public engagement is unfolding across ${target.city} today regarding "${topic}", drawing thoughtful reactions from local communities and observers alike. Beyond fleeting digital headlines, the lived experiences shared by everyday individuals highlight a multi-faceted reality that demands genuine contemplation. As conversations progress, people are actively addressing the core substance of this moment rather than accepting superficial narratives. A powerful reminder that authentic real-world connections remain the true foundation of our shared societal journey. ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      }
    }

    // 5. Save Main Post to 'open-confees' DB
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

    // 6. Realistic Slow Organic Comments on Previous Confessions
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

        // Slow organic growth: 22% chance per cycle
        if (Math.random() < 0.22 && currentComments < 18) {
          const catPool = CATEGORY_COMMENTS[pCategory] || CATEGORY_COMMENTS['Cricket Mania'];
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

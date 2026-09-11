import { Confession } from '../types';

interface SimulatedPostItem {
  id: string;
  category: 'deep' | 'funny' | 'intelligent' | 'incident' | 'motivational' | 'finance';
  text: string;
  author: string;
  city: string;
  country: string;
  rawImage: string;
  possibleComments: string[];
}

// Bumped to v12 for 50 initial posts, 100 max cap & 12-minute drip interval
const USED_POST_IDS_KEY = 'openconfess_used_post_registry_v12';
const LIVE_SIMULATED_POSTS_KEY = 'openconfess_live_simulated_posts_v12';
const LAST_SIMULATION_TIMESTAMP_KEY = 'openconfess_last_drip_post_time_v12';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// 20+ BALANCED DIVERSE CONFESSIONS (Bangla, Hindi, Urban & Global English)
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  // 1. Bangla (Kolkata & Bangladesh)
  {
    id: 'bn_post_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'সৌম্যদ্বীপ সেনগুপ্ত',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "সবাই ভাবে আমি খুব হাসিখুশি, সফল আর জীবনে কোনো আক্ষেপ নেই। কলকাতায় আমার একটা সুন্দর সাজানো ফ্ল্যাট আছে, একটা নামী আইটি কোম্পানিতে চাকরি আছে, আর উইকেন্ডে বন্ধুদের সাথে ক্যাফেতে আড্ডাও দিই। কিন্তু সত্যিটা হলো, ছয় বছর আগের সেই একটা অহংকারী সিদ্ধান্তের বোঝা আমি আজও রোজ রাতে একলা বয়ে বেড়াই। সেই মানুষটা যখন আমাকে অনুরোধ করেছিল আর মাত্র একবার বসে কথা বলে ভুল বোঝাবুঝি মিটিয়ে নেওয়ার জন্য, আমি আমার অন্ধ রাগের কারণে মুখের ওপর সব সম্পর্কের ইতি টেনে দিয়েছিলাম।",
    possibleComments: [
      'কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। আপনার প্রতি অনেক শ্রদ্ধা।',
      'অহংকার ক্ষণিকের স্বস্তি দেয়, কিন্তু অনুশোচনা সারাজীবন তাড়িয়ে বেড়ায়।'
    ]
  },
  {
    id: 'bn_post_2',
    category: 'deep',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'তানভীর হাসান',
    rawImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=75',
    text: "গ্রামের ধুলোমাখা পথ ছেড়ে যখন প্রথম ঢাকায় পা রেখেছিলাম, বুকের ভেতর একটাই জেদ ছিল—আমাকে প্রতিষ্ঠিত হতে হবে। বাবা যখন অসুস্থ শরীর নিয়ে গ্রামে কৃষিকাজ করতেন, তখন মনে মনে পণ করেছিলাম বাবার শেষ বয়সটা সুখের বানিয়ে দেব। আজ ধানমন্ডিতে ফ্ল্যাট আছে, গাড়ি আছে। কিন্তু যে বাবার জন্য এই লড়াইটা লড়লাম, সেই বাবাই সাফল্য দেখার মাত্র দুই মাস আগে চলে গেলেন। এখন এই সাফল্যের ওজন পৃথিবীর সবচেয়ে ভারী বোঝা বলে মনে হয়।",
    possibleComments: [
      'পড়ে চোখে জল চলে এলো ভাই। বাবা ওপর থেকেই আপনার জন্য গর্ব করছেন।',
      'সাফল্য তখনই সুন্দর যখন ভাগ করে নেওয়ার মানুষ পাশে থাকে।'
    ]
  },
  {
    id: 'bn_post_3',
    category: 'funny',
    city: 'Kolkata',
    country: 'India',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "সল্টলেকের অফিসে যখনই কোনো জটিল ডেডলাইন আসে বা ক্লায়েন্ট মিটিং ডাকে, টিমের সবাই টেনশন করে, আর আমি একটা মাস্টারস্ট্রোক চালাই। ল্যাপটপের ওয়াইফাই বন্ধ করে টার্মিনালে বিদঘুটে স্ক্রিপ্ট খুলে কপালে হাত দিয়ে বসি! গত সপ্তাহে প্রজেক্ট ডিরেক্টর এসে বললেন, 'শুভঙ্কর তোমার ডেডিকেশন শিক্ষণীয়' বলে স্পেশাল কফি খাইয়ে গেলেন! অথচ আমি ভেতরে ভেতরে হাসতে হাসতে শেষ!",
    possibleComments: [
      'ভাইরে ভাই! আপনি তো কর্পোরেট অস্কার পাওয়ার দাবিদার 😂',
      'কাল থেকে আমিও ট্রাই করব ভাবছি!'
    ]
  },
  {
    id: 'bn_post_4',
    category: 'incident',
    city: 'Chittagong',
    country: 'Bangladesh',
    author: 'রাকিবুল হাসান',
    rawImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=75',
    text: "আত্মীয়ের বিয়েতে কাচ্চির পর মিষ্টির শোকেসে গিয়ে দেখি স্পেশাল ক্ষীরসা সাধারণ মেহমানদের জন্য বন্ধ। আমি রাশভারি গলায় সাফারি ঠিক করে বললাম, 'লন্ডন থেকে বরের চাচা আসছেন, চার প্লেট ভিআইপি কর্নারে পাঠান।' ছেলেটা এমন স্যালুট দিল যেন আমি ভিআইপি অফিসার! পেট পুরে খেয়ে বের হলাম, অথচ আমি বরের দূর সম্পর্কের পাড়ার প্রতিবেশীর বন্ধু!",
    possibleComments: [
      'কনফিডেন্স লেভেল ইনফিনিটি! সেরা টেকনিক 😂',
      'বিয়েবাড়ির স্পেশাল মিষ্টি খাওয়ার টেকনিক দারুণ।'
    ]
  },
  {
    id: 'bn_post_5',
    category: 'intelligent',
    city: 'Kolkata',
    country: 'India',
    author: 'দেবাশিস মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=700&q=75',
    text: "বর্তমান বাঙালি সমাজ এমন এক অদ্ভুত জায়গায় যাচ্ছে যেখানে সোশ্যাল মিডিয়ার ভার্চুয়াল লাইক মানুষের যোগ্যতার মাপকাঠি। বইমেলার ভিড়ে সেলফি হয়, কিন্তু বাড়ি ফিরে ঘণ্টার পর ঘণ্টা রিলস দেখে সময় কাটে। যুক্তি দিয়ে ফেসবুকে তর্ক জেতা সহজ, কিন্তু জীবনে সম্পর্ক টিকিয়ে রাখার জন্য যুক্তির চেয়ে নিঃশব্দ সহমর্মিতা অনেক বেশি দামী।",
    possibleComments: [
      'অত্যন্ত সময়োপযোগী এবং খাঁটি বাস্তব কথা দেবাশিসদা।',
      'সোশ্যাল মিডিয়ার সস্তা চাকচিক্য আমাদের শিকড় নষ্ট করছে।'
    ]
  },
  {
    id: 'bn_post_6',
    category: 'motivational',
    city: 'Kolkata',
    country: 'India',
    author: 'প্রীতম ঘোষ',
    rawImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=75',
    text: "পরাজয় মানে জীবনের সমাপ্তি নয়; পরাজয় হলো আরও প্রস্তুতি নিয়ে মাঠে নামার ডাক। সমাজে ২৫-এ প্রতিষ্ঠিত হতে হবে, ৩০-এ বাড়ি বানাতে হবে—এই কৃত্রিম টাইমলাইন জীবনকে বিষাক্ত করে। কালবৈশাখীতে ন্যাড়া হওয়া বটগাছও বসন্তে নতুন পাতায় ভরে ওঠে। নিজের স্বপ্নের প্রতি ভরসা রাখুন, খারাপ সময় চিরকাল থাকে না।",
    possibleComments: [
      'আজকের ক্লান্ত দিনে এই লেখাটা খুব দরকার ছিল। ধন্যবাদ।',
      'শিকড় শক্ত থাকলে কোনো ঝড়ই শেষ করতে পারে না।'
    ]
  },

  // 2. Hindi (India)
  {
    id: 'hi_post_1',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'रोहन शर्मा',
    rawImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=75',
    text: "छोटे शहर से जब मुंबई आया था तो लगता था कि देर रात तक घर आना ही असली आजादी है। पर कल रात 2 बजे जब तेज बुखार में चक्कर खाकर फर्श पर गिरा, तो फोन में 600 कॉन्टैक्ट्स होने के बाद भी एक ऐसा इंसान नहीं था जिसे कह सकूं कि 'यार एक गोली लाकर दे दे।' समझ आया कि जिसे आत्मनिर्भरता कहते हैं, वो कई बार सिर्फ अकेलेपन का दूसरा नाम होती है।",
    possibleComments: [
      'महानगरों की यही कड़वी सच्चाई है भाई, लाखों की भीड़ में इंसान अकेला है।',
      'दवा हमेशा कमरे में पहले से रखा कीजिए दोस्त।'
    ]
  },
  {
    id: 'hi_post_2',
    category: 'funny',
    city: 'Delhi',
    country: 'India',
    author: 'अमित कुमार सिंह',
    rawImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=75',
    text: "नई टीम लीडर सुबह 8:30 बजे कॉल करती थी। मैंने पूरी टीम को बोल दिया कि मुझे 'सर्कैडियन हियरिंग डिसऑर्डर' है जिससे 11 बजे से पहले फोन की घंटी बजने पर चक्कर आते हैं। अब लीडर ने ऑफिशियल मेल कर दिया कि 'अमित को 11:05 से पहले कोई कॉल न करे।' पूरी दुनिया 9 बजे से खट रही होती है और मैं चाय की चुस्की के साथ अखबार पढ़ता हूं!",
    possibleComments: [
      'अमित भाई, 200 IQ मूव! पेटेंट करवा लो 😂🔥',
      'गजब दिमाग लगाया भाई साहब!'
    ]
  },
  {
    id: 'hi_post_3',
    category: 'deep',
    city: 'Pune',
    country: 'India',
    author: 'अदिति कुलकर्णी',
    rawImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=75',
    text: "मैंने सालों सबको ये यकीन दिलाने में बिता दिए कि मैं बहुत मजबूत हूं और कभी रोती नहीं। हर किसी के दुख में खड़ी रही। पर जब आप सबको यकीन दिला देते हैं कि आप कभी टूट नहीं सकते, तो लोग पूछना ही बंद कर देते हैं कि आप अंदर से कैसे हैं। कल कार में अकेले फूट-फूटकर रोई, किसी बात का दुख नहीं था, बस हमेशा मजबूत बने रहने की भारी थकान थी।",
    possibleComments: [
      'कमजोर होना कोई गुनाह नहीं है अदिति, कभी-कभी रो लेना चाहिए।',
      'हमेशा मजबूत रहने का मुखौटा बहुत भारी होता है।'
    ]
  },
  {
    id: 'hi_post_4',
    category: 'funny',
    city: 'Lucknow',
    country: 'India',
    author: 'विकास श्रीवास्तव',
    rawImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=700&q=75',
    text: "घरवाले पिछले 6 महीने से पूरे खानदान में तारीफ कर रहे हैं कि विकास शाम को पार्क में डेढ़ घंटे कड़ी रनिंग करता है। सच्चाई यह है कि मैं पार्क के पिछले गेट से निकलकर चाट-कचौड़ी और समोसे उड़ाता हूं, फिर पार्क आकर पसीना पोंछते हुए हांफता हूं। वजन 2 किलो बढ़ा तो सबको बोला कि 'ये फैट नहीं, हैवी मसल्स का वजन है!'",
    possibleComments: [
      'हैवी मसल्स का वजन! सिर्फ लखनऊ वाले ही ऐसा कह सकते हैं 😂',
      'समोसे के आगे मैराथन फेल है भाई!'
    ]
  },
  {
    id: 'hi_post_5',
    category: 'incident',
    city: 'Agra',
    country: 'India',
    author: 'दीपक यादव',
    rawImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=75',
    text: "यमुना एक्सप्रेसवे पर रात 2 बजे बाइक पंक्चर हो गई। कड़ाके की ठंड और जीरो नेटवर्क में हाथ कांप रहे थे। तभी एक पुराना ट्रक रुका, ड्राइवर ने उतरकर बिना सवाल किए 20 मिनट में टायर ठीक किया, गर्म चाय पिलाई। जब पैसे दिए तो मुस्कुराकर बोला—'बाबूजी, सफर में इंसान ही इंसान के काम आता है, बस घर पहुंचकर मां को फोन कर देना।' इंसानियत आज भी जिंदा है।",
    possibleComments: [
      'उस ड्राइवर भाई को दिल से सलाम।',
      'हाईवे पर ऐसे फरिश्ते मिलना बहुत बड़ी बात है।'
    ]
  },
  {
    id: 'hi_post_6',
    category: 'motivational',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=75',
    text: "35 की उम्र में सुरक्षित नौकरी छोड़कर कोडिंग सीखने का रिस्क लिया था। रिश्तेदारों ने कहा दिमाग खराब हो गया है। शुरुआती 1.5 साल इतने मुश्किल थे कि एरर देखकर रोना आता था। पर मैंने मैदान नहीं छोड़ा। आज जब ग्लोबल टेक कंपनी में हूं, तो वही लोग कहते हैं 'संजय की किस्मत अच्छी थी।' दुनिया सिर्फ नतीजा देखती है, रातों की तपस्या नहीं।",
    possibleComments: [
      '35 में ऐसा साहस दिखाना बहुत बड़ी बात है। प्रेरणादायक!',
      'लोग प्रोसेस नहीं रिजल्ट देखते हैं।'
    ]
  },
  {
    id: 'hi_post_7',
    category: 'intelligent',
    city: 'Varanasi',
    country: 'India',
    author: 'समीक्षा त्रिवेदी',
    rawImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=75',
    text: "काशी के घाटों पर बैठकर जब चिताओं और बहती गंगा को देखते हैं, तो जीवन की सारी भागदौड़ का घमंड उतर जाता है। हम जवानी मकान, पद और बैंक बैलेंस जोड़ने में झोंक देते हैं, पर जब तक जीने की पूरी तैयारी होती है, रंगमंच से पर्दा गिरने का वक्त आ जाता है। समझदारी इसमें है कि आप पीछे कितनी शांति छोड़ कर जाते हैं।",
    possibleComments: [
      'मणिकर्णिका घाट का यही शाश्वत सत्य है।',
      'अहंकार राख होने में एक पल लगता है।'
    ]
  },

  // 3. Indian Urban & Corporate English
  {
    id: 'ind_en_post_1',
    category: 'finance',
    city: 'Bengaluru',
    country: 'India',
    author: 'Vikram Razdan',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "Working in Bengaluru startups taught me how early-stage founders exploit 23-year-olds with LinkedIn buzzwords. I worked 15-hour shifts believing the 'we are a family' pitch. The moment Series-B funding stalled, a 4-minute mass Meet call fired 40% of us without warning. Your cervical spine and undisturbed dinner are worth more than unvested phantom equity.",
    possibleComments: [
      'Health before hustle. Startups are business, not a family.',
      'The moment funding drops, loyalty disappears.'
    ]
  },
  {
    id: 'ind_en_post_2',
    category: 'finance',
    city: 'Hyderabad',
    country: 'India',
    author: 'Arjun Rao',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Earning in USD working remotely from Hyderabad while my batchmates battle 3-hour Hitec City traffic. I cook fresh meals with my mother and write Go microservices in shorts. Traditional 9-to-6 office attendance was never about productivity; it was about middle management surveillance. Owning your calendar is true wealth.",
    possibleComments: [
      'Commute drains your life force. Remote work is freedom.',
      'True wealth is owning your daily calendar.'
    ]
  },
  {
    id: 'ind_en_post_3',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'Ananya Deshmukh',
    rawImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=75',
    text: "Attended my 12-year school reunion in Bandra. Within 5 minutes everyone reduced life to apartment sizes, mutual funds, and toddler curricula. Nobody asked: 'Are you at peace? Do you still laugh from the belly?' We didn't grow up; we just traded report cards for net-worth spreadsheets.",
    possibleComments: [
      'Reunions are just glorified status auctions now.',
      'Trading report cards for spreadsheets hit straight home.'
    ]
  },

  // 4. Global Worldwide English
  {
    id: 'world_post_1',
    category: 'finance',
    city: 'Seattle',
    country: 'USA',
    author: 'David Chen',
    rawImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    text: "Pulling $375k in Big Tech looks glamorous until 42% vanishes in taxes and $4,800/mo goes to a 6.8% mortgage. Next morning 300 engineers get automated layoff emails. High salary with constant dread isn't financial independence—it's just a luxury panic room with golden handcuffs.",
    possibleComments: [
      'Golden handcuffs are real. Zero debt beats a huge stressed salary.',
      'Corporate loyalty is an engineered myth.'
    ]
  },
  {
    id: 'world_post_2',
    category: 'finance',
    city: 'London',
    country: 'United Kingdom',
    author: 'Charlotte Evans',
    rawImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=75',
    text: "London's housing inflation has turned our generation into high-earning hostages. I'm an actuarial consultant in the Square Mile, yet over half my pay goes to a draughty Peckham flatshare with a rattling radiator. We drink flat whites pretending we're thriving cosmopolitan pros, but rent anxiety never stops.",
    possibleComments: [
      'Generational wealth gap in London is wild.',
      'Renting dignity in London is completely exhausting.'
    ]
  },
  {
    id: 'world_post_3',
    category: 'finance',
    city: 'Singapore',
    country: 'Singapore',
    author: 'Marcus Tan',
    rawImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=75',
    text: "I run a remote cloud DevOps consultancy while telling extended family I'm a broke freelancer. The moment relatives smell US dollars, Lunar New Year becomes a predatory circus of unsolicited investment pitches. Stealth wealth is peace. Drive a modest car, invest quietly, live without drama.",
    possibleComments: [
      'Stealth wealth is the true superpower in Asia.',
      'Loud wealth attracts drama; quiet wealth gives serenity.'
    ]
  },
  {
    id: 'world_post_4',
    category: 'funny',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Friday 4:45 PM my manager dropped an impromptu slide deck review. Having concert tickets at 6:30, I unmuted, opened and closed my mouth in silence while tapping a pen to fake packet loss. Chat lit up: 'Natalie your audio is fried, go enjoy your weekend!' Slacking secret: let tech fail for you.",
    possibleComments: [
      'The pen-tapping packet loss simulation is elite comedy 😂',
      'Stealing this for our mandatory Friday retrospective.'
    ]
  }
];

const ENGAGEMENT_REACTIONS = ['❤️', '🤗', '😢', '👏', '🔥', '😂', '🙏'];

export function detectLanguageFromTextOrLocation(text: string, city: string, country: string): 'bn' | 'hi' | 'en' {
  if (/[\u0980-\u09FF]/.test(text) || country === 'Bangladesh' || city === 'Kolkata') return 'bn';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

export async function compressUrlToUnder50KB(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 750;
        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(FALLBACK_LIGHTWEIGHT_JPEG);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.65;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > 65000 && quality > 0.2) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch {
        resolve(FALLBACK_LIGHTWEIGHT_JPEG);
      }
    };
    img.onerror = () => resolve(FALLBACK_LIGHTWEIGHT_JPEG);
    img.src = imageUrl;
  });
}

function getUsedPostIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USED_POST_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function recordUsedPostId(id: string) {
  try {
    const used = getUsedPostIds();
    used.add(id);
    localStorage.setItem(USED_POST_IDS_KEY, JSON.stringify(Array.from(used)));
  } catch (e) {
    console.error('Failed to record used post id', e);
  }
}

function getLiveSimulatedPosts(): Confession[] {
  try {
    const raw = localStorage.getItem(LIVE_SIMULATED_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLiveSimulatedPosts(posts: Confession[]) {
  try {
    localStorage.setItem(LIVE_SIMULATED_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save live simulated posts', e);
  }
}

function updateSimulatedPostProgression(posts: Confession[]): Confession[] {
  const now = Date.now();

  return posts.map((post: any) => {
    const poolItem = CURATED_POST_POOL.find((p) => post.id.startsWith(p.id));
    if (!poolItem) return post;

    const postTime = typeof post.createdAt === 'number' ? post.createdAt : new Date(post.createdAt).getTime() || now;
    const ageInMinutes = Math.max(0, Math.floor((now - postTime) / (60 * 1000)));

    let targetCommentsCount = 0;
    let baseLikes = 2;

    if (ageInMinutes < 10) {
      targetCommentsCount = 0;
      baseLikes = 2 + (post.id.length % 3);
    } else if (ageInMinutes < 30) {
      targetCommentsCount = Math.min(1, poolItem.possibleComments.length);
      baseLikes = 6 + (post.id.length % 4);
    } else if (ageInMinutes < 90) {
      targetCommentsCount = Math.min(2, poolItem.possibleComments.length);
      baseLikes = 16 + (post.id.length % 8);
    } else {
      targetCommentsCount = poolItem.possibleComments.length;
      baseLikes = 30 + (post.id.length % 22);
    }

    const visibleComments = poolItem.possibleComments.slice(0, targetCommentsCount).map((cText, idx) => {
      const commentTime = postTime + (idx + 1) * (14 * 60 * 1000);
      return {
        id: `comm_${post.id}_${idx}`,
        author: 'Anonymous',
        text: cText,
        createdAt: commentTime,
      };
    });

    return {
      ...post,
      likesCount: baseLikes,
      likes: baseLikes,
      commentsCount: visibleComments.length,
      comments: visibleComments.length,
      commentsList: visibleComments,
      viewsCount: Math.max(post.viewsCount || 10, baseLikes * 7 + ageInMinutes * 2),
    };
  });
}

async function buildInitialConfession(item: SimulatedPostItem, timestamp: number, customId?: string): Promise<Confession> {
  const compressedImageJpg = await compressUrlToUnder50KB(item.rawImage);

  return {
    id: customId || item.id,
    authorName: item.author,
    text: item.text,
    body: item.text,
    city: item.city,
    country: item.country,
    category: item.category,
    region: `${item.city}, ${item.country}`,
    imageUrl: compressedImageJpg,
    createdAt: timestamp,
    likesCount: 2,
    likes: 2,
    commentsCount: 0,
    comments: 0,
    commentsList: [],
    viewsCount: 15,
    userReaction: ENGAGEMENT_REACTIONS[Math.floor(Math.random() * ENGAGEMENT_REACTIONS.length)],
  } as any;
}

/**
 * FAST BOOTSTRAP TO 50 POSTS + 12-MINUTE DRIP UP TO 100 POSTS
 */
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  // Purge older cache keys
  const OUTDATED_KEYS = [
    'openconfess_used_post_registry_v11',
    'openconfess_live_simulated_posts_v11',
    'openconfess_last_drip_post_time_v11',
    'openconfess_used_post_registry_v10',
    'openconfess_live_simulated_posts_v10',
    'openconfess_last_drip_post_time_v10',
    'openconfess_used_post_registry_v9',
    'openconfess_live_simulated_posts_v9',
    'openconfess_last_drip_post_time_v9',
    'openconfess_simulated_feed_pool_v2',
    'openconfess_live_simulated_posts_v8'
  ];
  OUTDATED_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  });

  let livePosts = getLiveSimulatedPosts();
  const usedIds = getUsedPostIds();
  const now = Date.now();

  const INITIAL_POST_TARGET = 50;
  const MAX_DAILY_CAP = 100;
  const DRIP_INTERVAL = 12 * 60 * 1000; // Har 12 minute me 1 post

  // 1. FAST GENERATION: Bootstrap seed up to 50 realistic posts
  if (livePosts.length < INITIAL_POST_TARGET) {
    const needed = INITIAL_POST_TARGET - livePosts.length;

    for (let idx = 0; idx < needed; idx++) {
      const template = CURATED_POST_POOL[idx % CURATED_POST_POOL.length];
      const cycle = Math.floor(idx / CURATED_POST_POOL.length);
      const uniqueId = cycle === 0 ? template.id : `${template.id}_cycle_${cycle}_${idx}`;

      if (!usedIds.has(uniqueId)) {
        // Realistic staggered times over earlier hours
        const pastTime = now - (idx + 1) * (14 * 60 * 1000);
        const post = await buildInitialConfession(template, pastTime, uniqueId);
        livePosts.push(post);
        recordUsedPostId(uniqueId);
      }
    }

    saveLiveSimulatedPosts(livePosts);
    localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
  }

  // 2. 12-MINUTE DRIP MODE: After 50 posts, drip 1 post every 12 mins up to 100 posts
  const lastPostTime = Number(localStorage.getItem(LAST_SIMULATION_TIMESTAMP_KEY) || 0);

  if (livePosts.length >= INITIAL_POST_TARGET && livePosts.length < MAX_DAILY_CAP && now - lastPostTime >= DRIP_INTERVAL) {
    const currentCount = livePosts.length;
    const template = CURATED_POST_POOL[currentCount % CURATED_POST_POOL.length];
    const dripUniqueId = `${template.id}_drip_${Date.now()}`;

    const newDripPost = await buildInitialConfession(template, now, dripUniqueId);
    livePosts.unshift(newDripPost);
    recordUsedPostId(dripUniqueId);
    saveLiveSimulatedPosts(livePosts);
    localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
  }

  livePosts = updateSimulatedPostProgression(livePosts);
  saveLiveSimulatedPosts(livePosts);

  const existingIdSet = new Set(existingPosts.map((p) => String(p.id)));
  const filteredSimulated = livePosts.filter((p) => !existingIdSet.has(String(p.id)));

  // Combine and sort strictly by Newest First
  const allPosts = [...existingPosts, ...filteredSimulated];
  return allPosts.sort((a, b) => {
    const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime() || 0;
    const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });
}

export function scheduleEngagementForNewPost(
  confession: Confession,
  onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {
  const postText = (confession as any).text || (confession as any).body || '';
  const city = (confession as any).city || '';
  const country = (confession as any).country || '';
  const lang = detectLanguageFromTextOrLocation(postText, city, country);

  const reactionComments: Record<string, string[]> = {
    bn: [
      'কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। আপনার প্রতি অনেক শ্রদ্ধা।',
      'আমরা অনেকেই এই কষ্টটা নীরবে বয়ে বেড়াই। ভালো থাকুন আপনি।'
    ],
    hi: [
      'यह बात सीधे दिल को छू गई। बहुत हिम्मत चाहिए ऐसा सच स्वीकार करने के लिए।',
      'आप अकेले नहीं हैं दोस्त, खुद पर भरोसा रखिए।'
    ],
    en: [
      'This resonated with me on such an intimate level. Thank you for speaking your truth.',
      'Quiet battles are often the heaviest to carry. Sending peace.'
    ]
  };

  const pool = reactionComments[lang] || reactionComments.en;

  setTimeout(() => {
    onUpdate({ likesCountIncrement: 1 });
  }, 8000 + Math.random() * 7000);

  setTimeout(() => {
    onUpdate({
      newComment: {
        id: `sim_user_comm_${Date.now()}`,
        author: 'Anonymous',
        text: pool[Math.floor(Math.random() * pool.length)],
        createdAt: Date.now(),
      },
    });
  }, 90000 + Math.random() * 60000);
}

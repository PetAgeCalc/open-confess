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

// Bumped version key to refresh simulated pool
const USED_POST_IDS_KEY = 'openconfess_used_post_registry_v12';
const LIVE_SIMULATED_POSTS_KEY = 'openconfess_live_simulated_posts_v12';
const LAST_SIMULATION_TIMESTAMP_KEY = 'openconfess_last_drip_post_time_v12';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// CURATED CONFESSIONS POOL (Mixed lengths including 100-300 word stories)
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  // --- LONG CONFESSIONS (100 - 300 Words: Bangla, Hindi, English) ---
  {
    id: 'bn_long_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'অনির্বাণ মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "কলকাতার এক সাধারণ মধ্যবিত্ত পরিবারে আমার বেড়ে ওঠা। ছোটবেলা থেকেই বাবার ভাঙা পুরনো স্কুটার আর মায়ের তালি দেওয়া শাড়ির আঁচল দেখে বড় হয়েছি। মনের ভেতর একটাই তীব্র জেদ ছিল—আমাকে অনেক বড় কোনো বহুজাতিক সংস্থায় প্রতিষ্ঠিত হতে হবে, পরিবারের সব অভাব আর টানাটানি এক লহমায় মুছে দিতে হবে। বহু বিনিদ্র রাত আর কঠোর পরিশ্রমের পর আজ সল্টলেকের সেক্টর ফাইভে আমার একটা শীতাতপ নিয়ন্ত্রিত কাঁচের কেবিন হয়েছে, ব্যাংকে মোটা অঙ্কের স্যালারি ঢোকে প্রতি মাসের প্রথম দিনে, বন্ধুদের সাথে উইকেন্ডে দামি ক্যাফেতে আড্ডাও দিই। কিন্তু এক ভয়ানক অদ্ভুত শূন্যতা রোজ রাতে আমাকে তাড়া করে ফেরে। যে মানুষগুলোর মুখে একটু নিশ্চিন্তির হাসি ফোটানোর জন্য দিনরাত এক করে লড়েছিলাম, সেই মা-বাবাই আজ বার্ধক্যের এমন এক নিঃসঙ্গ পর্যায়ে পৌঁছে গেছেন যেখানে নামী রেস্তোরাঁর খাবার কিংবা ব্যান্ডের জামাকাপড় তাদের মনে কোনো আনন্দ জাগায় না। সময় এত দ্রুত বালির মতো হাত গলে বেরিয়ে গেল যে সফল হতে হতে প্রিয় মানুষগুলোর পাশে দুটো শান্ত কথা বলার সময়টাই হারিয়ে ফেললাম। আজ এই শীতাতপ নিয়ন্ত্রিত ঘরের বিলাসবহুল একাকিত্বে বসে মনে হয়, জীবনের সেরা সময়গুলো আমরা আসলে কীসের পেছনে ছুড়ে ফেলে দিলাম?",
    possibleComments: [
      'পড়ে মনটা ভিজে গেল। সময় চলে গেলে টাকা দিয়েও প্রিয়জনের হারানো মুহূর্ত ফেরানো যায় না।',
      'আমাদের প্রজন্মের সবচেয়ে বড় ট্র্যাজেডি এটাই।'
    ]
  },
  {
    id: 'hi_long_1',
    category: 'deep',
    city: 'Bengaluru',
    country: 'India',
    author: 'मयंक त्रिपाठी',
    rawImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=75',
    text: "बचपन में लगता था कि बड़े होकर जब अपनी कमाई होगी और अपनी मर्जी से जीने की पूरी छूट मिलेगी, तो वो जिंदगी का सबसे खूबसूरत दौर होगा। आज बेंगलुरु के एक पॉश हाई-राइज 2BHK फ्लैट की बालकनी में खड़ा होकर रात के ढाई बजे ये सब सोच रहा हूं। हाथ में महंगे सिरेमिक मग की गर्माहट है, पर सीने के अंदर एक अजीब सी बर्फ जमी हुई है। वो मां की डांट, आंगन में शाम को दोस्तों के साथ धूल उड़ाते हुए गली क्रिकेट खेलना, और दस रुपये की पॉकेट मनी में पूरी दुनिया जीत लेने का जो बेफिक्र सुकून था, वो आज इस चालीस लाख के पैकेज में कहीं बहुत दूर छूट गया है। हम सब बड़े तो हो गए, समाज की नजरों में कामयाब भी बन गए, लेकिन उस बड़प्पन की कीमत हमने अपनी मासूम बेपरवाह हंसी बेचकर चुकाई है। अब बस दिनभर लैपटॉप की नीली स्क्रीन, क्लाइंट्स की डेडलाइन्स और रात को अकेलेपन की सन्नाटेदार चादर रह गई है। फोन में सैकड़ों कॉन्टैक्ट्स हैं, पर जब दिल भारी होता है तो कॉल लगाने के लिए एक भी नाम ऐसा नहीं दिखता जिसे बिना सोचे-समझे अपनी तकलीफ बता सकूं।",
    possibleComments: [
      'हर उस इंसान की कहानी जो अपने घर से दूर किसी अनजान शहर में खुद को ढूंढ रहा है।',
      'करियर की दौड़ में हमने जिंदगी जीना ही छोड़ दिया।'
    ]
  },
  {
    id: 'en_long_1',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'Radhika Sen',
    rawImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=75',
    text: "From the outside, my life looks like a perfectly curated aesthetic dream. A thriving design consultancy in Bandra, regular invites to upscale networking dinners, and an apartment filled with bespoke art and monstera plants. But nobody sees what happens when the door locks shut behind me at midnight. I have spent the last seven years perfecting the art of emotional camouflage. When my engagement abruptly fell apart two years ago, I didn't take a single mental health day; instead, I took on twice the workload to ensure I was too exhausted to feel the void. People constantly tell me how inspired they are by my independence and emotional composure, unaware that being constantly praised for being 'unbreakable' is a private prison. When you teach everyone that you never break down, they gradually stop asking if you're hurting. Sometimes the heaviest burden in this world isn't failure—it is the quiet, chronic exhaustion of having to maintain the myth of your own effortless strength.",
    possibleComments: [
      'Being the strong one is the loneliest role in any family or circle.',
      'This spoke directly to the core of what so many of us hide.'
    ]
  },
  {
    id: 'hi_long_2',
    category: 'incident',
    city: 'Lucknow',
    country: 'India',
    author: 'आकाश रस्तोगी',
    rawImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=75',
    text: "तीन साल पहले कॉलेज के आखिरी साल में एक ऐसी गलती कर बैठा था जिसका बोझ आज भी मेरे दिल को कचोटता है। हमारे हॉस्टल में एक बेहद सीधा और गरीब लड़का था जो ट्यूशन पढ़ाकर अपनी फीस भरता था। एक दिन दोस्तों के साथ बेवजह की शरारत में हमने उसके कमरे में छिपकर उसका पुराना टूटा हुआ फोन गायब कर दिया और सोचा कि थोड़ी देर बाद लौटाकर खूब हंसेंगे। लेकिन उस फोन में उसकी बीमार मां की आखिरी कुछ वॉइस रिकॉर्डिंग्स और अस्पताल की दवाइयों की डिटेल्स थीं। जब वह घबराकर पागलों की तरह हॉस्टल के गलियारे में रोने लगा और उसकी हालत देखकर वॉर्डन आने लगे, तो हम सब अपने डर की वजह से चुप रह गए और डरपोक बनकर वह फोन कभी लौटा ही नहीं पाए। उसने अगले हफ्ते हॉस्टल छोड़ दिया और कॉलेज से भी नाम कटवा लिया। आज जब भी मुझे कोई नई कामयाबी मिलती है, मुझे उस लड़के की बेबस रोती हुई आंखें याद आ जाती हैं। इंसान की एक सेकंड की कायरता किसी दूसरे की पूरी जिंदगी पर कितना गहरा घाव छोड़ सकती है, यह मुझे उस दिन समझ आया।",
    possibleComments: [
      'गलती मान लेना ही पछतावे की पहली सीढ़ी है भाई।',
      'कुछ गलतियां उम्र भर इंसान का पीछा नहीं छोड़तीं।'
    ]
  },
  {
    id: 'bn_long_2',
    category: 'deep',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'ফারহানা ইসলাম',
    rawImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=75',
    text: "ঢাকার এক ব্যস্ত হাসপাতালের আইসিইউ-র বাইরে বসে এই কথাগুলো লিখছি। মানুষের জীবনের মূল্য যে কত পলকা, তা এই করিডোরে কয়েক ঘণ্টা না কাটালে কোনোদিন উপলব্ধি করা সম্ভব নয়। আমরা মাসের পর মাস ছোটখাটো অহংকার, মান-অভিমান আর হিংসা নিয়ে প্রিয়জনদের সাথে কথা বলা বন্ধ করে রাখি। ভাবি অহংকার বজায় রাখাটাই বুঝি ব্যক্তিত্বের সবচেয়ে বড় পরিচয়। অথচ এই দেয়ালগুলোর ওপারে যখন কোনো একজন মানুষের মনিটরের হৃদস্পন্দন হঠাৎ সরলরেখা হয়ে যায়, তখন আমাদের সমস্ত অহংকার, রাগ আর যুক্তি ধুলোয় মিশে যায়। যে মানুষটির সাথে কাল রাতেও তুচ্ছ বিষয়ে রাগ করে খাবার না খেয়ে উঠে গিয়েছিলাম, আজ তার নিঃশ্বাসটুকুর জন্য সমস্ত পৃথিবী দান করে দিতে ইচ্ছে করছে। প্রিয়জনকে ভালোবাসার কথা জানাতে কোনো বিশেষ দিনের অপেক্ষা করবেন না। জীবনের শেষ মুহূর্তগুলো কখনো নোটিশ দিয়ে আসে না।",
    possibleComments: [
      'চোখ খুলে দেওয়ার মতো লেখা আপু। আপনার পরিবারের জন্য অনেক প্রার্থনা রইল।',
      'অহংকার ক্ষণিকের, কিন্তু প্রিয়জন হারানোর শোক আজীবনের।'
    ]
  },
  {
    id: 'en_long_2',
    category: 'finance',
    city: 'Seattle',
    country: 'USA',
    author: 'David Vance',
    rawImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    text: "I spent the majority of my twenties convinced that reaching a $400k total compensation package in Big Tech would solve every underlying anxiety I inherited from a turbulent childhood. I optimized every single waking minute—tracked my productivity in Notion dashboards, outsourced my grocery shopping to save 45 minutes a week, and treated personal relationships like transactional quarterly networking check-ins. When I finally hit the compensation target and bought the panoramic condo overlooking Puget Sound, the psychological relief lasted exactly forty-eight hours. The following Monday, the exact same void opened up again, demanding the next promotion, the next RSUs tranche, the next arbitrary status milestone. Corporate consumerism is a brilliantly designed psychological hamster wheel; it convinces you that happiness is always just one salary band away, keeping you tethered until your prime years have quietly evaporated.",
    possibleComments: [
      'The hedonic treadmill is real. Peace of mind is the only true wealth.',
      'Spot on. We trade our youth for numbers on a screen.'
    ]
  },
  {
    id: 'hi_long_3',
    category: 'motivational',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=75',
    text: "बत्तीस साल की उम्र में जब मैंने अपनी सरकारी नौकरी की तैयारी छोड़कर कोडिंग और वेब डेवलपमेंट की दुनिया में कदम रखा, तो मेरे अपने रिश्तेदारों ने मेरे पिता से कह दिया था कि आपके बेटे का मानसिक संतुलन बिगड़ चुका है। शुरुआती डेढ़ साल इतने अंधेरे भरे थे कि रोज रात को कंप्यूटर स्क्रीन पर एरर देखते-देखते आंखें भर आती थीं। बचत खत्म हो रही थी और शादी के रिश्ते टूटने लगे थे। लेकिन सीने में एक जिद थी कि समाज द्वारा तय की गई टाइमलाइन पर अपनी जिंदगी बर्बाद नहीं करूंगा। आज जब मैं एक रिमोट टेक कंपनी के लिए काम करता हूं और अपने कमरे में बैठकर डॉलर में कमाता हूं, तो वही रिश्तेदार अपने बच्चों को मेरे पास करियर गाइडेंस के लिए भेजते हैं। दुनिया सिर्फ आपका नतीजा देखती है, उन नतीजों के पीछे की काली रातों की तपस्या नहीं। अगर आपके सपनों पर आपका खुद का यकीन पक्का है, तो दुनिया के तानों को सिर्फ बैकग्राउंड नॉइज़ समझकर आगे बढ़ते रहिए।",
    possibleComments: [
      'बहुत ही शानदार और हिम्मत देने वाला सफर भाई!',
      'लोग सिर्फ उगते सूरज को सलाम करते हैं।'
    ]
  },
  {
    id: 'bn_long_3',
    category: 'intelligent',
    city: 'Kolkata',
    country: 'India',
    author: 'দেবাশিস মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=700&q=75',
    text: "বর্তমান বাঙালি সমাজ এমন এক অদ্ভুত আত্মপ্রবঞ্চনার মধ্য দিয়ে যাচ্ছে যেখানে সোশ্যাল মিডিয়ার ভার্চুয়াল লাইক মানুষের প্রকৃত যোগ্যতার একমাত্র মানদণ্ড হয়ে দাঁড়িয়েছে। বইমেলার ভিড়ে মানুষ বই কেনার চেয়ে সেলফি তুলতে বেশি ব্যস্ত, আর বাড়ি ফিরে ঘণ্টার পর ঘণ্টা শর্টস আর রিলস দেখে নিজের মেধা নষ্ট করছে। ফেসবুকের কমেন্ট বক্সে যুক্তি দিয়ে তর্ক জেতা হয়তো খুব সহজ, কিন্তু বাস্তবের উঠোনে নেমে রক্ত-মাংসের সম্পর্ক টিকিয়ে রাখার জন্য যুক্তির চেয়ে নিঃশব্দ সহমর্মিতা আর ক্ষমার অনেক বেশি প্রয়োজন হয়। আমরা নিজেদের আধুনিক ভাবছি ঠিকই, কিন্তু মানসিক উদারতা আর পারস্পরিক শ্রদ্ধাবোধের দিক থেকে দিন দিন চরম সংকীর্ণতার শিকার হচ্ছি।",
    possibleComments: [
      'অত্যন্ত সময়োপযোগী এবং খাঁটি বাস্তব কথা দেবাশিসদা।',
      'আমাদের শিকড় আর গভীরতা ফিরে পাওয়া খুব জরুরি।'
    ]
  },

  // --- CORE CONCISE & MEDIUM CONFESSIONS ---
  {
    id: 'bn_post_1',
    category: 'funny',
    city: 'Kolkata',
    country: 'India',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "সল্টলেকের অফিসে যখনই কোনো জটিল ডেডলাইন আসে বা ক্লায়েন্ট মিটিং ডাকে, টিমের সবাই টেনশন করে, আর আমি একটা মাস্টারস্ট্রোক চালাই। ল্যাপটপের ওয়াইফাই বন্ধ করে টার্মিনালে বিদঘুটে স্ক্রিপ্ট খুলে কপালে হাত দিয়ে বসি! গত সপ্তাহে প্রজেক্ট ডিরেক্টর এসে বললেন, 'শুভঙ্কর তোমার ডেডিকেশন শিক্ষণীয়' বলে স্পেশাল কফি খাইয়ে গেলেন! অথচ আমি ভেতরে ভেতরে হাসতে হাসতে শেষ!",
    possibleComments: ['ভাইরে ভাই! আপনি তো কর্পোরেট অস্কার পাওয়ার দাবিদার 😂', 'কাল থেকে আমিও ট্রাই করব!']
  },
  {
    id: 'hi_post_1',
    category: 'funny',
    city: 'Delhi',
    country: 'India',
    author: 'अमित कुमार सिंह',
    rawImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=75',
    text: "नई टीम लीडर सुबह 8:30 बजे कॉल करती थी। मैंने पूरी टीम को बोल दिया कि मुझे 'सर्कैडियन हियरिंग डिसऑर्डर' है जिससे 11 बजे से पहले फोन की घंटी बजने पर चक्कर आते हैं। अब लीडर ने ऑफिशियल मेल कर दिया कि 'अमित को 11:05 से पहले कोई कॉल न करे।' पूरी दुनिया 9 बजे से खट रही होती है और मैं चाय की चुस्की के साथ अखबार पढ़ता हूं!",
    possibleComments: ['अमित भाई, 200 IQ मूव! पेटेंट करवा लो 😂🔥', 'गजब दिमाग लगाया भाई साहब!']
  },
  {
    id: 'ind_en_post_1',
    category: 'finance',
    city: 'Bengaluru',
    country: 'India',
    author: 'Vikram Razdan',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "Working in Bengaluru startups taught me how early-stage founders exploit 23-year-olds with LinkedIn buzzwords. I worked 15-hour shifts believing the 'we are a family' pitch. The moment Series-B funding stalled, a 4-minute mass Meet call fired 40% of us without warning. Your cervical spine and undisturbed dinner are worth more than unvested phantom equity.",
    possibleComments: ['Health before hustle. Startups are business, not a family.', 'The moment funding drops, loyalty disappears.']
  },
  {
    id: 'world_post_1',
    category: 'funny',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Friday 4:45 PM my manager dropped an impromptu slide deck review. Having concert tickets at 6:30, I unmuted, opened and closed my mouth in silence while tapping a pen to fake packet loss. Chat lit up: 'Natalie your audio is fried, go enjoy your weekend!' Slacking secret: let tech fail for you.",
    possibleComments: ['The pen-tapping packet loss simulation is elite comedy 😂', 'Stealing this for our mandatory Friday retrospective.']
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
    const poolItem = CURATED_POST_POOL.find((p) => p.id === post.id);
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

async function buildInitialConfession(item: SimulatedPostItem, timestamp: number): Promise<Confession> {
  const compressedImageJpg = await compressUrlToUnder50KB(item.rawImage);

  return {
    id: item.id,
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
 * FAST BOOTSTRAP TO 20 POSTS + NORMAL DRIP SWITCH
 */
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  // Purge older v10/v11 caches
  const OUTDATED_KEYS = [
    'openconfess_used_post_registry_v11',
    'openconfess_live_simulated_posts_v11',
    'openconfess_last_drip_post_time_v11',
    'openconfess_used_post_registry_v10',
    'openconfess_live_simulated_posts_v10',
    'openconfess_last_drip_post_time_v10',
  ];
  OUTDATED_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  });

  let livePosts = getLiveSimulatedPosts();
  const usedIds = getUsedPostIds();
  const now = Date.now();

  // 1. FAST GENERATION: Seed initial posts
  if (livePosts.length < 20) {
    const needed = 20 - livePosts.length;
    const available = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id)).slice(0, needed);

    for (let idx = 0; idx < available.length; idx++) {
      const item = available[idx];
      const pastTime = now - (idx + 1) * (2.8 * 60 * 1000);
      const post = await buildInitialConfession(item, pastTime);
      livePosts.push(post);
      recordUsedPostId(item.id);
    }

    saveLiveSimulatedPosts(livePosts);
    localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
  }

  // 2. NORMAL DRIP MODE: 1 post every 22 minutes
  const lastPostTime = Number(localStorage.getItem(LAST_SIMULATION_TIMESTAMP_KEY) || 0);
  const DRIP_INTERVAL = 22 * 60 * 1000;

  if (livePosts.length >= 20 && now - lastPostTime >= DRIP_INTERVAL) {
    const freshAvailable = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id));
    if (freshAvailable.length > 0) {
      const nextItem = freshAvailable[0];
      const newDripPost = await buildInitialConfession(nextItem, now);
      livePosts.unshift(newDripPost);
      recordUsedPostId(nextItem.id);
      saveLiveSimulatedPosts(livePosts);
      localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
    }
  }

  livePosts = updateSimulatedPostProgression(livePosts);
  saveLiveSimulatedPosts(livePosts);

  const existingIdSet = new Set(existingPosts.map((p) => String(p.id)));
  const filteredSimulated = livePosts.filter((p) => !existingIdSet.has(String(p.id)));

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

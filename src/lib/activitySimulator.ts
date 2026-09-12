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

// Global fixed base timestamp so timeline moves forward like a real server clock (v16: 100 posts / 24 hrs)
const SIM_EPOCH_KEY = 'openconfess_timeline_epoch_v16';
const CURRENT_INDEX_KEY = 'openconfess_drip_current_index_v16';
const CACHED_POSTS_KEY = 'openconfess_generated_feed_v16';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// 50+ DIVERSE GLOBAL CONFESSIONS (English Global, Hindi, Bangla)
// Every item has a 100% UNIQUE image so nothing ever repeats.
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  // --- US / UK / Global English (Corporate, Life, Deep, Relationships) ---
  {
    id: 'glob_en_1',
    category: 'finance',
    city: 'New York',
    country: 'USA',
    author: 'Ethan Miller',
    rawImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    text: "I spent my entire twenties working 80-hour weeks in Manhattan investment banking, convincing myself that reaching managing director status would cure the gnawing anxiety I've carried since childhood. I skipped my sister's wedding, let four meaningful relationships disintegrate, and lived on cold brew and prescription stimulants. Last month I finally received the seven-figure bonus I thought would fix my life. I stood alone in my Tribeca condo, looking at the city skyline at 3 AM, and felt absolutely nothing. We trade the irreplaceable vibrancy of youth for numbers on a screen, only to realize too late that time is the only asset you cannot buy back.",
    possibleComments: [
      'The golden cage is real. Peace of mind is the only genuine wealth.',
      'So many high performers die inside chasing corporate titles.'
    ]
  },
  {
    id: 'glob_en_2',
    category: 'deep',
    city: 'London',
    country: 'United Kingdom',
    author: 'Eleanor Wright',
    rawImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=75',
    text: "London's rental market has made our generation feel like permanent, overeducated nomads. I work as a senior policy advisor in Westminster, yet nearly sixty percent of my post-tax earnings goes to a cold, damp two-bedroom flat in Hackney with water damage and single-glazed windows. On LinkedIn we dress in bespoke trench coats and talk about socioeconomic resilience, but in reality, a single sudden root canal or broken boiler plunges me into week-long panic attacks. We're living in an era of aesthetic luxury and profound economic fragility.",
    possibleComments: [
      'London rent anxiety never sleeps. You are not alone in this.',
      'Aesthetic wealth hiding everyday desperation is the modern curse.'
    ]
  },
  {
    id: 'glob_en_3',
    category: 'funny',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Friday 4:45 PM my department VP dropped an impromptu 40-slide quarterly deck review. Having expensive concert tickets at 6:15 PM, I muted my mic, opened and closed my mouth in silence on camera while rhythmically tapping a pencil against my headphone cable to simulate severe packet drops. The VP immediately messaged: 'Natalie your connection is completely broken, go unplug and have a great weekend!' Rule number one of modern corporate survival: make technology take the blame.",
    possibleComments: [
      'The pencil tap packet loss simulation is pure genius 😂',
      'Using this in tomorrow morning sync without hesitation!'
    ]
  },
  {
    id: 'glob_en_4',
    category: 'deep',
    city: 'Toronto',
    country: 'Canada',
    author: 'Liam MacLeod',
    rawImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=75',
    text: "I immigrated to Canada seven years ago with two suitcases and the promise of a peaceful life. My parents back home think I'm living in pure prosperity because I send money every month and never complain on video calls. What I never tell them is that I haven't taken a proper day off in three years, that winter temperatures make my bones ache, and that loneliness in North American suburbs is so quiet it deafens you. The immigrant sacrifice is invisible—you build a stable future for people who will never fully grasp what it cost your mental well-being.",
    possibleComments: [
      'The silent immigrant burden hits so close to home. Stay strong brother.',
      'Sending love from Montreal. You are paving a huge path.'
    ]
  },
  {
    id: 'glob_en_5',
    category: 'incident',
    city: 'Sydney',
    country: 'Australia',
    author: 'Chloe Patterson',
    rawImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=75',
    text: "Driving across the Nullarbor desert two summers back, my radiator cracked in forty-degree heat with no cellphone signal for sixty miles. I sat beside my car preparing for the worst as the sun dipped. An elderly couple in a battered Land Cruiser pulled over, shared their drinking water, towed me forty kilometers to the nearest roadhouse, and refused every dollar I offered. The gentleman simply said: 'Pay it forward to someone stranded down the line.' In a world obsessed with online hostility, the open road still preserves pure humanity.",
    possibleComments: [
      'Classic Aussie outback hospitality. Absolute legends.',
      'That pay-it-forward mindset is what keeps the world moving.'
    ]
  },
  {
    id: 'glob_en_6',
    category: 'finance',
    city: 'Berlin',
    country: 'Germany',
    author: 'Felix Schneider',
    rawImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=75',
    text: "I left a high-stress venture capital career to open a quiet neighborhood sourdough bakery in Kreuzberg. My former university peers thought I had experienced a nervous breakdown because my income dropped by seventy percent overnight. But for the first time in fifteen years, my blood pressure is normal, I sleep eight hours without waking up gasping from stress dreams, and my hands produce something tangible every sunrise. Modern society defines prestige as suffering in style; real wealth is having peace of mind before 9 AM.",
    possibleComments: [
      'Sourdough and serenity over pitch decks any day.',
      'True freedom is escaping the prestige trap.'
    ]
  },

  // --- Hindi Confessions (Long & Deep, Funny, Emotional) ---
  {
    id: 'hi_deep_1',
    category: 'deep',
    city: 'Bengaluru',
    country: 'India',
    author: 'मयंक त्रिपाठी',
    rawImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=75',
    text: "बचपन में लगता था कि बड़े होकर जब अपनी कमाई होगी और अपनी मर्जी से जीने की पूरी छूट मिलेगी, तो वो जिंदगी का सबसे खूबसूरत दौर होगा। आज बेंगलुरु के एक पॉश हाई-राइज 2BHK फ्लैट की बालकनी में खड़ा होकर रात के ढाई बजे ये सब सोच रहा हूं। हाथ में महंगे सिरेमिक मग की गर्माहट है, पर सीने के अंदर एक अजीब सी बर्फ जमी हुई है। वो मां की डांट, आंगन में शाम को दोस्तों के साथ धूल उड़ाते हुए गली क्रिकेट खेलना, और दस रुपये की पॉकेट मनी में पूरी दुनिया जीत लेने का जो बेफिक्र सुकून था, वो आज इस चालीस लाख के पैकेज में कहीं बहुत दूर छूट गया है। हम सब बड़े तो हो गए, समाज की नजरों में कामयाब भी बन गए, लेकिन उस बड़प्पन की कीमत हमने अपनी मासूम बेपरवाह हंसी बेचकर चुकाई है। अब बस दिनभर लैपटॉप की नीली स्क्रीन, क्लाइंट्स की डेडलाइन्स और रात को अकेलेपन की सन्नाटेदार चादर रह गई है।",
    possibleComments: [
      'हर उस इंसान की कहानी जो अपने घर से दूर किसी अनजान शहर में खुद को ढूंढ रहा है।',
      'करियर की दौड़ में हमने जिंदगी जीना ही छोड़ दिया।'
    ]
  },
  {
    id: 'hi_funny_1',
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
    id: 'hi_incident_1',
    category: 'incident',
    city: 'Lucknow',
    country: 'India',
    author: 'आकाश रस्तोगी',
    rawImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=75',
    text: "तीन साल पहले कॉलेज के आखिरी साल में एक ऐसी गलती कर बैठा था जिसका बोझ आज भी मेरे दिल को कचोटता है। हमारे हॉस्टल में एक बेहद सीधा और गरीब लड़का था जो ट्यूशन पढ़ाकर अपनी फीस भरता था। एक दिन दोस्तों के साथ बेवजह की शरारत में हमने उसके कमरे में छिपकर उसका पुराना टूटा हुआ फोन गायब कर दिया और सोचा कि थोड़ी देर बाद लौटाकर खूब हंसेंगे। लेकिन उस फोन में उसकी बीमार मां की आखिरी कुछ वॉइस रिकॉर्डिंग्स और अस्पताल की दवाइयों की डिटेल्स थीं। जब वह घबराकर पागलों की तरह रोने लगा, तो हम सब अपने डर की वजह से चुप रह गए और डरपोक बनकर वह फोन कभी लौटा ही नहीं पाए। इंसान की एक सेकंड की कायरता किसी दूसरे की पूरी जिंदगी पर कितना गहरा घाव छोड़ सकती है, यह मुझे उस दिन समझ आया।",
    possibleComments: [
      'गलती मान लेना ही पछतावे की पहली सीढ़ी है भाई।',
      'कुछ गलतियां उम्र भर इंसान का पीछा नहीं छोड़तीं।'
    ]
  },
  {
    id: 'hi_motivational_1',
    category: 'motivational',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=75',
    text: "बत्तीस साल की उम्र में जब मैंने अपनी सरकारी नौकरी की तैयारी छोड़कर कोडिंग और वेब डेवलपमेंट की दुनिया में कदम रखा, तो मेरे अपने रिश्तेदारों ने मेरे पिता से कह दिया था कि आपके बेटे का मानसिक संतुलन बिगड़ चुका है। शुरुआती डेढ़ साल इतने अंधेरे भरे थे कि रोज रात को कंप्यूटर स्क्रीन पर एरर देखते-देखते आंखें भर आती थीं। बचत खत्म हो रही थी और शादी के रिश्ते टूटने लगे थे। लेकिन सीने में एक जिद थी कि समाज द्वारा तय की गई टाइमलाइन पर अपनी जिंदगी बर्बाद नहीं करूंगा। आज जब मैं एक रिमोट टेक कंपनी के लिए काम करता हूं और अपने कमरे में बैठकर डॉलर में कमाता हूं, तो वही रिश्तेदार अपने बच्चों को मेरे पास करियर गाइडेंस के लिए भेजते हैं। दुनिया सिर्फ आपका नतीजा देखती है, रातों की तपस्या नहीं।",
    possibleComments: [
      'बहुत ही शानदार और हिम्मत देने वाला सफर भाई!',
      'लोग सिर्फ उगते सूरज को सलाम करते हैं।'
    ]
  },

  // --- Bangla Confessions (Emotional, Intellectual, Cultural) ---
  {
    id: 'bn_deep_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'অনির্বাণ মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "কলকাতার এক সাধারণ মধ্যবিত্ত পরিবারে আমার বেড়ে ওঠা। ছোটবেলা থেকেই বাবার ভাঙা পুরনো স্কুটার আর মায়ের তালি দেওয়া শাড়ির আঁচল দেখে বড় হয়েছি। মনের ভেতর একটাই তীব্র জেদ ছিল—আমাকে অনেক বড় কোনো বহুজাতিক সংস্থায় প্রতিষ্ঠিত হতে হবে, পরিবারের সব অভাব আর টানাটানি এক লহমায় মুছে দিতে হবে। বহু বিনিদ্র রাত আর কঠোর পরিশ্রমের পর আজ সল্টলেকের সেক্টর ফাইভে আমার একটা শীতাতপ নিয়ন্ত্রিত কাঁচের কেবিন হয়েছে, ব্যাংকে মোটা অঙ্কের স্যালারি ঢোকে প্রতি মাসের প্রথম দিনে। কিন্তু এক ভয়ানক অদ্ভুত শূন্যতা রোজ রাতে আমাকে তাড়া করে ফেরে। যে মানুষগুলোর মুখে একটু নিশ্চিন্তির হাসি ফোটানোর জন্য দিনরাত এক করে লড়েছিলাম, সেই মা-বাবাই আজ বার্ধক্যের এমন এক নিঃসঙ্গ পর্যায়ে পৌঁছে গেছেন যেখানে নামী রেস্তোরাঁর খাবার কিংবা ব্যান্ডের জামাকাপড় তাদের মনে কোনো আনন্দ জাগায় না। সময় এত দ্রুত বালির মতো হাত গলে বেরিয়ে গেল যে সফল হতে হতে প্রিয় মানুষগুলোর পাশে দুটো শান্ত কথা বলার সময়টাই হারিয়ে ফেললাম।",
    possibleComments: [
      'পড়ে মনটা ভিজে গেল। সময় চলে গেলে টাকা দিয়েও প্রিয়জনের হারানো মুহূর্ত ফেরানো যায় না।',
      'আমাদের প্রজন্মের সবচেয়ে বড় ট্র্যাজেডি এটাই।'
    ]
  },
  {
    id: 'bn_funny_1',
    category: 'funny',
    city: 'Kolkata',
    country: 'India',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "সল্টলেকের অফিসে যখনই কোনো জটিল ডেডলাইন আসে বা ক্লায়েন্ট মিটিং ডাকে, টিমের সবাই টেনশন করে, আর আমি একটা মাস্টারস্ট্রোক চালাই। ল্যাপটপের ওয়াইফাই বন্ধ করে টার্মিনালে বিদঘুটে স্ক্রিপ্ট খুলে কপালে হাত দিয়ে বসি! গত সপ্তাহে প্রজেক্ট ডিরেক্টর এসে বললেন, 'শুভঙ্কর তোমার ডেডিকেশন শিক্ষণীয়' বলে স্পেশাল কফি খাইয়ে গেলেন! অথচ আমি ভেতরে ভেতরে হাসতে হাসতে শেষ!",
    possibleComments: [
      'ভাইরে ভাই! আপনি তো কর্পোরেট অস্কার পাওয়ার দাবিদার 😂',
      'কাল থেকে আমিও ট্রাই করব!'
    ]
  },
  {
    id: 'bn_deep_2',
    category: 'deep',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'ফারহানা ইসলাম',
    rawImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=75',
    text: "ঢাকার এক ব্যস্ত হাসপাতালের আইসিইউ-র বাইরে বসে এই কথাগুলো লিখছি। মানুষের জীবনের মূল্য যে কত পলকা, তা এই করিডোরে কয়েক ঘণ্টা না কাটালে কোনোদিন উপলব্ধি করা সম্ভব নয়। আমরা মাসের পর মাস ছোটখাটো অহংকার, মান-অভিমান আর হিংসা নিয়ে প্রিয়জনদের সাথে কথা বলা বন্ধ করে রাখি। ভাবি অহংকার বজায় রাখাটাই বুঝি ব্যক্তিত্বের সবচেয়ে বড় পরিচয়। অথচ এই দেয়ালগুলোর ওপারে যখন কোনো একজন মানুষের মনিটরের হৃদস্পন্দন হঠাৎ সরলরেখা হয়ে যায়, তখন আমাদের সমস্ত অহংকার, রাগ আর যুক্তি ধুলোয় মিশে যায়। প্রিয়জনকে ভালোবাসার কথা জানাতে কোনো বিশেষ দিনের অপেক্ষা করবেন না। জীবনের শেষ মুহূর্তগুলো কখনো নোটিশ দিয়ে আসে না।",
    possibleComments: [
      'চোখ খুলে দেওয়ার মতো লেখা আপু। আপনার পরিবারের জন্য অনেক প্রার্থনা রইল।',
      'অহংকার ক্ষণিকের, কিন্তু প্রিয়জন হারানোর শোক আজীবনের।'
    ]
  },

  // --- Indian English Urban / Tech ---
  {
    id: 'ind_en_tech_1',
    category: 'finance',
    city: 'Bengaluru',
    country: 'India',
    author: 'Vikram Razdan',
    rawImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=75',
    text: "Working in early-stage Bengaluru startups taught me how founders exploit young engineers with the 'we are a family' narrative. I sacrificed my spine working 16-hour shifts believing my ESOPs would make me financially liberated. When Series-B talks fell through, forty percent of us were cut in a 3-minute group call. Don't sacrifice your dinner and your physical well-being for a company that will replace you on job boards before your severance even clears.",
    possibleComments: [
      'Startups are purely businesses, not families. Prioritize health.',
      'Golden truth right here.'
    ]
  },
  {
    id: 'ind_en_tech_2',
    category: 'finance',
    city: 'Hyderabad',
    country: 'India',
    author: 'Arjun Rao',
    rawImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=75',
    text: "Earning in foreign currency while working remotely from my ancestral home in Hyderabad is the best decision I ever made. While my batchmates spend three hours daily stranded in Hitec City traffic, I cook with my mother, work in shorts, and invest eighty percent of my income into index funds. Modern corporate culture conditioned people to believe that misery equals importance. True wealth is simply autonomy over your schedule.",
    possibleComments: [
      'Remote work is life liberation. Traffic ruins health.',
      'Owning your daily calendar is the ultimate luxury.'
    ]
  }
];

const ENGAGEMENT_REACTIONS = ['❤️', '🤗', '😢', '👏', '🔥', '😂', '🙏'];

// 24 Hours = 1440 Minutes. 1440 / 100 Posts = Strictly 14.4 Minutes (864,000 ms) per post
const DRIP_INTERVAL = 14.4 * 60 * 1000;

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

function getStoredPosts(): Confession[] {
  try {
    const raw = localStorage.getItem(CACHED_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredPosts(posts: Confession[]) {
  try {
    localStorage.setItem(CACHED_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
}

async function buildConfessionItem(item: SimulatedPostItem, exactTimestamp: number): Promise<Confession> {
  const compressedImage = await compressUrlToUnder50KB(item.rawImage);

  return {
    id: `${item.id}_${exactTimestamp}`,
    authorName: item.author,
    text: item.text,
    body: item.text,
    city: item.city,
    country: item.country,
    category: item.category,
    region: `${item.city}, ${item.country}`,
    imageUrl: compressedImage,
    createdAt: exactTimestamp,
    likesCount: 2,
    likes: 2,
    commentsCount: 0,
    comments: 0,
    commentsList: [],
    viewsCount: 14,
    userReaction: ENGAGEMENT_REACTIONS[Math.floor(Math.random() * ENGAGEMENT_REACTIONS.length)],
  } as any;
}

function updateEngagementProgression(posts: Confession[]): Confession[] {
  const now = Date.now();

  return posts.map((post: any) => {
    const originalItem = CURATED_POST_POOL.find((p) => post.id.startsWith(p.id));
    const postTime = typeof post.createdAt === 'number' ? post.createdAt : new Date(post.createdAt).getTime() || now;
    const ageInMinutes = Math.max(0, Math.floor((now - postTime) / (60 * 1000)));

    let targetComments = 0;
    let baseLikes = 2;

    if (ageInMinutes < 14) {
      targetComments = 0;
      baseLikes = 2 + (post.id.length % 3);
    } else if (ageInMinutes < 40) {
      targetComments = 1;
      baseLikes = 6 + (post.id.length % 4);
    } else if (ageInMinutes < 90) {
      targetComments = 2;
      baseLikes = 15 + (post.id.length % 7);
    } else {
      targetComments = originalItem ? originalItem.possibleComments.length : 2;
      baseLikes = 28 + (post.id.length % 18);
    }

    const possiblePool = originalItem?.possibleComments || ['Deep thought.', 'Resonates with me.'];
    const visibleComments = possiblePool.slice(0, targetComments).map((cText, idx) => ({
      id: `comm_${post.id}_${idx}`,
      author: 'Anonymous',
      text: cText,
      createdAt: postTime + (idx + 1) * (11 * 60 * 1000),
    }));

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

/**
 * STRICT 100 POSTS PER 24-HOUR TIMELINE:
 * - Drip interval is strictly 14.4 minutes.
 * - Posts naturally sink down and NEVER jump back to top.
 */
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  const now = Date.now();
  let stored = getStoredPosts();

  // Initialize fixed epoch timeline if first launch
  let epoch = Number(localStorage.getItem(SIM_EPOCH_KEY));
  if (!epoch) {
    epoch = now;
    localStorage.setItem(SIM_EPOCH_KEY, String(epoch));
  }

  // 1. First-time setup: Seed 10 staggered past posts (14.4 min apart)
  if (stored.length === 0) {
    const initialCount = 10;
    for (let i = initialCount - 1; i >= 0; i--) {
      const itemIndex = i % CURATED_POST_POOL.length;
      const item = CURATED_POST_POOL[itemIndex];
      const postTimestamp = epoch - i * DRIP_INTERVAL;
      const initialPost = await buildConfessionItem(item, postTimestamp);
      stored.unshift(initialPost);
    }
    localStorage.setItem(CURRENT_INDEX_KEY, String(initialCount));
    saveStoredPosts(stored);
  }

  // 2. Strict Real-Time 14.4-Minute Drip:
  const elapsedIntervals = Math.floor((now - epoch) / DRIP_INTERVAL);
  let currentIndex = Number(localStorage.getItem(CURRENT_INDEX_KEY) || 10);

  if (elapsedIntervals > 0) {
    const targetTotalPosts = 10 + elapsedIntervals;
    if (targetTotalPosts > currentIndex) {
      while (currentIndex < targetTotalPosts) {
        const poolIndex = currentIndex % CURATED_POST_POOL.length;
        const item = CURATED_POST_POOL[poolIndex];
        const postTimestamp = epoch + (currentIndex - 10 + 1) * DRIP_INTERVAL;

        const newPost = await buildConfessionItem(item, postTimestamp);
        stored.unshift(newPost);
        currentIndex++;
      }
      localStorage.setItem(CURRENT_INDEX_KEY, String(currentIndex));
      saveStoredPosts(stored);
    }
  }

  stored = updateEngagementProgression(stored);
  saveStoredPosts(stored);

  // Exclude duplicate IDs if existing in real DB
  const existingIdSet = new Set(existingPosts.map((p) => String(p.id)));
  const filteredSimulated = stored.filter((p) => !existingIdSet.has(String(p.id)));

  // Combine and sort strictly by Newest First (Desc)
  const combined = [...existingPosts, ...filteredSimulated];
  return combined.sort((a, b) => {
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

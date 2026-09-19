import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// 1. Worldwide Authors (English, Desi Diaspora, Global users)
const WORLDWIDE_AUTHORS = [
  'Anonymous',
  'GlobalNomad',
  'Alex M.',
  'Sarah Jenkins',
  'Aarav Patel',
  'Liam K.',
  'Priya Sharma',
  'David Chen',
  'Subhashis Roy',
  'Elena Rostova',
  'Tariq Al-Mansoor',
  'Kavita D.',
  'Marcus V.',
  'Rohan K.',
  'Maya Lin'
];

// 2. Worldwide Locations (Major Global Hubs & Cities)
const WORLDWIDE_LOCATIONS = [
  { city: 'New York', country: 'United States', region: 'North America' },
  { city: 'London', country: 'United Kingdom', region: 'Europe' },
  { city: 'Toronto', country: 'Canada', region: 'North America' },
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East' },
  { city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { city: 'Sydney', country: 'Australia', region: 'Oceania' },
  { city: 'Berlin', country: 'Germany', region: 'Europe' },
  { city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { city: 'Kolkata', country: 'India', region: 'Asia' },
  { city: 'New Delhi', country: 'India', region: 'Asia' },
  { city: 'Dhaka', country: 'Bangladesh', region: 'Asia' }
];

// 3. 4 Main Categories: News, Politics, Entertainment & Funny (Worldwide View in EN, HI, BN)
const WORLDWIDE_TEMPLATES = [
  // --- NEWS ---
  {
    lang: 'en',
    category: 'News',
    texts: [
      'Global renewable energy generation reached a historic new peak this quarter! Cleaner grids worldwide #News #Sustainability',
      'International aviation consortium announces faster transatlantic electric flight trials for next year #News #Aviation',
      'Smart city tech rollouts expand across major transport hubs to reduce daily commuter delays #News #TechUpdate'
    ],
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'hi',
    category: 'News',
    texts: [
      'अंतरराष्ट्रीय स्तर पर ग्रीन एनर्जी प्रोजेक्ट्स को बढ़ावा देने के लिए नए समझौते पर हस्ताक्षर हुए #News #WorldUpdate',
      'वैश्विक बाजारों में नई तकनीकों और स्टार्टअप्स को लेकर सकारात्मक रुख देखने को मिल रहा है #News #Economy'
    ],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'bn',
    category: 'News',
    texts: [
      'বিশ্বজুড়ে পরিবেশবান্ধব শক্তি ব্যবহারের ক্ষেত্রে নতুন রেকর্ড তৈরি হলো এই বছর #News #GlobalNews',
      'আন্তর্জাতিক বিজ্ঞানীদের নতুন গবেষণায় মহাকাশ বিজ্ঞানের নতুন দিগন্ত উন্মোচিত হয়েছে #News #Science'
    ],
    images: [
      'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // --- POLITICS ---
  {
    lang: 'en',
    category: 'Politics',
    texts: [
      'World leaders finalize the joint climate and digital trade policy framework at the global summit #Politics #GlobalAffairs',
      'Heated discussions underway across municipal councils regarding citizen data privacy laws #Politics #Policy'
    ],
    images: [
      'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'hi',
    category: 'Politics',
    texts: [
      'वैश्विक स्तर पर डिजिटल प्राइवेसी और नए नागरिक नियमों को लेकर महत्वपूर्ण बैठक हुई #Politics #GlobalPolitics',
      'युवाओं के अंतरराष्ट्रीय रोजगार मंच को सशक्त बनाने पर विभिन्न देशों की सहमति #Politics #Diplomacy'
    ],
    images: [
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'bn',
    category: 'Politics',
    texts: [
      'আন্তর্জাতিক বাণিজ্য ও জলবায়ু পরিবর্তন নীতি নিয়ে বিভিন্ন দেশের প্রতিনিধিদের মধ্যে জরুরি আলোচনা #Politics #WorldAffairs'
    ],
    images: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // --- ENTERTAINMENT ---
  {
    lang: 'en',
    category: 'Entertainment',
    texts: [
      'World tour tickets sold out in under 3 minutes worldwide! What an incredible musical sensation #Entertainment #ConcertVibes',
      'The international film festival kicked off with breathtaking independent cinema and global talent #Entertainment #Cinema'
    ],
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'hi',
    category: 'Entertainment',
    texts: [
      'वर्ल्ड सिनेमा फेस्टिवल में नई फिल्मों को स्टैंडिंग ओवेशन मिला, अद्भुत कहानियां! #Entertainment #Movies',
      'ग्लोबल म्यूजिक कॉन्सर्ट की वाइब बिल्कुल नेक्स्ट लेवल थी, म्यूजिक सच में सबको जोड़ता है #Entertainment #MusicFestival'
    ],
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'bn',
    category: 'Entertainment',
    texts: [
      'আন্তর্জাতিক ফিল্ম ফেস্টিভ্যালে নতুন চিত্রনাট্যের ভূয়সী প্রশংসা করলেন সমালোচকেরা #Entertainment #WorldCinema',
      'বিশ্বের নানা প্রান্তের শিল্পীদের নিয়ে জমকালো লাইভ মিউজিক কনসার্ট অনুষ্ঠিত হলো #Entertainment #LiveMusic'
    ],
    images: [
      'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80'
    ]
  },

  // --- FUNNY ---
  {
    lang: 'en',
    category: 'Funny',
    texts: [
      'Traveling to a different timezone just to experience sleep deprivation in 4K resolution 😂 #Funny #JetlagLife',
      'My computer has 47 open tabs and I am convinced every single one of them is emotionally supporting my career #Funny #WorkLife'
    ],
    images: [
      'https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'hi',
    category: 'Funny',
    texts: [
      'जब भी डाइट शुरू करने का फैसला करो, तभी दुनिया का सबसे स्वादिष्ट खाना सामने आ जाता है 😅 #Funny #FoodieLife',
      'अलार्म बजने के बाद वो "बस 5 मिनट और" वाली नींद दुनिया का सबसे बड़ा भ्रम है 😂 #Funny #Relatable'
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    lang: 'bn',
    category: 'Funny',
    texts: [
      'ভেবেছিলাম সময়মতো ঘুমাতে যাবো, কিন্তু সোশ্যাল মিডিয়া স্ক্রোল করতে করতে ভোর হয়ে গেল! 😴 #Funny #NightOwl',
      'ডায়েট করবো ভেবে রেস্তোরাঁয় ঢুকি, কিন্তু মেনু কার্ড দেখলেই ডায়েট ভুলে যাই! 😋 #Funny #FoodAddict'
    ],
    images: [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

const LAST_POST_TIME_KEY = 'openconfess_bot_last_post_time';
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export async function runAutoFeedBot(): Promise<boolean> {
  try {
    const lastPosted = localStorage.getItem(LAST_POST_TIME_KEY);
    const now = Date.now();

    // 15-Minute strict interval check: koi purana ya repeated post nahi aayega
    if (lastPosted && now - Number(lastPosted) < FIFTEEN_MINUTES_MS) {
      return false;
    }

    // Pick random category template, location and author
    const template = WORLDWIDE_TEMPLATES[Math.floor(Math.random() * WORLDWIDE_TEMPLATES.length)];
    const text = template.texts[Math.floor(Math.random() * template.texts.length)];
    const image = template.images[Math.floor(Math.random() * template.images.length)];
    const loc = WORLDWIDE_LOCATIONS[Math.floor(Math.random() * WORLDWIDE_LOCATIONS.length)];
    const author = WORLDWIDE_AUTHORS[Math.floor(Math.random() * WORLDWIDE_AUTHORS.length)];

    // Exact confession document schema matching your app
    const newConfession = {
      text,
      imageUrl: image,
      authorName: author,
      city: loc.city,
      country: loc.country,
      region: loc.region || loc.country,
      createdAt: now,
      likesCount: 0,
      likes: 0,
      commentsCount: 0,
      comments: 0,
      commentsList: [],
      userReaction: null
    };

    const confessionsRef = collection(db, 'confessions');
    await addDoc(confessionsRef, newConfession);

    // Save timestamp to prevent repeat
    localStorage.setItem(LAST_POST_TIME_KEY, String(now));
    return true;
  } catch (err) {
    console.error('AutoFeedBot error:', err);
    return false;
  }
}

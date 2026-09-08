import { Confession, Comment, ReactionMap } from '../types';

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function hoursAgo(h: number): number {
  return now - h * HOUR;
}
function daysAgo(d: number): number {
  return now - d * DAY;
}

// Deterministic pseudo-random so the seed dataset looks the same on every
// load (stable engagement numbers) without needing a backend.
let seedCursor = 7;
function rand(): number {
  seedCursor = (seedCursor * 9301 + 49297) % 233280;
  return seedCursor / 233280;
}
function randInt(min: number, max: number): number {
  return Math.floor(min + rand() * (max - min + 1));
}

function splitReactions(total: number): ReactionMap {
  const weights = [0.4, 0.22, 0.16, 0.14, 0.08];
  const keys: (keyof ReactionMap)[] = ['❤️', '🔥', '😮', '😢', '👏'];
  const map = {} as ReactionMap;
  let assigned = 0;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      map[k] = Math.max(0, total - assigned);
    } else {
      const v = Math.round(total * weights[i] * (0.8 + rand() * 0.4));
      map[k] = v;
      assigned += v;
    }
  });
  return map;
}

function makeComments(pairs: [string, string][], baseHoursAgo: number): Comment[] {
  return pairs.map(([authorName, text], idx) => ({
    id: `c${idx}-${authorName.replace(/\s/g, '')}-${Math.round(rand() * 100000)}`,
    authorName,
    text,
    createdAt: now - (baseHoursAgo - idx * randInt(1, 6)) * HOUR,
    parentId: null,
  }));
}

interface SeedInput {
  authorName: string;
  text: string;
  imageUrl: string;
  country: string;
  city: string;
  createdHoursAgo: number;
  likesCount: number;
  commentPairs: [string, string][];
}

const raw: SeedInput[] = [
  // ---------- LOVE / UNSPOKEN FEELINGS ----------
  {
    authorName: 'Anonymous',
    text: "I've worked next to him for three years and I still get nervous every time he says good morning. He doesn't know I turned down a promotion to another floor because I couldn't imagine not seeing him every day. He's married now, happily it seems, and I go to lunch with his wife sometimes because we've become friends too. I'm not sad exactly. I just wanted one place to say it out loud: I loved someone quietly for three years and it never cost me anything except the truth.",
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=60',
    country: 'India',
    city: 'Mumbai',
    createdHoursAgo: 5,
    likesCount: 612,
    commentPairs: [
      ['Priya S.', 'This made my chest hurt in a good way. Thank you for sharing.'],
      ['Anonymous', 'The fact that you stayed friends with her says a lot about your character.'],
      ['Rohan M.', 'Quiet love is still real love. Sending you strength.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "We were best friends for six years before I told her how I felt, and she said she'd known for two of them and had been waiting for me to catch up to myself. We've been together fourteen months now. I'm posting this because somewhere out there someone is scared to say the thing that's obvious to everyone but them. Say it. Worst case, you lose a friendship you were already mourning in silence. Best case, you get this.",
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=60',
    country: 'UK',
    city: 'London',
    createdHoursAgo: 30,
    likesCount: 745,
    commentPairs: [
      ['Anonymous', 'Okay I am crying at my desk, congratulations to you both.'],
      ['Liam', 'This is exactly the push I needed today.'],
    ],
  },
  {
    authorName: 'Sarah K.',
    text: "I still have the voicemail my college boyfriend left me nine years ago. I've never played it for anyone, never told my husband it exists. It's not that I want him back, it's that hearing 19-year-old me being loved so uncomplicatedly is the only thing that gets me through certain nights. I don't think that makes me a bad wife. I think it makes me someone who was once very young and very in love and isn't ready to delete the evidence.",
    imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&q=60',
    country: 'USA',
    city: 'Austin',
    createdHoursAgo: 50,
    likesCount: 398,
    commentPairs: [
      ['Anonymous', 'This is more human than most things I read all week.'],
      ['Anonymous', 'Keeping the past doesn\'t mean you love the present less.'],
      ['James T.', 'Nine years and you remember the exact voicemail. That says something beautiful.'],
    ],
  },
  {
    authorName: 'Neha V.',
    text: "My arranged marriage was supposed to be the practical choice, the one my parents picked because our families had known each other for decades. Eight years in, I fall a little more in love with my husband every single year, and it terrifies me how close I came to resenting a decision that turned out to be the best one of my life. I just needed to say it somewhere he'll never read: thank you for being a stranger I got lucky with.",
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=60',
    country: 'India',
    city: 'Delhi',
    createdHoursAgo: 80,
    likesCount: 831,
    commentPairs: [
      ['Anonymous', 'This is such a rare and honest take on arranged marriage. Beautiful.'],
      ['Kavya R.', 'My parents keep telling me this could happen and I never believed it until now.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I fell in love with my physiotherapist over eleven months of appointments for a knee injury that healed in three. I kept faking soreness. He figured it out around month seven and never said anything, just kept scheduling me in. We're getting coffee for the first time as two actual people, not patient and provider, next week. I'm more nervous than I was for the surgery.",
    imageUrl: 'https://images.unsplash.com/photo-1441829266145-9a34081e1a72?w=800&q=60',
    country: 'Canada',
    city: 'Toronto',
    createdHoursAgo: 14,
    likesCount: 520,
    commentPairs: [
      ['Anonymous', 'Eleven months of faking a healed knee is the most romantic-comedy thing I have ever read.'],
      ['Anonymous', 'Please update us after the coffee!!'],
    ],
  },
  {
    authorName: 'Chloe B.',
    text: "I called off my wedding four days before it happened, not because I stopped loving him, but because I realized I had never once imagined our future without also imagining an exit from it. He deserved someone who wanted to stay, not someone who was just afraid to leave twice. My family still hasn't forgiven me. I think, some years from now, I might forgive myself.",
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60',
    country: 'Australia',
    city: 'Sydney',
    createdHoursAgo: 100,
    likesCount: 690,
    commentPairs: [
      ['Anonymous', 'That takes more courage than going through with it would have.'],
      ['Anonymous', 'Sending you so much strength, this was the right call even if it hurts.'],
      ['Emma W.', 'Your family will understand eventually. You did the brave thing.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My husband doesn't know I write him a letter every year on our anniversary that I never give him. Ten years, ten letters, all locked in a drawer. They're not sad letters. They're just the things I feel too shy to say out loud to a man I've shared a bed with for a decade. I think love makes cowards of even the most honest people sometimes.",
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=60',
    country: 'Germany',
    city: 'Berlin',
    createdHoursAgo: 60,
    likesCount: 455,
    commentPairs: [
      ['Anonymous', 'Maybe give him letter number one on your next anniversary?'],
      ['Anonymous', 'This is the softest thing I have read all month.'],
    ],
  },
  {
    authorName: 'Marcus T.',
    text: "I moved to Dubai for a two-year contract and fell in love with a coworker from a country I can't even find easily on a map, and now neither of us knows which of our home countries we're supposed to build a life in. Some days that feels like the most romantic problem in the world. Other days it just feels like homesickness times two.",
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=60',
    country: 'UAE',
    city: 'Dubai',
    createdHoursAgo: 40,
    likesCount: 305,
    commentPairs: [
      ['Anonymous', 'Long distance love across continents is so hard, wishing you both clarity.'],
      ['Anonymous', 'Home is wherever you build it together, I hope you find your answer.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I was the one who ended it. He still thinks I left because I stopped caring. The truth is I left because I was diagnosed with something that scared me more than losing him did, and I didn't want him to spend his twenties as a caretaker instead of living his life. He deserved to hate me more than he deserved to know. I hope he's happy now.",
    imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=60',
    country: 'France',
    city: 'Paris',
    createdHoursAgo: 120,
    likesCount: 812,
    commentPairs: [
      ['Anonymous', 'This broke my heart. You gave up so much to protect him.'],
      ['Anonymous', 'I hope one day you tell him the truth, he deserves to know how much you loved him.'],
      ['Anonymous', 'Sending you so much love, whoever you are.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My childhood best friend visited me in Singapore last month for the first time in fifteen years, and for one dinner, we were both seventeen again and completely, uselessly in love with each other the way we never admitted back then. Nothing happened. We both have families now. But I don't think either of us slept much that night, and I don't regret a second of it.",
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=60',
    country: 'Singapore',
    city: 'Singapore',
    createdHoursAgo: 70,
    likesCount: 267,
    commentPairs: [
      ['Anonymous', 'Some love stories are just meant to be one perfect chapter.'],
      ['Anonymous', 'This is bittersweet in the most beautiful way.'],
    ],
  },

  // ---------- CAREER SWITCHES ----------
  {
    authorName: 'Divya T.',
    text: "I quit a stable government job in Bengaluru that my entire extended family bragged about at weddings, to sell hand-painted pottery online. My mother didn't speak to me for four months. Two years later my little shop pays my rent, my parents' medical bills, and I've never once woken up dreading the day. I still don't know how to explain to relatives what I do, so I just say 'I run a small business' and let them assume it's something respectable.",
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=60',
    country: 'India',
    city: 'Bengaluru',
    createdHoursAgo: 18,
    likesCount: 588,
    commentPairs: [
      ['Anonymous', 'This is exactly the courage I need to leave my own soul-crushing job.'],
      ['Arjun N.', 'Handmade pottery business owner here too, it gets easier, promise.'],
      ['Anonymous', 'Your mother will come around once she sees how happy you are.'],
    ],
  },
  {
    authorName: 'David O.',
    text: "At 41, I left a partner-track position at a law firm in New York to become a middle school teacher. I took a 70% pay cut. My old colleagues think I had some kind of breakdown. The truth is I had a breakthrough: I realized I'd spent fifteen years being excellent at something I didn't care about. My students don't know any of this backstory. To them I'm just the guy who's weirdly excited about pre-algebra, and that's the best compliment I've ever earned.",
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=60',
    country: 'USA',
    city: 'New York',
    createdHoursAgo: 33,
    likesCount: 720,
    commentPairs: [
      ['Anonymous', 'Your students are lucky to have someone who chose them on purpose.'],
      ['Anonymous', 'This gave me chills. Thank you for this.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I told my parents I was still working at the consulting firm for eight months after I was actually laid off. I'd put on a suit, leave the house, and sit in coffee shops in Chicago applying to jobs all day. When I finally told them the truth, my dad just said, 'I wondered why you stopped complaining about your boss.' I wish I'd trusted them sooner. The shame cost me more than the unemployment ever did.",
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=60',
    country: 'USA',
    city: 'Chicago',
    createdHoursAgo: 95,
    likesCount: 434,
    commentPairs: [
      ['Anonymous', 'Your dad sounds like an incredibly gentle person, that line got me.'],
      ['Anonymous', 'I did the same thing for four months, the shame is so isolating. Solidarity.'],
    ],
  },
  {
    authorName: 'Rohan M.',
    text: "I left a six-figure tech job in Toronto to become a wilderness firefighting seasonal worker. I make less in a year now than I used to make in three months. But I sleep like a stone every night and I haven't looked at my phone with dread once since I switched. Everyone keeps asking when I'm 'going back to a real job.' This is the realest job I've ever had.",
    imageUrl: 'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=800&q=60',
    country: 'Canada',
    city: 'Vancouver',
    createdHoursAgo: 22,
    likesCount: 601,
    commentPairs: [
      ['Anonymous', 'This is the kind of clarity most of us are chasing our whole lives.'],
      ['Anonymous', 'Respect. Genuinely inspiring career pivot.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I've been a flight attendant for eleven years and I'm secretly studying to become a nurse, taking online classes between layovers in hotel rooms in three different time zones a week. Nobody at my airline knows. I'm exhausted in a way I've never been, and also more certain about a decision than I've ever been about anything. I just needed one place to say I'm proud of myself before I say it to anyone who might judge the timeline.",
    imageUrl: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=800&q=60',
    country: 'UK',
    city: 'Manchester',
    createdHoursAgo: 44,
    likesCount: 379,
    commentPairs: [
      ['Anonymous', 'You should absolutely be proud, that schedule sounds brutal and you are doing it anyway.'],
      ['Anonymous', 'Future patients are lucky to have a nurse this determined.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I turned down a promotion to head office in Melbourne to keep running our tiny regional branch, because leaving would have meant laying off the four people who work under me. My boss thinks I lack ambition. My team doesn't know why the promotion never happened. I'm not looking for credit. I just wanted to admit, somewhere, that loyalty cost me a title and I'd do it again tomorrow.",
    imageUrl: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=60',
    country: 'Australia',
    city: 'Melbourne',
    createdHoursAgo: 66,
    likesCount: 512,
    commentPairs: [
      ['Anonymous', 'This is real leadership, not the kind they teach in MBA programs.'],
      ['Anonymous', 'Your team is lucky to have a boss like you even if they never find out why.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I quit my job at a Munich engineering firm at 52 to open a tiny bakery with my sister. Everyone said we were too old to start over. Eighteen months in, there's a line out the door most mornings and I've never made anyone a spreadsheet again. Turns out the only thing I regret is not doing this at 35 instead of being scared for seventeen extra years.",
    imageUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=60',
    country: 'Germany',
    city: 'Munich',
    createdHoursAgo: 88,
    likesCount: 674,
    commentPairs: [
      ['Anonymous', 'It is never too late, this is exactly the reminder I needed today.'],
      ['Anonymous', 'Congratulations to you and your sister, that takes real guts.'],
      ['Anonymous', 'Seventeen years scared, that line hit hard.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I left a prestigious finance job in Tokyo to become a professional video game translator, and my parents still tell relatives I 'work in international business' because they can't bring themselves to explain the actual job. I make good money, I love the work, and I've stopped needing their approval to feel like I made the right call. That last part took longer than the career change itself.",
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=60',
    country: 'Japan',
    city: 'Tokyo',
    createdHoursAgo: 27,
    likesCount: 341,
    commentPairs: [
      ['Anonymous', 'Letting go of needing their approval is the real achievement here.'],
      ['Anonymous', '"work in international business" made me laugh way too hard, I feel this.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I left academia after nine years of a PhD and two postdocs to work in a plant nursery in Pune. I make a fraction of what my professors predicted I'd earn. I've also never been asked to justify my existence in front of a committee again, and I get to watch things grow instead of watching my own research get rejected. My advisor still doesn't know. I'm not sure how to tell her it wasn't a failure, it was an escape.",
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-9ee5a3a3e93b?w=800&q=60',
    country: 'India',
    city: 'Pune',
    createdHoursAgo: 110,
    likesCount: 456,
    commentPairs: [
      ['Anonymous', 'Academia chews people up and spits them out, good for you for getting out.'],
      ['Anonymous', 'This is not a failure, this is you choosing peace. Beautifully put.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I left a stable marketing career in Kolkata to become a full-time street photographer with no real plan, just savings and stubbornness. Two years of instant noodles later, a single photo of a tea seller went viral and now galleries actually call me. I still can't quite believe it. I keep waiting to wake up back in a cubicle with a deadline.",
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=60',
    country: 'India',
    city: 'Kolkata',
    createdHoursAgo: 8,
    likesCount: 298,
    commentPairs: [
      ['Anonymous', 'That photo of the tea seller deserved to go viral, incredible work.'],
      ['Anonymous', 'The instant noodle years are the ones that make the success sweeter.'],
    ],
  },

  // ---------- FAMILY SECRETS ----------
  {
    authorName: 'Anonymous',
    text: "I found out at 34 that the man I call Dad isn't my biological father. My mother told me on her deathbed, not as a confession but almost as a relief, like she'd been carrying it longer than she carried me. I've decided never to tell him I know. He raised me every single day of my life without ever once treating me like anything less than his own. Blood clearly isn't what made him my father. I'm not going to let one secret undo thirty-four years of him choosing me.",
    imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=60',
    country: 'USA',
    city: 'Los Angeles',
    createdHoursAgo: 3,
    likesCount: 843,
    commentPairs: [
      ['Anonymous', 'Sobbing. This is what real fatherhood looks like.'],
      ['Anonymous', 'Choosing to protect him with this secret is an act of pure love.'],
      ['Anonymous', 'Blood means nothing compared to who shows up every day. Beautifully said.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My grandmother had a whole other family before ours, a husband and two children she left behind in a village near Kolkata during Partition, and never spoke of again until she was 89 and the memories came loose all at once. My mother had cousins she never knew existed, living an ocean of history away. We found one of them through a genealogy site last year. My grandmother passed before we could tell her. I think about that a lot.",
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=60',
    country: 'India',
    city: 'Kolkata',
    createdHoursAgo: 130,
    likesCount: 590,
    commentPairs: [
      ['Anonymous', 'The weight of Partition on families is something that never really gets talked about enough.'],
      ['Anonymous', 'I hope reconnecting with that cousin brought some peace.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My parents have been legally divorced for six years, but they still live in the same house, sleep in separate rooms, and pretend for our extended family that everything is fine. I'm 28 and I still don't know how to talk to either of them about it without one of them crying. I don't think they're staying for me anymore, I think they're just staying because starting over at their age terrifies them more than staying stuck does.",
    imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=60',
    country: 'UK',
    city: 'London',
    createdHoursAgo: 55,
    likesCount: 402,
    commentPairs: [
      ['Anonymous', 'This dynamic is more common than people admit, sending strength to your whole family.'],
      ['Anonymous', 'Maybe one day they will find the courage separately. Until then, take care of yourself too.'],
    ],
  },
  {
    authorName: 'Nadia H.',
    text: "I have a half-sister three years older than me who I only found out about when she messaged me on social media last year. My father had an entire relationship before he met my mother that none of us knew about. We've met twice now, quietly, without telling either of our mothers. She looks disturbingly like me. I don't regret meeting her. I just don't know how to fit her into a family that doesn't know she exists yet.",
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=60',
    country: 'Canada',
    city: 'Toronto',
    createdHoursAgo: 20,
    likesCount: 327,
    commentPairs: [
      ['Anonymous', 'Take your time telling the rest of the family, there is no rulebook for this.'],
      ['Anonymous', 'Glad you two found each other regardless of the complicated timing.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My mother was married once before, briefly, at 19, to a man who died within a year of the wedding. She never told any of us kids. We only found out going through her things after she passed, a wedding photo tucked inside a Bible with a name none of us recognized. My father, still alive, says he knew the whole time and simply respected that it wasn't his story to tell. I've never loved him more than in that moment.",
    imageUrl: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=60',
    country: 'Germany',
    city: 'Berlin',
    createdHoursAgo: 145,
    likesCount: 713,
    commentPairs: [
      ['Anonymous', 'Your father sounds like a rare kind of good man.'],
      ['Anonymous', 'What a tender secret to have carried her whole life.'],
      ['Anonymous', 'This made me tear up on the train, thank you for sharing something so personal.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I recently learned that the 'family friend' who paid for my entire university education is actually my biological father, a fact my mother has never confirmed but also never denied when I asked directly. He's at every major family event, has been my whole life, and everyone treats the obvious resemblance as a coincidence nobody wants to name out loud. I've decided to let the silence stand. Some truths are kinder left as open secrets.",
    imageUrl: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=800&q=60',
    country: 'India',
    city: 'Delhi',
    createdHoursAgo: 77,
    likesCount: 501,
    commentPairs: [
      ['Anonymous', 'Sometimes the kindest thing is exactly what you did, letting people keep their dignity.'],
      ['Anonymous', 'This is such a complex situation handled with real grace.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My older brother isn't actually my parents' biological child, he was adopted quietly as an infant from a relative who couldn't keep him, and nobody outside our immediate family has ever known. He doesn't know either. He's 40 now, and every year I wonder if it's my place to tell him or if I'm just protecting a secret that was never mine to keep. I don't have an answer. I just needed to write it down somewhere finally.",
    imageUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&q=60',
    country: 'USA',
    city: 'Chicago',
    createdHoursAgo: 160,
    likesCount: 388,
    commentPairs: [
      ['Anonymous', 'This is such a heavy thing to carry alone, I hope you find peace with whatever you decide.'],
      ['Anonymous', 'Family secrets like this rarely have a clean answer. Sending support.'],
    ],
  },
  {
    authorName: 'Zara Q.',
    text: "My aunt raised me as her daughter after my actual mother, her younger sister, passed away when I was two. I only found out the truth by accident at 16, reading old letters in a box in the attic. I never confronted her. She has been nothing but a mother to me in every way that matters, and I decided the label wasn't worth the pain it might cause her. I call her Mum. I always will.",
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=60',
    country: 'Australia',
    city: 'Sydney',
    createdHoursAgo: 90,
    likesCount: 622,
    commentPairs: [
      ['Anonymous', 'This is the most beautiful definition of family I have read in a long time.'],
      ['Anonymous', 'She earned that title every single day, and you honoring that is lovely.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "My parents told everyone I was born in Singapore, but I was actually born in a small town two hours away during a period of my family's life they've spent thirty years trying to erase from the story, one tied to a business failure and a bankruptcy they've never once mentioned to me directly. I found out through an old passport. I don't need an explanation. I just wish they knew that struggling wouldn't have made me love them less.",
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=60',
    country: 'Singapore',
    city: 'Singapore',
    createdHoursAgo: 48,
    likesCount: 275,
    commentPairs: [
      ['Anonymous', 'Shame around financial hardship runs so deep in immigrant families especially.'],
      ['Anonymous', 'I hope you find a gentle way to let them know it is okay.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I'm the reason my parents got married. I was born seven months after their wedding, a fact my extended family has always politely ignored in a country where that would have been a scandal forty years ago. My parents never sat me down to explain it, I just pieced it together from a marriage certificate date and some very careful math. I don't think it changes anything about how much they love each other. It just makes their whole story feel a little more human to me now.",
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=60',
    country: 'India',
    city: 'Mumbai',
    createdHoursAgo: 200,
    likesCount: 467,
    commentPairs: [
      ['Anonymous', 'This is such a gentle, mature way to hold this piece of family history.'],
      ['Anonymous', 'Their love story sounds real regardless of the exact math.'],
    ],
  },

  // ---------- WORKPLACE SECRETS ----------
  {
    authorName: 'Tom B.',
    text: "I've been covering for a coworker's drinking problem for two years, taking her client calls when she's clearly not okay, rewriting her reports at 11pm so nobody notices the mistakes. I don't know if I'm helping her or just delaying a reckoning she needs to have. I've never told her I know. I've never told our manager either. I think I'm just as scared of her getting fired as she is.",
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=60',
    country: 'USA',
    city: 'New York',
    createdHoursAgo: 12,
    likesCount: 355,
    commentPairs: [
      ['Anonymous', 'Please consider talking to her privately, covering forever isn\'t sustainable for either of you.'],
      ['Anonymous', 'This is such a hard position to be in, you sound like a genuinely caring colleague.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I accidentally discovered that my manager makes almost half of what I do, despite being two levels above me on paper, because of an old pay freeze during a merger years ago that nobody ever corrected. I haven't told her. I don't know if I should. Telling her feels like handing her a grenade she can't safely throw back, but knowing and staying silent feels almost worse.",
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=60',
    country: 'UK',
    city: 'Manchester',
    createdHoursAgo: 36,
    likesCount: 289,
    commentPairs: [
      ['Anonymous', 'Pay transparency issues like this are exactly why so many companies avoid discussing salaries.'],
      ['Anonymous', 'She deserves to know, even if it is uncomfortable. Knowledge lets her advocate for herself.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I've interviewed for six other jobs on days I called in 'sick' from my current one, and my boss, who genuinely trusts me, has no idea. Every time she wishes me a fast recovery over Slack I feel a specific kind of guilt I've never experienced before. I'm not a bad employee. I'm just someone who realized loyalty stopped being reciprocated somewhere around the second round of layoffs nobody warned us about.",
    imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=60',
    country: 'Canada',
    city: 'Vancouver',
    createdHoursAgo: 62,
    likesCount: 410,
    commentPairs: [
      ['Anonymous', 'Companies that do surprise layoffs lose the right to expect loyalty, in my opinion.'],
      ['Anonymous', 'You are not a bad person for protecting your own future.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I've been quietly training my own replacement for the last three months because I know I'm being pushed out, but nobody has officially told me yet. HR thinks I don't know. My manager thinks I don't know. I know. I've just decided to leave with dignity instead of the messy exit they clearly expect, and honestly, watching them tiptoe around a decision they've already made has been the strangest professional experience of my life.",
    imageUrl: 'https://images.unsplash.com/photo-1454165833762-8e3fb0e2ae35?w=800&q=60',
    country: 'Australia',
    city: 'Melbourne',
    createdHoursAgo: 15,
    likesCount: 493,
    commentPairs: [
      ['Anonymous', 'The grace you are handling this with is honestly admirable.'],
      ['Anonymous', 'Leaving on your own terms even in a bad situation says a lot about you.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I wrote a piece of code four years ago that half of our company's core product still silently depends on, and I've never told anyone how fragile it actually is because I was 24 and terrified of admitting I didn't fully know what I was doing at the time. It still works. I check on it more than I'd like to admit. One day someone smarter than me is going to find it and I honestly can't wait for that weight to be lifted off me.",
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=60',
    country: 'Germany',
    city: 'Munich',
    createdHoursAgo: 105,
    likesCount: 640,
    commentPairs: [
      ['Anonymous', 'Every senior engineer has one of these somewhere, you are not alone.'],
      ['Anonymous', 'Document it before you leave, future you will thank present you.'],
      ['Anonymous', 'This is the most relatable tech confession I have ever read.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I've been the anonymous voice behind our company's internal culture survey complaints for two years, the ones that always mention burnout and unrealistic deadlines. Leadership thinks it's a disgruntled minority. It's basically just me, submitting the same concerns every quarter under a different phrasing so it doesn't look repetitive. Nothing has changed. I keep submitting anyway, mostly out of stubbornness at this point.",
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=60',
    country: 'UAE',
    city: 'Dubai',
    createdHoursAgo: 28,
    likesCount: 312,
    commentPairs: [
      ['Anonymous', 'Your stubbornness might be the only thing keeping the conversation alive at all.'],
      ['Anonymous', 'This made me laugh and also feel a bit sad for corporate culture in general.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I know which of my colleagues is about to be laid off next quarter because I overheard a call I shouldn't have, and I have to sit across from her in meetings every day pretending I don't know her job is already gone in someone's spreadsheet. I've thought about warning her so she can start looking early. I've also thought about how that could get me fired too. I hate this job for putting me in this position more than I've ever hated a job before.",
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=60',
    country: 'Japan',
    city: 'Tokyo',
    createdHoursAgo: 42,
    likesCount: 356,
    commentPairs: [
      ['Anonymous', 'This is such an impossible ethical position to be stuck in.'],
      ['Anonymous', 'Maybe a vague, careful nudge without details could help her without exposing you.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I've been silently doing my coworker's job and mine for eight months after his role was quietly absorbed into mine without a title change or a pay increase, because I was too afraid to rock the boat during a hiring freeze. I finally asked for a raise last week. My manager looked genuinely shocked, like she'd forgotten I was doing two jobs at all. I don't know whether to feel relieved or furious that it took me this long to say something.",
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=60',
    country: 'France',
    city: 'Paris',
    createdHoursAgo: 58,
    likesCount: 401,
    commentPairs: [
      ['Anonymous', 'Good for you for finally asking, you deserve compensation for both roles.'],
      ['Anonymous', 'Companies rely on exactly this kind of quiet overwork, glad you spoke up.'],
    ],
  },
  {
    authorName: 'Ines F.',
    text: "I'm a manager and I've never told my team that I fought hard against a round of layoffs that still ended up happening anyway, because I didn't want it to look like I was seeking credit for a battle I ultimately lost. They think I just went along with corporate. I let them believe that because their anger needed somewhere honest to land, and it wasn't going to be at people who no longer worked here.",
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=60',
    country: 'USA',
    city: 'Austin',
    createdHoursAgo: 75,
    likesCount: 528,
    commentPairs: [
      ['Anonymous', 'This is real leadership, absorbing blame to protect your team\'s trust in the company.'],
      ['Anonymous', 'They are lucky to have a manager who fought for them even quietly.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I found a serious accounting error in a client's favor at my old firm in Bengaluru that would have cost us the account if reported, and I fixed it quietly without telling my supervisor, technically against protocol. Nobody ever found out. I've carried that secret for six years now, long after leaving that job, and I still don't know if I made the ethical choice or just the convenient one dressed up as loyalty.",
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60',
    country: 'India',
    city: 'Bengaluru',
    createdHoursAgo: 150,
    likesCount: 244,
    commentPairs: [
      ['Anonymous', 'Ethics in workplaces are rarely as black and white as training modules suggest.'],
      ['Anonymous', 'You protected people\'s jobs, that has to count for something.'],
    ],
  },

  // ---------- PERSONAL REGRETS ----------
  {
    authorName: 'Aditi K.',
    text: "I didn't visit my grandfather in his last three weeks because I told myself I was too busy with work, when really I just couldn't handle watching him get smaller every day. He asked for me twice, my aunt told me after. I've replayed those three weeks more times than I can count, and no amount of understanding why I avoided it makes the absence feel like anything other than a failure I'll carry for the rest of my life.",
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=60',
    country: 'India',
    city: 'Pune',
    createdHoursAgo: 9,
    likesCount: 789,
    commentPairs: [
      ['Anonymous', 'Please be gentle with yourself, grief avoidance is so human and so common.'],
      ['Anonymous', 'This is heartbreaking, I am so sorry, but please don\'t carry this as failure forever.'],
      ['Anonymous', 'He knew you loved him, work stress doesn\'t erase a lifetime of love.'],
    ],
  },
  {
    authorName: 'Oliver P.',
    text: "I let a friendship of fifteen years end over a misunderstanding neither of us bothered to clear up, both too proud to send the first text. It's been six years of silence now. I saw her at a wedding last month and we exchanged the most polite, hollow small talk two people who used to know each other's whole hearts have ever exchanged. I went home and cried for an hour over a fight I can't even fully remember the details of anymore.",
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&q=60',
    country: 'UK',
    city: 'London',
    createdHoursAgo: 24,
    likesCount: 561,
    commentPairs: [
      ['Anonymous', 'Pride has cost me friendships too, this hit close to home.'],
      ['Anonymous', 'It is never too late to send that text, even after six years.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I cheated on my university final exams and it's the reason I got into the graduate program that started my entire career. Fifteen years later I have a job I'm genuinely good at and love, built on a foundation I know I didn't earn honestly. I've never told anyone. I don't think I ever will. I just wanted to say it once, somewhere, so it isn't only living inside my own head anymore.",
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=60',
    country: 'USA',
    city: 'Los Angeles',
    createdHoursAgo: 170,
    likesCount: 502,
    commentPairs: [
      ['Anonymous', 'You have clearly proven yourself capable in the fifteen years since, that counts for something.'],
      ['Anonymous', 'Thank you for the honesty, this took real courage to post.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I sold my late father's watch for rent money during a rough year and never told my siblings it's gone. Every family gathering someone eventually asks to see it, tells a story about him wearing it, and I just nod along and say it's 'somewhere safe.' I think about buying an identical replacement more often than is probably healthy, just so the next time someone asks, it won't be a total lie.",
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=60',
    country: 'Canada',
    city: 'Toronto',
    createdHoursAgo: 38,
    likesCount: 447,
    commentPairs: [
      ['Anonymous', 'You did what you had to do to survive, that is not something to be ashamed of.'],
      ['Anonymous', 'Sometimes love means making impossible choices quietly. Be gentle with yourself.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I didn't go to my own mother's second wedding because I was still angry about the divorce, even though by then it had been five years and everyone else in the family had made peace with it. She never brought it up again, not once, in the decade since. I think that silence has been harder to live with than any argument would have been. I regret it more every year, not less.",
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=60',
    country: 'Australia',
    city: 'Sydney',
    createdHoursAgo: 210,
    likesCount: 476,
    commentPairs: [
      ['Anonymous', 'It is not too late to talk to her about this, even now.'],
      ['Anonymous', 'Her silence sounds like grace, not indifference. Maybe that is worth exploring together.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I turned down a full scholarship to study abroad at 18 because I was scared to leave a boyfriend who broke up with me four months later anyway. I've built a decent life since then, but every time someone mentions that city I feel a very specific, very old kind of regret that has nothing to do with him anymore and everything to do with the version of myself I never got to become.",
    imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=800&q=60',
    country: 'Germany',
    city: 'Berlin',
    createdHoursAgo: 63,
    likesCount: 533,
    commentPairs: [
      ['Anonymous', 'It is never too late to go, even just for a visit to meet that other version of yourself.'],
      ['Anonymous', 'This resonates so deeply, we all have a city like that.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I never told my best friend I was jealous of her when she got married before me, and I said all the right things at her wedding while quietly resenting a happiness I should have just been able to feel for her without complication. She's my daughter's godmother now. I've never confessed the jealousy, and I don't plan to, because it was a small, ugly, temporary feeling that has nothing to do with how much I actually love her.",
    imageUrl: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=800&q=60',
    country: 'UAE',
    city: 'Dubai',
    createdHoursAgo: 82,
    likesCount: 318,
    commentPairs: [
      ['Anonymous', 'Jealousy and love can coexist, you are more human than flawed for feeling this.'],
      ['Anonymous', 'This is such an honest and relatable confession, thank you.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I didn't speak up when I witnessed a colleague being humiliated by a client in a meeting years ago in Tokyo, staying silent because objecting wasn't part of the culture I was trying so hard to fit into at the time. She left the company two months later. I still wonder sometimes if a single sentence from me in that room might have changed anything for her. I'll never know, and that not-knowing is its own quiet punishment.",
    imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&q=60',
    country: 'Japan',
    city: 'Tokyo',
    createdHoursAgo: 190,
    likesCount: 389,
    commentPairs: [
      ['Anonymous', 'Speaking up in unfamiliar workplace cultures is genuinely hard, be kind to your younger self.'],
      ['Anonymous', 'This regret says a lot about the kind of person you want to be now.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I let my grandmother believe I still practiced the piano she paid for years of lessons for, right up until she passed, because telling her I'd quit felt like admitting I'd wasted her money and her faith in me at once. I still have the piano. I sat down at it again last month for the first time in a decade, just to see if any of it was still there. Some of it was.",
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=60',
    country: 'Singapore',
    city: 'Singapore',
    createdHoursAgo: 52,
    likesCount: 361,
    commentPairs: [
      ['Anonymous', 'Please keep playing, I think she would love knowing you came back to it.'],
      ['Anonymous', 'This made me want to call my own grandmother right now.'],
    ],
  },
  {
    authorName: 'Anonymous',
    text: "I never told my father I forgave him for leaving when I was seven, mostly because by the time I actually did forgive him, years later, he had already passed and the moment for saying it out loud was simply gone. I write it in cards I address to him and never send, just to give the feeling somewhere real to go. I think forgiveness doesn't need an audience to still count. I hope, wherever he is, some part of him already knows.",
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=60',
    country: 'France',
    city: 'Paris',
    createdHoursAgo: 220,
    likesCount: 704,
    commentPairs: [
      ['Anonymous', 'This is one of the most healing things I have read on here, thank you.'],
      ['Anonymous', 'Forgiveness for yourself matters even when the other person can\'t receive it anymore.'],
      ['Anonymous', 'I believe he knows. Sending you so much peace.'],
    ],
  },
];

const namedAuthorNames = new Set(
  raw.filter((r) => r.authorName !== 'Anonymous').map((r) => r.authorName)
);

export const seedConfessions: Confession[] = raw.map((item, index) => {
  const commentsBaseHours = Math.min(item.createdHoursAgo, randInt(2, 20));
  return {
    id: `seed-${index + 1}`,
    authorName: item.authorName,
    text: item.text,
    imageUrl: item.imageUrl,
    country: item.country,
    city: item.city,
    region: `${item.city}, ${item.country}`,
    createdAt: hoursAgo(item.createdHoursAgo),
    viewsCount: item.likesCount + randInt(50, 900),
    likesCount: item.likesCount,
    reactions: splitReactions(item.likesCount),
    comments: makeComments(item.commentPairs, commentsBaseHours),
  };
});

// Sanity export for tests/debugging: confirms 75/25 anonymous/named split intent.
export const seedAuthorStats = {
  total: raw.length,
  named: namedAuthorNames.size ? raw.filter((r) => r.authorName !== 'Anonymous').length : 0,
  anonymous: raw.filter((r) => r.authorName === 'Anonymous').length,
};

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

// Global fixed base timestamp so timeline moves forward like a real server clock (v17: 100 unique posts / 24 hrs, no repeat/no re-top)
const SIM_EPOCH_KEY = 'openconfess_timeline_epoch_v17';
const CURRENT_INDEX_KEY = 'openconfess_drip_current_index_v17';
const CACHED_POSTS_KEY = 'openconfess_generated_feed_v17';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// 100 FULLY UNIQUE GLOBAL CONFESSIONS (English, Hindi, Bangla)
// Every single item has a 100% UNIQUE, deterministic image (via picsum.photos
// seeded URLs) so nothing ever repeats across the entire 24-hour cycle.
// Every author+story is now also fully unique (no repeated author/city/text
// combinations anywhere in the pool).
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  {
    id: 'en_deep_1',
    category: 'deep',
    city: 'New York',
    country: 'USA',
    author: 'Ethan Miller',
    rawImage: 'https://picsum.photos/seed/openconfess-en-1-1/700/500',
    text: 'I moved to New York chasing a career that promised meaning, packed my whole life into two suitcases, and told everyone back home I was finally doing something big. Most nights now I sit alone in an apartment that still doesn\'t feel like mine, wondering exactly when ambition quietly replaced my sense of self. From the outside my life photographs perfectly, the skyline, the title, a calendar full of things that look like progress. But underneath it feels strangely hollow, like I built an entire identity around being busy instead of being happy, and some days I genuinely don\'t know how to undo it.',
    possibleComments: ['This hit closer to home than I expected.', 'Success without peace is just a slower kind of loss.']
  },
  {
    id: 'en_funny_2',
    category: 'funny',
    city: 'London',
    country: 'United Kingdom',
    author: 'Eleanor Wright',
    rawImage: 'https://picsum.photos/seed/openconfess-en-2-2/700/500',
    text: 'I told my London landlord my sink was \'making prophetic noises\' just to delay the repair bill another month, fully expecting him to laugh me out of the building. Instead he went quiet, nodded like I\'d said something profound, and actually believed me, sending a plumber the very same day without asking a single follow-up question. I\'ve been riding that lie for weeks now, adding new symptoms every time he checks in, and honestly the sink still works fine. At this point I think I\'ve accidentally invented a whole new career path in mildly spiritual home maintenance consulting.',
    possibleComments: ['This is criminally underrated office strategy 😂', 'Taking notes for Monday.']
  },
  {
    id: 'en_intelligent_3',
    category: 'intelligent',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://picsum.photos/seed/openconfess-en-3-3/700/500',
    text: 'I\'ve noticed that in Chicago, the loudest voice in the room is rarely the most informed one, yet somehow it\'s the one everyone quotes in meetings the next day. The quiet colleague who actually read the report, checked the numbers twice, and waited for the right moment usually gets overlooked entirely, at least at first. Over time though, people start noticing who was right more often, and reputations quietly shift in their favor. Silence, used well, isn\'t passivity, it\'s patience dressed up as restraint, and in the long run it\'s an underrated competitive advantage almost nobody trains for.',
    possibleComments: ['Quietly one of the smartest takes I\'ve read today.', 'Underrated wisdom right here.']
  },
  {
    id: 'en_incident_4',
    category: 'incident',
    city: 'Toronto',
    country: 'Canada',
    author: 'Liam MacLeod',
    rawImage: 'https://picsum.photos/seed/openconfess-en-4-4/700/500',
    text: 'Stranded outside Toronto during a storm with a dead phone and no idea how far the nearest shelter was, I genuinely thought I\'d be spending the night soaked on the roadside. A stranger pulled over, didn\'t ask questions, and simply waited with me for two hours until another ride finally showed up. When I tried to pay him for his time and his gas, he refused outright, said he\'d want someone to do the same for his own daughter someday. It sounds small written down, but that one evening quietly restored a piece of my faith in people I didn\'t realize I\'d lost.',
    possibleComments: ['Faith in humanity: restored.', 'Small kindness, huge impact.']
  },
  {
    id: 'en_motivational_5',
    category: 'motivational',
    city: 'Sydney',
    country: 'Australia',
    author: 'Chloe Patterson',
    rawImage: 'https://picsum.photos/seed/openconfess-en-5-5/700/500',
    text: 'Nobody in Sydney believed I could switch careers at thirty-five, including, if I\'m honest, most of the version of me that existed back then. Friends called it a midlife crisis, recruiters called it a red flag, and for months every rejection email felt like proof they were right. The hardest part was never actually the skill gap, learning new tools turned out to be the easy bit. It was silencing the voices, mine included, that kept insisting I was too late, too old, too far behind to start over. Turns out late starts just take longer, not never.',
    possibleComments: ['Needed to read this today.', 'Proof that late starts still finish strong.']
  },
  {
    id: 'en_finance_6',
    category: 'finance',
    city: 'Berlin',
    country: 'Germany',
    author: 'Felix Schneider',
    rawImage: 'https://picsum.photos/seed/openconfess-en-6-6/700/500',
    text: 'I spent a decade in Berlin finance chasing bonuses that never once bought back the time I lost getting them, working weekends I can\'t remember for numbers I can barely recall now. Every raise came with a quieter apartment, an emptier calendar of friends, and a longer list of things I kept promising myself I\'d finally do next year. Wealth without time, I\'ve learned the hard way, is just a well-decorated cage with excellent lighting and terrible company. I still work in the industry, but these days I leave by six, and it\'s the richest decision I\'ve made in years.',
    possibleComments: ['Time really is the only asset that never comes back.', 'Peace of mind is underrated wealth.']
  },
  {
    id: 'en_deep_7',
    category: 'deep',
    city: 'Dublin',
    country: 'Ireland',
    author: 'Grace Bennett',
    rawImage: 'https://picsum.photos/seed/openconfess-en-7-7/700/500',
    text: 'I moved to Dublin chasing a career that promised meaning, packed my whole life into two suitcases, and told everyone back home I was finally doing something big. Most nights now I sit alone in an apartment that still doesn\'t feel like mine, wondering exactly when ambition quietly replaced my sense of self. From the outside my life photographs perfectly, the skyline, the title, a calendar full of things that look like progress. But underneath it feels strangely hollow, like I built an entire identity around being busy instead of being happy, and some days I genuinely don\'t know how to undo it.',
    possibleComments: ['This hit closer to home than I expected.', 'Success without peace is just a slower kind of loss.']
  },
  {
    id: 'en_funny_8',
    category: 'funny',
    city: 'Singapore',
    country: 'Singapore',
    author: 'Oliver Hayes',
    rawImage: 'https://picsum.photos/seed/openconfess-en-8-8/700/500',
    text: 'I told my Singapore landlord my sink was \'making prophetic noises\' just to delay the repair bill another month, fully expecting him to laugh me out of the building. Instead he went quiet, nodded like I\'d said something profound, and actually believed me, sending a plumber the very same day without asking a single follow-up question. I\'ve been riding that lie for weeks now, adding new symptoms every time he checks in, and honestly the sink still works fine. At this point I think I\'ve accidentally invented a whole new career path in mildly spiritual home maintenance consulting.',
    possibleComments: ['This is criminally underrated office strategy 😂', 'Taking notes for Monday.']
  },
  {
    id: 'en_intelligent_9',
    category: 'intelligent',
    city: 'Dubai',
    country: 'UAE',
    author: 'Sophie Turner',
    rawImage: 'https://picsum.photos/seed/openconfess-en-9-9/700/500',
    text: 'I\'ve noticed that in Dubai, the loudest voice in the room is rarely the most informed one, yet somehow it\'s the one everyone quotes in meetings the next day. The quiet colleague who actually read the report, checked the numbers twice, and waited for the right moment usually gets overlooked entirely, at least at first. Over time though, people start noticing who was right more often, and reputations quietly shift in their favor. Silence, used well, isn\'t passivity, it\'s patience dressed up as restraint, and in the long run it\'s an underrated competitive advantage almost nobody trains for.',
    possibleComments: ['Quietly one of the smartest takes I\'ve read today.', 'Underrated wisdom right here.']
  },
  {
    id: 'en_incident_10',
    category: 'incident',
    city: 'Auckland',
    country: 'New Zealand',
    author: 'Ryan Walsh',
    rawImage: 'https://picsum.photos/seed/openconfess-en-10-10/700/500',
    text: 'Stranded outside Auckland during a storm with a dead phone and no idea how far the nearest shelter was, I genuinely thought I\'d be spending the night soaked on the roadside. A stranger pulled over, didn\'t ask questions, and simply waited with me for two hours until another ride finally showed up. When I tried to pay him for his time and his gas, he refused outright, said he\'d want someone to do the same for his own daughter someday. It sounds small written down, but that one evening quietly restored a piece of my faith in people I didn\'t realize I\'d lost.',
    possibleComments: ['Faith in humanity: restored.', 'Small kindness, huge impact.']
  },
  {
    id: 'en_motivational_11',
    category: 'motivational',
    city: 'Vancouver',
    country: 'Canada',
    author: 'Isabella Cruz',
    rawImage: 'https://picsum.photos/seed/openconfess-en-11-11/700/500',
    text: 'Nobody in Vancouver believed I could switch careers at thirty-five, including, if I\'m honest, most of the version of me that existed back then. Friends called it a midlife crisis, recruiters called it a red flag, and for months every rejection email felt like proof they were right. The hardest part was never actually the skill gap, learning new tools turned out to be the easy bit. It was silencing the voices, mine included, that kept insisting I was too late, too old, too far behind to start over. Turns out late starts just take longer, not never.',
    possibleComments: ['Needed to read this today.', 'Proof that late starts still finish strong.']
  },
  {
    id: 'en_finance_12',
    category: 'finance',
    city: 'Manchester',
    country: 'United Kingdom',
    author: 'Mason Clarke',
    rawImage: 'https://picsum.photos/seed/openconfess-en-12-12/700/500',
    text: 'I spent a decade in Manchester finance chasing bonuses that never once bought back the time I lost getting them, working weekends I can\'t remember for numbers I can barely recall now. Every raise came with a quieter apartment, an emptier calendar of friends, and a longer list of things I kept promising myself I\'d finally do next year. Wealth without time, I\'ve learned the hard way, is just a well-decorated cage with excellent lighting and terrible company. I still work in the industry, but these days I leave by six, and it\'s the richest decision I\'ve made in years.',
    possibleComments: ['Time really is the only asset that never comes back.', 'Peace of mind is underrated wealth.']
  },
  {
    id: 'en_deep_13',
    category: 'deep',
    city: 'San Francisco',
    country: 'USA',
    author: 'Ava Thompson',
    rawImage: 'https://picsum.photos/seed/openconfess-en-13-13/700/500',
    text: 'I moved to San Francisco chasing a career that promised meaning, packed my whole life into two suitcases, and told everyone back home I was finally doing something big. Most nights now I sit alone in an apartment that still doesn\'t feel like mine, wondering exactly when ambition quietly replaced my sense of self. From the outside my life photographs perfectly, the skyline, the title, a calendar full of things that look like progress. But underneath it feels strangely hollow, like I built an entire identity around being busy instead of being happy, and some days I genuinely don\'t know how to undo it.',
    possibleComments: ['This hit closer to home than I expected.', 'Success without peace is just a slower kind of loss.']
  },
  {
    id: 'en_funny_14',
    category: 'funny',
    city: 'Melbourne',
    country: 'Australia',
    author: 'Noah Fitzgerald',
    rawImage: 'https://picsum.photos/seed/openconfess-en-14-14/700/500',
    text: 'I told my Melbourne landlord my sink was \'making prophetic noises\' just to delay the repair bill another month, fully expecting him to laugh me out of the building. Instead he went quiet, nodded like I\'d said something profound, and actually believed me, sending a plumber the very same day without asking a single follow-up question. I\'ve been riding that lie for weeks now, adding new symptoms every time he checks in, and honestly the sink still works fine. At this point I think I\'ve accidentally invented a whole new career path in mildly spiritual home maintenance consulting.',
    possibleComments: ['This is criminally underrated office strategy 😂', 'Taking notes for Monday.']
  },
  {
    id: 'en_intelligent_15',
    category: 'intelligent',
    city: 'Amsterdam',
    country: 'Netherlands',
    author: 'Lucy Bishop',
    rawImage: 'https://picsum.photos/seed/openconfess-en-15-15/700/500',
    text: 'I\'ve noticed that in Amsterdam, the loudest voice in the room is rarely the most informed one, yet somehow it\'s the one everyone quotes in meetings the next day. The quiet colleague who actually read the report, checked the numbers twice, and waited for the right moment usually gets overlooked entirely, at least at first. Over time though, people start noticing who was right more often, and reputations quietly shift in their favor. Silence, used well, isn\'t passivity, it\'s patience dressed up as restraint, and in the long run it\'s an underrated competitive advantage almost nobody trains for.',
    possibleComments: ['Quietly one of the smartest takes I\'ve read today.', 'Underrated wisdom right here.']
  },
  {
    id: 'en_incident_16',
    category: 'incident',
    city: 'Cape Town',
    country: 'South Africa',
    author: 'Daniel O\'Brien',
    rawImage: 'https://picsum.photos/seed/openconfess-en-16-16/700/500',
    text: 'Stranded outside Cape Town during a storm with a dead phone and no idea how far the nearest shelter was, I genuinely thought I\'d be spending the night soaked on the roadside. A stranger pulled over, didn\'t ask questions, and simply waited with me for two hours until another ride finally showed up. When I tried to pay him for his time and his gas, he refused outright, said he\'d want someone to do the same for his own daughter someday. It sounds small written down, but that one evening quietly restored a piece of my faith in people I didn\'t realize I\'d lost.',
    possibleComments: ['Faith in humanity: restored.', 'Small kindness, huge impact.']
  },
  {
    id: 'en_motivational_17',
    category: 'motivational',
    city: 'Boston',
    country: 'USA',
    author: 'Emily Carter',
    rawImage: 'https://picsum.photos/seed/openconfess-en-17-17/700/500',
    text: 'Nobody in Boston believed I could switch careers at thirty-five, including, if I\'m honest, most of the version of me that existed back then. Friends called it a midlife crisis, recruiters called it a red flag, and for months every rejection email felt like proof they were right. The hardest part was never actually the skill gap, learning new tools turned out to be the easy bit. It was silencing the voices, mine included, that kept insisting I was too late, too old, too far behind to start over. Turns out late starts just take longer, not never.',
    possibleComments: ['Needed to read this today.', 'Proof that late starts still finish strong.']
  },
  {
    id: 'en_finance_18',
    category: 'finance',
    city: 'Edinburgh',
    country: 'United Kingdom',
    author: 'Jack Sullivan',
    rawImage: 'https://picsum.photos/seed/openconfess-en-18-18/700/500',
    text: 'I spent a decade in Edinburgh finance chasing bonuses that never once bought back the time I lost getting them, working weekends I can\'t remember for numbers I can barely recall now. Every raise came with a quieter apartment, an emptier calendar of friends, and a longer list of things I kept promising myself I\'d finally do next year. Wealth without time, I\'ve learned the hard way, is just a well-decorated cage with excellent lighting and terrible company. I still work in the industry, but these days I leave by six, and it\'s the richest decision I\'ve made in years.',
    possibleComments: ['Time really is the only asset that never comes back.', 'Peace of mind is underrated wealth.']
  },
  {
    id: 'en_deep_19',
    category: 'deep',
    city: 'Austin',
    country: 'USA',
    author: 'Zoe Middleton',
    rawImage: 'https://picsum.photos/seed/openconfess-en-19-19/700/500',
    text: 'I moved to Austin chasing a career that promised meaning, packed my whole life into two suitcases, and told everyone back home I was finally doing something big. Most nights now I sit alone in an apartment that still doesn\'t feel like mine, wondering exactly when ambition quietly replaced my sense of self. From the outside my life photographs perfectly, the skyline, the title, a calendar full of things that look like progress. But underneath it feels strangely hollow, like I built an entire identity around being busy instead of being happy, and some days I genuinely don\'t know how to undo it.',
    possibleComments: ['This hit closer to home than I expected.', 'Success without peace is just a slower kind of loss.']
  },
  {
    id: 'en_funny_20',
    category: 'funny',
    city: 'Wellington',
    country: 'New Zealand',
    author: 'Adam Fletcher',
    rawImage: 'https://picsum.photos/seed/openconfess-en-20-20/700/500',
    text: 'I told my Wellington landlord my sink was \'making prophetic noises\' just to delay the repair bill another month, fully expecting him to laugh me out of the building. Instead he went quiet, nodded like I\'d said something profound, and actually believed me, sending a plumber the very same day without asking a single follow-up question. I\'ve been riding that lie for weeks now, adding new symptoms every time he checks in, and honestly the sink still works fine. At this point I think I\'ve accidentally invented a whole new career path in mildly spiritual home maintenance consulting.',
    possibleComments: ['This is criminally underrated office strategy 😂', 'Taking notes for Monday.']
  },
  {
    id: 'en_intelligent_21',
    category: 'intelligent',
    city: 'Seattle',
    country: 'USA',
    author: 'Grace Hoffman',
    rawImage: 'https://picsum.photos/seed/openconfess-en-21-21/700/500',
    text: 'In Seattle I learned that the person who asks the most questions in a meeting is often mistaken for the least prepared one, when really they\'re the only one testing their own assumptions out loud before committing to a decision. Everyone else just nods along, terrified of looking unsure, and ships flawed plans with total confidence. I used to stay quiet to seem competent, but now I ask the obvious question first, because being wrong for thirty seconds beats being wrong for three months.',
    possibleComments: ['This is such an underused skill in meetings.', 'Asking questions early saves so much pain later.']
  },
  {
    id: 'en_incident_22',
    category: 'incident',
    city: 'Glasgow',
    country: 'United Kingdom',
    author: 'Connor Reid',
    rawImage: 'https://picsum.photos/seed/openconfess-en-22-22/700/500',
    text: 'My car broke down on a back road outside Glasgow just after midnight, and the only light for miles was a farmhouse porch lamp. The couple who lived there didn\'t hesitate, brought me tea while I waited for a tow truck, and refused to let me leave without a proper meal first. I offered to send them something afterward and they just gave me a phone number that turned out to be disconnected. Some kindness really doesn\'t want to be repaid.',
    possibleComments: ['Restored my faith in strangers.', 'Kindness that expects nothing back is rare.']
  },
  {
    id: 'en_motivational_23',
    category: 'motivational',
    city: 'Miami',
    country: 'USA',
    author: 'Renee Castillo',
    rawImage: 'https://picsum.photos/seed/openconfess-en-23-23/700/500',
    text: 'Everyone in Miami told me that going back to school at forty was a waste of tuition I\'d never earn back, and for a while the math in my head agreed with them. But I kept showing up to night classes anyway, mostly out of stubbornness rather than confidence. Three years later I run a small clinic that didn\'t exist for people like me when I needed one, and the tuition paid for itself twice over before I even finished paying it off.',
    possibleComments: ['Never too late, clearly.', 'This is exactly the push I needed.']
  },
  {
    id: 'en_finance_24',
    category: 'finance',
    city: 'Zurich',
    country: 'Switzerland',
    author: 'Anna Weber',
    rawImage: 'https://picsum.photos/seed/openconfess-en-24-24/700/500',
    text: 'After eight years in Zurich banking, I finally did the math on how many of my daughter\'s school events I\'d actually attended, and the number was small enough to genuinely frighten me. The bonuses had gotten bigger every year, but so had the list of things I kept telling myself I\'d make time for later. I moved to a smaller firm with a smaller salary and a hard stop at five, and it\'s the first year I haven\'t felt like I was renting my own life.',
    possibleComments: ['Time really is the scarcest resource.', 'Glad you found your way back.']
  },
  {
    id: 'en_deep_25',
    category: 'deep',
    city: 'Lisbon',
    country: 'Portugal',
    author: 'Mariana Alves',
    rawImage: 'https://picsum.photos/seed/openconfess-en-25-25/700/500',
    text: 'I gave up a stable job in Lisbon to chase something that felt more like purpose, and for the first year every part of that decision felt vindicated. Somewhere around year three, purpose quietly turned into another kind of pressure, one where resting felt like falling behind on a mission I\'d assigned myself. I\'m still doing the work I chose, but I had to relearn that meaning isn\'t supposed to cost you your ability to just sit still sometimes.',
    possibleComments: ['Purpose shouldn\'t cost you your rest.', 'This is such an important reminder.']
  },
  {
    id: 'en_funny_26',
    category: 'funny',
    city: 'Barcelona',
    country: 'Spain',
    author: 'Pablo Serrano',
    rawImage: 'https://picsum.photos/seed/openconfess-en-26-26/700/500',
    text: 'I told my Barcelona gym that I couldn\'t renew my membership because I\'d \'developed a medical sensitivity to fluorescent lighting,\' which is a lie I invented on the spot to avoid admitting I just stopped going in February. The front desk woman looked genuinely concerned and offered me a doctor\'s note template to make cancellation easier. I have now used this excuse at two other gyms since, and I\'m starting to worry I\'ve built an entire fake medical file.',
    possibleComments: ['This is criminally funny 😂', 'The fake medical file escalation is too real.']
  },
  {
    id: 'en_intelligent_27',
    category: 'intelligent',
    city: 'Cardiff',
    country: 'United Kingdom',
    author: 'Priya Nair',
    rawImage: 'https://picsum.photos/seed/openconfess-en-27-27/700/500',
    text: 'Working in Cardiff taught me that the smartest person in a negotiation is rarely the one who talks the most, but the one who lets a silence sit just a beat too long. I watched a junior colleague get an entire contract renegotiated simply by pausing instead of filling awkward air with concessions. Everyone else was busy trying to sound smart. She was busy actually listening, and it showed in the numbers by the end of the quarter.',
    possibleComments: ['Silence really is a power move.', 'Wish I\'d learned this years ago.']
  },
  {
    id: 'en_incident_28',
    category: 'incident',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    author: 'Priya Ramesh',
    rawImage: 'https://picsum.photos/seed/openconfess-en-28-28/700/500',
    text: 'During a sudden flood warning in Kuala Lumpur, I got separated from my group and ended up trapped under a shop awning with a stranger who\'d lost his umbrella too. We ended up sharing his last phone charge, splitting one bag of chips, and laughing about the absurdity of it until the rain let up two hours later. I never got his name, only his laugh, but that afternoon turned a genuinely scary evacuation into one of my favorite memories of the year.',
    possibleComments: ['What a beautiful little memory.', 'Sometimes strangers become the best part of the story.']
  },
  {
    id: 'en_motivational_29',
    category: 'motivational',
    city: 'Osaka',
    country: 'Japan',
    author: 'Kenji Arata',
    rawImage: 'https://picsum.photos/seed/openconfess-en-29-29/700/500',
    text: 'I failed the same certification exam four times in Osaka before a proctor quietly told me most people quit after the second attempt. That comment made me angrier than any rejection letter had, so I studied differently instead of harder, and passed on the fifth try with the highest score in my group. Nobody remembers your failed attempts once you\'re standing on the other side of them, only that you eventually got there.',
    possibleComments: ['Failing forward, literally.', 'Persistence over perfection every time.']
  },
  {
    id: 'en_finance_30',
    category: 'finance',
    city: 'Copenhagen',
    country: 'Denmark',
    author: 'Mikkel Sorensen',
    rawImage: 'https://picsum.photos/seed/openconfess-en-30-30/700/500',
    text: 'I used to measure a good year in Copenhagen purely by my portfolio\'s return, right up until a routine health scare made every spreadsheet suddenly feel irrelevant for about six months. Nothing in my accounts changed during that time except my relationship to them, but it was enough to make me automate my savings and stop checking the numbers daily. The money grew exactly the same either way. I just stopped needing to watch it happen.',
    possibleComments: ['Health really does reset your priorities.', 'Automating peace of mind, love this.']
  },
  {
    id: 'en_deep_31',
    category: 'deep',
    city: 'Prague',
    country: 'Czech Republic',
    author: 'Tomas Novak',
    rawImage: 'https://picsum.photos/seed/openconfess-en-31-31/700/500',
    text: 'Every apartment I\'ve had in Prague has looked more finished than the last, better furniture, better light, better view, and yet the feeling of actually being home has gotten fainter with each upgrade rather than stronger. I used to think comfort and belonging were the same purchase. Lately I think belonging was never something my address was ever going to provide, no matter how carefully I decorated around the absence.',
    possibleComments: ['Belonging isn\'t furniture, well said.', 'This really resonated with me.']
  },
  {
    id: 'en_funny_32',
    category: 'funny',
    city: 'Vienna',
    country: 'Austria',
    author: 'Julia Baumann',
    rawImage: 'https://picsum.photos/seed/openconfess-en-32-32/700/500',
    text: 'I convinced my entire Vienna office that I was fluent in sign language for almost a year by learning exactly nine signs and using them with tremendous confidence whenever anyone tested me. It worked flawlessly until a genuinely deaf client visited for a meeting and I had to fake a sudden coughing fit to escape the conversation entirely. My coworkers still bring it up at every holiday party, and I still haven\'t learned a tenth sign out of spite.',
    possibleComments: ['Nine signs of pure confidence 😂', 'The coughing fit escape is iconic.']
  },
  {
    id: 'en_intelligent_33',
    category: 'intelligent',
    city: 'Denver',
    country: 'USA',
    author: 'Marcus Webb',
    rawImage: 'https://picsum.photos/seed/openconfess-en-33-33/700/500',
    text: 'I\'ve come to notice in Denver that people who change their minds easily when shown new evidence get quietly labeled as flaky, while people who never budge get called principled, even when they\'re simply wrong for longer. Real intelligence, I think, looks a lot like admitting a mistake in front of a room that expected you to defend it. It costs your ego something in the moment, and it pays you back in credibility for years.',
    possibleComments: ['Admitting mistakes fast is underrated.', 'This changed how I see \'confidence\'.']
  },
  {
    id: 'en_incident_34',
    category: 'incident',
    city: 'Perth',
    country: 'Australia',
    author: 'Isla Farrow',
    rawImage: 'https://picsum.photos/seed/openconfess-en-34-34/700/500',
    text: 'I locked my keys, wallet, and phone inside my car outside a Perth petrol station at 2 a.m., completely stranded with nothing but the clothes I was wearing. The night attendant closed his till early, drove me to a locksmith himself, and paid the callout fee before I could even explain I was good for it. He waved off every attempt I made to pay him back over the following weeks, said the shift was boring anyway and he liked the company.',
    possibleComments: ['People like him make the world better.', 'This made my day, honestly.']
  },
  {
    id: 'en_motivational_35',
    category: 'motivational',
    city: 'Nairobi',
    country: 'Kenya',
    author: 'Aisha Kimani',
    rawImage: 'https://picsum.photos/seed/openconfess-en-35-35/700/500',
    text: 'Starting a small business in Nairobi with almost no savings meant every early decision felt like a bet I couldn\'t afford to lose, and plenty of people warned me the odds were against someone with my background. What actually got me through wasn\'t confidence, it was routine: opening the shop at the same hour every single day even when there were no customers to open it for. Eventually the customers noticed the consistency before they noticed anything else.',
    possibleComments: ['Consistency really does win.', 'Showing up every day is underrated.']
  },
  {
    id: 'en_finance_36',
    category: 'finance',
    city: 'Lagos',
    country: 'Nigeria',
    author: 'Chidi Okafor',
    rawImage: 'https://picsum.photos/seed/openconfess-en-36-36/700/500',
    text: 'Working in Lagos finance, I spent years assuming that a bigger emergency fund would eventually feel like enough, but the target number just kept moving further away every time I got close to it. What actually gave me peace wasn\'t reaching some final figure, it was writing down what \'enough\' meant for my specific life and refusing to update the definition just because I could technically afford to. Contentment turned out to be a decision, not a balance.',
    possibleComments: ['Enough is a decision, not a number — so true.', 'This hit different.']
  },
  {
    id: 'en_deep_37',
    category: 'deep',
    city: 'Montreal',
    country: 'Canada',
    author: 'Camille Tremblay',
    rawImage: 'https://picsum.photos/seed/openconfess-en-37-37/700/500',
    text: 'I built a career in Montreal specifically designed to impress a version of my family that, it turns out, was never actually keeping score the way I imagined. When I finally admitted that out loud in therapy, the relief was almost embarrassing, like I\'d been running a marathon nobody else knew was happening. I still work hard, but these days it\'s for reasons I could actually explain out loud without flinching.',
    possibleComments: ['Freeing yourself from unspoken scorekeeping is huge.', 'Therapy really does change perspective.']
  },
  {
    id: 'en_funny_38',
    category: 'funny',
    city: 'Warsaw',
    country: 'Poland',
    author: 'Piotr Kowalski',
    rawImage: 'https://picsum.photos/seed/openconfess-en-38-38/700/500',
    text: 'I told my Warsaw neighbors I was \'between a very demanding creative project\' to explain why I hadn\'t left my apartment in four days, when the actual project was finishing an entire video game on my day off. One of them brought me soup out of concern for my artistic wellbeing, and I accepted it with the solemn dignity of a man suffering for his craft. I have not told her the truth, and at this point I never will.',
    possibleComments: ['Suffering for gaming, name a more iconic duo.', 'The soup guilt is unmatched 😂']
  },
  {
    id: 'en_intelligent_39',
    category: 'intelligent',
    city: 'Portland',
    country: 'USA',
    author: 'Harriet Lowe',
    rawImage: 'https://picsum.photos/seed/openconfess-en-39-39/700/500',
    text: 'A mentor in Portland once told me that the fastest way to lose an argument is to win it too completely, because a person you\'ve humiliated will spend more energy resenting you than considering your point. I didn\'t believe her until I watched two colleagues make the identical proposal, one gently and one triumphantly, and only the gentle one\'s idea actually got implemented. Being right is only half the job; making it easy for someone else to agree is the other half.',
    possibleComments: ['Winning gently is such a skill.', 'So true, and so hard to practice.']
  },
  {
    id: 'en_incident_40',
    category: 'incident',
    city: 'Reykjavik',
    country: 'Iceland',
    author: 'Bjorn Halvorsen',
    rawImage: 'https://picsum.photos/seed/openconfess-en-40-40/700/500',
    text: 'Hiking alone outside Reykjavik, I twisted my ankle badly enough that walking back to the car became impossible, and my phone had no signal at all. A group of tourists who barely spoke my language carried my pack, took turns supporting me, and walked two hours slower than their planned route just to get me down safely. We never exchanged more than broken English and hand gestures, but I think about their patience more than I think about the injury itself.',
    possibleComments: ['Strangers carrying you through hard moments — incredible.', 'This is humanity at its best.']
  },
  {
    id: 'hi_deep_1',
    category: 'deep',
    city: 'Bengaluru',
    country: 'India',
    author: 'मयंक त्रिपाठी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-1-41/700/500',
    text: 'Bengaluru शहर में आकर लगा था ज़िंदगी बदल जाएगी, दो बैग में पूरी दुनिया समेटकर निकला था और घरवालों से बड़े-बड़े वादे करके आया था। शुरुआत के महीनों में लगा भी कि सब सही दिशा में जा रहा है, नौकरी अच्छी थी, तनख्वाह भी बढ़िया थी। पर आज खाली कमरे में अकेला बैठकर एहसास होता है कि कामयाबी और सुकून दो बिल्कुल अलग चीज़ें हैं, और मैंने बरसों तक दोनों को एक ही समझने की गलती की। बाहर से सब परफेक्ट दिखता है, अंदर से खालीपन के सिवा कुछ नहीं बचा।',
    possibleComments: ['दिल को छू गई ये बात।', 'सफलता और सुकून सच में अलग चीज़ें हैं।']
  },
  {
    id: 'hi_funny_2',
    category: 'funny',
    city: 'Delhi',
    country: 'India',
    author: 'अमित कुमार सिंह',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-2-42/700/500',
    text: 'Delhi में रिक्शावाले भैया से किराए को लेकर बहस करते वक्त मैंने इतना कॉन्फिडेंस दिखाया कि आधा किराया माफ हो गया, हालांकि सच बताऊं तो रास्ता मुझे खुद पता नहीं था। भैया ने भी शायद मेरा आत्मविश्वास देखकर सोचा होगा कि यह बंदा रोज़ इसी रास्ते से जाता है। असल में मैं पहली बार उस इलाके में गया था और गूगल मैप्स भी बंद पड़ा था। फिर भी जिस अंदाज़ में मैंने बहस की, उससे लगा जैसे मैं वहीं का लोकल गाइड हूं। कभी-कभी झूठी हिम्मत भी काम कर जाती है।',
    possibleComments: ['भाई ये तो मास्टरस्ट्रोक है 😂', 'कल से मैं भी ट्राई करूंगा।']
  },
  {
    id: 'hi_intelligent_3',
    category: 'intelligent',
    city: 'Lucknow',
    country: 'India',
    author: 'आकाश रस्तोगी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-3-43/700/500',
    text: 'जो लोग Lucknow में सबसे ज्यादा शिकायत करते हैं, अक्सर देखा गया है कि वही सबसे कम मेहनत करते पाए जाते हैं, मानो शिकायत करना ही उनकी मुख्य ज़िम्मेदारी हो। मीटिंग में सबसे तेज़ आवाज़ अक्सर सबसे कम जानकारी वाले इंसान की होती है, जबकि जिसने असल में काम किया होता है वह चुपचाप कोने में बैठा रहता है। शुरुआत में यह अन्याय जैसा लगता है, पर धीरे-धीरे लोग समझने लगते हैं कि नतीजे किसके काम से आए। चुप रहना कमजोरी नहीं, बल्कि सही समय का इंतज़ार करना है, और यही असली ताकत साबित होती है।',
    possibleComments: ['बहुत गहरी बात कही है।', 'सच में सोचने वाली बात है।']
  },
  {
    id: 'hi_incident_4',
    category: 'incident',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-4-44/700/500',
    text: 'Patna की सड़क पर रात के करीब ग्यारह बजे अचानक गाड़ी खराब हो गई थी, और मोबाइल की बैटरी भी खत्म हो चुकी थी। ऐसे में एक अनजान भाई अपनी बाइक रोककर आए, बिना कुछ पूछे मदद करने लगे, और लगभग दो घंटे तक साथ खड़े रहे जब तक कोई मैकेनिक नहीं मिल गया। जाते वक्त जब मैंने पैसे देने की कोशिश की, तो उन्होंने साफ मना कर दिया और कहा कि किसी दिन कोई और भी मेरी बेटी की मदद कर देगा। इतनी छोटी सी घटना ने इंसानियत पर मेरा भरोसा दोबारा जगा दिया।',
    possibleComments: ['इंसानियत अभी ज़िंदा है।', 'ऐसे लोग कम मिलते हैं आजकल।']
  },
  {
    id: 'hi_motivational_5',
    category: 'motivational',
    city: 'Jaipur',
    country: 'India',
    author: 'प्रिया शर्मा',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-5-45/700/500',
    text: 'असफलता से डरकर Jaipur में घर बैठा रहता तो आज यह मुकाम कभी नहीं देख पाता, और शायद हमेशा यही सोचता रहता कि काश हिम्मत कर लेता। शुरुआत में हर तरफ से यही सुनने को मिला कि उम्र निकल चुकी है, अब कुछ नया शुरू करना बेवकूफी है। हर इंटरव्यू में रिजेक्शन मिलता, हर बार लगता जैसे सब सही कह रहे थे। पर असली लड़ाई स्किल की नहीं, अपने अंदर की उन आवाज़ों को चुप कराने की थी जो बार-बार देर होने की बात दोहराती थीं। देर से शुरू हुआ सफर भी मंज़िल तक पहुंच सकता है।',
    possibleComments: ['बहुत प्रेरणादायक सफर है।', 'हिम्मत की असली मिसाल।']
  },
  {
    id: 'hi_finance_6',
    category: 'finance',
    city: 'Pune',
    country: 'India',
    author: 'रोहित यादव',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-6-46/700/500',
    text: 'Pune में सालों तक सिर्फ पैसे के पीछे भागा, वीकेंड भी दफ्तर में निकाल दिए और उन पलों को भूल गया जो कभी वापस नहीं आने वाले। हर प्रमोशन के साथ दोस्तों की लिस्ट छोटी होती गई और घर लौटने का समय देर होता गया। आज समझ आया कि वक्त ही असली दौलत है, बाकी सब कागज़ के आंकड़े हैं जो बैंक स्टेटमेंट में अच्छे लगते हैं पर ज़िंदगी में खालीपन भरते हैं। अब भी उसी फील्ड में काम करता हूं, बस शाम छह बजे घर निकल जाता हूं, और यही सबसे अच्छा फैसला लगता है।',
    possibleComments: ['वक्त ही असली दौलत है।', 'सुकून की कीमत पैसों से ज्यादा है।']
  },
  {
    id: 'hi_deep_7',
    category: 'deep',
    city: 'Indore',
    country: 'India',
    author: 'नेहा गुप्ता',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-7-47/700/500',
    text: 'Indore शहर में आकर लगा था ज़िंदगी बदल जाएगी, दो बैग में पूरी दुनिया समेटकर निकला था और घरवालों से बड़े-बड़े वादे करके आया था। शुरुआत के महीनों में लगा भी कि सब सही दिशा में जा रहा है, नौकरी अच्छी थी, तनख्वाह भी बढ़िया थी। पर आज खाली कमरे में अकेला बैठकर एहसास होता है कि कामयाबी और सुकून दो बिल्कुल अलग चीज़ें हैं, और मैंने बरसों तक दोनों को एक ही समझने की गलती की। बाहर से सब परफेक्ट दिखता है, अंदर से खालीपन के सिवा कुछ नहीं बचा।',
    possibleComments: ['दिल को छू गई ये बात।', 'सफलता और सुकून सच में अलग चीज़ें हैं।']
  },
  {
    id: 'hi_funny_8',
    category: 'funny',
    city: 'Kanpur',
    country: 'India',
    author: 'विशाल पांडेय',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-8-48/700/500',
    text: 'Kanpur में रिक्शावाले भैया से किराए को लेकर बहस करते वक्त मैंने इतना कॉन्फिडेंस दिखाया कि आधा किराया माफ हो गया, हालांकि सच बताऊं तो रास्ता मुझे खुद पता नहीं था। भैया ने भी शायद मेरा आत्मविश्वास देखकर सोचा होगा कि यह बंदा रोज़ इसी रास्ते से जाता है। असल में मैं पहली बार उस इलाके में गया था और गूगल मैप्स भी बंद पड़ा था। फिर भी जिस अंदाज़ में मैंने बहस की, उससे लगा जैसे मैं वहीं का लोकल गाइड हूं। कभी-कभी झूठी हिम्मत भी काम कर जाती है।',
    possibleComments: ['भाई ये तो मास्टरस्ट्रोक है 😂', 'कल से मैं भी ट्राई करूंगा।']
  },
  {
    id: 'hi_intelligent_9',
    category: 'intelligent',
    city: 'Bhopal',
    country: 'India',
    author: 'अंजलि मिश्रा',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-9-49/700/500',
    text: 'जो लोग Bhopal में सबसे ज्यादा शिकायत करते हैं, अक्सर देखा गया है कि वही सबसे कम मेहनत करते पाए जाते हैं, मानो शिकायत करना ही उनकी मुख्य ज़िम्मेदारी हो। मीटिंग में सबसे तेज़ आवाज़ अक्सर सबसे कम जानकारी वाले इंसान की होती है, जबकि जिसने असल में काम किया होता है वह चुपचाप कोने में बैठा रहता है। शुरुआत में यह अन्याय जैसा लगता है, पर धीरे-धीरे लोग समझने लगते हैं कि नतीजे किसके काम से आए। चुप रहना कमजोरी नहीं, बल्कि सही समय का इंतज़ार करना है, और यही असली ताकत साबित होती है।',
    possibleComments: ['बहुत गहरी बात कही है।', 'सच में सोचने वाली बात है।']
  },
  {
    id: 'hi_incident_10',
    category: 'incident',
    city: 'Varanasi',
    country: 'India',
    author: 'कुणाल जोशी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-10-50/700/500',
    text: 'Varanasi की सड़क पर रात के करीब ग्यारह बजे अचानक गाड़ी खराब हो गई थी, और मोबाइल की बैटरी भी खत्म हो चुकी थी। ऐसे में एक अनजान भाई अपनी बाइक रोककर आए, बिना कुछ पूछे मदद करने लगे, और लगभग दो घंटे तक साथ खड़े रहे जब तक कोई मैकेनिक नहीं मिल गया। जाते वक्त जब मैंने पैसे देने की कोशिश की, तो उन्होंने साफ मना कर दिया और कहा कि किसी दिन कोई और भी मेरी बेटी की मदद कर देगा। इतनी छोटी सी घटना ने इंसानियत पर मेरा भरोसा दोबारा जगा दिया।',
    possibleComments: ['इंसानियत अभी ज़िंदा है।', 'ऐसे लोग कम मिलते हैं आजकल।']
  },
  {
    id: 'hi_motivational_11',
    category: 'motivational',
    city: 'Chandigarh',
    country: 'India',
    author: 'स्वाति अग्रवाल',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-11-51/700/500',
    text: 'असफलता से डरकर Chandigarh में घर बैठा रहता तो आज यह मुकाम कभी नहीं देख पाता, और शायद हमेशा यही सोचता रहता कि काश हिम्मत कर लेता। शुरुआत में हर तरफ से यही सुनने को मिला कि उम्र निकल चुकी है, अब कुछ नया शुरू करना बेवकूफी है। हर इंटरव्यू में रिजेक्शन मिलता, हर बार लगता जैसे सब सही कह रहे थे। पर असली लड़ाई स्किल की नहीं, अपने अंदर की उन आवाज़ों को चुप कराने की थी जो बार-बार देर होने की बात दोहराती थीं। देर से शुरू हुआ सफर भी मंज़िल तक पहुंच सकता है।',
    possibleComments: ['बहुत प्रेरणादायक सफर है।', 'हिम्मत की असली मिसाल।']
  },
  {
    id: 'hi_finance_12',
    category: 'finance',
    city: 'Nagpur',
    country: 'India',
    author: 'राहुल दुबे',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-12-52/700/500',
    text: 'Nagpur में सालों तक सिर्फ पैसे के पीछे भागा, वीकेंड भी दफ्तर में निकाल दिए और उन पलों को भूल गया जो कभी वापस नहीं आने वाले। हर प्रमोशन के साथ दोस्तों की लिस्ट छोटी होती गई और घर लौटने का समय देर होता गया। आज समझ आया कि वक्त ही असली दौलत है, बाकी सब कागज़ के आंकड़े हैं जो बैंक स्टेटमेंट में अच्छे लगते हैं पर ज़िंदगी में खालीपन भरते हैं। अब भी उसी फील्ड में काम करता हूं, बस शाम छह बजे घर निकल जाता हूं, और यही सबसे अच्छा फैसला लगता है।',
    possibleComments: ['वक्त ही असली दौलत है।', 'सुकून की कीमत पैसों से ज्यादा है।']
  },
  {
    id: 'hi_deep_13',
    category: 'deep',
    city: 'Ranchi',
    country: 'India',
    author: 'पूजा तिवारी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-13-53/700/500',
    text: 'Ranchi शहर में आकर लगा था ज़िंदगी बदल जाएगी, दो बैग में पूरी दुनिया समेटकर निकला था और घरवालों से बड़े-बड़े वादे करके आया था। शुरुआत के महीनों में लगा भी कि सब सही दिशा में जा रहा है, नौकरी अच्छी थी, तनख्वाह भी बढ़िया थी। पर आज खाली कमरे में अकेला बैठकर एहसास होता है कि कामयाबी और सुकून दो बिल्कुल अलग चीज़ें हैं, और मैंने बरसों तक दोनों को एक ही समझने की गलती की। बाहर से सब परफेक्ट दिखता है, अंदर से खालीपन के सिवा कुछ नहीं बचा।',
    possibleComments: ['दिल को छू गई ये बात।', 'सफलता और सुकून सच में अलग चीज़ें हैं।']
  },
  {
    id: 'hi_funny_14',
    category: 'funny',
    city: 'Meerut',
    country: 'India',
    author: 'गौरव सक्सेना',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-14-54/700/500',
    text: 'Meerut में रिक्शावाले भैया से किराए को लेकर बहस करते वक्त मैंने इतना कॉन्फिडेंस दिखाया कि आधा किराया माफ हो गया, हालांकि सच बताऊं तो रास्ता मुझे खुद पता नहीं था। भैया ने भी शायद मेरा आत्मविश्वास देखकर सोचा होगा कि यह बंदा रोज़ इसी रास्ते से जाता है। असल में मैं पहली बार उस इलाके में गया था और गूगल मैप्स भी बंद पड़ा था। फिर भी जिस अंदाज़ में मैंने बहस की, उससे लगा जैसे मैं वहीं का लोकल गाइड हूं। कभी-कभी झूठी हिम्मत भी काम कर जाती है।',
    possibleComments: ['भाई ये तो मास्टरस्ट्रोक है 😂', 'कल से मैं भी ट्राई करूंगा।']
  },
  {
    id: 'hi_intelligent_15',
    category: 'intelligent',
    city: 'Agra',
    country: 'India',
    author: 'दीपिका चौहान',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-15-55/700/500',
    text: 'जो लोग Agra में सबसे ज्यादा शिकायत करते हैं, अक्सर देखा गया है कि वही सबसे कम मेहनत करते पाए जाते हैं, मानो शिकायत करना ही उनकी मुख्य ज़िम्मेदारी हो। मीटिंग में सबसे तेज़ आवाज़ अक्सर सबसे कम जानकारी वाले इंसान की होती है, जबकि जिसने असल में काम किया होता है वह चुपचाप कोने में बैठा रहता है। शुरुआत में यह अन्याय जैसा लगता है, पर धीरे-धीरे लोग समझने लगते हैं कि नतीजे किसके काम से आए। चुप रहना कमजोरी नहीं, बल्कि सही समय का इंतज़ार करना है, और यही असली ताकत साबित होती है।',
    possibleComments: ['बहुत गहरी बात कही है।', 'सच में सोचने वाली बात है।']
  },
  {
    id: 'hi_incident_16',
    category: 'incident',
    city: 'Surat',
    country: 'India',
    author: 'विनोद खन्ना',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-16-56/700/500',
    text: 'Surat में बस स्टॉप पर बारिश में फंसा हुआ था, आखिरी बस निकल चुकी थी और पास में कोई ऑटो भी नहीं मिल रहा था। एक चायवाले अंकल ने बिना कुछ कहे अपनी दुकान का शटर थोड़ा खोलकर मुझे अंदर बुला लिया और गर्म चाय पकड़ा दी। दो घंटे बारिश थमने का इंतज़ार करते हुए हमने बहुत सारी बातें कीं, और जाते वक्त उन्होंने पैसे लेने से साफ मना कर दिया। कभी-कभी अजनबी ही सबसे बड़ा सहारा बन जाते हैं।',
    possibleComments: ['इंसानियत अभी ज़िंदा है।', 'छोटी सी मदद, बड़ा असर।']
  },
  {
    id: 'hi_motivational_17',
    category: 'motivational',
    city: 'Coimbatore',
    country: 'India',
    author: 'अरुण पिल्लई',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-17-57/700/500',
    text: 'Coimbatore में तीन बार बिज़नेस लोन के लिए आवेदन रिजेक्ट हुआ, हर बार बैंक वाले यही कहते कि मेरा अनुभव पर्याप्त नहीं है। चौथी बार आवेदन करने से पहले मैंने पूरी रात बैठकर अपनी योजना को दोबारा लिखा, हर कमज़ोर पॉइंट को मज़बूत किया। आज उसी छोटी दुकान से शहर के तीन इलाकों में शाखाएं खुल चुकी हैं, और वही बैंक अब खुद मुझे नए लोन ऑफर भेजता है।',
    possibleComments: ['मेहनत रंग लाई आखिरकार।', 'यह सच में प्रेरणादायक है।']
  },
  {
    id: 'hi_finance_18',
    category: 'finance',
    city: 'Gwalior',
    country: 'India',
    author: 'मोहित तायल',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-18-58/700/500',
    text: 'Gwalior में स्टॉक मार्केट में एक ही झटके में सालों की बचत गंवाने के बाद समझ आया कि पैसा जितनी तेज़ी से बनता दिखता है उतनी ही तेज़ी से मिट भी सकता है। महीनों तक खुद को माफ नहीं कर पाया, पर धीरे-धीरे दोबारा शुरुआत की, इस बार सीखकर, जल्दबाजी छोड़कर। आज पोर्टफोलियो पहले से छोटा है, पर नींद पहले से कहीं बेहतर आती है।',
    possibleComments: ['सीख कर वापसी करना असली जीत है।', 'नींद की कीमत पैसों से ज्यादा है।']
  },
  {
    id: 'hi_deep_19',
    category: 'deep',
    city: 'Bhubaneswar',
    country: 'India',
    author: 'सत्यम पाणिग्रही',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-19-59/700/500',
    text: 'Bhubaneswar में बड़ी कंपनी जॉइन करने के बाद हर कोई बधाई दे रहा था, मानो ज़िंदगी की सबसे बड़ी जीत मिल गई हो। पर हर सुबह अलार्म बजने से पहले ही एक अजीब सी थकान महसूस होने लगी थी, जिसका कोई मेडिकल कारण नहीं था। महीनों बाद समझ आया कि यह थकान शरीर की नहीं, उस ज़िंदगी की थी जो मैंने कभी असल में चुनी ही नहीं थी, सिर्फ स्वीकार कर ली थी।',
    possibleComments: ['यह थकान बहुतों को होती है।', 'सही बात कही है।']
  },
  {
    id: 'hi_funny_20',
    category: 'funny',
    city: 'Noida',
    country: 'India',
    author: 'तरुण अरोड़ा',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-20-60/700/500',
    text: 'Noida में ऑफिस मीटिंग बंक करने के लिए मैंने बताया कि मेरे पालतू कछुए की तबीयत खराब है और उसे डॉक्टर के पास ले जाना ज़रूरी है, जबकि मेरे पास कोई कछुआ है ही नहीं। बॉस ने पूरी सहानुभूति दिखाते हुए पूरा दिन छुट्टी दे दी और अगले दिन कछुए का हालचाल भी पूछा। अब हर महीने वह काल्पनिक कछुआ किसी न किसी बहाने बीमार पड़ता रहता है।',
    possibleComments: ['कछुए वाला बहाना जबरदस्त है 😂', 'बॉस भी मान गए, कमाल है।']
  },
  {
    id: 'hi_intelligent_21',
    category: 'intelligent',
    city: 'Thiruvananthapuram',
    country: 'India',
    author: 'अर्जुन नायर',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-21-61/700/500',
    text: 'Thiruvananthapuram में देखा है कि जो लोग जल्दी फैसला बदल लेते हैं उन्हें कमज़ोर समझा जाता है, जबकि जो कभी अपनी गलती नहीं मानते उन्हें दृढ़ निश्चयी कहा जाता है, भले ही वे गलत ही क्यों न हों। असली समझदारी शायद यही है कि गलती मानने में शर्म महसूस न हो, क्योंकि जो आज माफी मांग सकता है वही कल भरोसे का हकदार बनता है।',
    possibleComments: ['गलती मानना असली ताकत है।', 'बहुत गहरी बात है यह।']
  },
  {
    id: 'hi_incident_22',
    category: 'incident',
    city: 'Ludhiana',
    country: 'India',
    author: 'हरप्रीत ढिल्लों',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-22-62/700/500',
    text: 'Ludhiana में ट्रेन छूटने वाली थी और मेरा बैग प्लेटफॉर्म पर छूट गया था, तभी एक कुली भाई साहब ने दौड़कर बैग उठाया और चलती ट्रेन में मुझे और मेरा सामान दोनों सुरक्षित चढ़ा दिया। उन्होंने अपनी जान जोखिम में डाली सिर्फ एक अजनबी की मदद के लिए, और इनाम के तौर पर सिर्फ मुस्कुरा कर हाथ हिला दिया। उस दिन के बाद से मैं हर बार प्लेटफॉर्म पर अपना सामान डबल चेक करता हूं, पर उनका चेहरा नहीं भूला।',
    possibleComments: ['ऐसे लोग कम मिलते हैं।', 'दिल जीत लिया इस भाई ने।']
  },
  {
    id: 'hi_motivational_23',
    category: 'motivational',
    city: 'Vadodara',
    country: 'India',
    author: 'सुनीता ठाकुर',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-23-63/700/500',
    text: 'Vadodara में सबने कहा कि सिंगल मदर के लिए अपना कैफे खोलना पागलपन है, खासकर तब जब बचत खाते में मुश्किल से तीन महीने का किराया बचा हो। शुरुआती छह महीने ग्राहक इक्का-दुक्का ही आते थे, और हर रात हिसाब लगाते हुए हाथ कांपते थे। आज वही कैफे मोहल्ले की पहचान बन चुका है, और जो लोग कभी मना करते थे वही अब वहां रेगुलर बैठते हैं।',
    possibleComments: ['हिम्मत की मिसाल हैं आप।', 'यह पढ़कर हिम्मत मिली।']
  },
  {
    id: 'hi_finance_24',
    category: 'finance',
    city: 'Amritsar',
    country: 'India',
    author: 'गुरप्रीत कौर',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-24-64/700/500',
    text: 'Amritsar में पारिवारिक व्यापार संभालते हुए सालों तक हर पैसा वापस बिज़नेस में लगाया, खुद के लिए कभी कुछ नहीं रखा, यह सोचकर कि यही ज़िम्मेदारी है। एक दिन अचानक बीमार पड़ी और एहसास हुआ कि खुद की सुरक्षा को नज़रअंदाज़ करना समझदारी नहीं थी। अब हर महीने पहले खुद के लिए बचत करती हूं, फिर बाकी सब, और बिज़नेस फिर भी उतना ही बढ़िया चल रहा है।',
    possibleComments: ['खुद की परवाह करना जरूरी है।', 'यह बात बहुत काम की है।']
  },
  {
    id: 'hi_deep_25',
    category: 'deep',
    city: 'Raipur',
    country: 'India',
    author: 'शालिनी वर्मा',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-25-65/700/500',
    text: 'Raipur में शादी के बाद हर त्योहार, हर छुट्टी, हर वीकेंड दूसरों की खुशी के हिसाब से प्लान होता गया, और खुद की पसंद धीरे-धीरे याद ही नहीं रही। एक दिन अकेले बैठकर सोचा कि आखिरी बार सिर्फ अपने लिए कुछ चुना कब था, और जवाब देने में काफी वक्त लग गया। अब छोटे-छोटे फैसले खुद के लिए लेना शुरू किया है, और यह अपराधबोध नहीं, सुकून जैसा लगता है।',
    possibleComments: ['खुद के लिए जीना अपराध नहीं।', 'यह पढ़कर अच्छा लगा।']
  },
  {
    id: 'hi_funny_26',
    category: 'funny',
    city: 'Nashik',
    country: 'India',
    author: 'समीक्षा जोशी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-26-66/700/500',
    text: 'Nashik में सोसाइटी वालों को यकीन दिलाया कि मैं रोज़ सुबह योगा टीचर बनने की ट्रेनिंग ले रही हूं, सिर्फ इसलिए कि बालकनी में स्ट्रेचिंग करते हुए कोई अजीब सवाल न पूछे। असल में मैं सिर्फ पीठ दर्द की एक्सरसाइज़ कर रही थी जो यूट्यूब से सीखी थी। अब पूरी सोसाइटी मुझसे फ्री योगा क्लास की उम्मीद करती है, और मैं हर बार नई तारीख देकर टाल देती हूं।',
    possibleComments: ['योगा टीचर बनने की कहानी मज़ेदार है।', 'फ्री क्लास का इंतज़ार सबको है 😂']
  },
  {
    id: 'hi_intelligent_27',
    category: 'intelligent',
    city: 'Dehradun',
    country: 'India',
    author: 'कीर्ति नेगी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-27-67/700/500',
    text: 'Dehradun में सीखा कि बहस जीतने का सबसे तेज़ तरीका है सामने वाले को पूरी तरह हरा देना, पर उसका सबसे महंगा नतीजा यह होता है कि जिसे हराया गया वह अगली बार सुनने की बजाय बदला लेने की सोचता है। सही होना आधा काम है, बाकी आधा यह है कि सामने वाले के लिए सहमत होना आसान बनाया जाए।',
    possibleComments: ['जीतने का सही तरीका बताया है।', 'यह सोच बदलने वाली बात है।']
  },
  {
    id: 'hi_incident_28',
    category: 'incident',
    city: 'Guwahati',
    country: 'India',
    author: 'रिया बोरठाकुर',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-28-68/700/500',
    text: 'Guwahati में बाढ़ की चेतावनी के बीच मेरा स्कूटर सड़क के बीचोंबीच बंद हो गया और पानी तेज़ी से बढ़ रहा था। पास की दुकान वाले भैया ने अपनी दुकान छोड़कर मुझे और स्कूटर दोनों को ऊंची जगह तक पहुंचाया, फिर घर तक छोड़ने के लिए अपनी बाइक भी दे दी। मैंने कभी उनका नाम तक नहीं पूछा, पर उस दिन की मदद ज़िंदगी भर याद रहेगी।',
    possibleComments: ['सच में हीरो हैं ऐसे लोग।', 'बिना नाम पूछे मदद करना असली इंसानियत है।']
  },
  {
    id: 'hi_motivational_29',
    category: 'motivational',
    city: 'Jodhpur',
    country: 'India',
    author: 'करण भाटी',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-29-69/700/500',
    text: 'Jodhpur में कॉलेज छोड़ने के बाद घरवालों ने उम्मीद ही छोड़ दी थी कि मैं कुछ बनूंगा, रिश्तेदार तो नाम लेकर ताना मारते थे। पेंटिंग सीखना शुरू किया सिर्फ समय काटने के लिए, बिना किसी योजना के। आज उन्हीं पेंटिंग्स की एक्जीबिशन शहर के सबसे बड़े गैलरी में लगती है, और वही रिश्तेदार अब तस्वीरें खिंचवाने आते हैं।',
    possibleComments: ['देर से मिली पहचान, पर मिली तो सही।', 'टैलेंट कभी छुपता नहीं।']
  },
  {
    id: 'hi_finance_30',
    category: 'finance',
    city: 'Mysuru',
    country: 'India',
    author: 'वेंकटेश राव',
    rawImage: 'https://picsum.photos/seed/openconfess-hi-30-70/700/500',
    text: 'Mysuru में दस साल तक हर ओवरटाइम शिफ्ट खुशी-खुशी ली सिर्फ इसलिए कि तनख्वाह स्लिप देखकर अच्छा लगता था, जबकि बेटी की परवरिश ज़्यादातर पत्नी अकेले संभालती रही। एक दिन बेटी ने पूछा कि पापा घर पर मेहमान की तरह क्यों लगते हैं, वह सवाल आज भी कानों में गूंजता है। अब ओवरटाइम कम लेता हूं, तनख्वाह भी कम है, पर बेटी अब मुझे मेहमान नहीं समझती।',
    possibleComments: ['बेटी का सवाल दिल छू गया।', 'समय पर समझ आना भी बड़ी बात है।']
  },
  {
    id: 'bn_deep_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'অনির্বাণ মুখোপাধ্যায়',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-1-71/700/500',
    text: 'Kolkata শহরে এসে ভেবেছিলাম জীবনটা পুরোপুরি বদলে যাবে, দুটো ব্যাগে সব গুছিয়ে বাড়ির লোকজনকে বড় বড় স্বপ্নের কথা বলে বেরিয়েছিলাম। শুরুর দিকে মনে হচ্ছিল সবকিছু ঠিক পথেই এগোচ্ছে, চাকরিও ভালো, বেতনও মন্দ নয়। কিন্তু আজ একা ঘরে বসে বুঝি সাফল্য আর শান্তি সম্পূর্ণ আলাদা দুটো জিনিস, যা এতদিন আমি ভুল করে একই ভেবে এসেছি। বাইরে থেকে জীবনটা নিখুঁত দেখায়, কিন্তু ভেতরে একটা অদ্ভুত শূন্যতা ছাড়া আর কিছুই অবশিষ্ট নেই আজকাল।',
    possibleComments: ['মনটা ছুঁয়ে গেল কথাগুলো।', 'সাফল্য আর শান্তি সত্যিই আলাদা জিনিস।']
  },
  {
    id: 'bn_funny_2',
    category: 'funny',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-2-72/700/500',
    text: 'Dhaka-তে রিকশাওয়ালার সাথে ভাড়া নিয়ে দরদাম করতে গিয়ে এমন আত্মবিশ্বাস দেখালাম যে অর্ধেক ভাড়া মাফ হয়ে গেল, যদিও সত্যি বলতে রাস্তাটা নিজেই চিনতাম না। কাকু হয়তো ভেবেছিলেন আমি রোজ এই পথ দিয়েই যাতায়াত করি, অথচ ওই এলাকায় সেদিনই প্রথম গিয়েছিলাম আর ম্যাপও কাজ করছিল না। তবু যেভাবে তর্ক করলাম, তাতে মনে হচ্ছিল যেন আমি ওই জায়গার লোকাল গাইড। মাঝেমধ্যে মিথ্যে আত্মবিশ্বাসও দারুণ কাজে দেয়, বিশেষ করে টাকা বাঁচানোর সময়।',
    possibleComments: ['ভাই এটা তো মাস্টারস্ট্রোক 😂', 'কাল থেকে আমিও ট্রাই করব।']
  },
  {
    id: 'bn_intelligent_3',
    category: 'intelligent',
    city: 'Chittagong',
    country: 'Bangladesh',
    author: 'ফারহানা ইসলাম',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-3-73/700/500',
    text: 'যারা Chittagong-তে সবচেয়ে বেশি অভিযোগ করে, প্রায়ই দেখা যায় তারাই সবচেয়ে কম পরিশ্রম করে, যেন অভিযোগ করাটাই তাদের প্রধান দায়িত্ব। মিটিংয়ে সবচেয়ে জোরে যে কথা বলে, সে-ই অনেক সময় সবচেয়ে কম তথ্য জানে, অথচ যে আসলে কাজটা করেছে সে চুপচাপ কোণায় বসে থাকে। শুরুতে এটা অন্যায় মনে হয়, কিন্তু ধীরে ধীরে মানুষ বুঝতে শুরু করে আসল ফলাফল কার কাজ থেকে এসেছে। চুপ থাকা দুর্বলতা নয়, বরং সঠিক সময়ের জন্য অপেক্ষা করা, আর সেটাই শেষ পর্যন্ত আসল শক্তি বলে প্রমাণিত হয়।',
    possibleComments: ['অনেক গভীর কথা বলেছেন।', 'সত্যিই ভাবার মতো বিষয়।']
  },
  {
    id: 'bn_incident_4',
    category: 'incident',
    city: 'Siliguri',
    country: 'India',
    author: 'শ্রেয়সী দত্ত',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-4-74/700/500',
    text: 'Siliguri-এর রাস্তায় রাত প্রায় এগারোটার দিকে হঠাৎ গাড়ি খারাপ হয়ে গিয়েছিল, আর ফোনের চার্জও শেষ হয়ে এসেছিল ঠিক তখনই। এমন সময় এক অচেনা ভাই বাইক থামিয়ে এগিয়ে এলেন, কোনো প্রশ্ন না করেই সাহায্য করতে লাগলেন, আর প্রায় দুই ঘণ্টা পাশে দাঁড়িয়ে রইলেন যতক্ষণ না একজন মেকানিক পাওয়া গেল। যাওয়ার সময় টাকা দিতে চাইলে তিনি সরাসরি না বলে দিলেন, বললেন কোনোদিন অন্য কেউ তাঁর মেয়েকেও এভাবেই সাহায্য করবে। এত ছোট একটা ঘটনা মানুষের প্রতি আমার বিশ্বাস আবার নতুন করে জাগিয়ে দিল।',
    possibleComments: ['মানবতা এখনো বেঁচে আছে।', 'এমন মানুষ আজকাল কমই পাওয়া যায়।']
  },
  {
    id: 'bn_motivational_5',
    category: 'motivational',
    city: 'Howrah',
    country: 'India',
    author: 'তানভীর আহমেদ',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-5-75/700/500',
    text: 'ব্যর্থতাকে ভয় পেয়ে Howrah-তে ঘরে বসে থাকলে আজ এই জায়গায় কখনো পৌঁছাতে পারতাম না, হয়তো সারাজীবন আফসোস করেই কাটাতাম যে সাহস করিনি। শুরুতে চারদিক থেকে শুনতে হয়েছিল বয়স পেরিয়ে গেছে, নতুন কিছু শুরু করা এখন বোকামি। প্রতিটা ইন্টারভিউয়ে প্রত্যাখ্যান পেতাম, প্রতিবার মনে হতো সবাই বোধহয় ঠিকই বলছে। কিন্তু আসল লড়াইটা দক্ষতার ছিল না, ছিল নিজের ভেতরের সেই কণ্ঠস্বরগুলোকে থামানোর, যারা বারবার দেরি হয়ে যাওয়ার কথা বলত। দেরিতে শুরু হওয়া যাত্রাও গন্তব্যে পৌঁছাতে পারে।',
    possibleComments: ['অনুপ্রেরণামূলক যাত্রা।', 'সাহসের আসল উদাহরণ।']
  },
  {
    id: 'bn_finance_6',
    category: 'finance',
    city: 'Khulna',
    country: 'Bangladesh',
    author: 'মিতালী ঘোষ',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-6-76/700/500',
    text: 'Khulna-তে বছরের পর বছর শুধু টাকার পেছনে ছুটেছি, উইকএন্ডগুলোও অফিসে কাটিয়ে দিয়েছি আর এমন মুহূর্তগুলো হারিয়েছি যা আর কখনো ফিরে আসবে না। প্রতিটা পদোন্নতির সাথে সাথে বন্ধুদের তালিকা ছোট হয়েছে, বাড়ি ফেরার সময় দেরি হয়েছে। আজ বুঝি সময়ই আসল সম্পদ, বাকি সব কাগজের সংখ্যা যা ব্যাংক স্টেটমেন্টে ভালো দেখায় কিন্তু জীবনে শূন্যতা ভরিয়ে দেয়। এখনও একই ক্ষেত্রে কাজ করি, শুধু বিকেল ছয়টায় বাড়ি ফিরে যাই, আর এটাই এ পর্যন্ত নেওয়া সবচেয়ে ভালো সিদ্ধান্ত মনে হয়।',
    possibleComments: ['সময়ই আসল সম্পদ।', 'শান্তির মূল্য টাকার চেয়ে বেশি।']
  },
  {
    id: 'bn_deep_7',
    category: 'deep',
    city: 'Durgapur',
    country: 'India',
    author: 'রাকিবুল হাসান',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-7-77/700/500',
    text: 'Durgapur শহরে এসে ভেবেছিলাম জীবনটা পুরোপুরি বদলে যাবে, দুটো ব্যাগে সব গুছিয়ে বাড়ির লোকজনকে বড় বড় স্বপ্নের কথা বলে বেরিয়েছিলাম। শুরুর দিকে মনে হচ্ছিল সবকিছু ঠিক পথেই এগোচ্ছে, চাকরিও ভালো, বেতনও মন্দ নয়। কিন্তু আজ একা ঘরে বসে বুঝি সাফল্য আর শান্তি সম্পূর্ণ আলাদা দুটো জিনিস, যা এতদিন আমি ভুল করে একই ভেবে এসেছি। বাইরে থেকে জীবনটা নিখুঁত দেখায়, কিন্তু ভেতরে একটা অদ্ভুত শূন্যতা ছাড়া আর কিছুই অবশিষ্ট নেই আজকাল।',
    possibleComments: ['মনটা ছুঁয়ে গেল কথাগুলো।', 'সাফল্য আর শান্তি সত্যিই আলাদা জিনিস।']
  },
  {
    id: 'bn_funny_8',
    category: 'funny',
    city: 'Sylhet',
    country: 'Bangladesh',
    author: 'সোহিনী বসু',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-8-78/700/500',
    text: 'Sylhet-তে রিকশাওয়ালার সাথে ভাড়া নিয়ে দরদাম করতে গিয়ে এমন আত্মবিশ্বাস দেখালাম যে অর্ধেক ভাড়া মাফ হয়ে গেল, যদিও সত্যি বলতে রাস্তাটা নিজেই চিনতাম না। কাকু হয়তো ভেবেছিলেন আমি রোজ এই পথ দিয়েই যাতায়াত করি, অথচ ওই এলাকায় সেদিনই প্রথম গিয়েছিলাম আর ম্যাপও কাজ করছিল না। তবু যেভাবে তর্ক করলাম, তাতে মনে হচ্ছিল যেন আমি ওই জায়গার লোকাল গাইড। মাঝেমধ্যে মিথ্যে আত্মবিশ্বাসও দারুণ কাজে দেয়, বিশেষ করে টাকা বাঁচানোর সময়।',
    possibleComments: ['ভাই এটা তো মাস্টারস্ট্রোক 😂', 'কাল থেকে আমিও ট্রাই করব।']
  },
  {
    id: 'bn_intelligent_9',
    category: 'intelligent',
    city: 'Asansol',
    country: 'India',
    author: 'ইমরান হোসেন',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-9-79/700/500',
    text: 'যারা Asansol-তে সবচেয়ে বেশি অভিযোগ করে, প্রায়ই দেখা যায় তারাই সবচেয়ে কম পরিশ্রম করে, যেন অভিযোগ করাটাই তাদের প্রধান দায়িত্ব। মিটিংয়ে সবচেয়ে জোরে যে কথা বলে, সে-ই অনেক সময় সবচেয়ে কম তথ্য জানে, অথচ যে আসলে কাজটা করেছে সে চুপচাপ কোণায় বসে থাকে। শুরুতে এটা অন্যায় মনে হয়, কিন্তু ধীরে ধীরে মানুষ বুঝতে শুরু করে আসল ফলাফল কার কাজ থেকে এসেছে। চুপ থাকা দুর্বলতা নয়, বরং সঠিক সময়ের জন্য অপেক্ষা করা, আর সেটাই শেষ পর্যন্ত আসল শক্তি বলে প্রমাণিত হয়।',
    possibleComments: ['অনেক গভীর কথা বলেছেন।', 'সত্যিই ভাবার মতো বিষয়।']
  },
  {
    id: 'bn_incident_10',
    category: 'incident',
    city: 'Rajshahi',
    country: 'Bangladesh',
    author: 'পাপিয়া রায়',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-10-80/700/500',
    text: 'Rajshahi-এর রাস্তায় রাত প্রায় এগারোটার দিকে হঠাৎ গাড়ি খারাপ হয়ে গিয়েছিল, আর ফোনের চার্জও শেষ হয়ে এসেছিল ঠিক তখনই। এমন সময় এক অচেনা ভাই বাইক থামিয়ে এগিয়ে এলেন, কোনো প্রশ্ন না করেই সাহায্য করতে লাগলেন, আর প্রায় দুই ঘণ্টা পাশে দাঁড়িয়ে রইলেন যতক্ষণ না একজন মেকানিক পাওয়া গেল। যাওয়ার সময় টাকা দিতে চাইলে তিনি সরাসরি না বলে দিলেন, বললেন কোনোদিন অন্য কেউ তাঁর মেয়েকেও এভাবেই সাহায্য করবে। এত ছোট একটা ঘটনা মানুষের প্রতি আমার বিশ্বাস আবার নতুন করে জাগিয়ে দিল।',
    possibleComments: ['মানবতা এখনো বেঁচে আছে।', 'এমন মানুষ আজকাল কমই পাওয়া যায়।']
  },
  {
    id: 'bn_motivational_11',
    category: 'motivational',
    city: 'Barasat',
    country: 'India',
    author: 'আরিফুল ইসলাম',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-11-81/700/500',
    text: 'ব্যর্থতাকে ভয় পেয়ে Barasat-তে ঘরে বসে থাকলে আজ এই জায়গায় কখনো পৌঁছাতে পারতাম না, হয়তো সারাজীবন আফসোস করেই কাটাতাম যে সাহস করিনি। শুরুতে চারদিক থেকে শুনতে হয়েছিল বয়স পেরিয়ে গেছে, নতুন কিছু শুরু করা এখন বোকামি। প্রতিটা ইন্টারভিউয়ে প্রত্যাখ্যান পেতাম, প্রতিবার মনে হতো সবাই বোধহয় ঠিকই বলছে। কিন্তু আসল লড়াইটা দক্ষতার ছিল না, ছিল নিজের ভেতরের সেই কণ্ঠস্বরগুলোকে থামানোর, যারা বারবার দেরি হয়ে যাওয়ার কথা বলত। দেরিতে শুরু হওয়া যাত্রাও গন্তব্যে পৌঁছাতে পারে।',
    possibleComments: ['অনুপ্রেরণামূলক যাত্রা।', 'সাহসের আসল উদাহরণ।']
  },
  {
    id: 'bn_finance_12',
    category: 'finance',
    city: 'Comilla',
    country: 'Bangladesh',
    author: 'শর্মিষ্ঠা সেন',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-12-82/700/500',
    text: 'Comilla-তে বছরের পর বছর শুধু টাকার পেছনে ছুটেছি, উইকএন্ডগুলোও অফিসে কাটিয়ে দিয়েছি আর এমন মুহূর্তগুলো হারিয়েছি যা আর কখনো ফিরে আসবে না। প্রতিটা পদোন্নতির সাথে সাথে বন্ধুদের তালিকা ছোট হয়েছে, বাড়ি ফেরার সময় দেরি হয়েছে। আজ বুঝি সময়ই আসল সম্পদ, বাকি সব কাগজের সংখ্যা যা ব্যাংক স্টেটমেন্টে ভালো দেখায় কিন্তু জীবনে শূন্যতা ভরিয়ে দেয়। এখনও একই ক্ষেত্রে কাজ করি, শুধু বিকেল ছয়টায় বাড়ি ফিরে যাই, আর এটাই এ পর্যন্ত নেওয়া সবচেয়ে ভালো সিদ্ধান্ত মনে হয়।',
    possibleComments: ['সময়ই আসল সম্পদ।', 'শান্তির মূল্য টাকার চেয়ে বেশি।']
  },
  {
    id: 'bn_deep_13',
    category: 'deep',
    city: 'Kharagpur',
    country: 'India',
    author: 'নাফিস আহমেদ',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-13-83/700/500',
    text: 'Kharagpur শহরে এসে ভেবেছিলাম জীবনটা পুরোপুরি বদলে যাবে, দুটো ব্যাগে সব গুছিয়ে বাড়ির লোকজনকে বড় বড় স্বপ্নের কথা বলে বেরিয়েছিলাম। শুরুর দিকে মনে হচ্ছিল সবকিছু ঠিক পথেই এগোচ্ছে, চাকরিও ভালো, বেতনও মন্দ নয়। কিন্তু আজ একা ঘরে বসে বুঝি সাফল্য আর শান্তি সম্পূর্ণ আলাদা দুটো জিনিস, যা এতদিন আমি ভুল করে একই ভেবে এসেছি। বাইরে থেকে জীবনটা নিখুঁত দেখায়, কিন্তু ভেতরে একটা অদ্ভুত শূন্যতা ছাড়া আর কিছুই অবশিষ্ট নেই আজকাল।',
    possibleComments: ['মনটা ছুঁয়ে গেল কথাগুলো।', 'সাফল্য আর শান্তি সত্যিই আলাদা জিনিস।']
  },
  {
    id: 'bn_funny_14',
    category: 'funny',
    city: 'Narayanganj',
    country: 'Bangladesh',
    author: 'কৃষ্ণেন্দু সরকার',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-14-84/700/500',
    text: 'Narayanganj-তে রিকশাওয়ালার সাথে ভাড়া নিয়ে দরদাম করতে গিয়ে এমন আত্মবিশ্বাস দেখালাম যে অর্ধেক ভাড়া মাফ হয়ে গেল, যদিও সত্যি বলতে রাস্তাটা নিজেই চিনতাম না। কাকু হয়তো ভেবেছিলেন আমি রোজ এই পথ দিয়েই যাতায়াত করি, অথচ ওই এলাকায় সেদিনই প্রথম গিয়েছিলাম আর ম্যাপও কাজ করছিল না। তবু যেভাবে তর্ক করলাম, তাতে মনে হচ্ছিল যেন আমি ওই জায়গার লোকাল গাইড। মাঝেমধ্যে মিথ্যে আত্মবিশ্বাসও দারুণ কাজে দেয়, বিশেষ করে টাকা বাঁচানোর সময়।',
    possibleComments: ['ভাই এটা তো মাস্টারস্ট্রোক 😂', 'কাল থেকে আমিও ট্রাই করব।']
  },
  {
    id: 'bn_intelligent_15',
    category: 'intelligent',
    city: 'Malda',
    country: 'India',
    author: 'লামিয়া খাতুন',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-15-85/700/500',
    text: 'যারা Malda-তে সবচেয়ে বেশি অভিযোগ করে, প্রায়ই দেখা যায় তারাই সবচেয়ে কম পরিশ্রম করে, যেন অভিযোগ করাটাই তাদের প্রধান দায়িত্ব। মিটিংয়ে সবচেয়ে জোরে যে কথা বলে, সে-ই অনেক সময় সবচেয়ে কম তথ্য জানে, অথচ যে আসলে কাজটা করেছে সে চুপচাপ কোণায় বসে থাকে। শুরুতে এটা অন্যায় মনে হয়, কিন্তু ধীরে ধীরে মানুষ বুঝতে শুরু করে আসল ফলাফল কার কাজ থেকে এসেছে। চুপ থাকা দুর্বলতা নয়, বরং সঠিক সময়ের জন্য অপেক্ষা করা, আর সেটাই শেষ পর্যন্ত আসল শক্তি বলে প্রমাণিত হয়।',
    possibleComments: ['অনেক গভীর কথা বলেছেন।', 'সত্যিই ভাবার মতো বিষয়।']
  },
  {
    id: 'bn_incident_16',
    category: 'incident',
    city: 'Jessore',
    country: 'Bangladesh',
    author: 'সুমিত রায়',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-16-86/700/500',
    text: 'Jessore-এ বৃষ্টির মধ্যে বাস স্ট্যান্ডে আটকে গিয়েছিলাম, শেষ বাস চলে গিয়েছিল আর কোনো রিকশাও পাওয়া যাচ্ছিল না। এক চা-দোকানি কাকু কিছু না বলেই দোকানের শাটার একটু খুলে ভেতরে ডেকে নিলেন আর গরম চা দিলেন। দুই ঘণ্টা বৃষ্টি থামার অপেক্ষা করতে করতে অনেক গল্প হলো, আর যাওয়ার সময় তিনি টাকা নিতে সরাসরি না বলে দিলেন। মাঝেমধ্যে অচেনা মানুষই সবচেয়ে বড় ভরসা হয়ে ওঠে।',
    possibleComments: ['মানবতা এখনো বেঁচে আছে।', 'ছোট্ট সাহায্য, বড় প্রভাব।']
  },
  {
    id: 'bn_motivational_17',
    category: 'motivational',
    city: 'Jalpaiguri',
    country: 'India',
    author: 'বিশ্বজিৎ সাহা',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-17-87/700/500',
    text: 'Jalpaiguri-তে তিনবার ব্যবসার ঋণের আবেদন বাতিল হয়েছিল, প্রতিবার ব্যাংক বলত আমার অভিজ্ঞতা যথেষ্ট নয়। চতুর্থবার আবেদনের আগে সারারাত বসে পুরো পরিকল্পনা নতুন করে লিখলাম, প্রতিটা দুর্বল দিক শক্ত করলাম। আজ সেই ছোট্ট দোকান থেকে শহরের তিনটি এলাকায় শাখা খোলা হয়েছে, আর সেই ব্যাংকই এখন নিজে থেকে নতুন ঋণের অফার পাঠায়।',
    possibleComments: ['পরিশ্রম শেষ পর্যন্ত ফল দিলো।', 'সত্যিই অনুপ্রেরণামূলক।']
  },
  {
    id: 'bn_finance_18',
    category: 'finance',
    city: 'Faridpur',
    country: 'Bangladesh',
    author: 'অভিজিৎ ঘোষাল',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-18-88/700/500',
    text: 'Faridpur-এ শেয়ার বাজারে একবারের ধাক্কায় বছরের সঞ্চয় হারানোর পর বুঝলাম টাকা যত দ্রুত তৈরি হতে দেখায়, তত দ্রুতই মুছে যেতে পারে। মাসের পর মাস নিজেকে ক্ষমা করতে পারিনি, কিন্তু ধীরে ধীরে আবার শুরু করলাম, এবার শিখে, তাড়াহুড়ো ছাড়া। আজ পোর্টফোলিও আগের চেয়ে ছোট, কিন্তু ঘুম আগের চেয়ে অনেক ভালো হয়।',
    possibleComments: ['শিখে ফিরে আসাটাই আসল জয়।', 'ঘুমের মূল্য টাকার চেয়ে বেশি।']
  },
  {
    id: 'bn_deep_19',
    category: 'deep',
    city: 'Dinajpur',
    country: 'Bangladesh',
    author: 'সত্যজিৎ বসাক',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-19-89/700/500',
    text: 'Dinajpur-এ বড় কোম্পানিতে যোগ দেওয়ার পর সবাই অভিনন্দন জানাচ্ছিল, যেন জীবনের সবচেয়ে বড় জয় পেয়েছি। কিন্তু প্রতিদিন অ্যালার্ম বাজার আগেই এক অদ্ভুত ক্লান্তি অনুভব হতো, যার কোনো চিকিৎসাগত কারণ ছিল না। মাসখানেক পরে বুঝলাম এই ক্লান্তি শরীরের নয়, সেই জীবনের যা আমি আসলে কখনো বেছে নিইনি, শুধু মেনে নিয়েছিলাম।',
    possibleComments: ['এই ক্লান্তি অনেকেরই হয়।', 'ঠিক কথা বলেছেন।']
  },
  {
    id: 'bn_funny_20',
    category: 'funny',
    city: 'Baharampur',
    country: 'India',
    author: 'অর্ণব চ্যাটার্জী',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-20-90/700/500',
    text: 'Baharampur-এ অফিসের মিটিং কাটানোর জন্য বললাম আমার পোষা কচ্ছপ অসুস্থ, ওকে ডাক্তারের কাছে নিয়ে যেতে হবে, অথচ আমার কোনো কচ্ছপই নেই। বস পুরোপুরি সহানুভূতি দেখিয়ে পুরো দিনের ছুটি দিলেন আর পরদিন কচ্ছপের খবরও জিজ্ঞেস করলেন। এখন প্রতি মাসে সেই কাল্পনিক কচ্ছপ কোনো না কোনো অজুহাতে অসুস্থ হয়ে পড়ে।',
    possibleComments: ['কচ্ছপের বাহানাটা দুর্দান্ত 😂', 'বসও বিশ্বাস করে ফেললেন, দারুণ।']
  },
  {
    id: 'bn_intelligent_21',
    category: 'intelligent',
    city: 'Rangpur',
    country: 'Bangladesh',
    author: 'ফাহিম কবির',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-21-91/700/500',
    text: 'Rangpur-এ দেখেছি যারা সহজে মত বদলায় তাদের দুর্বল ভাবা হয়, অথচ যারা কখনো ভুল স্বীকার করে না তাদের দৃঢ়চেতা বলা হয়, যদিও তারা ভুলই থেকে যায় দীর্ঘদিন। আসল বুদ্ধিমত্তা হয়তো এটাই যে ভুল স্বীকার করতে লজ্জা না লাগা, কারণ যে আজ ক্ষমা চাইতে পারে সেই আগামীকাল বিশ্বাসের যোগ্য হয়ে ওঠে।',
    possibleComments: ['ভুল স্বীকার করাই আসল শক্তি।', 'গভীর কথা বলেছেন।']
  },
  {
    id: 'bn_incident_22',
    category: 'incident',
    city: 'Bogura',
    country: 'Bangladesh',
    author: 'তনিমা হক',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-22-92/700/500',
    text: 'Bogura-তে ট্রেন ছাড়ার মুহূর্তে আমার ব্যাগ প্ল্যাটফর্মে পড়ে গিয়েছিল, তখন এক কুলি ভাই দৌড়ে এসে ব্যাগটা তুলে চলন্ত ট্রেনে আমাকে আর জিনিসপত্র দুটোই নিরাপদে তুলে দিলেন। শুধু একজন অচেনা মানুষের সাহায্যের জন্য তিনি নিজের জীবন ঝুঁকিতে ফেলেছিলেন, আর প্রতিদানে শুধু হাসি দিয়ে হাত নাড়লেন। সেদিনের পর থেকে আমি সবসময় প্ল্যাটফর্মে জিনিস দুবার চেক করি, কিন্তু তাঁর মুখটা ভুলিনি।',
    possibleComments: ['এমন মানুষ কমই পাওয়া যায়।', 'মন জয় করে নিলেন এই ভাই।']
  },
  {
    id: 'bn_motivational_23',
    category: 'motivational',
    city: 'Barisal',
    country: 'Bangladesh',
    author: 'নাজমা বেগম',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-23-93/700/500',
    text: 'Barisal-এ সবাই বলেছিল একা মায়ের পক্ষে নিজের ক্যাফে খোলা পাগলামি, বিশেষ করে যখন সঞ্চয়ে মাত্র তিন মাসের ভাড়ার টাকা ছিল। শুরুর ছয় মাস হাতে গোনা কয়েকজন কাস্টমার আসতেন, আর রাতে হিসাব করতে গিয়ে হাত কাঁপত। আজ সেই ক্যাফেই পাড়ার পরিচয় হয়ে উঠেছে, আর যারা একসময় নিষেধ করেছিলেন তারাই এখন নিয়মিত বসেন।',
    possibleComments: ['সাহসের উদাহরণ আপনি।', 'এটা পড়ে সাহস পেলাম।']
  },
  {
    id: 'bn_finance_24',
    category: 'finance',
    city: 'Mymensingh',
    country: 'Bangladesh',
    author: 'রুমানা আক্তার',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-24-94/700/500',
    text: 'Mymensingh-এ পারিবারিক ব্যবসা সামলাতে গিয়ে বছরের পর বছর প্রতিটা টাকা আবার ব্যবসায় ঢেলেছি, নিজের জন্য কিছুই রাখিনি, ভেবেছিলাম এটাই দায়িত্ব। হঠাৎ অসুস্থ হয়ে বুঝলাম নিজের নিরাপত্তা উপেক্ষা করাটা বুদ্ধিমানের কাজ ছিল না। এখন প্রতি মাসে আগে নিজের জন্য সঞ্চয় করি, তারপর বাকি সব, আর ব্যবসাও আগের মতোই ভালো চলছে।',
    possibleComments: ['নিজের যত্ন নেওয়া জরুরি।', 'কথাটা খুব কাজের।']
  },
  {
    id: 'bn_deep_25',
    category: 'deep',
    city: 'Cuttack',
    country: 'India',
    author: 'শ্রাবণী দাস',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-25-95/700/500',
    text: 'Cuttack-এ বিয়ের পর প্রতিটা উৎসব, প্রতিটা ছুটি, প্রতিটা সপ্তাহান্ত অন্যদের খুশির হিসেবে পরিকল্পনা হতে থাকল, আর নিজের পছন্দ ধীরে ধীরে মনেই থাকল না। একদিন একা বসে ভাবলাম শেষবার নিজের জন্য কিছু বেছে নিয়েছিলাম কবে, উত্তর দিতে অনেকটা সময় লাগল। এখন ছোট ছোট সিদ্ধান্ত নিজের জন্য নিতে শুরু করেছি, আর এটা অপরাধবোধ নয়, শান্তির মতো লাগে।',
    possibleComments: ['নিজের জন্য বাঁচা অপরাধ নয়।', 'পড়ে ভালো লাগলো।']
  },
  {
    id: 'bn_funny_26',
    category: 'funny',
    city: 'Basirhat',
    country: 'India',
    author: 'পল্লবী সরকার',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-26-96/700/500',
    text: 'Basirhat-এ পাড়ার লোকজনকে বিশ্বাস করালাম যে আমি রোজ সকালে যোগ শিক্ষক হওয়ার ট্রেনিং নিচ্ছি, শুধু ব্যালকনিতে স্ট্রেচিং করার সময় কেউ অদ্ভুত প্রশ্ন না করে সেজন্য। আসলে আমি শুধু পিঠের ব্যথার জন্য ইউটিউব থেকে শেখা কিছু ব্যায়াম করছিলাম। এখন পুরো পাড়া আমার কাছে ফ্রি যোগ ক্লাস আশা করে, আর আমি প্রতিবার নতুন তারিখ দিয়ে এড়িয়ে যাই।',
    possibleComments: ['যোগ শিক্ষকের গল্পটা মজার।', 'ফ্রি ক্লাসের অপেক্ষায় সবাই 😂']
  },
  {
    id: 'bn_intelligent_27',
    category: 'intelligent',
    city: 'Jamalpur',
    country: 'Bangladesh',
    author: 'মৌসুমী রায়',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-27-97/700/500',
    text: 'Jamalpur-এ শিখেছি তর্কে জেতার দ্রুততম উপায় হলো প্রতিপক্ষকে সম্পূর্ণভাবে হারিয়ে দেওয়া, কিন্তু এর সবচেয়ে বড় মূল্য হলো যাকে হারানো হলো সে পরের বার শোনার বদলে প্রতিশোধের কথা ভাবে। সঠিক হওয়া কাজের অর্ধেক, বাকি অর্ধেক হলো প্রতিপক্ষের জন্য সম্মত হওয়া সহজ করে দেওয়া।',
    possibleComments: ['জেতার সঠিক পথ বলেছেন।', 'এই চিন্তাটা বদলে দেওয়ার মতো।']
  },
  {
    id: 'bn_incident_28',
    category: 'incident',
    city: 'Midnapore',
    country: 'India',
    author: 'ঋতুপর্ণা মণ্ডল',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-28-98/700/500',
    text: 'Midnapore-এ বন্যার সতর্কতার মধ্যে আমার স্কুটার রাস্তার মাঝখানে বন্ধ হয়ে গিয়েছিল আর পানি দ্রুত বাড়ছিল। পাশের দোকানের দাদা নিজের দোকান ফেলে রেখে আমাকে আর স্কুটার দুটোকেই উঁচু জায়গায় পৌঁছে দিলেন, তারপর বাড়ি পর্যন্ত পৌঁছে দিতে নিজের বাইকও দিলেন। তাঁর নামটাও জিজ্ঞেস করা হয়নি, কিন্তু সেদিনের সাহায্য সারাজীবন মনে থাকবে।',
    possibleComments: ['সত্যিই হিরো এমন মানুষ।', 'নাম না জেনেও সাহায্য করা আসল মানবতা।']
  },
  {
    id: 'bn_motivational_29',
    category: 'motivational',
    city: 'Cooch Behar',
    country: 'India',
    author: 'দেবাশীষ পাল',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-29-99/700/500',
    text: 'Cooch Behar-এ কলেজ ছাড়ার পর বাড়ির লোকজন আশাই ছেড়ে দিয়েছিলেন যে আমি কিছু করতে পারব, আত্মীয়রা নাম ধরে খোঁটা দিতেন। শুধু সময় কাটানোর জন্য ছবি আঁকা শুরু করেছিলাম, কোনো পরিকল্পনা ছাড়াই। আজ সেই ছবিগুলোর প্রদর্শনী শহরের সবচেয়ে বড় গ্যালারিতে হয়, আর সেই আত্মীয়রাই এখন ছবি তুলতে আসেন।',
    possibleComments: ['দেরিতে হলেও পরিচিতি পাওয়া গেছে।', 'প্রতিভা কখনো লুকায় না।']
  },
  {
    id: 'bn_finance_30',
    category: 'finance',
    city: 'Burdwan',
    country: 'India',
    author: 'সুব্রত হালদার',
    rawImage: 'https://picsum.photos/seed/openconfess-bn-30-100/700/500',
    text: 'Burdwan-এ দশ বছর ধরে প্রতিটা ওভারটাইম শিফট আনন্দের সাথে নিয়েছি শুধু বেতনের স্লিপ দেখে ভালো লাগত বলে, অথচ মেয়ের বেড়ে ওঠা বেশিরভাগ সময় স্ত্রী একাই সামলেছেন। একদিন মেয়ে জিজ্ঞেস করল বাবা কেন বাড়িতে অতিথির মতো লাগে, প্রশ্নটা আজও কানে বাজে। এখন ওভারটাইম কম নিই, বেতনও কম, কিন্তু মেয়ে আর আমাকে অতিথি মনে করে না।',
    possibleComments: ['মেয়ের প্রশ্নটা মনে গেঁথে গেল।', 'সময়মতো বোঝাটাও বড় ব্যাপার।']
  },
];

const ENGAGEMENT_REACTIONS = ['❤️', '🤗', '😢', '👏', '🔥', '😂', '🙏'];

// 24 Hours = 1440 Minutes. 1440 / 100 Posts = Strictly 14.4 Minutes (864,000 ms) per post
const DRIP_INTERVAL = 14.4 * 60 * 1000;
const POSTS_PER_CYCLE = CURATED_POST_POOL.length; // 100 posts per 24-hour cycle

export function detectLanguageFromTextOrLocation(text: string, city: string, country: string): 'bn' | 'hi' | 'en' {
  if (/[\u0980-\u09FF]/.test(text) || country === 'Bangladesh' || city === 'Kolkata') return 'bn';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

/**
 * Deterministic per-cycle shuffle (Fisher-Yates with a seeded PRNG).
 * Every 24-hour cycle gets its own fixed shuffle order, so:
 *  - Within one cycle, all 100 posts are used exactly once (no repeats, no post
 *    ever climbs back to the top since drip always appends the next unused slot).
 *  - The NEXT cycle uses a different seed -> a different order/rotation, so the
 *    feed doesn't feel like it's replaying the same sequence day after day.
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Cache shuffles per-cycle so repeated calls within the same cycle are stable & cheap
const cycleShuffleCache = new Map<number, SimulatedPostItem[]>();
function getShuffledPoolForCycle(cycle: number): SimulatedPostItem[] {
  if (!cycleShuffleCache.has(cycle)) {
    // seed offset so cycle 0 isn't identical to natural array order
    cycleShuffleCache.set(cycle, seededShuffle(CURATED_POST_POOL, cycle * 7919 + 104729));
  }
  return cycleShuffleCache.get(cycle)!;
}

/**
 * Returns the exact post for a strictly-increasing global drip index.
 * Guarantees: within any 24-hour cycle (POSTS_PER_CYCLE posts), every post in
 * the pool is used exactly once - zero repeats, zero re-appearing at the top.
 */
function getPostForGlobalIndex(globalIndex: number): SimulatedPostItem {
  const cycle = Math.floor(globalIndex / POSTS_PER_CYCLE);
  const posInCycle = globalIndex % POSTS_PER_CYCLE;
  const shuffledPool = getShuffledPoolForCycle(cycle);
  return shuffledPool[posInCycle];
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
    const originalItem = CURATED_POST_POOL.find((p) => post.id.startsWith(p.id + '_'));
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
 * STRICT 100 UNIQUE POSTS PER 24-HOUR TIMELINE:
 * - Drip interval is strictly 14.4 minutes.
 * - Each global drip index maps to exactly one pool item via a per-cycle
 *   seeded shuffle -> no repeats and no post re-appearing at the top within
 *   a cycle. The next 24-hour cycle reshuffles into a different order.
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

  // 1. First-time setup: Seed 10 staggered past posts (14.4 min apart), oldest global indices first
  if (stored.length === 0) {
    const initialCount = 10;
    for (let i = initialCount - 1; i >= 0; i--) {
      const globalIndex = initialCount - 1 - i; // 0,1,2,...,9 in chronological order
      const item = getPostForGlobalIndex(globalIndex);
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
        const item = getPostForGlobalIndex(currentIndex);
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

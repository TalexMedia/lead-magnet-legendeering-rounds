// Regenerates content.js and stamps a content hash onto the script URL in index.html.
// Run from this folder:  node build-content.js
// Two sides per round. Sides that exist in the block library are copied byte for byte.
const fs = require('fs');
const path = require('path');
const libPath = path.join(__dirname, '..', '..', 'ProspectAudit', 'templates', 'format-blocks.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8')).blocks;

function fromBlock(id, extra) {
  const b = lib[id]; if (!b) throw new Error('missing block ' + id);
  return Object.assign({ id, scale: b.scale, title: b.cardTitle, video: b.video, spec: b.spec, stats: b.stats, note: b.note, fromLibrary: true }, extra || {});
}

// Authored sides use the same shape. Figures are verbatim from the source named in the round's cite.
const SIDES = {
  ricos: fromBlock('sitcom-ricos-tacos', { name: "P&G and Albertsons, Rico's Tacos" }),
  rentSlot: { id: 'rent-slot', name: 'Thirty seconds in somebody else\'s show', scale: 'The old way · Rented attention', title: 'A thirty-second spot inside someone else\'s program', video: null, poster: ['30 SECONDS', 'IN SOMEONE ELSE\'S SHOW'],
    spec: [['What it is', 'The model the networks built in the 1950s: the sponsor loses the show and rents a slot inside it.'], ['Who did it', 'Almost everyone, including P&G for seventy years after inventing the soap opera.'], ['Runs', '30 seconds, then the show comes back']],
    stats: [['1950s', 'When The Slot Replaced The Show'], ['Rented', 'What The Attention Is'], ['Skipped', 'What Happens To It']], note: 'P&G invented the soap opera as branded content in 1933 and later spent decades buying slots instead. Tom Langan, What\'s 100 Years Old is New Again, 22 May 2026.' },

  bestWorst: { id: 'best-worst-team', name: 'Specsavers, The Best Worst Team', scale: 'Long-Form Episodic · Docuseries', title: 'A returning documentary series', video: { id: 'NdL2VYNYpQE', label: "There's More to Cwm, Specsavers' Best Worst Team, Series 2, Episode 1", caption: "There's More to Cwm · Specsavers' Best Worst Team" }, poster: null,
    spec: [['Format', 'A docuseries following one team over a season, narrated by Jill Scott.'], ['A company that did it', 'Specsavers, The Best Worst Team. An eight-part YouTube series about the worst football team in the country.'], ['Episode length', '10-20 minutes per episode']],
    stats: [['23.3M', 'YouTube Views'], ['5 min', 'Average Watch Time'], ['+35%', 'Brand Consideration']], note: 'Figures from the campaign\'s award entry as reported by The Drum, 13 November 2024. <a href="https://www.thedrum.com/news/2024/11/13/here-s-how-specsavers-won-over-gen-z-sponsoring-the-nation-s-worst-football-team" target="_blank" rel="noopener">Source</a>' },
  sgts: { id: 'sgts-tv', name: 'Specsavers, "Should\'ve gone to Specsavers" on TV', scale: 'The old way · Thirty-second commercials', title: 'One of the best-known slogans in Britain, in TV spots', video: null, poster: ['SHOULD\'VE GONE', 'TO SPECSAVERS'],
    spec: [['What it is', 'Thirty-second television commercials built on a slogan.'], ['Who did it', 'Specsavers, for years, on television.'], ['Runs', '30 seconds']],
    stats: [['30%', 'Of Gen Z Reached By TV Ads'], ['Dad gag', 'What Gen Z Called The Slogan'], ['TV', 'Where It Ran']], note: 'The same source: TV advertising reached 30 percent of Gen Z, and the slogan "was seen as the \'ultimate dad gag\'". The Drum, 13 November 2024.' },

  secondAct: fromBlock('docuseries-mailchimp-second-act', { name: 'Mailchimp, Second Act, made with Vice' }),
  sponsor: { id: 'sponsor', name: 'Mailchimp sponsoring other people\'s shows', scale: 'The old way · Sponsorship', title: 'Paying to sit inside the thing the audience came for', video: null, poster: ['SPONSORED', 'BY MAILCHIMP'],
    spec: [['What it is', 'Sponsoring shows and podcasts other people make.'], ['Who did it', 'Mailchimp, before it built its own studio.'], ['Runs', 'A logo and a read, inside someone else\'s episode']],
    stats: [['"Paying rent"', 'The Brand\'s Own Words'], ['$2.3M', 'Ad Spend, Q1 2018'], ['$1.9M', 'Ad Spend, Q1 2019']], note: 'Mark DiCristina, Mailchimp, quoted by Tim Peterson, Digiday, 29 July 2019. <a href="https://digiday.com/future-of-tv/mailchimp-has-cut-back-on-traditional-brand-advertising-to-invest-in-producing-original-shows-podcasts/" target="_blank" rel="noopener">Source</a>' },

  weekly: { id: 'weekly', name: 'YouTube creators posting every week', scale: 'Consistency · Every week, for years', title: 'A show that never goes silent', video: null, poster: ['EVERY WEEK', 'FOR YEARS'],
    spec: [['What it is', 'People posting on a schedule the audience can count on, to the same people every time.'], ['Who did it', 'YouTube, the number one distributor of television viewing in the US for eight straight months.'], ['Runs', 'Weekly, without a gap']],
    stats: [['12.7%', 'Of All US TV Watched, December'], ['#1', 'Distributor, Eight Months Running'], ['$0', 'Studio Money']], note: 'Nielsen\'s monthly measure as cited by Tom Langan, Bigger Isn\'t Always Better, 8 July 2026. Check first hand before a prospect sees it.' },
  silent: { id: 'silent', name: 'A Netflix hit that waits two years for season two', scale: 'The old way · Big budget, long silence', title: 'A hundred million dollars, then two years of nothing', video: null, poster: ['SEASON TWO', 'TWO YEARS LATER'],
    spec: [['What it is', 'A month to read the numbers, then a season written, shot and finished.'], ['Who did it', 'Netflix, on four named hits.'], ['Runs', 'Close to two years between seasons']],
    stats: [['60%', 'Avatar, Audience Lost By S2'], ['80%', 'A Good Girl\'s Guide, Lost By S2'], ['66%', 'A Man On The Inside, Lost By S2']], note: 'Bloomberg\'s report as cited by Tom Langan, Bigger Isn\'t Always Better, 8 July 2026.' },

  michelin: { id: 'michelin', name: 'Michelin, the 1900 guide', scale: 'Give Without Expectation · A gift', title: 'Thirty-five thousand free guides', video: null, poster: ['THE MICHELIN', 'GUIDE, 1900'],
    spec: [['What it is', 'Maps, routes, how to fix a flat, mechanics, hotels and fuel. Built to get people driving farther and more often.'], ['Who did it', 'André and Édouard Michelin, in a country with fewer than 3,000 cars.'], ['Runs', 'Still running, 125 years later']],
    stats: [['35,000', 'Free Copies, 1900'], ['<3,000', 'Cars In France'], ['125 yrs', 'Still The Guide']], note: 'Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026.' },
  tireAds: { id: 'tire-ads', name: 'Advertising tires to three thousand drivers', scale: 'The old way · Asking for the sale', title: 'Begging a tiny market to buy more', video: null, poster: ['BUY MORE', 'TIRES'],
    spec: [['What it is', 'Adverts aimed at the few people who already own a car.'], ['Who did it', 'Any tire company that led with the sale.'], ['Runs', 'Until the reader turns the page']],
    stats: [['<3,000', 'Customers To Ask'], ['1 set', 'Tires Worn Out Per Year'], ['Strings', 'Attached']], note: 'Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026.' },

  hubspot: { id: 'hubspot', name: 'HubSpot, plain answers to real questions', scale: 'Be Relentlessly Authentic · The honest answer', title: 'Pages that answer what a buyer actually asks', video: null, poster: ['A REAL', 'ANSWER'],
    spec: [['What it is', 'Plain-language pages answering the questions buyers ask, such as whether it works for their industry.'], ['Who did it', 'HubSpot, summer 2025, after finding it often did not appear in AI answers.'], ['Runs', 'Written content, not video']],
    stats: [['3x', 'Conversion, Leads From AI Search'], ['#1', 'Most Visible CRM In AI Search'], ['Reddit', 'What The AI Trusted']], note: 'HubSpot\'s reported results as cited by Tom Langan, Keywords Don\'t Fix Leaky Pipes, 17 June 2026. Link the original write-up before a prospect sees it.' },
  keywords: { id: 'keywords', name: 'Keyword stuffing to please Google', scale: 'The old way · Tricking a machine', title: 'Twenty years of cramming in the right words', video: null, poster: ['KEYWORD', 'KEYWORD KEYWORD'],
    spec: [['What it is', 'Finding the right keywords, stacking them into the site, climbing the rankings.'], ['Who did it', 'Almost everyone, for twenty years.'], ['Runs', 'Until the algorithm moves on']],
    stats: [['Absent', 'HubSpot In AI Answers, Before'], ['40%', 'Of Young Users Search Elsewhere First'], ['0', 'Pipes Fixed']], note: 'Tom Langan, Keywords Don\'t Fix Leaky Pipes, 17 June 2026.' },

  polaroid: { id: 'polaroid', name: 'Polaroid, The Camera for an Analog Life', scale: 'Be Relentlessly Authentic · Showing humanity', title: 'Building things a machine can\'t', video: null, poster: ['REAL STORIES.', 'NOT STORIES AND REELS.'],
    spec: [['What it is', 'Handwritten billboards next to Apple Stores and Google offices, and phone-free walking tours in Paris and Tokyo.'], ['Who did it', 'Polaroid, 2025.'], ['Runs', 'A campaign and an experience, not a series']],
    stats: [['78%', 'Would Rather See Work Made By People'], ['68%', 'Don\'t Mind AI If Ads Are Relevant'], ['Analog', 'What The Product Is']], note: 'Canva\'s State of Marketing and AI Report, as cited by Tom Langan, Breaking: Humans Still Prefer Humans, 4 June 2026.' },
  machine: { id: 'machine', name: 'Content a machine made because it was cheaper', scale: 'The old way · The faster option', title: 'Cut the crew, let the model write it', video: null, poster: ['GENERATED', 'CONTENT'],
    spec: [['What it is', 'Automating the work because it costs less.'], ['Who did it', 'Whoever took the cheaper, faster option.'], ['Runs', 'Until the audience notices']],
    stats: [['54%', 'Of Americans Report AI Fatigue'], ['Less', 'Likely To Trust, Click Or Buy'], ['Cheaper', 'To Make']], note: 'Tom Langan, Breaking: Humans Still Prefer Humans, 4 June 2026.' }
};

const ROUNDS = [
  { id: 'own-or-rent', job: 'Own the show, or rent thirty seconds in someone else\'s?', lens: ['Give Without Expectation', 'Consistency Is Key'], sides: ['ricos', 'rentSlot'], winner: 'ricos', measure: 'the one that earns a return visit',
    quote: '"Instead of buying 30 seconds inside someone else\'s show, P&G decided to simply own the program outright." "You need it to be episodic, because a series earns you a return visit and a one off never does." "Attention you earn beats attention you rent every single time, because it arrives with a little trust already attached to it."',
    cite: 'Tom Langan, Welcome to The Taco Drama, 30 July 2026', url: 'https://www.linkedin.com/pulse/welcome-taco-drama-tom-langan-wusce',
    teach: 'A series earns a return visit. A one-off never does.',
    why: { question: 'Why did the show work, in Tom\'s words?', options: [ { side: 'ricos', text: 'A series earns a return visit, and the attention arrives with trust already attached.' }, { side: 'rentSlot', text: 'It had the biggest media budget in grocery.' }, { side: 'rentSlot', text: 'It ran as a thirty-second spot in prime time.' } ] } },
  { id: 'series-or-ad', job: 'A series about them, or an ad about you?', lens: ['It\'s Not About You. It\'s About Them.', 'Give Without Expectation'], sides: ['bestWorst', 'sgts'], winner: 'bestWorst', measure: 'the one that reached Gen Z',
    quote: '"Gen Z audiences and younger are social natives, they spend less time watching TV, than any other age group, so a large proportion of our target audience were simply not as familiar with the Specsavers\' brand." "what was once a celebrated slogan, SGTS, that had worked wonders ATL, wasn\'t working for this audience, it was seen as the \'ultimate dad gag\'."',
    cite: 'The Drum, from the campaign\'s award entry, 13 November 2024', url: 'https://www.thedrum.com/news/2024/11/13/here-s-how-specsavers-won-over-gen-z-sponsoring-the-nation-s-worst-football-team',
    teach: 'A series that is about them reaches the people your ads cannot.',
    why: { question: 'Why did the series reach Gen Z when the slogan could not?', options: [ { side: 'sgts', text: 'The slogan was new to that audience.' }, { side: 'bestWorst', text: 'The series was about the team, not about glasses, so people chose to watch it.' }, { side: 'sgts', text: 'TV reached more of Gen Z than YouTube did.' } ] } },
  { id: 'own-shows-or-sponsor', job: 'Make your own shows, or sponsor other people\'s?', lens: ['Give Without Expectation', 'It\'s Not About You. It\'s About Them.'], sides: ['secondAct', 'sponsor'], winner: 'secondAct', measure: 'the one that reached its best customers',
    quote: '"As long as we\'re sponsoring shows, we\'re paying rent to get in front of people. We\'re interrupting the thing that they want to be engaged with." "They tend to be really, really similar to our most valuable customers," said Mark DiCristina. "They tend to pay us more. They tend to pay us more quickly. They tend to be more engaged."',
    cite: 'Mark DiCristina, Mailchimp, quoted by Tim Peterson, Digiday, 29 July 2019', url: 'https://digiday.com/future-of-tv/mailchimp-has-cut-back-on-traditional-brand-advertising-to-invest-in-producing-original-shows-podcasts/',
    teach: 'Rent gets you in front of people. Owning the show gets you the ones who become customers.',
    why: { question: 'Why did Mailchimp say its own shows worked better?', options: [ { side: 'secondAct', text: 'The shows reached people who looked like its most valuable customers.' }, { side: 'sponsor', text: 'The shows ran on broadcast television.' }, { side: 'sponsor', text: 'Sponsorship was no longer allowed on the platforms it used.' } ] } },
  { id: 'weekly-or-silent', job: 'Every week for years, or a hundred million dollars and two years of silence?', lens: ['Consistency Is Key'], sides: ['weekly', 'silent'], winner: 'weekly', measure: 'the one that keeps its audience',
    quote: '"Two years of silence. People move on. They forget the characters. They forget why they cared." "They post every week. They talk to the same people every time. They build a relationship on a schedule their audience can count on. Consistency over time beats big budget. It is the thing Netflix and Paramount can\'t buy their way out of."',
    cite: 'Tom Langan, Bigger Isn\'t Always Better, 8 July 2026', url: 'https://www.linkedin.com/pulse/bigger-isnt-always-better-tom-langan-bouuc',
    teach: 'Consistency over time beats big budget.',
    why: { question: 'Why do the creators keep their audience, in Tom\'s words?', options: [ { side: 'silent', text: 'They spend more on every episode than the studios do.' }, { side: 'weekly', text: 'They show up on a schedule the audience can count on.' }, { side: 'silent', text: 'They own the biggest library of shows.' } ] } },
  { id: 'give-or-beg', job: 'Give it away, or beg three thousand drivers to buy tires?', lens: ['Give Without Expectation'], sides: ['michelin', 'tireAds'], winner: 'michelin', measure: 'the one that sold tires for a century',
    quote: '"The Michelin Guide wasn\'t a sales pitch dressed up as a gift. It was an actual gift. The sales took care of themselves, later, because Michelin had earned the business." "Most businesses can\'t stomach it. They want the sale today. They attach strings and put up gates around every free thing they make."',
    cite: 'Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026', url: 'https://www.linkedin.com/pulse/where-rubber-meets-restaurant-tom-langan-gllme',
    teach: 'Give people something they actually want and take the brand along for the ride.',
    why: { question: 'Why did the guide sell tires, in Tom\'s words?', options: [ { side: 'tireAds', text: 'It listed Michelin tires on every page.' }, { side: 'tireAds', text: 'It was sold at a profit from the first edition.' }, { side: 'michelin', text: 'It gave people a reason to drive more and asked for nothing in return.' } ] } },
  { id: 'answer-or-stuff', job: 'Answer the real question, or stuff the keyword?', lens: ['Be Relentlessly Authentic'], sides: ['hubspot', 'keywords'], winner: 'hubspot', measure: 'the one the buyers trusted',
    quote: '"When you want a real answer, you want a real person who has used the thing, not a brochure dressed up as a webpage." "Keywords don\'t fix leaking pipes, good plumbers do." "You can\'t keyword-stuff your way to trust."',
    cite: 'Tom Langan, Keywords Don\'t Fix Leaky Pipes, 17 June 2026', url: 'https://www.linkedin.com/pulse/keywords-dont-fix-leaky-pipes-tom-langan-ffhfc',
    teach: 'Say what you actually know, plainly, and the right people arrive already trusting you.',
    why: { question: 'Why did the leads convert at three times the rate, in Tom\'s words?', options: [ { side: 'keywords', text: 'HubSpot bought ads inside the AI answers.' }, { side: 'hubspot', text: 'The buyer got a real answer first, so they arrived already trusting the brand.' }, { side: 'keywords', text: 'HubSpot added more keywords to every page.' } ] } },
  { id: 'human-or-machine', job: 'Show your humanity, or let the machine make it?', lens: ['Be Relentlessly Authentic'], sides: ['polaroid', 'machine'], winner: 'polaroid', measure: 'the one people would rather have',
    quote: '"The same people who tolerate AI still prefer a human. They will put up with the robot but they would rather have you." "The brands winning this moment aren\'t the ones bragging that they\'re human. They\'re the ones showing their humanity, building things a machine can\'t."',
    cite: 'Tom Langan, Breaking: Humans Still Prefer Humans, 4 June 2026', url: 'https://www.linkedin.com/pulse/breaking-humans-still-prefer-tom-langan-z3u8e',
    teach: 'They will put up with the robot. They would rather have you.',
    why: { question: 'Why did Polaroid\'s approach work, in Tom\'s words?', options: [ { side: 'polaroid', text: 'It showed its humanity by building things a machine can\'t.' }, { side: 'machine', text: 'It said in every ad that no AI was used.' }, { side: 'machine', text: 'AI content is more expensive to make.' } ] } }
];

const COPY = {
  brand: 'Talex Media',
  eyebrow: 'Legendeering rounds · draft for Tom',
  title: 'Which one worked?',
  lead: 'Seven rounds. Pick the one that worked, then say why. Two points a round.',
  gate: '"If you stripped your name and your product off this piece of content, would anyone still want to watch it? If the answer is yes, you have earned the right to put your name back on. If the answer is no, you are making a commercial and calling it content."',
  gateCite: 'Tom Langan, What\'s 100 Years Old is New Again',
  gateUrl: 'https://www.linkedin.com/pulse/whats-100-years-old-new-again-tom-langan-6bm2e',
  start: 'Start round one',
  roundLabel: 'Round {n} of {total}',
  pickStep: 'Pick',
  pickLead: 'Which one is {measure}?',
  pickInstruction: 'Click the one you think worked. Click it again to change your mind.',
  lock: 'Lock in my pick',
  revealStep: 'What worked',
  calledWinner: 'You called it.',
  missedWinner: 'You picked {pick}. The one that worked was {winner}.',
  youSaidRight: 'Your pick. Right.',
  youSaidWrong: 'Your pick',
  realOrder: 'What worked',
  cmpYou: 'You said',
  cmpReal: 'Real',
  whyStep: 'Why did it work?',
  whyLead: 'The one that worked is {winner}.',
  choose: 'Lock in my answer',
  whyRight: 'Right. That is the stated reason.',
  whyWrong: 'Not the stated reason.',
  whyRevealStep: 'The reason',
  optionTrueOf: 'About {name}',
  winnerFact: 'The stated reason',
  yourAnswer: 'Your answer',
  takeawayLabel: 'What it teaches',
  sourceLabel: 'The source',
  approval: 'Prepared for Talex review. Not yet approved by Tom.',
  nextRound: 'Round {n}',
  seeResult: 'See my result',
  resultStep: 'Your result',
  resultHeading: 'You called {n} of 14.',
  resultSub: 'Seven picks and seven reasons. Here is how each round went.',
  resultHigh: 'You read these the way we do. That is the conversation worth having.',
  resultLow: 'Instinct went one way and the examples went another. That gap is the work we do every day, and it is a normal place to start.',
  highFrom: 10,
  scoreLabel: 'Points', streakLabel: 'Streak', plusOne: '+1',
  medalNames: ['Gold', 'Silver'],
  tiers: [ { from: 14, name: 'Perfect read' }, { from: 10, name: 'Sharp eye' }, { from: 0, name: 'First look' } ],
  logRight: 'called it', logMissed: 'missed it', reasonRow: 'Reason',
  cta: { heading: 'Want to talk through your own?', copy: 'Tell us what your video needs to do, and we will talk through which of these fits.', button: 'Book A Call With Our Team', url: 'https://calendly.com/talextom/20-min-discovery-call' },
  share: 'Send this to a colleague', shared: 'Link copied', print: 'Print my result', startOver: 'Start over',
  sample: 'Every example on this page is real and links to its source. Six of the seven rounds are built from Tom\'s Value First editions, quoted word for word. The why-answers are prepared by Talex and not yet approved by Tom.',
  noFilm: 'No film to show: this is a way of working, not a series.',
  ordinals: ['first', 'second']
};

const head = [
  '/* Every word the page shows lives in this file.',
  '   Sides marked fromLibrary are copied byte for byte from ProspectAudit/templates/format-blocks.json by build-content.js.',
  '   Never edit those here. Edit the live card, re-extract, run build-content.js again.',
  '   Everything else is authored text with verbatim quotes from the source named in each round. */',
  ''
].join('\n');

const out = head +
  'window.SIDES = ' + JSON.stringify(SIDES, null, 2) + ';\n\n' +
  'window.ROUNDS = ' + JSON.stringify(ROUNDS, null, 2) + ';\n\n' +
  'window.COPY = ' + JSON.stringify(COPY, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, 'content.js'), out, 'utf8');

const hash = require('crypto').createHash('sha256').update(out).digest('hex').slice(0, 10);
const idxPath = path.join(__dirname, 'index.html');
const idx = fs.readFileSync(idxPath, 'utf8');
const stamped = idx.replace(/<script src="content\.js(\?v=[0-9a-f]+)?"><\/script>/, '<script src="content.js?v=' + hash + '"></script>');
if (stamped === idx && !idx.includes('content.js?v=' + hash)) throw new Error('could not find the content.js script tag in index.html');
fs.writeFileSync(idxPath, stamped, 'utf8');
console.log('index.html script tag stamped: content.js?v=' + hash);

let bad = 0;
for (const k of Object.keys(SIDES)) if (SIDES[k].fromLibrary && JSON.stringify(Object.assign({}, lib[SIDES[k].id], {})) === null) bad++;
for (const id of ['sitcom-ricos-tacos', 'docuseries-mailchimp-second-act']) {
  const s = Object.values(SIDES).find(x => x.id === id);
  for (const f of ['scale', 'spec', 'stats', 'note', 'video']) if (JSON.stringify(s[f]) !== JSON.stringify(lib[id][f === 'scale' ? 'scale' : f])) { bad++; console.log('MISMATCH', id, f); }
  if (s.title !== lib[id].cardTitle) { bad++; console.log('MISMATCH', id, 'title'); }
}
for (const r of ROUNDS) {
  if (!r.sides.includes(r.winner)) { bad++; console.log('WINNER NOT IN SIDES', r.id); }
  const w = r.why.options.filter(o => o.side === r.winner).length;
  if (w !== 1) { bad++; console.log('WHY needs exactly one winner-side option', r.id, w); }
}
console.log('content.js written,', out.length, 'chars;', Object.keys(SIDES).length, 'sides;', ROUNDS.length, 'rounds;', bad ? bad + ' PROBLEMS' : 'all checks passed');

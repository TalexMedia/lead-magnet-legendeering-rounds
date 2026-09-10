// Regenerates content.js and stamps a content hash onto the script URL in index.html.
// Run from this folder:  node build-content.js
// Two sides per round, both from the same company, both with a real film. Sides that exist in the block library are copied byte for byte.
const fs = require('fs');
const path = require('path');
const libPath = path.join(__dirname, '..', '..', 'ProspectAudit', 'templates', 'format-blocks.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8')).blocks;

function fromBlock(id, extra) {
  const b = lib[id]; if (!b) throw new Error('missing block ' + id);
  return Object.assign({ id, scale: b.scale, title: b.cardTitle, video: b.video, spec: b.spec, stats: b.stats, note: b.note, fromLibrary: true }, extra || {});
}

// Authored sides use the same shape. Figures are verbatim from the source named in each side's note or the round's cite.
// Every video id was confirmed through YouTube's oEmbed endpoint on 2026-09-10 (title and channel). View counts were read the same day.
const SIDES = {
  ricos: fromBlock('sitcom-ricos-tacos', { name: "P&G and Albertsons, Rico's Tacos" }),
  tideSpot: { id: 'tide-school-lunch', name: 'P&G, a Tide commercial', scale: 'The old way · A commercial', title: 'One spot about the product, then nothing', video: { id: 'xPHs8yT8cPM', label: 'Tide, School Lunch', caption: 'School Lunch &middot; Tide' },
    spec: [['Format', 'A commercial. One spot, about the product, with no next episode.'], ['A company that did it', 'P&G, on Tide\'s own YouTube channel, October 2025.'], ['Episode length', 'One spot']],
    stats: [['26,725', 'YouTube Views, 10 Sep 2026'], ['1', 'Film'], ['None', 'Next Episode']], note: 'Published on Tide\'s channel on 15 October 2025. View count read on 10 September 2026. Tom Langan, Welcome to The Taco Drama, 30 July 2026: "Instead of buying 30 seconds inside someone else\'s show, P&G decided to simply own the program outright."' },

  bestWorst: { id: 'best-worst-team', name: 'Specsavers, The Best Worst Team', scale: 'Long-Form Episodic · Docuseries', title: 'A returning documentary series', video: { id: 'NdL2VYNYpQE', label: "There's More to Cwm, Specsavers' Best Worst Team, Series 2, Episode 1", caption: "There's More to Cwm &middot; Specsavers' Best Worst Team" },
    spec: [['Format', 'A docuseries following one team over a season, narrated by Jill Scott.'], ['A company that did it', 'Specsavers, The Best Worst Team. An eight-part YouTube series about the worst football team in the country.'], ['Episode length', '10-20 minutes per episode']],
    stats: [['23.3M', 'YouTube Views'], ['5 min', 'Average Watch Time'], ['+35%', 'Brand Consideration']], note: 'Figures from the campaign\'s award entry as reported by The Drum, 13 November 2024. <a href="https://www.thedrum.com/news/2024/11/13/here-s-how-specsavers-won-over-gen-z-sponsoring-the-nation-s-worst-football-team" target="_blank" rel="noopener">Source</a>' },
  sgts: { id: 'sgts-tv', name: 'Specsavers, "Should\'ve gone to Specsavers" on TV', scale: 'The old way · A commercial', title: 'One of the best-known slogans in Britain, in a TV spot', video: { id: 'OMQiJojeryw', label: "Should've Gone To Specsavers 2024 TV Advert", caption: "Should've Gone To Specsavers, 2024 TV advert &middot; Specsavers" },
    spec: [['Format', 'A television commercial built on a slogan.'], ['A company that did it', 'Specsavers, for years, on television. This is the 2024 spot on its own channel.'], ['Episode length', 'One spot']],
    stats: [['30%', 'Of Gen Z Reached By TV Ads'], ['"Dad gag"', 'What Gen Z Called The Slogan'], ['10.5M', 'YouTube Views, 10 Sep 2026']], note: 'Reach and the "ultimate dad gag" line from The Drum, 13 November 2024. Published on Specsavers\' channel on 1 February 2024; view count read on 10 September 2026.' },

  secondAct: fromBlock('docuseries-mailchimp-second-act', { name: 'Mailchimp, Second Act, made with Vice' }),
  serialAd: { id: 'serial-ad', name: 'Mailchimp sponsoring Serial', scale: 'The old way · Sponsorship', title: 'Paying to sit inside the thing the audience came for', video: { id: 'GkPZP2NADYg', label: 'MailChimp Ad, Serial Season 1, a listener\'s upload', caption: 'The "MailKimp" read at the top of Serial, 2014 &middot; a listener\'s upload' },
    spec: [['Format', 'A sponsor read at the top of someone else\'s episode. This is the famous "MailKimp" one from Serial.'], ['A company that did it', 'Mailchimp, before it built its own studio.'], ['Episode length', 'About twenty seconds, then the show the listener came for']],
    stats: [['"Paying rent"', 'The Brand\'s Own Words'], ['$2.3M', 'Ad Spend, Q1 2018'], ['$1.9M', 'Ad Spend, Q1 2019']], note: 'Mark DiCristina, Mailchimp, quoted by Tim Peterson, Digiday, 29 July 2019. <a href="https://digiday.com/future-of-tv/mailchimp-has-cut-back-on-traditional-brand-advertising-to-invest-in-producing-original-shows-podcasts/" target="_blank" rel="noopener">Source</a> Neither Mailchimp nor Serial has posted the read itself, so the film here is a listener\'s upload of it.' },

  stratos: { id: 'stratos', name: 'Red Bull, the Stratos jump', scale: 'Give Without Expectation · Live and free', title: 'A jump from the stratosphere, streamed free to anyone who wanted it', video: { id: 'raiFrxbHxV0', label: "Red Bull Stratos FULL POV, Felix Baumgartner's Stratosphere Jump", caption: 'Stratos, full POV &middot; Red Bull' },
    spec: [['Format', 'A live event streamed free, then the films cut from it. This is the jump from Felix Baumgartner\'s point of view.'], ['A company that did it', 'Red Bull, 14 October 2012.'], ['Episode length', 'The live stream ran the whole mission']],
    stats: [['8M+', 'Concurrent Live Viewers, 2012'], ['Free', 'No Sign-Up, No Gate'], ['6.5M', 'Views Of This Film, 10 Sep 2026']], note: 'More than 8 million concurrent viewers, a YouTube record at the time, as cited by Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026, and reported by The Drum on the day. Published on Red Bull\'s channel on 14 October 2013; view count read on 10 September 2026.' },
  wings: { id: 'wings', name: 'Red Bull, "gives you wings" on TV', scale: 'The old way · A commercial', title: 'A cartoon about the can', video: { id: 'K31dg86OmuM', label: 'Red Bull Gives You Wings 2000, a viewer\'s recording', caption: 'Red Bull gives you wings, 2000 &middot; a viewer\'s recording of the broadcast' },
    spec: [['Format', 'A thirty-second cartoon commercial, the kind Red Bull ran on television for years.'], ['A company that did it', 'Red Bull. This is a viewer\'s recording of a broadcast in New Zealand.'], ['Episode length', 'One spot']],
    stats: [['30 sec', 'Long'], ['The can', 'What It Is About'], ['Shown', 'Not Chosen']], note: 'Red Bull keeps its cartoon commercials on its own site rather than on YouTube, and we could not find an official upload, so the film here is a viewer\'s recording. Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026.' }
};

const ROUNDS = [
  { id: 'own-or-spot', job: 'P&G: own the show, or make a commercial?', lens: ['Give Without Expectation', 'Consistency Is Key'], sides: ['ricos', 'tideSpot'], winner: 'ricos', measure: 'the one that earns a return visit',
    quote: '"Instead of buying 30 seconds inside someone else\'s show, P&G decided to simply own the program outright." "You need it to be episodic, because a series earns you a return visit and a one off never does." "Attention you earn beats attention you rent every single time, because it arrives with a little trust already attached to it."',
    cite: 'Tom Langan, Welcome to The Taco Drama, 30 July 2026', url: 'https://www.linkedin.com/pulse/welcome-taco-drama-tom-langan-wusce',
    teach: 'A series earns a return visit. A one-off never does.',
    why: { question: 'Why did the show work, in Tom\'s words?', options: [ { side: 'ricos', text: 'A series earns a return visit, and the attention arrives with trust already attached.' }, { side: 'tideSpot', text: 'It had the biggest media budget in grocery.' }, { side: 'tideSpot', text: 'It ran as a thirty-second spot in prime time.' } ] } },
  { id: 'series-or-ad', job: 'Specsavers: a series about them, or an ad about you?', lens: ['It\'s Not About You. It\'s About Them.', 'Give Without Expectation'], sides: ['bestWorst', 'sgts'], winner: 'bestWorst', measure: 'the one that reached Gen Z',
    quote: '"Gen Z audiences and younger are social natives, they spend less time watching TV, than any other age group, so a large proportion of our target audience were simply not as familiar with the Specsavers\' brand." "what was once a celebrated slogan, SGTS, that had worked wonders ATL, wasn\'t working for this audience, it was seen as the \'ultimate dad gag\'."',
    cite: 'The Drum, from the campaign\'s award entry, 13 November 2024', url: 'https://www.thedrum.com/news/2024/11/13/here-s-how-specsavers-won-over-gen-z-sponsoring-the-nation-s-worst-football-team',
    teach: 'A series that is about them reaches the people your ads cannot.',
    why: { question: 'Why did the series reach Gen Z when the slogan could not?', options: [ { side: 'sgts', text: 'The slogan was new to that audience.' }, { side: 'bestWorst', text: 'The series was about the team, not about glasses, so people chose to watch it.' }, { side: 'sgts', text: 'TV reached more of Gen Z than YouTube did.' } ] } },
  { id: 'own-shows-or-sponsor', job: 'Mailchimp: make your own show, or sponsor someone else\'s?', lens: ['Give Without Expectation', 'It\'s Not About You. It\'s About Them.'], sides: ['secondAct', 'serialAd'], winner: 'secondAct', measure: 'the one that reached its best customers',
    quote: '"As long as we\'re sponsoring shows, we\'re paying rent to get in front of people. We\'re interrupting the thing that they want to be engaged with." "They tend to be really, really similar to our most valuable customers," said Mark DiCristina. "They tend to pay us more. They tend to pay us more quickly. They tend to be more engaged."',
    cite: 'Mark DiCristina, Mailchimp, quoted by Tim Peterson, Digiday, 29 July 2019', url: 'https://digiday.com/future-of-tv/mailchimp-has-cut-back-on-traditional-brand-advertising-to-invest-in-producing-original-shows-podcasts/',
    teach: 'Rent gets you in front of people. Owning the show gets you the ones who become customers.',
    why: { question: 'Why did Mailchimp say its own shows worked better?', options: [ { side: 'secondAct', text: 'The shows reached people who looked like its most valuable customers.' }, { side: 'serialAd', text: 'The shows ran on broadcast television.' }, { side: 'serialAd', text: 'Sponsorship was no longer allowed on the platforms it used.' } ] } },
  { id: 'give-or-sell', job: 'Red Bull: give the jump away live, or sell the can in thirty seconds?', lens: ['Give Without Expectation'], sides: ['stratos', 'wings'], winner: 'stratos', measure: 'the one that asked for nothing',
    quote: '"They didn\'t gate it behind a sign-up. They didn\'t cut away to a guy chugging a can the second Felix landed." "None of these brands led with the sale. They led with something their community actually wanted, and they trusted the relationship to pay them back. It did, every time."',
    cite: 'Tom Langan, Where the Rubber Meets The Restaurant, 10 June 2026', url: 'https://www.linkedin.com/pulse/where-rubber-meets-restaurant-tom-langan-gllme',
    teach: 'Lead with something they actually want, ask for nothing, and trust it to pay you back.',
    why: { question: 'Why did the jump work, in Tom\'s words?', options: [ { side: 'stratos', text: 'It was given away live and free, with no sign-up and no cut to the can.' }, { side: 'wings', text: 'It showed the can more often than the cartoon did.' }, { side: 'wings', text: 'It ran as a thirty-second spot in prime time.' } ] } }
];

const COPY = {
  brand: 'Talex Media',
  eyebrow: 'Legendeering rounds · draft for Tom',
  title: 'Which one worked?',
  lead: 'Four rounds. Each one is a single company two ways: a show and a commercial. Pick the one that worked, then say why. Two points a round.',
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
  resultHeading: 'You called {n} of 8.',
  resultSub: 'Four picks and four reasons. Here is how each round went.',
  resultHigh: 'You read these the way we do. That is the conversation worth having.',
  resultLow: 'Instinct went one way and the examples went another. That gap is the work we do every day, and it is a normal place to start.',
  highFrom: 6,
  scoreLabel: 'Points', streakLabel: 'Streak', plusOne: '+1',
  medalNames: ['Gold', 'Silver'],
  tiers: [ { from: 8, name: 'Perfect read' }, { from: 6, name: 'Sharp eye' }, { from: 0, name: 'First look' } ],
  logRight: 'called it', logMissed: 'missed it', reasonRow: 'Reason',
  cta: { heading: 'Want to talk through your own?', copy: 'Tell us what your video needs to do, and we will talk through which of these fits.', button: 'Book A Call With Our Team', url: 'https://calendly.com/talextom/20-min-discovery-call' },
  share: 'Send this to a colleague', shared: 'Link copied', print: 'Print my result', startOver: 'Start over',
  sample: 'Every film on this page is real and links to its source, and both films in every round come from the same company. Two of the four rounds are built from Tom\'s Value First editions, quoted word for word. The why-answers are prepared by Talex and not yet approved by Tom.',
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
for (const id of ['sitcom-ricos-tacos', 'docuseries-mailchimp-second-act']) {
  const s = Object.values(SIDES).find(x => x.id === id);
  for (const f of ['scale', 'spec', 'stats', 'note', 'video']) if (JSON.stringify(s[f]) !== JSON.stringify(lib[id][f])) { bad++; console.log('MISMATCH', id, f); }
  if (s.title !== lib[id].cardTitle) { bad++; console.log('MISMATCH', id, 'title'); }
}
for (const k of Object.keys(SIDES)) {
  const s = SIDES[k];
  if (!s.video || !/^[A-Za-z0-9_-]{11}$/.test(s.video.id || '')) { bad++; console.log('SIDE WITHOUT A FILM', k); }
  if (!s.video || !s.video.label || !s.video.caption) { bad++; console.log('FILM WITHOUT LABEL OR CAPTION', k); }
}
for (const r of ROUNDS) {
  if (r.sides.length !== 2) { bad++; console.log('ROUND NEEDS TWO SIDES', r.id); }
  if (!r.sides.includes(r.winner)) { bad++; console.log('WINNER NOT IN SIDES', r.id); }
  for (const k of r.sides) if (!SIDES[k]) { bad++; console.log('UNKNOWN SIDE', r.id, k); }
  const w = r.why.options.filter(o => o.side === r.winner).length;
  if (w !== 1) { bad++; console.log('WHY needs exactly one winner-side option', r.id, w); }
}
if (COPY.tiers[0].from !== ROUNDS.length * 2 || !COPY.resultHeading.includes('of ' + ROUNDS.length * 2 + '.')) { bad++; console.log('COPY totals do not match the round count'); }
console.log('content.js written,', out.length, 'chars;', Object.keys(SIDES).length, 'sides;', ROUNDS.length, 'rounds;', bad ? bad + ' PROBLEMS' : 'all checks passed');

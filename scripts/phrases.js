/**
 * Complete phrase manifest for Aubrey's Magic School.
 * Keys are audio file stems (saved to audio/{key}.mp3).
 * Values are the exact text passed to speak() in the app.
 *
 * Run scripts/generate-audio.js to create all MP3 files.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTER_WORDS = {
    A:'Apple', B:'Butterfly', C:'Crown',    D:'Diamond',  E:'Elephant',
    F:'Flower', G:'Glitter',  H:'Heart',    I:'Ice Cream',J:'Jellyfish',
    K:'Kitten', L:'Lollipop', M:'Mermaid',  N:'Night Sky', O:'Ocean',
    P:'Princess',Q:'Queen',   R:'Rainbow',  S:'Star',      T:'Tiara',
    U:'Unicorn', V:'Violet',  W:'Wand',     X:'X-ray',     Y:'Yarn',
    Z:'Zebra'
};

const NUMBER_WORDS = [
    'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen',
    'Sixteen','Seventeen','Eighteen','Nineteen','Twenty',
    'Twenty one','Twenty two','Twenty three','Twenty four','Twenty five',
    'Twenty six','Twenty seven','Twenty eight','Twenty nine','Thirty',
    'Thirty one','Thirty two','Thirty three','Thirty four','Thirty five',
    'Thirty six','Thirty seven','Thirty eight','Thirty nine','Forty',
    'Forty one','Forty two','Forty three','Forty four','Forty five',
    'Forty six','Forty seven','Forty eight','Forty nine','Fifty'
];

const COLORS = [
    { name:'Red',    say:'Red, like a heart!'           },
    { name:'Orange', say:'Orange, like an orange!'      },
    { name:'Yellow', say:'Yellow, like a star!'         },
    { name:'Green',  say:'Green, like a four-leaf clover!' },
    { name:'Blue',   say:'Blue, like the ocean!'        },
    { name:'Purple', say:'Purple, like a unicorn!'      },
    { name:'Pink',   say:'Pink, like a flower!'         },
    { name:'White',  say:'White, like a cloud!'         },
];

const SHAPES = ['circle','square','triangle','rectangle','star','heart'];

const NAME_DISTRACTORS = ['Summer','Grace','Emma','Lily','Olivia','Sophia','Charlie','Emily','Molly','Harper'];

// ─── Build the full manifest ───────────────────────────────────────────────

const PHRASES = {};

// ── Alphabet ──────────────────────────────────────────────────────────────

ALPHABET.forEach(l => {
    const w = LETTER_WORDS[l];
    PHRASES[`letter-${l.toLowerCase()}`]          = l;
    PHRASES[`letter-is-for-${l.toLowerCase()}`]   = `${l} is for ${w}.`;
    PHRASES[`find-letter-${l.toLowerCase()}`]      = `Find the letter ${l}!`;
    PHRASES[`yes-letter-${l.toLowerCase()}`]       = `Yes! ${l}!`;
    PHRASES[`thats-letter-${l.toLowerCase()}`]     = `That was ${l}.`;
    PHRASES[`find-letter-try-${l.toLowerCase()}`]  = `Find the ${l}!`;
});

// Singing sequence end phrase
PHRASES['abc-song-end'] = "Now I know my A B Cs! Next time won't you sing with me!";

// ── Numbers ───────────────────────────────────────────────────────────────

for (let i = 1; i <= 50; i++) {
    const word = NUMBER_WORDS[i - 1];
    PHRASES[`number-word-${i}`]     = word;
    PHRASES[`find-number-${i}`]     = `Find the number ${i}! ${word}!`;
    PHRASES[`yes-number-${i}`]      = `Yes! ${i}! ${word}!`;
    PHRASES[`thats-number-${i}`]    = `That was ${i}.`;
    PHRASES[`counted-to-${i}`]      = `Amazing! You counted all the way to ${i}!`;
    PHRASES[`the-number-${i}`]      = `The number ${i}. ${word}!`;
}

// ── Colors ────────────────────────────────────────────────────────────────

COLORS.forEach(c => {
    const key = c.name.toLowerCase();
    PHRASES[`find-color-${key}`]  = `Find the color ${c.name}! ${c.say}`;
    PHRASES[`yes-color-${key}`]   = `Yes! That's ${c.name}! Amazing!`;
    PHRASES[`thats-color-${key}`] = `That was ${c.name}.`;
    PHRASES[`try-again-color-${key}`] = `Hmm, try again! Find the color ${c.name}!`;
});

// ── Shapes ────────────────────────────────────────────────────────────────

SHAPES.forEach(s => {
    PHRASES[`find-shape-${s}`]  = `Find the ${s}!`;
    PHRASES[`yes-shape-${s}`]   = `Yes! That's a ${s}!`;
    PHRASES[`thats-shape-${s}`] = `That was a ${s}.`;
});

// ── Name practice ─────────────────────────────────────────────────────────

// Name recognize — distractors
NAME_DISTRACTORS.forEach(d => {
    PHRASES[`thats-name-${d.toLowerCase()}`] = `That says ${d}. Find AUBREY!`;
});
PHRASES['name-recognize-intro']   = "Which one says Aubrey? Listen!";
PHRASES['name-recognize-correct'] = "Yes! That spells Aubrey! That's your name!";

// Hear-all reading of word tiles (recognize level)
NAME_DISTRACTORS.forEach(d => {
    PHRASES[`read-name-${d.toLowerCase()}`] = d;
});
PHRASES['read-name-aubrey'] = 'Aubrey';

// Name order (spell it out)
PHRASES['name-order-intro']   = "Tap the letters to spell your name! Start with A!";
PHRASES['name-order-victory'] = "A! U! B! R! E! Y! Aubrey! You spelled your name!";
'AUBREY'.split('').forEach(l => {
    PHRASES[`name-order-next-${l.toLowerCase()}`] = `The next letter is ${l}!`;
});

// Tracing (letter by letter)
PHRASES['tracing-intro'] = "Let's write your name! Trace the letter A with your finger!";
'AUBREY'.split('').slice(1).forEach(l => {
    PHRASES[`tracing-next-${l.toLowerCase()}`] = `Great job! Now trace the letter ${l}!`;
});
PHRASES['tracing-done']     = "Aubrey! You traced your whole name! You are so amazing!";
PHRASES['tracing-no-draw']  = "Try tracing first!";

// Tracing — full name mode
PHRASES['fullname-intro']   = "Now write your whole name all at once! Trace AUBREY with your finger!";
PHRASES['fullname-done']    = "Wow! You wrote Aubrey all at once! You are AMAZING!";

// ── Hub / nav phrases ─────────────────────────────────────────────────────

PHRASES['hub-name-start']    = "Let's practice your name, Aubrey! Start with Level 1.";
PHRASES['hub-name-mastered'] = "Wow! You mastered all four levels! Amazing job!";
for (let i = 2; i <= 4; i++) {
    PHRASES[`hub-name-level-${i}`] = `Great job! Let's try Level ${i} now!`;
}

PHRASES['hub-alphabet-start'] = "Let's learn the alphabet! Pick Learn or play the find game.";
PHRASES['hub-numbers-start']  = "Let's practice numbers! Pick Count or play the find game.";

// ── Counting page ─────────────────────────────────────────────────────────

PHRASES['count-intro'] = "Let's count together! Tap each one to count!";

// ── Stickers ──────────────────────────────────────────────────────────────

PHRASES['sticker-board-empty']   = "Welcome to your sticker board! Earn stars to get your first sticker!";
PHRASES['sticker-tap']           = "Sticker!";
for (let i = 1; i <= 20; i++) {
    PHRASES[`sticker-count-${i}`] = `You have ${i} sticker${i === 1 ? '' : 's'}! Good job!`;
}

// ── Celebrations & praise ─────────────────────────────────────────────────

PHRASES['surprise'] = "You found a magic surprise!";

const STREAK_MILESTONES = [5, 10, 15, 20, 25, 30];
STREAK_MILESTONES.forEach(n => {
    PHRASES[`streak-${n}`] = `${NUMBER_WORDS[n-1]} in a row! You are on fire! Keep going!`;
});

PHRASES['name-level-1-win'] = "That's your name! AUBREY — you found it! Amazing!";
PHRASES['name-level-2-win'] = "A! U! B! R! E! Y! Aubrey! You spelled your name!";
PHRASES['name-level-3-win'] = "Aubrey! You traced your whole name! You are so amazing!";
PHRASES['name-level-4-win'] = "Wow! You wrote Aubrey all at once! You are AMAZING!";

// ── Daily lessons ─────────────────────────────────────────────────────────

PHRASES['lesson-sunday']    = "Today's lesson is: Practice your name!";
PHRASES['lesson-monday']    = "Today's lesson is: Learn some ABCs!";
PHRASES['lesson-tuesday']   = "Today's lesson is: Count to ten!";
PHRASES['lesson-wednesday'] = "Today's lesson is: Write your name!";
PHRASES['lesson-thursday']  = "Today's lesson is: Play the colors game!";
PHRASES['lesson-friday']    = "Today's lesson is: Sing the ABCs!";
PHRASES['lesson-saturday']  = "Today's lesson is: See your stickers!";

// ─── Exports ───────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = { PHRASES };

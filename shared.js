/* Shared utilities across all activity pages */

/* ============================================================
   Audio system — ElevenLabs pre-generated files with
   Web Speech API fallback when a file isn't available.

   speak(text, rate, pitch, onEnd) is the single public API.
   Internally it checks _AUDIO_MAP for a matching phrase key,
   plays the MP3 if found, and falls back to the browser voice
   if not (or if the file fails to load / no audio support).
   ============================================================ */

// Build text → audio-file map from the phrase manifest.
// Keys are lowercased+trimmed text strings; values are paths.
const _AUDIO_MAP = (() => {
    const map  = {};
    // Alphabet
    const _LW  = {A:'Apple',B:'Butterfly',C:'Crown',D:'Diamond',E:'Elephant',
                  F:'Flower',G:'Glitter',H:'Heart',I:'Ice Cream',J:'Jellyfish',
                  K:'Kitten',L:'Lollipop',M:'Mermaid',N:'Night Sky',O:'Ocean',
                  P:'Princess',Q:'Queen',R:'Rainbow',S:'Star',T:'Tiara',
                  U:'Unicorn',V:'Violet',W:'Wand',X:'X-ray',Y:'Yarn',Z:'Zebra'};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l => {
        const lo = l.toLowerCase();
        map[l]                                           = `audio/letter-${lo}.mp3`;
        map[`${l} is for ${_LW[l]}.`]                   = `audio/letter-is-for-${lo}.mp3`;
        map[`find the letter ${l}!`]                     = `audio/find-letter-${lo}.mp3`;
        map[`yes! ${l}!`]                                = `audio/yes-letter-${lo}.mp3`;
        map[`that was ${l}.`]                            = `audio/thats-letter-${lo}.mp3`;
        map[`find the ${l}!`]                            = `audio/find-letter-try-${lo}.mp3`;
    });
    map["now i know my a b cs! next time won't you sing with me!"] = 'audio/abc-song-end.mp3';

    // Numbers 1-50
    const _NW = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
                 'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
                 'Eighteen','Nineteen','Twenty','Twenty one','Twenty two','Twenty three',
                 'Twenty four','Twenty five','Twenty six','Twenty seven','Twenty eight',
                 'Twenty nine','Thirty','Thirty one','Thirty two','Thirty three',
                 'Thirty four','Thirty five','Thirty six','Thirty seven','Thirty eight',
                 'Thirty nine','Forty','Forty one','Forty two','Forty three','Forty four',
                 'Forty five','Forty six','Forty seven','Forty eight','Forty nine','Fifty'];
    for (let i = 1; i <= 50; i++) {
        const w = _NW[i-1];
        map[w.toLowerCase()]                                         = `audio/number-word-${i}.mp3`;
        map[`find the number ${i}! ${w.toLowerCase()}!`]             = `audio/find-number-${i}.mp3`;
        map[`yes! ${i}! ${w.toLowerCase()}!`]                        = `audio/yes-number-${i}.mp3`;
        map[`that was ${i}.`]                                        = `audio/thats-number-${i}.mp3`;
        map[`amazing! you counted all the way to ${i}!`]             = `audio/counted-to-${i}.mp3`;
        map[`the number ${i}. ${w.toLowerCase()}!`]                  = `audio/the-number-${i}.mp3`;
    }

    // Colors
    [{n:'Red',s:'Red, like a heart!'},{n:'Orange',s:'Orange, like an orange!'},
     {n:'Yellow',s:'Yellow, like a star!'},{n:'Green',s:'Green, like a four-leaf clover!'},
     {n:'Blue',s:'Blue, like the ocean!'},{n:'Purple',s:'Purple, like a unicorn!'},
     {n:'Pink',s:'Pink, like a flower!'},{n:'White',s:'White, like a cloud!'}
    ].forEach(c => {
        const k = c.n.toLowerCase();
        map[`find the color ${k}! ${c.s.toLowerCase()}`] = `audio/find-color-${k}.mp3`;
        map[`yes! that's ${k}! amazing!`]                = `audio/yes-color-${k}.mp3`;
        map[`that was ${k}.`]                            = `audio/thats-color-${k}.mp3`;
        map[`hmm, try again! find the color ${k}!`]      = `audio/try-again-color-${k}.mp3`;
    });

    // Shapes
    ['circle','square','triangle','rectangle','star','heart'].forEach(s => {
        map[`find the ${s}!`]        = `audio/find-shape-${s}.mp3`;
        map[`yes! that's a ${s}!`]   = `audio/yes-shape-${s}.mp3`;
        map[`that was a ${s}.`]      = `audio/thats-shape-${s}.mp3`;
    });

    // Name practice
    ['Summer','Grace','Emma','Lily','Olivia','Sophia','Charlie','Emily','Molly','Harper']
        .forEach(d => {
            map[`that says ${d.toLowerCase()}. find aubrey!`] = `audio/thats-name-${d.toLowerCase()}.mp3`;
            map[d.toLowerCase()]                              = `audio/read-name-${d.toLowerCase()}.mp3`;
        });
    map['aubrey']                                           = 'audio/read-name-aubrey.mp3';
    map["which one says aubrey? listen!"]                   = 'audio/name-recognize-intro.mp3';
    map["yes! that spells aubrey! that's your name!"]       = 'audio/name-recognize-correct.mp3';
    map["tap the letters to spell your name! start with a!"]= 'audio/name-order-intro.mp3';
    map["a! u! b! r! e! y! aubrey! you spelled your name!"] = 'audio/name-order-victory.mp3';
    'AUBREY'.split('').forEach(l => {
        map[`the next letter is ${l}!`] = `audio/name-order-next-${l.toLowerCase()}.mp3`;
    });
    map["let's write your name! trace the letter a with your finger!"] = 'audio/tracing-intro.mp3';
    'UBREY'.split('').forEach(l => {
        map[`great job! now trace the letter ${l}!`] = `audio/tracing-next-${l.toLowerCase()}.mp3`;
    });
    map["aubrey! you traced your whole name! you are so amazing!"]      = 'audio/tracing-done.mp3';
    map["try tracing first!"]                                           = 'audio/tracing-no-draw.mp3';
    map["now write your whole name all at once! trace aubrey with your finger!"] = 'audio/fullname-intro.mp3';
    map["wow! you wrote aubrey all at once! you are amazing!"]          = 'audio/fullname-done.mp3';

    // Hubs
    map["let's practice your name, aubrey! start with level 1."]        = 'audio/hub-name-start.mp3';
    map["wow! you mastered all four levels! amazing job!"]               = 'audio/hub-name-mastered.mp3';
    [2,3,4].forEach(n => {
        map[`great job! let's try level ${n} now!`] = `audio/hub-name-level-${n}.mp3`;
    });
    map["let's learn the alphabet! pick learn or play the find game."]   = 'audio/hub-alphabet-start.mp3';
    map["let's practice numbers! pick count or play the find game."]     = 'audio/hub-numbers-start.mp3';
    map["let's count together! tap each one to count!"]                  = 'audio/count-intro.mp3';

    // Stickers
    map["welcome to your sticker board! earn stars to get your first sticker!"] = 'audio/sticker-board-empty.mp3';
    map["sticker!"]                                                       = 'audio/sticker-tap.mp3';
    for (let i = 1; i <= 20; i++) {
        map[`you have ${i} sticker${i===1?'':'s'}! good job!`] = `audio/sticker-count-${i}.mp3`;
    }

    // Misc
    map["you found a magic surprise!"] = 'audio/surprise.mp3';
    [5,10,15,20,25,30].forEach(n => {
        const w = _NW[n-1].toLowerCase();
        map[`${w} in a row! you are on fire! keep going!`] = `audio/streak-${n}.mp3`;
    });

    // Daily lessons
    ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].forEach((day, i) => {
        const titles = [
            "Practice your name!", "Learn some ABCs!", "Count to ten!",
            "Write your name!", "Play the colors game!", "Sing the ABCs!", "See your stickers!"
        ];
        map[`today's lesson is: ${titles[i].toLowerCase()}`] = `audio/lesson-${day}.mp3`;
    });

    return map;
})();

// Holds a reference to the currently playing Audio element so we can cancel it
let _currentAudio = null;

function _playAudio(src, onEnd) {
    if (_currentAudio) {
        _currentAudio.pause();
        _currentAudio.src = '';
        _currentAudio = null;
    }
    const a = new Audio(src);
    _currentAudio = a;
    if (onEnd) a.addEventListener('ended', onEnd, { once: true });
    a.onerror = () => {
        _currentAudio = null;
        if (onEnd) onEnd(); // don't leave the app hanging
    };
    a.play().catch(() => {
        _currentAudio = null;
        if (onEnd) onEnd();
    });
}

/* ── Web Speech API fallback ── */

let _cachedVoices = [];
let _preferredVoice = null;

function _loadVoices() {
    _cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    _preferredVoice = _pickBestVoice(_cachedVoices);
}

function _pickBestVoice(voices) {
    if (!voices || !voices.length) return null;
    const preferred = [
        'Samantha (Enhanced)', 'Samantha (Premium)',
        'Ava (Enhanced)',      'Ava (Premium)',
        'Allison (Enhanced)',  'Allison',
        'Karen (Enhanced)',    'Karen',
        'Samantha', 'Susan',
        'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira',
        'Google US English',
    ];
    for (const name of preferred) {
        const v = voices.find(v => v.name === name);
        if (v) return v;
    }
    return voices.find(v => v.lang === 'en-US')
        || voices.find(v => v.lang && v.lang.startsWith('en'))
        || voices[0];
}

if ('speechSynthesis' in window) {
    _loadVoices();
    window.speechSynthesis.onvoiceschanged = _loadVoices;
}

function _webSpeak(text, rate, pitch, onEnd) {
    if (!('speechSynthesis' in window)) {
        if (onEnd) setTimeout(onEnd, 0);
        return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (!_preferredVoice) _loadVoices();
    if (_preferredVoice) {
        u.voice = _preferredVoice;
        u.lang  = _preferredVoice.lang || 'en-US';
    } else {
        u.lang = 'en-US';
    }
    u.rate  = rate;
    u.pitch = pitch;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
}

/* ── Public API ── */

function speak(text, rate = 0.7, pitch = 1.2, onEnd) {
    const key      = text.trim().toLowerCase();
    const audioSrc = _AUDIO_MAP[key];
    if (audioSrc) {
        _playAudio(audioSrc, onEnd);
    } else {
        _webSpeak(text, rate, pitch, onEnd);
    }
}


function getStars() {
    return parseInt(localStorage.getItem('aubreyStars') || '0');
}

function addStars(n) {
    const total = getStars() + n;
    localStorage.setItem('aubreyStars', total);
    const el = document.getElementById('star-count');
    if (el) {
        el.textContent = total;
        el.parentElement.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
            { duration: 400, easing: 'ease' }
        );
    }
    // Phase 1: bookkeeping for the guided path
    if (typeof touchActivity === 'function')      touchActivity();
    if (typeof checkForNewStickers === 'function') checkForNewStickers();
    return total;
}

function initStarBar() {
    const el = document.getElementById('star-count');
    if (el) el.textContent = getStars();
}

function initSparkles() {
    const emojis = ['✨', '⭐', '💜', '🌸', '🦄', '💎', '🌈', '💖', '🧜‍♀️'];
    const container = document.getElementById('sparkles');
    if (!container) return;
    function create() {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (6 + Math.random() * 10) + 's';
        s.style.fontSize = (0.8 + Math.random() * 1.1) + 'rem';
        container.appendChild(s);
        setTimeout(() => s.remove(), 16000);
    }
    setInterval(create, 1100);
    for (let i = 0; i < 7; i++) create();
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const colors = ['#FF6EB4','#9B59B6','#FFD700','#00CED1','#FF4500','#00FF88','#FF69B4'];
    const particles = Array.from({ length: 220 }, () => ({
        x:        Math.random() * canvas.width,
        y:        -30 - Math.random() * 120,
        vx:       (Math.random() - 0.5) * 7,
        vy:       2.5 + Math.random() * 4,
        color:    colors[Math.floor(Math.random() * colors.length)],
        size:     6 + Math.random() * 10,
        rot:      Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        circle:   Math.random() > 0.55
    }));
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const alpha = Math.max(0, 1 - frame / 190);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.rot += p.rotSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            if (p.circle) {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
            }
            ctx.restore();
        });
        frame++;
        if (frame < 210) requestAnimationFrame(draw);
        else { canvas.style.display = 'none'; }
    }
    draw();
}

function showCelebration(headline, sub, onDone) {
    const ov = document.getElementById('celebration-overlay');
    const h  = document.getElementById('celebrate-text');
    const s  = document.getElementById('celebrate-sub');
    if (!ov) return;
    if (h) h.textContent = headline;
    if (s) s.textContent = sub || '';
    ov.classList.add('show');
    launchConfetti();
    if (onDone) {
        setTimeout(() => {
            ov.classList.remove('show');
            onDone();
        }, 2800);
    }
}

/* ============================================================
   Phase 1 additions — guided learning path support
   ============================================================ */

function getLearnedLetters() {
    return JSON.parse(localStorage.getItem('learnedLetters') || '[]');
}
function getEarnedNumbers() {
    return JSON.parse(localStorage.getItem('earnedNumbers') || '[]');
}
function getNameLevel() {
    return parseInt(localStorage.getItem('nameLevel') || '0');
}
function setNameLevel(level) {
    if (level > getNameLevel()) localStorage.setItem('nameLevel', level);
}
function getStickers() {
    return JSON.parse(localStorage.getItem('stickers') || '[]');
}
function getLastActivity() {
    return localStorage.getItem('lastActivity');
}
function touchActivity() {
    localStorage.setItem('lastActivity', new Date().toISOString());
}
function getLessonsCompleted() {
    return JSON.parse(localStorage.getItem('lessonsCompleted') || '[]');
}
function todayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function markLessonComplete() {
    const list = getLessonsCompleted();
    const today = todayKey();
    if (!list.includes(today)) {
        list.push(today);
        localStorage.setItem('lessonsCompleted', JSON.stringify(list));
    }
}
function isLessonCompletedToday() {
    return getLessonsCompleted().includes(todayKey());
}

// Themed sticker pool — princess / unicorn / mermaid / sparkle
const STICKER_POOL = [
    '🦄','🌈','⭐','💖','🦋','👑','🧜‍♀️','💎',
    '🌸','✨','🪄','🐱','🐰','🌙','🦩','🌺',
    '🎀','👸','🌷','🍭'
];

// Every 5 stars = 1 new sticker. Called silently after addStars.
function checkForNewStickers() {
    const deserved  = Math.floor(getStars() / 5);
    const stickers  = getStickers();
    const newCount  = deserved - stickers.length;
    if (newCount <= 0) return 0;
    const today = todayKey();
    for (let i = 0; i < newCount; i++) {
        stickers.push({
            emoji:     STICKER_POOL[Math.floor(Math.random() * STICKER_POOL.length)],
            date:      today,
            milestone: (stickers.length + 1) * 5
        });
    }
    localStorage.setItem('stickers', JSON.stringify(stickers));
    return newCount;
}

/* ============================================================
   Lesson picker — one suggested activity per weekday
   ============================================================ */
const DAILY_LESSONS = [
    // Sunday
    { activity:'name',     title:'Practice your name!',  emoji:'✏️', href:'name-hub.html', cta:'Open Name Practice' },
    // Monday
    { activity:'alphabet', title:'Learn some ABCs!',     emoji:'🔤', href:'alphabet-hub.html', cta:'Tap the letters' },
    // Tuesday
    { activity:'numbers',  title:'Count to ten!',        emoji:'🔢', href:'numbers-hub.html', cta:'Let\'s count' },
    // Wednesday
    { activity:'name',     title:'Write your name!',     emoji:'✏️', href:'name-hub.html', cta:'Open Name Practice' },
    // Thursday
    { activity:'colors',   title:'Play the colors game!',emoji:'🌈', href:'colors-hub.html', cta:'Find the colors' },
    // Friday
    { activity:'alphabet', title:'Sing the ABCs!',       emoji:'🎵', href:'alphabet.html', cta:'Sing along' },
    // Saturday
    { activity:'stickers', title:'See your stickers!',   emoji:'⭐', href:'stickers.html', cta:'Open the board' }
];

function getTodaysLesson() {
    return DAILY_LESSONS[new Date().getDay()];
}

/* Shared utilities across all activity pages */

let _cachedVoices = [];
let _preferredVoice = null;

function _loadVoices() {
    _cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    _preferredVoice = _pickBestVoice(_cachedVoices);
}

function _pickBestVoice(voices) {
    if (!voices || !voices.length) return null;
    // High-quality voices to prefer, in order. "Samantha" is the friendly
    // default US iOS voice; the Enhanced/Premium variants sound the best.
    const preferred = [
        'Samantha (Enhanced)', 'Samantha (Premium)',
        'Ava (Enhanced)',      'Ava (Premium)',
        'Allison (Enhanced)',  'Allison',
        'Karen (Enhanced)',    'Karen',
        'Samantha',
        'Susan',
        'Microsoft Aria',      'Microsoft Jenny',  'Microsoft Zira',
        'Google US English',
    ];
    for (const name of preferred) {
        const v = voices.find(v => v.name === name);
        if (v) return v;
    }
    // Fallback: any English voice, preferring US
    return voices.find(v => v.lang === 'en-US')
        || voices.find(v => v.lang && v.lang.startsWith('en'))
        || voices[0];
}

if ('speechSynthesis' in window) {
    _loadVoices();
    window.speechSynthesis.onvoiceschanged = _loadVoices;
}

function speak(text, rate = 0.92, pitch = 1.15, onEnd) {
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
    { activity:'colors',   title:'Play the colors game!',emoji:'🌈', href:'colors.html',   cta:'Find the colors' },
    // Friday
    { activity:'alphabet', title:'Sing the ABCs!',       emoji:'🎵', href:'alphabet.html', cta:'Sing along' },
    // Saturday
    { activity:'stickers', title:'See your stickers!',   emoji:'⭐', href:'stickers.html', cta:'Open the board' }
];

function getTodaysLesson() {
    return DAILY_LESSONS[new Date().getDay()];
}

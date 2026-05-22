/* Shared utilities across all activity pages */

function speak(text, rate = 0.88, pitch = 1.25) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
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

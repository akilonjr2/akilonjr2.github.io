const intro = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const whisper = document.getElementById('whisper');
const main = document.getElementById('main-content');

// Skip intro if returning from another page
if (sessionStorage.getItem('visited')) {
    intro?.remove();
    main?.classList.remove('hidden');
} else if (intro) {
    enterBtn.addEventListener('click', () => {
        whisper.volume = 0.3;
        whisper.play().catch(() => {});
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.remove();
            main.classList.remove('hidden');
            main.style.opacity = '1';
            sessionStorage.setItem('visited', 'true');
        }, 1200);
    });
}

// Fade-in scroll
document.querySelectorAll('.fade').forEach((el) => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    obs.observe(el);
});

// Music toggle
const audio = document.getElementById('ambient');
const toggle = document.getElementById('music-toggle');
let playing = false;

function fadeIn(a, d = 3000) {
    a.volume = 0;
    a.play().catch(() => {});
    const step = 50, inc = 1 / (d / step);
    const fade = setInterval(() => {
        if (a.volume < 1 - inc) a.volume += inc;
        else { a.volume = 1; clearInterval(fade); }
    }, step);
}

function fadeOut(a, d = 1000) {
    const step = 50, dec = a.volume / (d / step);
    const fade = setInterval(() => {
        if (a.volume > dec) a.volume -= dec;
        else { a.volume = 0; a.pause(); clearInterval(fade); }
    }, step);
}

toggle?.addEventListener('click', () => {
    if (playing) { fadeOut(audio); toggle.textContent = '🔇'; }
    else { fadeIn(audio); toggle.textContent = '🔊'; }
    playing = !playing;
});

// Form spam protection
const form = document.getElementById('contact-form');
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const honey = (form.querySelector('input[name="_honey"]')).value;
    if (honey) return;
    const formData = new FormData(form);
    const res = await fetch(form.action, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
    if (res.ok) {
        alert('🦉 The Court has received your message...');
        form.reset();
    } else alert('The Owls are displeased. Try again.');
});

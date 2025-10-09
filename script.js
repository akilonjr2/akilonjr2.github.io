// ===== Intro Screen =====
const intro = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const whisper = document.getElementById('whisper');
const main = document.getElementById('main-content');

if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        whisper.volume = 0.3;
        whisper.play().catch(() => console.warn('Tap again to start audio.'));
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.remove();
            main.classList.remove('hidden');
            main.style.opacity = '1';
            main.style.visibility = 'visible';
        }, 1200);
    });
}

// ===== Fade-in sections =====
const fadeEls = document.querySelectorAll('.fade');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
fadeEls.forEach((el) => fadeObserver.observe(el));

// ===== Audio Controls =====
const audio = document.getElementById('ambient');
const toggle = document.getElementById('music-toggle');
let playing = false;

function fadeIn(a, d = 3000) {
    a.volume = 0;
    a.play().catch(() => console.warn('Tap 🔇 to start audio.'));
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

if (toggle) {
    toggle.addEventListener('click', () => {
        if (playing) { fadeOut(audio); toggle.textContent = '🔇'; }
        else { fadeIn(audio); toggle.textContent = '🔊'; }
        playing = !playing;
    });
}

// ===== Form Submission (Spam Protected) =====
const form = document.getElementById('contact-form');
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const honey = (form.querySelector('input[name="_honey"]')).value;
    if (honey) return; // bot detected

    const formData = new FormData(form);
    const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: 'application/json' },
    });

    if (response.ok) {
        alert('🦉 The Court has received your message...');
        form.reset();
    } else {
        alert('Something went wrong. The Owls are displeased.');
    }
});

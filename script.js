// ===================
// Multi-Page Court of Owls Script
// ===================

// Helper to check if element exists
function $(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

// ===================
// Intro Sequence (Home Page Only)
// ===================
const intro = $('#intro-screen');
const enterBtn = $('#enter-btn');
const whisper = $('#whisper');
const main = $('#main-content');

if (intro && enterBtn && whisper && main) {
    enterBtn.addEventListener('click', () => {
        whisper.volume = 0.3;
        whisper.play().catch(() => console.warn('Tap again to start audio.'));
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.remove();
            main.classList.remove('hidden');
        }, 1200);
    });
}

// ===================
// Contact Form (Apply Page Only)
// ===================
const contactForm = $('#contact-form');
contactForm?.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    alert('The Court has received your message...');
    contactForm.reset();
});

// ===================
// Fade Animations
// ===================
const fadeEls = document.querySelectorAll<HTMLElement>('.fade');
const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    },
    { threshold: 0.2 }
);
fadeEls.forEach((el) => fadeObserver.observe(el));

// ===================
// Secret "OWL" Easter Egg
// ===================
let sequence = '';
document.addEventListener('keydown', (e: KeyboardEvent) => {
    sequence += e.key.toUpperCase();
    if (sequence.endsWith('OWL')) {
        const msg = $('#secret-message');
        if (msg) {
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 4000);
        }
        sequence = '';
    }
    if (sequence.length > 3) sequence = sequence.slice(-3);
});

// ===================
// Ambient Audio Toggle
// ===================
const audio = $('#ambient');
const toggle = $('#music-toggle');
let playing = false;

function fadeIn(a: HTMLAudioElement, d = 3000) {
    a.volume = 0;
    a.play().catch(() => console.warn('Tap 🔇 to start audio.'));
    const step = 50;
    const inc = 1 / (d / step);
    const fade = setInterval(() => {
        if (a.volume < 1 - inc) a.volume += inc;
        else {
            a.volume = 1;
            clearInterval(fade);
        }
    }, step);
}

function fadeOut(a: HTMLAudioElement, d = 1000) {
    const step = 50;
    const dec = a.volume / (d / step);
    const fade = setInterval(() => {
        if (a.volume > dec) a.volume -= dec;
        else {
            a.volume = 0;
            a.pause();
            clearInterval(fade);
        }
    }, step);
}

if (audio && toggle) {
    toggle.addEventListener('click', () => {
        if (playing) {
            fadeOut(audio, 1000);
            toggle.textContent = '🔇';
        } else {
            fadeIn(audio, 3000);
            toggle.textContent = '🔊';
        }
        playing = !playing;
    });
}

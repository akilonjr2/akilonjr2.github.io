// =======================
// 🦉 Court of Owls Website Script
// =======================

// 📝 Contact form behavior
document.getElementById('contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('The Court has received your message... We are watching.');
});

// 🌒 Fade-in scroll animations
const fadeEls = document.querySelectorAll('.fade');
const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.2 }
);
fadeEls.forEach((el) => fadeObserver.observe(el));

// 🔑 Secret "OWL" Easter Egg
let sequence = '';
document.addEventListener('keydown', (e) => {
    sequence += e.key.toUpperCase();
    if (sequence.endsWith('OWL')) {
        const secret = document.getElementById('secret-message');
        secret.classList.remove('hidden');
        setTimeout(() => {
            secret.classList.add('hidden');
            sequence = '';
        }, 4000);
    }
    if (sequence.length > 3) sequence = sequence.slice(-3);
});

// 🔊 Ambient Music Controls with Fade-in/out
const audio = document.getElementById('ambient');
const toggle = document.getElementById('music-toggle');
let musicPlaying = false;

// Smooth fade-in/out helpers
function fadeIn(audioElement, duration = 3000) {
    audioElement.volume = 0;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => console.warn('Tap 🔇 to start audio.'));
    }
    const step = 50;
    const volumeIncrement = 1 / (duration / step);
    const fade = setInterval(() => {
        if (audioElement.volume < 1 - volumeIncrement) {
            audioElement.volume += volumeIncrement;
        } else {
            audioElement.volume = 1;
            clearInterval(fade);
        }
    }, step);
}

function fadeOut(audioElement, duration = 1000) {
    const step = 50;
    const volumeDecrement = audioElement.volume / (duration / step);
    const fade = setInterval(() => {
        if (audioElement.volume > volumeDecrement) {
            audioElement.volume -= volumeDecrement;
        } else {
            audioElement.volume = 0;
            audioElement.pause();
            clearInterval(fade);
        }
    }, step);
}

toggle.addEventListener('click', () => {
    if (musicPlaying) {
        fadeOut(audio, 1000);
        toggle.textContent = '🔇';
    } else {
        fadeIn(audio, 3000);
        toggle.textContent = '🔊';
    }
    musicPlaying = !musicPlaying;
});

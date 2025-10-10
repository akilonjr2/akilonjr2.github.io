// === SMOKE EFFECT ===
const smokeContainer = document.getElementById('smoke-bg');
if (smokeContainer) {
    for (let i = 0; i < 10; i++) {
        const s = document.createElement('div');
        s.className = 'smoke';
        s.style.width = `${Math.random() * 120 + 80}px`;
        s.style.height = s.style.width;
        s.style.left = `${Math.random() * 100}%`;
        s.style.bottom = `${Math.random() * -100}px`;
        s.style.animationDelay = `${Math.random() * 10}s`;
        smokeContainer.appendChild(s);
    }
}

// === INTRO SCREEN ===
const introScreen = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const mainContent = document.getElementById('main-content');

if (enterBtn && introScreen && mainContent) {
    enterBtn.addEventListener('click', () => {
        introScreen.classList.add('fade-out');
        setTimeout(() => {
            introScreen.remove();
            mainContent.classList.remove('hidden');

            // Make sections visible immediately if already in viewport
            document.querySelectorAll('.section').forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight) section.classList.add('visible');
            });
        }, 1000);
    });
}

// === SECTIONS FADE-IN ===
document.querySelectorAll('.section').forEach((section) => {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target); // animate once
                }
            });
        },
        { threshold: 0.2 }
    );

    observer.observe(section);
});

// === FORM LOGIC ===
const form = document.getElementById('contact-form');
if (form) {
    const honey = form.querySelector('input[name="_honey"]');
    const timestampField = form.querySelector('#timestamp');
    const note = document.getElementById('submission-note');
    const submitBtn = form.querySelector('button');
    const alreadyMsg = document.getElementById('already-submitted');

    const lastSubmission = localStorage.getItem('courtSubmissionTime');
    const now = Date.now();

    if (lastSubmission && now - parseInt(lastSubmission, 10) < 86400000) {
        form.classList.add('disabled');
        submitBtn.disabled = true;
        submitBtn.textContent = ' Application Received';
        if (alreadyMsg) alreadyMsg.classList.remove('hidden');
        note.classList.remove('hidden');
        note.classList.add('visible');
    }

    timestampField.value = now.toString();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.classList.contains('disabled')) return;
        if (honey && honey.value) return;

        const delta = Date.now() - parseInt(timestampField.value, 10);
        if (delta < 3000) {
            alert('Too swift, intruder. The Court sees through you.');
            return;
        }

        const confirmed = confirm('Your application will be permanently recorded in the archives of the Court. Do you wish to proceed?');
        if (!confirmed) return;

        const formData = new FormData(form);
        try {
            const res = await fetch(form.action, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
            if (res.ok) {
                localStorage.setItem('courtSubmissionTime', Date.now().toString());
                submitBtn.disabled = true;
                submitBtn.textContent = 'Application Received';
                note.classList.remove('hidden');
                setTimeout(() => note.classList.add('visible'), 100);
                form.classList.add('disabled');
            } else alert('The Owls are displeased. Try again.');
        } catch {
            alert('A dark force has disrupted your submission. Try again later.');
        }
    });
}

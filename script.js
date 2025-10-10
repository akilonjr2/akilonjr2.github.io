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

// === VISUAL FADE-IN ===
document.querySelectorAll('.fade').forEach((el) => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    obs.observe(el);
});

// === FORM LOGIC ===
const form = document.getElementById('contact-form');
if (form) {
    const honey = form.querySelector('input[name="_honey"]');
    const timestampField = form.querySelector('#timestamp');
    const note = document.getElementById('submission-note');
    const submitBtn = form.querySelector('button');

    const lastSubmission = localStorage.getItem('courtSubmissionTime');
    const now = Date.now();

    // If submitted within 24 hours
    if (lastSubmission && now - parseInt(lastSubmission, 10) < 86400000) {
        form.classList.add('disabled');
        submitBtn.disabled = true;
        submitBtn.textContent = '🦉 Application Received';
        note.classList.remove('hidden');
        note.classList.add('visible');
    }

    timestampField.value = now.toString();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.classList.contains('disabled')) return;

        if (honey && honey.value) return; // spam check

        const delta = Date.now() - parseInt(timestampField.value, 10);
        if (delta < 3000) {
            alert('🦉 Too swift, intruder. The Court sees through you.');
            return;
        }

        const formData = new FormData(form);
        const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
        });

        if (res.ok) {
            localStorage.setItem('courtSubmissionTime', Date.now().toString());
            submitBtn.disabled = true;
            submitBtn.textContent = '🦉 Application Received';
            note.classList.remove('hidden');
            setTimeout(() => note.classList.add('visible'), 100);
            form.classList.add('disabled');
        } else {
            alert('The Owls are displeased. Try again.');
        }
    });
}

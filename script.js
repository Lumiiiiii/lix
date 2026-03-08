// Relationship Start Date:
// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const loginPass = document.getElementById('login-pass');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    function checkLogin() {
        const pass = loginPass.value.toLowerCase().trim();
        if (pass === 'bibi') {
            loginOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Re-enable scroll
            localStorage.setItem('loggedIn', 'true');
        } else {
            loginOverlay.classList.add('shake');
            loginError.classList.remove('hidden');
            setTimeout(() => loginOverlay.classList.remove('shake'), 400);
            loginPass.value = '';
        }
    }

    // Check if already logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        document.body.style.overflow = 'hidden'; // Lock scroll until login
    }

    loginBtn.addEventListener('click', checkLogin);
    loginPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkLogin();
    });
});

// Countdown Timer Logic
const startDate = new Date('2025-12-11T00:00:00'); // Fixed starting date();

// Timer Logic
function updateTimer() {
    const now = new Date().getTime();
    const distance = now - startDate;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(distance % 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    document.getElementById('milliseconds').innerText = milliseconds.toString().padStart(3, '0');
}

setInterval(updateTimer, 50); // Faster update for milliseconds
updateTimer();

// Animated Number Counter Logic
const speed = 200; // The lower the number, the faster the animation

const animateSingleCounter = (counter) => {
    const target = +counter.getAttribute('data-target');

    const updateCount = () => {
        let current = +(counter.getAttribute('data-current') || 0);

        // Slightly faster speed for huge numbers
        const currentSpeed = target > 1000000 ? 150 : speed;
        const inc = target / currentSpeed;

        if (current < target) {
            let nextValue = Math.ceil(current + inc);
            if (nextValue > target) nextValue = target;

            counter.setAttribute('data-current', nextValue);
            counter.innerText = nextValue.toLocaleString('it-IT');

            // Call function every ms to update
            setTimeout(updateCount, 15);
        } else {
            counter.innerText = target.toLocaleString('it-IT');
        }
    };

    updateCount();
};

const animateTypingText = (element) => {
    const text = element.getAttribute('data-text');
    let index = 0;
    element.innerText = ''; // Clear content initially

    const typeCharacter = () => {
        if (index < text.length) {
            element.innerText += text.charAt(index);
            index++;
            // Randomize typing speed slightly for realism (50ms to 150ms)
            const typeSpeed = Math.random() * 100 + 50;
            setTimeout(typeCharacter, typeSpeed);
        }
    };

    typeCharacter();
};

// Click-to-Reveal Logic
document.querySelectorAll('.stat-card').forEach(card => {
    const btn = card.querySelector('.reveal-btn');
    const numberContainer = card.querySelector('.stat-number-container');
    const counterElement = card.querySelector('.stat-number');

    if (btn && numberContainer && counterElement) {
        btn.addEventListener('click', () => {
            // Hide the button
            btn.classList.add('hidden');
            // Show the number container
            numberContainer.classList.remove('hidden');

            // Start the appropriate animation for each counter found in the card
            card.querySelectorAll('.stat-number').forEach(counterElement => {
                if (counterElement.hasAttribute('data-text')) {
                    animateTypingText(counterElement);
                } else if (counterElement.hasAttribute('data-target')) {
                    animateSingleCounter(counterElement);
                }
            });
        });
    }
});

// Copy Coordinates Logic
window.copyCoordinates = function () {
    const coordsText = document.getElementById('kiss-coords').innerText;
    navigator.clipboard.writeText(coordsText).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerText;

        btn.innerText = 'Copiato!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Errore durante la copia: ', err);
    });
};

// Lovometro Animation Logic
const lovometroSection = document.getElementById('lovometro');
const loveBar = document.getElementById('love-bar');

if (lovometroSection && loveBar) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for better effect
                setTimeout(() => {
                    loveBar.classList.add('filled');
                }, 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(lovometroSection);
}

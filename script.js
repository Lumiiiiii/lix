// Relationship Start Date:
// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const statusMsg = document.getElementById('status-msg');
    const dots = document.querySelectorAll('.dot');
    const numBtns = document.querySelectorAll('.num-btn:not(.delete-btn)');
    const deleteBtn = document.getElementById('delete-btn');

    const CORRECT_PIN = '111225';
    let currentInput = '';

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentInput.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function checkPin() {
        if (currentInput === CORRECT_PIN) {
            handleSuccess();
        } else {
            handleError();
        }
    }

    function handleSuccess() {
        dots.forEach(dot => dot.classList.add('success'));
        statusMsg.textContent = 'Accesso autorizzato';
        statusMsg.style.color = '#00ff88';

        // localStorage.setItem('loggedIn', 'true'); // Disabilitato per chiedere sempre il PIN

        setTimeout(() => {
            loginOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                loginOverlay.style.display = 'none';
            }, 800);
        }, 800);
    }

    function handleError() {
        loginOverlay.classList.add('shake');
        dots.forEach(dot => dot.classList.add('error'));
        statusMsg.textContent = 'Data errata, riprova!';
        statusMsg.style.color = '#ff4d4d';

        setTimeout(() => {
            loginOverlay.classList.remove('shake');
            currentInput = '';
            updateDots();
            dots.forEach(dot => dot.classList.remove('error'));

            setTimeout(() => {
                statusMsg.textContent = 'Inserisci il PIN per entrare';
                statusMsg.style.color = '';
            }, 1000);
        }, 800);
    }

    // Event Listeners
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentInput.length < CORRECT_PIN.length) {
                currentInput += btn.dataset.val;
                updateDots();
                if (currentInput.length === CORRECT_PIN.length) {
                    checkPin();
                }
            }
        });
    });

    deleteBtn.addEventListener('click', () => {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDots();
        }
    });

    // Supporto tastiera fisica
    document.addEventListener('keydown', (e) => {
        if (loginOverlay.style.display !== 'none') {
            if (e.key >= '0' && e.key <= '9') {
                if (currentInput.length < CORRECT_PIN.length) {
                    currentInput += e.key;
                    updateDots();
                    if (currentInput.length === CORRECT_PIN.length) {
                        checkPin();
                    }
                }
            } else if (e.key === 'Backspace') {
                if (currentInput.length > 0) {
                    currentInput = currentInput.slice(0, -1);
                    updateDots();
                }
            }
        }
    });

    // Mostra sempre il PIN pad all'avvio
    loginOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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

// ----------------------------------------------------
// Quiz Logic
// ----------------------------------------------------
function checkQuiz(btn, isCorrect, nextStep) {
    const errorMsg = document.getElementById('quiz-error');
    if (isCorrect) {
        errorMsg.classList.add('hidden');
        btn.style.backgroundColor = 'var(--accent-color)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--accent-glow)';

        setTimeout(() => {
            btn.closest('.quiz-step').classList.add('hidden');
            const nextEl = document.getElementById('quiz-question-' + nextStep);
            if (nextEl) {
                nextEl.classList.remove('hidden');
            }
        }, 600);
    } else {
        btn.style.backgroundColor = 'rgba(255, 50, 50, 0.3)';
        btn.style.borderColor = '#ff3333';
        errorMsg.classList.remove('hidden');

        // Simple shake by toggling class or inline style
        const step = btn.closest('.quiz-step');
        step.style.transform = 'translateX(10px)';
        setTimeout(() => step.style.transform = 'translateX(-10px)', 100);
        setTimeout(() => step.style.transform = 'translateX(10px)', 200);
        setTimeout(() => step.style.transform = 'translateX(0)', 300);

        setTimeout(() => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            btn.style.borderColor = 'var(--glass-border)';
            errorMsg.classList.add('hidden');
        }, 1500);
    }
}





// ----------------------------------------------------
// Phrase Generator Logic
// ----------------------------------------------------
const romanticPhrases = [
    "Sei la ragione per cui sorrido ogni mattina. ❤️",
    "Amo ogni piccolo dettaglio di te, anche quelli che tu non noti.",
    "Il mio posto preferito nel mondo è accanto a te. 🌍",
    "Sei la mia persona preferita, ieri, oggi e per sempre.",
    "Ogni momento passato con te è un regalo prezioso. 🎁",
    "Non esiste distanza che possa separare i nostri cuori.",
    "Sei più bella di un tramonto sul mare. 🌅",
    "Grazie per essere esattamente come sei. 🤍",
    "Insieme a te, tutto sembra possibile.",
    "Sei il mio sogno diventato realtà. ✨",
    "Il tuo amore è il carburante dei miei giorni.",
    "Ogni tua risata è musica per le mie orecchie. 🎵",
    "Ti amo più di quanto le parole possano mai esprimere.",
    "Sei la mia casa, ovunque noi siamo. 🏠",
    "Sei la cosa più bella che mi sia mai capitata. 🥰"
];

let lastPhraseIndex = -1;

function generatePhrase() {
    const phraseElement = document.getElementById('random-phrase');
    const btn = document.getElementById('generate-btn');

    // Disable button during animation
    btn.disabled = true;
    phraseElement.classList.add('hidden');

    setTimeout(() => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * romanticPhrases.length);
        } while (newIndex === lastPhraseIndex);

        lastPhraseIndex = newIndex;
        phraseElement.innerText = romanticPhrases[newIndex];
        phraseElement.classList.remove('hidden');
        btn.disabled = false;
    }, 500);
}


// ----------------------------------------------------
// Secret Letter Login Logic
// ----------------------------------------------------
function checkSecretLetter() {
    const passInput = document.getElementById('secret-pass');
    const loginContainer = document.getElementById('secret-login');
    const letterPaper = document.getElementById('revealed-letter');
    const errorMsg = document.getElementById('secret-error');

    const password = passInput.value.toLowerCase().trim();

    // Secret Password: change this if you want!
    if (password === 'per sempre') {
        errorMsg.classList.add('hidden');

        // Hide login with animation
        loginContainer.style.opacity = '0';
        loginContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            loginContainer.classList.add('hidden');
            // Show letter
            letterPaper.classList.remove('hidden');
            // Scroll to letter smoothly
            letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    } else {
        // Shake animation
        loginContainer.classList.add('shake');
        errorMsg.classList.remove('hidden');
        setTimeout(() => loginContainer.classList.remove('shake'), 400);
        passInput.value = '';
    }
}

// Add Enter key listener for secret letter
document.addEventListener('DOMContentLoaded', () => {
    const secretPassInput = document.getElementById('secret-pass');
    if (secretPassInput) {
        secretPassInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkSecretLetter();
        });
    }
});

// ----------------------------------------------------
// Vinyl Player Logic
// ----------------------------------------------------
function toggleVinyl() {
    const audio = document.getElementById('romantic-audio');
    const record = document.getElementById('vinyl-record');
    const arm = document.getElementById('tonearm');
    const icon = document.getElementById('vinyl-icon');
    const text = document.getElementById('vinyl-text');

    if (audio.paused) {
        audio.play();
        record.classList.add('playing');
        arm.classList.add('playing');
        icon.innerText = '⏸️';
        text.innerText = 'Pausa';
    } else {
        audio.pause();
        record.classList.remove('playing');
        arm.classList.remove('playing');
        icon.innerText = '▶️';
        text.innerText = 'Riproduci';
    }
}

// ----------------------------------------------------
// Easter Egg: Heart Rain
// ----------------------------------------------------
let secretClicks = 0;
let lastSecretClick = 0;

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('secret-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastSecretClick > 2000) {
                secretClicks = 1;
            } else {
                secretClicks++;
            }
            lastSecretClick = now;

            if (secretClicks === 3) {
                startHeartRain();
                secretClicks = 0; // Reset
            }
        });
    }
});

function startHeartRain() {
    const duration = 5000; // 5 seconds
    const interval = setInterval(createFallingHeart, 100);

    setTimeout(() => {
        clearInterval(interval);
    }, duration);
}

function createFallingHeart() {
    const heart = document.createElement('div');
    const emojis = ['❤️', '💖', '🥰', '✨', '🤍', '🧡', '💛', '💚', '💙', '💜'];

    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    heart.classList.add('heart-emoji');

    // Random position and duration
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3-5s
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';

    document.body.appendChild(heart);

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, 5000);
}





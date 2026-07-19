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

let currentTimerMode = 0;
const timerModes = [
    { id: 'default', nextLabel: 'Soli Mesi' },
    { id: 'months', label: 'Mesi', nextLabel: 'Soli Giorni', calc: d => (d / (1000 * 60 * 60 * 24 * 30.436875)).toFixed(6) },
    { id: 'days', label: 'Giorni', nextLabel: 'Sole Ore', calc: d => (d / (1000 * 60 * 60 * 24)).toFixed(5) },
    { id: 'hours', label: 'Ore', nextLabel: 'Soli Minuti', calc: d => Math.floor(d / (1000 * 60 * 60)).toLocaleString('it-IT') },
    { id: 'minutes', label: 'Minuti', nextLabel: 'Soli Secondi', calc: d => Math.floor(d / (1000 * 60)).toLocaleString('it-IT') },
    { id: 'seconds', label: 'Secondi', nextLabel: 'Soli Millisecondi', calc: d => Math.floor(d / 1000).toLocaleString('it-IT') },
    { id: 'milliseconds', label: 'Millisecondi', nextLabel: 'Formato Standard', calc: d => Math.floor(d).toLocaleString('it-IT') }
];

document.addEventListener('DOMContentLoaded', () => {
    // ... existed logic ...

    // Timer Format Switcher
    const formatBtn = document.getElementById('format-btn');
    if (formatBtn) {
        formatBtn.addEventListener('click', () => {
            currentTimerMode = (currentTimerMode + 1) % timerModes.length;
            formatBtn.innerText = 'Converti in: ' + timerModes[currentTimerMode].nextLabel;

            if (currentTimerMode === 0) {
                document.getElementById('timer-default').classList.remove('hidden');
                document.getElementById('timer-single').classList.add('hidden');
            } else {
                document.getElementById('timer-default').classList.add('hidden');
                document.getElementById('timer-single').classList.remove('hidden');
                document.getElementById('single-label').innerText = timerModes[currentTimerMode].label;
            }
            updateTimer();
        });
    }
});

// Timer Logic
function updateTimer() {
    const now = new Date().getTime();
    const distance = now - startDate;

    if (currentTimerMode === 0) {
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
    } else {
        const mode = timerModes[currentTimerMode];
        const val = mode.calc(distance);
        document.getElementById('single-value').innerText = val;
    }
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
// Easter Egg: Heart Rain
// ----------------------------------------------------

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

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// ----------------------------------------------------
// Modern Music Player Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const bgMusic = document.getElementById('bg-music');
    const vinylDisk = document.getElementById('vinyl-disk');
    const coverArt = document.getElementById('mp-cover-art');
    const progressFill = document.getElementById('mp-progress-fill');
    const currentTimeEl = document.getElementById('mp-current-time');
    const durationEl = document.getElementById('mp-duration');
    const playIcon = playPauseBtn?.querySelector('.play-icon');
    const pauseIcon = playPauseBtn?.querySelector('.pause-icon');

    if (!playPauseBtn || !bgMusic) return;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (bgMusic.duration) {
            const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(bgMusic.currentTime);
        }
        if (!bgMusic.paused) {
            requestAnimationFrame(updateProgress);
        }
    }

    bgMusic.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(bgMusic.duration);
    });

    // Allow seeking by clicking on progress bar
    const progressBar = document.querySelector('.mp-progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            if (bgMusic.duration) {
                bgMusic.currentTime = percent * bgMusic.duration;
                updateProgress();
            }
        });
    }

    function togglePlay() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                vinylDisk.classList.add('playing');
                coverArt.classList.add('playing');
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                requestAnimationFrame(updateProgress);
            }).catch(err => console.error("Error playing audio:", err));
        } else {
            bgMusic.pause();
            vinylDisk.classList.remove('playing');
            coverArt.classList.remove('playing');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    // Simple, robust click listener (browsers handle tap-to-click automatically)
    playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        togglePlay();
    });

    // Reset when audio ends
    bgMusic.addEventListener('ended', () => {
        vinylDisk.classList.remove('playing');
        coverArt.classList.remove('playing');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
});

// ----------------------------------------------------
// Magic Love Card - Love Reasons Generator
// ----------------------------------------------------
const loveReasons = [
    "Il tuo sorriso",
    "Le tue labbra",
    "I tuoi occhi",
    "La tua risata",
    "I tuoi piedi!! HIIHI",
    "I tuoi capelli",
    "Il tuo naso",
    "Le tue gambe",
    "Il tuo umorismo",
    "La tua schiena (sì, la amo così com'è)",
    "Le tue orecchie",
    "Come mi guardi",
    "Come mi baci",
    "Gli abbracci che mi dai",
    "TUTTO (sì, anche i difetti)",
    "La tua dolcezza",
];

let isDispensing = false;
let lastReasonIndex = -1;

/*
function dispenseLoveReason(e) {
    if (e) e.preventDefault();
    if (isDispensing) return;
    isDispensing = true;

    const card = document.getElementById('magic-card');
    const reasonText = document.getElementById('magic-reason-text');
    const btn = document.getElementById('magic-btn');
    const container = document.getElementById('magic-card-container');

    // Pick a random reason (avoid repeating the same one)
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * loveReasons.length);
    } while (randomIndex === lastReasonIndex && loveReasons.length > 1);
    lastReasonIndex = randomIndex;

    const reason = loveReasons[randomIndex];

    // Set the reason text before flipping
    reasonText.innerText = reason;

    // Lock scroll position to prevent jump during 3D transform
    const scrollY = window.scrollY || window.pageYOffset;
    const lockScroll = () => window.scrollTo(0, scrollY);

    // Flip the card
    card.classList.add('flipped');

    // Enforce scroll lock for a brief period (covers the transform start)
    lockScroll();
    const scrollLockId = setInterval(lockScroll, 16);
    setTimeout(() => clearInterval(scrollLockId), 150);

    // Disable button during animation
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';

    // Flip back after a delay so user can read
    setTimeout(() => {
        card.classList.remove('flipped');
        
        // Re-enable button after flip-back animation
        setTimeout(() => {
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
            isDispensing = false;
        }, 800);
    }, 2500);
}

// Bind the magic button
document.addEventListener('DOMContentLoaded', () => {
    const magicBtn = document.getElementById('magic-btn');
    if (!magicBtn) return;
    
    magicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dispenseLoveReason(e);
    });
});
*/



// ----------------------------------------------------
// Scattered Polaroids Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const polaroids = document.querySelectorAll('.polaroid-item');
    const gallery = document.getElementById('polaroid-gallery');
    if (!polaroids.length || !gallery) return;

    let highestZ = 10;

    // Initialize random rotations and positions
    polaroids.forEach(polaroid => {
        // Random rotation between -15 and +15 degrees
        const randomRot = Math.random() * 30 - 15;

        // Slight random offset from center for a messy pile look
        const randomX = Math.random() * 60 - 30;
        const randomY = Math.random() * 60 - 30;

        polaroid.dataset.rot = randomRot;
        polaroid.dataset.basex = randomX;
        polaroid.dataset.basey = randomY;

        polaroid.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg)`;

        // Drag logic
        let isDragging = false;
        let startX, startY, initialX = randomX, initialY = randomY;

        // Use pointer events for both mouse and touch support
        polaroid.addEventListener('pointerdown', (e) => {
            if (e.button && e.button !== 0) return; // Only left click
            e.preventDefault(); // Prevent default text selection

            isDragging = true;
            polaroid.classList.add('dragging');

            // Bring to front
            highestZ++;
            polaroid.style.zIndex = highestZ;

            startX = e.clientX;
            startY = e.clientY;

            // Revert scale slightly for dragging feel without losing rotation
            polaroid.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${randomRot}deg) scale(1.05)`;
            polaroid.setPointerCapture(e.pointerId);
        });

        polaroid.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const currentX = initialX + dx;
            const currentY = initialY + dy;

            polaroid.dataset.x = currentX;
            polaroid.dataset.y = currentY;

            polaroid.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${randomRot}deg) scale(1.05)`;
        });

        const stopDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            polaroid.classList.remove('dragging');

            try {
                polaroid.releasePointerCapture(e.pointerId);
            } catch (err) { }

            if (polaroid.dataset.x !== undefined) initialX = parseFloat(polaroid.dataset.x);
            if (polaroid.dataset.y !== undefined) initialY = parseFloat(polaroid.dataset.y);

            polaroid.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${randomRot}deg) scale(1)`;
        };

        polaroid.addEventListener('pointerup', stopDrag);
        polaroid.addEventListener('pointercancel', stopDrag);
    });
});

// ----------------------------------------------------
// Mesiversario Countdown Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const ANNIVERSARY_DAY = 11; // 11th of each month
    const RELATIONSHIP_START = new Date('2025-12-11T00:00:00');

    const daysEl = document.getElementById('mesi-days');
    const hoursEl = document.getElementById('mesi-hours');
    const minutesEl = document.getElementById('mesi-minutes');
    const secondsEl = document.getElementById('mesi-seconds');
    const countdownEl = document.getElementById('mesiversario-countdown');
    const todayEl = document.getElementById('mesiversario-today');
    const subtitleEl = document.getElementById('mesiversario-subtitle');
    const monthNumberEl = document.getElementById('mesi-month-number');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function getMonthNumber(date) {
        const startYear = RELATIONSHIP_START.getFullYear();
        const startMonth = RELATIONSHIP_START.getMonth();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth();
        return (currentYear - startYear) * 12 + (currentMonth - startMonth);
    }

    function getNextMesiversario() {
        const now = new Date();
        const thisMonth11 = new Date(now.getFullYear(), now.getMonth(), ANNIVERSARY_DAY);

        if (now.getDate() === ANNIVERSARY_DAY) {
            return null; // It's today!
        } else if (now.getDate() < ANNIVERSARY_DAY) {
            return thisMonth11;
        } else {
            // Next month's 11th
            return new Date(now.getFullYear(), now.getMonth() + 1, ANNIVERSARY_DAY);
        }
    }

    let confettiFired = false;

    function updateMesiversario() {
        const now = new Date();
        const target = getNextMesiversario();

        if (target === null) {
            // It's mesiversario day!
            countdownEl.classList.add('hidden');
            todayEl.classList.remove('hidden');
            const monthNum = getMonthNumber(now);
            monthNumberEl.innerText = monthNum + '° mese insieme 🤍';
            subtitleEl.innerText = 'Oggi è un giorno speciale!';

            // Fire confetti once
            if (!confettiFired) {
                confettiFired = true;
                fireMesiversarioConfetti();
            }
        } else {
            countdownEl.classList.remove('hidden');
            todayEl.classList.add('hidden');

            const nextMonthNum = getMonthNumber(target);
            subtitleEl.innerText = 'Mancano al nostro ' + nextMonthNum + '° mese...';

            const diff = target.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minutesEl.innerText = minutes.toString().padStart(2, '0');
            secondsEl.innerText = seconds.toString().padStart(2, '0');
        }
    }

    function fireMesiversarioConfetti() {
        const colors = ['#ff6b9d', '#c44dff', '#6e8efb', '#ffcc00', '#00ff88', '#ff3366'];
        const card = document.getElementById('mesiversario-card');
        if (!card) return;

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = (Math.random() * 8 + 5) + 'px';
                confetti.style.height = (Math.random() * 8 + 5) + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.opacity = '1';
                confetti.style.transition = 'none';

                document.body.appendChild(confetti);

                const duration = 2000 + Math.random() * 2000;
                const swayX = (Math.random() - 0.5) * 200;
                const startTime = performance.now();

                function animateConfetti(time) {
                    const elapsed = time - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    confetti.style.top = (progress * window.innerHeight * 1.1) + 'px';
                    confetti.style.transform = `translateX(${Math.sin(progress * 6) * swayX}px) rotate(${progress * 720}deg)`;
                    confetti.style.opacity = progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1;

                    if (progress < 1) {
                        requestAnimationFrame(animateConfetti);
                    } else {
                        confetti.remove();
                    }
                }

                requestAnimationFrame(animateConfetti);
            }, i * 60);
        }
    }

    updateMesiversario();
    setInterval(updateMesiversario, 1000);
});

// ----------------------------------------------------
// Secret Message Board Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'lix-secret-board';
    const messagesContainer = document.getElementById('board-messages');
    const emptyMsg = document.getElementById('board-empty');
    const input = document.getElementById('board-input');
    const sendBtn = document.getElementById('board-send-btn');

    if (!messagesContainer || !input || !sendBtn) return;

    function loadMessages() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function saveMessages(messages) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }

    function formatDate(timestamp) {
        const d = new Date(timestamp);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const mins = d.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} alle ${hours}:${mins}`;
    }

    function renderMessages() {
        // Remove all notes (keep empty message element)
        messagesContainer.querySelectorAll('.board-note').forEach(n => n.remove());

        const messages = loadMessages();

        if (messages.length === 0) {
            emptyMsg.classList.remove('hidden');
        } else {
            emptyMsg.classList.add('hidden');
            messages.forEach((msg, index) => {
                const note = document.createElement('div');
                note.classList.add('board-note');

                const text = document.createElement('p');
                text.classList.add('board-note-text');
                text.textContent = msg.text;

                const time = document.createElement('span');
                time.classList.add('board-note-time');
                time.textContent = formatDate(msg.timestamp);

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('board-note-delete');
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Elimina';
                deleteBtn.addEventListener('click', () => {
                    deleteMessage(index);
                });

                note.appendChild(deleteBtn);
                note.appendChild(text);
                note.appendChild(time);
                messagesContainer.appendChild(note);
            });

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function addMessage(text) {
        const messages = loadMessages();
        messages.push({
            text: text.trim(),
            timestamp: Date.now()
        });
        saveMessages(messages);
        renderMessages();
    }

    function deleteMessage(index) {
        const messages = loadMessages();
        messages.splice(index, 1);
        saveMessages(messages);
        renderMessages();
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text);
        input.value = '';

        // Visual feedback
        sendBtn.classList.add('sent');
        const originalContent = sendBtn.innerHTML;
        sendBtn.innerHTML = '✓';
        setTimeout(() => {
            sendBtn.classList.remove('sent');
            sendBtn.innerHTML = originalContent;
        }, 1200);
    }

    sendBtn.addEventListener('click', handleSend);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });

    // Initial render
    renderMessages();
});

// ----------------------------------------------------
// Travel Map Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('wishlist-map');
    const listContainer = document.getElementById('map-places-list');
    if (!mapElement || !listContainer) return;

    // Initialize Leaflet Map
    const map = L.map('wishlist-map', {
        minZoom: 2,
        maxZoom: 12,
        worldCopyJump: true,
        attributionControl: false // Custom attribution below
    }).setView([20, 10], 2);

    // Add CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Define custom marker icons using L.divIcon
    const heartIcon = L.divIcon({
        className: 'custom-marker-heart',
        html: '<div class="marker-pulse-red"></div><div class="marker-icon-heart">❤️</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -12]
    });

    const wishIcon = L.divIcon({
        className: 'custom-marker-wish',
        html: '<div class="marker-pulse-blue"></div><div class="marker-icon-wish">✈️</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -12]
    });

    // Default Seeded places
    const defaultPlaces = [
        {
            id: 'tokyo',
            name: 'Tokyo, Giappone 🇯🇵',
            coords: [35.6762, 139.6503],
            type: 'wishlist'
        },
        {
            id: 'seoul',
            name: 'Seoul, Corea del Sud 🇰🇷',
            coords: [37.5665, 126.9780],
            type: 'wishlist'
        },
        {
            id: 'paris',
            name: 'Parigi, Francia 🇫🇷',
            coords: [48.8566, 2.3522],
            type: 'wishlist'
        },
        {
            id: 'reykjavik',
            name: 'Reykjavík, Islanda 🇮🇸',
            coords: [64.1466, -21.9426],
            type: 'wishlist'
        },
        {
            id: 'newyork',
            name: 'New York City, USA 🇺🇸',
            coords: [40.7128, -74.0060],
            type: 'wishlist'
        }
    ];

    const STORAGE_KEY = 'lix-travel-map-custom';
    let markersMap = {}; // Keep track of marker objects by place ID

    // Load custom places from localStorage
    function loadCustomPlaces() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading custom places:', e);
            return [];
        }
    }

    // Save custom places to localStorage
    function saveCustomPlaces(places) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
        } catch (e) {
            console.error('Error saving custom places:', e);
        }
    }

    // Render list and markers
    function renderMapAndList() {
        // Clear existing markers from map
        Object.values(markersMap).forEach(marker => map.removeLayer(marker));
        markersMap = {};

        const customPlaces = loadCustomPlaces();
        const allPlaces = [...defaultPlaces, ...customPlaces];

        // Clear sidebar list container
        listContainer.innerHTML = '';

        allPlaces.forEach(place => {
            // Determine icon and emoji
            const isMemory = place.type === 'memory';
            const icon = isMemory ? heartIcon : wishIcon;
            const emoji = isMemory ? '❤️' : '✈️';

            // Create Leaflet Marker
            const popupContent = `
                <div class="popup-title">${isMemory ? '🤍' : '✈️'} ${place.name}</div>
                <div class="popup-description">${place.desc}</div>
            `;
            const marker = L.marker(place.coords, { icon: icon })
                .bindPopup(popupContent)
                .addTo(map);

            markersMap[place.id] = marker;

            // Create sidebar list item
            const item = document.createElement('div');
            item.classList.add('map-item');
            item.dataset.id = place.id;

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('map-item-icon');
            iconDiv.textContent = emoji;

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('map-item-content');

            const titleEl = document.createElement('div');
            titleEl.classList.add('map-item-title');
            titleEl.textContent = place.name;

            const descEl = document.createElement('div');
            descEl.classList.add('map-item-desc');
            descEl.textContent = place.desc;

            contentDiv.appendChild(titleEl);
            contentDiv.appendChild(descEl);
            item.appendChild(iconDiv);
            item.appendChild(contentDiv);

            // Add delete button only for custom places
            if (!defaultPlaces.some(dp => dp.id === place.id)) {
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('map-item-delete');
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Rimuovi questo luogo';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent clicking the item
                    deleteCustomPlace(place.id);
                });
                item.appendChild(deleteBtn);
            }

            // Click listener for list item
            item.addEventListener('click', () => {
                // Remove active class from all items
                document.querySelectorAll('.map-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                // Fly to coordinate and open popup
                map.flyTo(place.coords, 6, {
                    animate: true,
                    duration: 1.5
                });

                // Open marker popup after transition
                setTimeout(() => {
                    marker.openPopup();
                }, 1000);
            });

            listContainer.appendChild(item);
        });
    }

    function addCustomPlace(lat, lng, name, desc) {
        const customPlaces = loadCustomPlaces();
        const newPlace = {
            id: 'custom-' + Date.now(),
            name: name,
            coords: [lat, lng],
            desc: desc,
            type: 'wishlist'
        };
        customPlaces.push(newPlace);
        saveCustomPlaces(customPlaces);
        renderMapAndList();

        // Highlight and focus the new item
        setTimeout(() => {
            const newItem = listContainer.querySelector(`[data-id="${newPlace.id}"]`);
            if (newItem) {
                newItem.click();
                newItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    }

    function deleteCustomPlace(id) {
        let customPlaces = loadCustomPlaces();
        customPlaces = customPlaces.filter(p => p.id !== id);
        saveCustomPlaces(customPlaces);
        renderMapAndList();
    }

    // Map Click Listener to Add Place
    map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Custom modal prompt
        const name = window.prompt("Nome del luogo da visitare insieme (es: Londra, Islanda, ecc.):");
        if (!name) return; // Cancelled

        const desc = window.prompt(`Cosa vogliamo fare a ${name}? (es: Vedere i musei, mangiare dolci, ecc.):`);
        if (desc === null) return; // Cancelled

        addCustomPlace(lat, lng, name, desc || 'Nessuna descrizione inserita.');
    });

    // Fix hidden-container leaflet tile loading bug by calling invalidateSize when map becomes visible
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    map.invalidateSize();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(mapElement);
    } else {
        // Fallback for browsers without observer
        setTimeout(() => {
            map.invalidateSize();
        }, 2000);
    }

    // Initial Render
    renderMapAndList();
});

// ----------------------------------------------------
// Quadernino dei Ricordi (Memories Notebook) Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'lix-memories-book';
    const memoriesList = document.getElementById('memories-list');
    const memoryForm = document.getElementById('memory-form');
    const memoryTitle = document.getElementById('memory-title');
    const memoryDate = document.getElementById('memory-date');
    const memoryDesc = document.getElementById('memory-desc');
    const memoryEmojiInput = document.getElementById('memory-emoji');
    const emojiSelector = document.getElementById('memory-emoji-selector');
    const searchInput = document.getElementById('memory-search');

    if (!memoriesList || !memoryForm) return;

    // Function to strip emojis from titles
    function cleanTitleString(str) {
        if (!str) return '';
        return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Strips surrogate pairs (most emojis)
                  .replace(/[\u2700-\u27BF]|[\u2600-\u26FF]|[\u2B50]/g, '') // Strips BMP emojis
                  .replace(/\s+/g, ' ')
                  .trim();
    }

    // Seed data
    const defaultMemories = [
        {
            id: 'seed-1',
            title: 'Il nostro primo messaggio WhatsApp',
            date: '2025-11-29',
            desc: 'La prima scintilla... Da quel "Ciao" non abbiamo mai smesso di scriverci nemmeno per un giorno.',
            emoji: '✨'
        },
        {
            id: 'seed-2',
            title: 'Il nostro primo bacio',
            date: '2025-12-05',
            desc: 'A Grosseto, una delle serate più fredde ma allo stesso tempo più calde e magiche della mia vita.',
            emoji: '🤍'
        },
        {
            id: 'seed-3',
            title: 'La nostra prima notte insieme',
            date: '2026-07-12',
            desc: 'Prima nottata passata insieme! Rimasti svegli a parlare, ridere e coccolarci fino alle 6 del mattino... Indimenticabile. 🤍',
            emoji: '🛌'
        }
    ];

    function loadMemories() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            let memories = [];
            if (!data) {
                // If empty, save and return default seed data
                memories = defaultMemories;
                saveMemories(memories);
            } else {
                memories = JSON.parse(data);
            }
            // Strip any emojis from titles of all memories
            return memories.map(m => ({
                ...m,
                title: cleanTitleString(m.title)
            }));
        } catch (e) {
            console.error('Error loading memories:', e);
            return defaultMemories.map(m => ({
                ...m,
                title: cleanTitleString(m.title)
            }));
        }
    }

    function saveMemories(memories) {
        try {
            // Clean titles before saving
            const cleanedMemories = memories.map(m => ({
                ...m,
                title: cleanTitleString(m.title)
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedMemories));
        } catch (e) {
            console.error('Error saving memories:', e);
        }
    }

    function formatDateString(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const [year, month, day] = parts;
        
        // Months in Italian
        const months = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        const monthIndex = parseInt(month, 10) - 1;
        return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
    }

    function renderMemories() {
        const memories = loadMemories();
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Clear existing memories rendering
        memoriesList.innerHTML = '';

        // Filter and sort (most recent date first)
        const filtered = memories.filter(m => {
            return m.title.toLowerCase().includes(searchTerm) || 
                   m.desc.toLowerCase().includes(searchTerm) ||
                   m.date.includes(searchTerm);
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filtered.length === 0) {
            const emptyContainer = document.createElement('div');
            emptyContainer.classList.add('memories-empty');
            emptyContainer.innerHTML = `
                <div class="memories-empty-icon">📖</div>
                <p class="memories-empty-text">Nessun ricordo trovato... Scrivine uno a sinistra!</p>
            `;
            memoriesList.appendChild(emptyContainer);
            return;
        }

        filtered.forEach(memory => {
            const card = document.createElement('div');
            card.classList.add('memory-card');

            const header = document.createElement('div');
            header.classList.add('memory-header');

            const meta = document.createElement('div');
            meta.classList.add('memory-meta');

            const titleEl = document.createElement('div');
            titleEl.classList.add('memory-card-title');
            titleEl.textContent = memory.title;

            const dateEl = document.createElement('div');
            dateEl.classList.add('memory-card-date');
            dateEl.textContent = formatDateString(memory.date);

            meta.appendChild(titleEl);
            meta.appendChild(dateEl);
            header.appendChild(meta);

            const textEl = document.createElement('p');
            textEl.classList.add('memory-card-text');
            textEl.textContent = (memory.emoji ? memory.emoji + ' ' : '') + memory.desc;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('memory-delete-btn');
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Elimina questo ricordo';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.confirm(`Sei sicuro di voler eliminare il ricordo "${memory.title}"?`)) {
                    deleteMemory(memory.id);
                }
            });

            card.appendChild(header);
            card.appendChild(textEl);
            card.appendChild(deleteBtn);
            
            memoriesList.appendChild(card);
        });
    }

    function deleteMemory(id) {
        const memories = loadMemories();
        const updated = memories.filter(m => m.id !== id);
        saveMemories(updated);
        renderMemories();
    }

    // Emoji selection logic
    if (emojiSelector) {
        const opts = emojiSelector.querySelectorAll('.emoji-opt');
        opts.forEach(opt => {
            opt.addEventListener('click', () => {
                opts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                memoryEmojiInput.value = opt.dataset.emoji;
            });
        });
    }

    // Search logic
    searchInput.addEventListener('input', renderMemories);

    // Form submit logic
    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = cleanTitleString(memoryTitle.value.trim());
        const date = memoryDate.value;
        const desc = memoryDesc.value.trim();
        const emoji = memoryEmojiInput.value;

        if (!title || !date || !desc) return;

        const newMemory = {
            id: 'memory-' + Date.now(),
            title: title,
            date: date,
            desc: desc,
            emoji: emoji
        };

        const memories = loadMemories();
        memories.push(newMemory);
        saveMemories(memories);

        // Reset form
        memoryTitle.value = '';
        memoryDesc.value = '';
        
        // Reset emoji active state
        if (emojiSelector) {
            const opts = emojiSelector.querySelectorAll('.emoji-opt');
            opts.forEach((o, i) => {
                if (i === 0) {
                    o.classList.add('active');
                    memoryEmojiInput.value = o.dataset.emoji;
                } else {
                    o.classList.remove('active');
                }
            });
        }

        // Keep date input to today's date
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        memoryDate.value = `${yyyy}-${mm}-${dd}`;

        renderMemories();

        // Scroll to the list of memories
        memoriesList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Set today's date in form by default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    memoryDate.value = `${yyyy}-${mm}-${dd}`;

    // Initial render
    renderMemories();
});


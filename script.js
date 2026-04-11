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
    if(formatBtn) {
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
// Bucket List Logic & Confetti
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const bucketItems = document.querySelectorAll('.bucket-item');

    bucketItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        item.addEventListener('click', (e) => {
            // Prevent double toggling if clicking directly on the checkbox/label
            if (e.target !== checkbox && e.target !== item.querySelector('.check-box')) {
                checkbox.checked = !checkbox.checked;
            }

            if (checkbox.checked) {
                item.classList.add('checked');
                fireConfetti(item);
            } else {
                item.classList.remove('checked');
            }
        });
        
        // Also listen to change on the checkbox explicitly
        checkbox.addEventListener('change', (e) => {
            if (checkbox.checked) {
                item.classList.add('checked');
                fireConfetti(item);
            } else {
                item.classList.remove('checked');
            }
        });
    });

    function fireConfetti(element) {
        const colors = ['#ff0055', '#00ff88', '#00ccff', '#ffcc00', '#ff00ff'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Start from the element's position
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height + window.scrollY;
            
            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            
            // Custom animation logic
            const tx = (Math.random() - 0.5) * 100; // X spread
            const ty = -Math.random() * 50; // Y upwards force before falling
            
            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');
            
            // Apply custom animation
            confetti.style.animation = `popConfetti ${0.5 + Math.random() * 0.5}s ease-out forwards`;
            
            document.body.appendChild(confetti);
            
            // Cleanup
            setTimeout(() => {
                confetti.remove();
            }, 1000);
        }
    }
});

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
            } catch (err) {}
            
            if(polaroid.dataset.x !== undefined) initialX = parseFloat(polaroid.dataset.x);
            if(polaroid.dataset.y !== undefined) initialY = parseFloat(polaroid.dataset.y);
            
            polaroid.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${randomRot}deg) scale(1)`;
        };

        polaroid.addEventListener('pointerup', stopDrag);
        polaroid.addEventListener('pointercancel', stopDrag);
    });
});

/* ========================================================
   COMPLEANNO.JS - LOGICA DEDICATA 16° COMPLEANNO LINDA
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Configurazione Date & Modalità Test / Anteprima
    // -------------------------------------------------------------
    // Inizio Compleanno: 24 Settembre 2026 00:00:00
    const bdayStartDate = new Date('2026-09-24T00:00:00').getTime();
    // Fine Compleanno (Autodistruzione): 24 Settembre 2026 23:59:59.999 (25 Settembre 00:00:00)
    const bdayEndDate = new Date('2026-09-25T00:00:00').getTime();

    const urlParams = new URLSearchParams(window.location.search);
    let isTestMode = urlParams.has('test') || urlParams.has('preview') || sessionStorage.getItem('bday_test_mode') === 'true';

    // Gestione click per attivare la modalità anteprima dal messaggio di blocco
    const previewHint = document.getElementById('lock-preview-hint');
    if (previewHint) {
        previewHint.addEventListener('click', () => {
            sessionStorage.setItem('bday_test_mode', 'true');
            window.location.reload();
        });
    }

    // -------------------------------------------------------------
    // 2. Controllo di Sicurezza & Timer di Autodistruzione
    // -------------------------------------------------------------
    const lockScreen = document.getElementById('bday-lock-screen');
    const lockTitle = document.getElementById('lock-title');
    const lockDesc = document.getElementById('lock-desc');
    const autodestructOverlay = document.getElementById('autodestruct-overlay');
    const redirectSecSpan = document.getElementById('destruct-redirect-sec');

    const hudHours = document.getElementById('hud-hours');
    const hudMinutes = document.getElementById('hud-minutes');
    const hudSeconds = document.getElementById('hud-seconds');
    const hudProgressFill = document.getElementById('hud-progress-fill');

    let autodestructionTriggered = false;

    function checkAccessAndAutodestruction() {
        const now = new Date().getTime();
        const hudTag = document.querySelector('.hud-tag');
        const hudSub = document.querySelector('.hud-sub');

        // 1. Caso: Prima del 24 Settembre 00:00:00 (Oggi, 23 Settembre)
        if (now < bdayStartDate) {
            // Se siamo in modalità anteprima/test, consentiamo l'accesso ma il timer di autodistruzione NON viene contato: è resettato!
            if (isTestMode) {
                if (lockScreen) lockScreen.classList.add('hidden');
                // Timer resettato a 24 ore piene: non scala e non si autodistrugge oggi
                if (hudHours) hudHours.innerText = '24';
                if (hudMinutes) hudMinutes.innerText = '00';
                if (hudSeconds) hudSeconds.innerText = '00';
                if (hudProgressFill) hudProgressFill.style.width = '100%';
                if (hudTag) hudTag.innerText = '⏳ ATTIVAZIONE IL 24 SETTEMBRE';
                if (hudSub) hudSub.innerText = 'Il timer di autodistruzione si attiverà a mezzanotte! ⏳';
                return;
            } else {
                if (lockScreen) {
                    lockScreen.classList.remove('hidden');
                    if (lockTitle) lockTitle.innerText = 'Sorpresa non ancora sbloccata! 🔒';
                    if (lockDesc) lockDesc.innerHTML = 'Questa pagina speciale è un regalo per i tuoi 16 anni e si aprirà solo a mezzanotte del <strong>24 Settembre</strong>! 🎂✨';
                }
                return;
            }
        }

        // 2. Caso: Dopo il 24 Settembre 23:59:59 (Autodistrutto)
        if (now >= bdayEndDate) {
            if (lockScreen) {
                lockScreen.classList.remove('hidden');
                if (lockTitle) lockTitle.innerText = 'Pagina Autodistrutta 🔒';
                if (lockDesc) lockDesc.innerText = 'Il 24 Settembre è terminato. Come promesso, questa pagina di compleanno speciale si è autodistrutta ed è tornata bloccata!';
            }
            return;
        }

        // 3. Caso: Domani, 24 Settembre (00:00:00 - 23:59:59) -> IL TIMER SI ATTIVA UFFICIALMENTE!
        if (lockScreen) lockScreen.classList.add('hidden');
        if (hudTag) hudTag.innerText = '⚠️ AUTODISTRUZIONE ATTIVA';
        if (hudSub) hudSub.innerText = 'Tempo rimasto alla fine del giorno:';

        const remainingMs = bdayEndDate - now;

        if (remainingMs <= 0 && !autodestructionTriggered) {
            triggerAutodestructionSequence();
        } else {
            updateHudDisplay(remainingMs, 24 * 60 * 60 * 1000);
        }
    }

    function updateHudDisplay(remainingMs, totalMs) {
        if (remainingMs <= 0) {
            if (hudHours) hudHours.innerText = '00';
            if (hudMinutes) hudMinutes.innerText = '00';
            if (hudSeconds) hudSeconds.innerText = '00';
            if (hudProgressFill) hudProgressFill.style.width = '0%';
            return;
        }

        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

        if (hudHours) hudHours.innerText = hours.toString().padStart(2, '0');
        if (hudMinutes) hudMinutes.innerText = minutes.toString().padStart(2, '0');
        if (hudSeconds) hudSeconds.innerText = seconds.toString().padStart(2, '0');

        if (hudProgressFill) {
            const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
            hudProgressFill.style.width = `${pct}%`;
        }
    }

    function triggerAutodestructionSequence() {
        autodestructionTriggered = true;
        if (autodestructOverlay) {
            autodestructOverlay.classList.remove('hidden');
        }

        let secondsLeft = 5;
        if (redirectSecSpan) redirectSecSpan.innerText = secondsLeft;

        const countdownInterval = setInterval(() => {
            secondsLeft--;
            if (redirectSecSpan) redirectSecSpan.innerText = secondsLeft;
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                sessionStorage.removeItem('bday_test_mode');
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    // Timer loop per il countdown persistente ogni secondo
    setInterval(checkAccessAndAutodestruction, 1000);
    checkAccessAndAutodestruction();

    // -------------------------------------------------------------
    // 3. Sfondo con Palloncini Fluttuanti
    // -------------------------------------------------------------
    const balloonsBg = document.getElementById('bday-balloons-bg');
    if (balloonsBg) {
        const balloonIcons = ['🎈', '💖', '🎂', '✨', '🎉', '🌟', '🎀', '🤍'];
        for (let i = 0; i < 18; i++) {
            const b = document.createElement('div');
            b.className = 'floating-balloon';
            b.innerText = balloonIcons[i % balloonIcons.length];
            b.style.left = `${Math.random() * 92 + 3}%`;
            b.style.animationDelay = `${Math.random() * 12}s`;
            b.style.animationDuration = `${12 + Math.random() * 10}s`;
            balloonsBg.appendChild(b);
        }
    }

    // -------------------------------------------------------------
    // 4. Torta Interattiva a 16 Candeline
    // -------------------------------------------------------------
    const cakeCandlesRow = document.getElementById('cake-candles-row');
    const cakeStatusText = document.getElementById('cake-status-text');
    const blowAllBtn = document.getElementById('blow-all-candles-btn');
    const relightBtn = document.getElementById('relight-candles-btn');
    const wishBox = document.getElementById('wish-revealed-box');

    let litCandlesCount = 16;

    if (cakeCandlesRow) {
        for (let i = 1; i <= 16; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle-item';
            candle.title = `Candelina #${i} - Clicca per spegnere!`;
            candle.innerHTML = `
                <div class="candle-flame" id="flame-${i}">🔥</div>
                <div class="candle-stick"></div>
            `;

            candle.addEventListener('click', () => {
                const flame = document.getElementById(`flame-${i}`);
                if (flame) {
                    if (flame.classList.contains('off')) {
                        flame.classList.remove('off');
                        litCandlesCount++;
                    } else {
                        flame.classList.add('off');
                        litCandlesCount--;
                        triggerMiniSparkle(candle);
                    }
                    updateCandlesStatus();
                }
            });

            cakeCandlesRow.appendChild(candle);
        }
    }

    function updateCandlesStatus() {
        if (cakeStatusText) {
            if (litCandlesCount === 0) {
                cakeStatusText.innerText = '🎉 Tutte le 16 candeline sono spente! ✨';
                if (wishBox) wishBox.classList.remove('hidden');
                if (blowAllBtn) blowAllBtn.classList.add('hidden');
                if (relightBtn) relightBtn.classList.remove('hidden');
                triggerFullConfettiExplosion();
            } else {
                cakeStatusText.innerText = `${litCandlesCount} candeline ancora accese 🔥`;
                if (wishBox) wishBox.classList.add('hidden');
                if (blowAllBtn) blowAllBtn.classList.remove('hidden');
                if (relightBtn) relightBtn.classList.add('hidden');
            }
        }
    }

    if (blowAllBtn) {
        blowAllBtn.addEventListener('click', () => {
            for (let i = 1; i <= 16; i++) {
                const flame = document.getElementById(`flame-${i}`);
                if (flame) flame.classList.add('off');
            }
            litCandlesCount = 0;
            updateCandlesStatus();
        });
    }

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            for (let i = 1; i <= 16; i++) {
                const flame = document.getElementById(`flame-${i}`);
                if (flame) flame.classList.remove('off');
            }
            litCandlesCount = 16;
            updateCandlesStatus();
            triggerFullConfettiExplosion();
        });
    }

    // -------------------------------------------------------------
    // 5. 16 Motivi Per Cui Sei Speciale (Flip Cards)
    // -------------------------------------------------------------
    const reasonsGrid = document.getElementById('reasons-grid');
    if (reasonsGrid) {
        const reasons = [
            { icon: '💖', title: 'Motivo #1', desc: 'Il tuo sorriso unico che illumina all’istante qualsiasi mia giornata, anche quelle più grigie.' },
            { icon: '🌺', title: 'Motivo #2', desc: 'La tua dolcezza infinita e il modo premuroso con cui ti prendi cura di me ogni volta.' },
            { icon: '✨', title: 'Motivo #3', desc: 'I tuoi occhi bellissimi e profondi, in cui potrei perdermi a guardarti per ore intere.' },
            { icon: '🍕', title: 'Motivo #4', desc: 'La nostra complicità quando mangiamo insieme al sushi e condividiamo ogni cosa.' },
            { icon: '🎬', title: 'Motivo #5', desc: 'Le nostre serate al cinema vicini vicini al buio della sala, mano nella mano.' },
            { icon: '🌊', title: 'Motivo #6', desc: 'I nostri primi bagni al mare insieme, il sole caldo sulla pelle e le risate tra le onde.' },
            { icon: '🗣️', title: 'Motivo #7', desc: 'Le nostre chiamate interminabili in cui parliamo di tutto e il tempo vola via in un secondo.' },
            { icon: '🤍', title: 'Motivo #8', desc: 'I tuoi abbracci calorosi: il posto al mondo in cui mi sento più al sicuro e amato.' },
            { icon: '🎵', title: 'Motivo #9', desc: 'La nostra sintonia musicale e cantare la nostra canzone a squarciagola insieme in macchina.' },
            { icon: '⭐', title: 'Motivo #10', desc: 'La tua intelligenza, la tua simpatia e la tua forza di volontà che ammiro tantissimo.' },
            { icon: '💌', title: 'Motivo #11', desc: 'I tuoi messaggi dolci che conservo con cura nei preferiti e rileggo quando mi manchi.' },
            { icon: '🛌', title: 'Motivo #12', desc: 'La nostra prima notte passata svegli insieme fino alle 6 del mattino a ridere senza sosta.' },
            { icon: '🚗', title: 'Motivo #13', desc: 'Tutti i nostri sogni di viaggio e la voglia matta di esplorare il mondo mano nella mano.' },
            { icon: '🥟', title: 'Motivo #14', desc: 'Come mi ascolti e mi capisci senza mai giudicarmi, dandomi sempre fiducia e coraggio.' },
            { icon: '🌟', title: 'Motivo #15', desc: 'La ragazza straordinaria, gentile e meravigliosa che sei e che diventa ogni giorno più speciale.' },
            { icon: '♾️', title: 'Motivo #16', desc: 'Che siamo noi due, complici contro tutto il mondo, con un amore puro e infinito!' }
        ];

        reasons.forEach((r, idx) => {
            const card = document.createElement('div');
            card.className = 'reason-card';
            card.innerHTML = `
                <div class="reason-card-inner">
                    <div class="reason-card-front">
                        <span class="reason-num">#${idx + 1}</span>
                        <div class="reason-icon">${r.icon}</div>
                        <div class="reason-prompt">${r.title}</div>
                    </div>
                    <div class="reason-card-back">
                        <p>${r.desc}</p>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
                triggerMiniConfetti(card);
            });

            reasonsGrid.appendChild(card);
        });
    }

    // -------------------------------------------------------------
    // 6. Effetti Confetti & Celebrazione
    // -------------------------------------------------------------
    const launchConfettiBtn = document.getElementById('launch-confetti-btn');
    if (launchConfettiBtn) {
        launchConfettiBtn.addEventListener('click', () => {
            triggerFullConfettiExplosion();
        });
    }

    function triggerFullConfettiExplosion() {
        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
                colors: ['#ff1493', '#ffd700', '#ffffff']
            });
            fire(0.2, {
                spread: 60,
                colors: ['#ff69b4', '#9932cc', '#ff8c00']
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                colors: ['#ffd700', '#00ff88', '#ff3366'],
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    }

    function triggerMiniSparkle(element) {
        if (typeof confetti === 'function') {
            const rect = element.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 15,
                spread: 45,
                origin: { x, y },
                colors: ['#ffd700', '#ff69b4', '#ffffff'],
                scalar: 0.7,
                ticks: 60
            });
        }
    }

    function triggerMiniConfetti(card) {
        if (typeof confetti === 'function') {
            const rect = card.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 20,
                spread: 50,
                origin: { x, y },
                colors: ['#ff1493', '#ffd700', '#6e8efb'],
                scalar: 0.8,
                ticks: 70
            });
        }
    }

    // -------------------------------------------------------------
    // 7. Audio Soundtrack Player
    // -------------------------------------------------------------
    const audioBtn = document.getElementById('bday-audio-btn');
    const audioPlayer = document.getElementById('bday-music-player');
    const playIcon = document.getElementById('bday-play-icon');

    if (audioBtn && audioPlayer) {
        audioBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().then(() => {
                    if (playIcon) playIcon.innerText = '❚❚';
                }).catch(() => {
                    console.log('Audio playback prevented');
                });
            } else {
                audioPlayer.pause();
                if (playIcon) playIcon.innerText = '▶';
            }
        });

        audioPlayer.addEventListener('ended', () => {
            if (playIcon) playIcon.innerText = '▶';
        });
    }

    // -------------------------------------------------------------
    // 8. Navigazione e Ritorno alla Schermata del PIN
    // -------------------------------------------------------------
    function navigateToPinScreen(e) {
        if (e) e.preventDefault();
        sessionStorage.removeItem('site_authenticated');
        window.location.href = 'index.html';
    }

    const hudHomeBtn = document.getElementById('hud-home-btn');
    if (hudHomeBtn) {
        hudHomeBtn.addEventListener('click', navigateToPinScreen);
    }

    // All'apertura della pagina, se l'utente ha già fatto un click o dopo breve delay, spara coriandoli di benvenuto
    setTimeout(() => {
        triggerFullConfettiExplosion();
    }, 600);
});

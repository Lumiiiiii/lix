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

    // Password di sicurezza per la simulazione (5893)
    const SIM_PASSWORD = '5893';

    // Accesso anteprima SOLO se è stata validata la password 5893 in sessione
    let isTestMode = sessionStorage.getItem('bday_sim_auth') === SIM_PASSWORD;

    // Gestione Modal Password Simulazione in compleanno.html
    const simModal = document.getElementById('sim-pwd-modal');
    const simInput = document.getElementById('sim-pwd-input');
    const simError = document.getElementById('sim-pwd-error');
    const simConfirmBtn = document.getElementById('sim-pwd-confirm');
    const simCancelBtn = document.getElementById('sim-pwd-cancel');
    const simCloseBtn = document.getElementById('sim-pwd-close');
    const simBackdrop = document.getElementById('sim-pwd-backdrop');

    function openSimulationPasswordModal(onSuccess) {
        if (!simModal) {
            const entered = prompt('Inserisci la password per sbloccare la modalità anteprima:');
            if (entered === SIM_PASSWORD) {
                if (typeof onSuccess === 'function') onSuccess();
            } else if (entered !== null) {
                alert('Password errata! Accesso negato ❌');
            }
            return;
        }

        if (simError) simError.classList.add('hidden');
        if (simInput) {
            simInput.value = '';
            simModal.classList.remove('hidden');
            setTimeout(() => simInput.focus(), 100);
        }

        function closeSimModal() {
            if (simModal) simModal.classList.add('hidden');
            cleanupListeners();
        }

        function handleConfirm() {
            const val = simInput ? simInput.value.trim() : '';
            if (val === SIM_PASSWORD) {
                closeSimModal();
                if (typeof onSuccess === 'function') onSuccess();
            } else {
                if (simError) {
                    simError.classList.remove('hidden');
                    simError.innerText = 'Password errata! Riprova ❌';
                }
                if (simInput) {
                    simInput.select();
                }
            }
        }

        function handleKey(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeSimModal();
            }
        }

        function cleanupListeners() {
            if (simConfirmBtn) simConfirmBtn.removeEventListener('click', handleConfirm);
            if (simCancelBtn) simCancelBtn.removeEventListener('click', closeSimModal);
            if (simCloseBtn) simCloseBtn.removeEventListener('click', closeSimModal);
            if (simBackdrop) simBackdrop.removeEventListener('click', closeSimModal);
            document.removeEventListener('keydown', handleKey);
        }

        if (simConfirmBtn) simConfirmBtn.addEventListener('click', handleConfirm);
        if (simCancelBtn) simCancelBtn.addEventListener('click', closeSimModal);
        if (simCloseBtn) simCloseBtn.addEventListener('click', closeSimModal);
        if (simBackdrop) simBackdrop.addEventListener('click', closeSimModal);
        document.addEventListener('keydown', handleKey);
    }

    // Gestione click per attivare la modalità anteprima dal messaggio di blocco (richiede password 5893)
    const previewHint = document.getElementById('lock-preview-hint');
    if (previewHint) {
        previewHint.addEventListener('click', () => {
            openSimulationPasswordModal(() => {
                sessionStorage.setItem('bday_sim_auth', SIM_PASSWORD);
                sessionStorage.setItem('bday_test_mode', 'true');
                isTestMode = true;
                checkAccessAndAutodestruction();
                if (typeof triggerFullConfettiExplosion === 'function') {
                    triggerFullConfettiExplosion();
                }
            });
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
                sessionStorage.removeItem('bday_sim_auth');
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
    // 4. Torta Interattiva a 16 Candeline & Rilevamento Soffio Microfono
    // -------------------------------------------------------------
    const cakeCandlesRow = document.getElementById('cake-candles-row');
    const cakeStatusText = document.getElementById('cake-status-text');
    const micBlowBtn = document.getElementById('mic-blow-btn');
    const micBtnLabel = document.getElementById('mic-btn-label');
    const blowAllBtn = document.getElementById('blow-all-candles-btn');
    const relightBtn = document.getElementById('relight-candles-btn');
    const micIndicatorWrap = document.getElementById('mic-indicator-wrap');
    const micWaveBars = document.querySelectorAll('.mic-wave-bar');
    const cakeCelebrationBox = document.getElementById('cake-celebration-box');
    const cakeScrollWheelBtn = document.getElementById('cake-scroll-wheel-btn');

    let litCandlesCount = 16;

    // Generazione dinamica delle 16 candeline
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
            if (litCandlesCount <= 0) {
                litCandlesCount = 0;
                cakeStatusText.innerText = '🎉 Tutte le 16 candeline sono spente! ✨';
                if (cakeCelebrationBox) cakeCelebrationBox.classList.remove('hidden');
                if (micBlowBtn) micBlowBtn.classList.add('hidden');
                if (blowAllBtn) blowAllBtn.classList.add('hidden');
                if (relightBtn) relightBtn.classList.remove('hidden');
                stopMicListening();
                triggerFullConfettiExplosion();
            } else {
                cakeStatusText.innerText = `${litCandlesCount} candeline ancora accese 🔥`;
                if (cakeCelebrationBox) cakeCelebrationBox.classList.add('hidden');
                if (micBlowBtn) micBlowBtn.classList.remove('hidden');
                if (blowAllBtn) blowAllBtn.classList.remove('hidden');
                if (relightBtn) relightBtn.classList.add('hidden');
            }
        }
    }

    if (cakeScrollWheelBtn) {
        cakeScrollWheelBtn.addEventListener('click', () => {
            const wheelSection = document.getElementById('bday-wheel-section');
            if (wheelSection) {
                wheelSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Tasto "Spegni tutte le candeline" (Manuale)
    if (blowAllBtn) {
        blowAllBtn.addEventListener('click', () => {
            stopMicListening();
            for (let i = 1; i <= 16; i++) {
                const flame = document.getElementById(`flame-${i}`);
                if (flame) {
                    flame.classList.remove('trembling');
                    flame.classList.add('off');
                }
            }
            litCandlesCount = 0;
            updateCandlesStatus();
        });
    }

    // Tasto "Riaccendi le candeline"
    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            stopMicListening();
            for (let i = 1; i <= 16; i++) {
                const flame = document.getElementById(`flame-${i}`);
                if (flame) {
                    flame.classList.remove('trembling');
                    flame.classList.remove('off');
                }
            }
            litCandlesCount = 16;
            updateCandlesStatus();
            triggerFullConfettiExplosion();
        });
    }

    // -------------------------------------------------------------
    // GESTIONE MICROFONO (Web Audio API - Soffia sulle candeline)
    // -------------------------------------------------------------
    let micStream = null;
    let audioContext = null;
    let analyser = null;
    let micAnimationId = null;
    let isMicListening = false;
    let blowStreak = 0;

    async function startMicListening() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Il microfono non è supportato da questo browser. Puoi usare il tasto "Spegni tutte le candeline"!');
            return;
        }

        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const source = audioContext.createMediaStreamSource(micStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.35;
            source.connect(analyser);

            isMicListening = true;
            if (micBlowBtn) {
                micBlowBtn.classList.add('active');
                if (micBtnLabel) micBtnLabel.innerText = 'Ascolto attivo... Soffia! 🌬️';
            }
            if (micIndicatorWrap) {
                micIndicatorWrap.classList.remove('hidden');
            }

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function analyzeBlowFrame() {
                if (!isMicListening) return;

                analyser.getByteFrequencyData(dataArray);

                // Il soffio genera forte turbolenza sulle basse-medie frequenze (bin 1-8)
                let lowFreqSum = 0;
                const binLimit = Math.min(10, dataArray.length);
                for (let i = 1; i < binLimit; i++) {
                    lowFreqSum += dataArray[i];
                }
                const avgLow = lowFreqSum / (binLimit - 1);

                // Aggiornamento barre visualizzatore d'onda
                if (micWaveBars && micWaveBars.length > 0) {
                    micWaveBars.forEach((bar, idx) => {
                        const sample = dataArray[(idx * 2) + 1] || 0;
                        const factor = Math.min(1, (sample / 180));
                        const h = Math.max(6, Math.round(factor * 26));
                        bar.style.height = `${h}px`;
                    });
                }

                // Tremolio visivo realistico delle fiammelle
                const activeFlames = document.querySelectorAll('.candle-flame:not(.off)');
                if (avgLow > 32) {
                    activeFlames.forEach(f => f.classList.add('trembling'));
                } else {
                    activeFlames.forEach(f => f.classList.remove('trembling'));
                }

                // Soglia di soffio continuo: quando soffia deciso sul microfono
                if (avgLow > 48) {
                    blowStreak++;
                    // Dopo 3 frame di soffio continuo (~50ms) spegniamo un gruppo di candeline
                    if (blowStreak >= 3) {
                        extinguishCandlesByBreath();
                        blowStreak = 0;
                    }
                } else {
                    blowStreak = Math.max(0, blowStreak - 1);
                }

                micAnimationId = requestAnimationFrame(analyzeBlowFrame);
            }

            micAnimationId = requestAnimationFrame(analyzeBlowFrame);
        } catch (err) {
            console.error('Microphone error:', err);
            alert('Permesso microfono non concesso o non disponibile.');
            stopMicListening();
        }
    }

    function stopMicListening() {
        isMicListening = false;
        if (micAnimationId) {
            cancelAnimationFrame(micAnimationId);
            micAnimationId = null;
        }
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(() => { });
            audioContext = null;
        }
        analyser = null;

        if (micBlowBtn) {
            micBlowBtn.classList.remove('active');
            if (micBtnLabel) micBtnLabel.innerText = 'Soffia con il Microfono';
        }
        if (micIndicatorWrap) {
            micIndicatorWrap.classList.add('hidden');
        }
        document.querySelectorAll('.candle-flame.trembling').forEach(f => f.classList.remove('trembling'));
    }

    // Spegne 2-3 candeline per ogni colpo di soffio
    function extinguishCandlesByBreath() {
        const litFlames = Array.from(document.querySelectorAll('.candle-flame:not(.off)'));
        if (litFlames.length === 0) {
            stopMicListening();
            return;
        }

        const countToBlow = Math.min(litFlames.length, Math.floor(Math.random() * 2) + 2);
        for (let i = 0; i < countToBlow; i++) {
            const randIndex = Math.floor(Math.random() * litFlames.length);
            const flame = litFlames.splice(randIndex, 1)[0];
            if (flame) {
                flame.classList.remove('trembling');
                flame.classList.add('off');
                litCandlesCount--;
                const candleEl = flame.closest('.candle-item');
                if (candleEl) triggerMiniSparkle(candleEl);
            }
        }

        updateCandlesStatus();
    }

    if (micBlowBtn) {
        micBlowBtn.addEventListener('click', () => {
            if (isMicListening) {
                stopMicListening();
            } else {
                startMicListening();
            }
        });
    }

    // -------------------------------------------------------------
    // GESTIONE RUOTA DELLA FORTUNA DEI 16 ANNI 🎡
    // -------------------------------------------------------------
    const wheelCanvas = document.getElementById('wheel-canvas');
    const wheelRotator = document.getElementById('wheel-rotator');
    const wheelPointer = document.getElementById('wheel-pointer');
    const wheelSpinBtn = document.getElementById('wheel-spin-btn');
    const wheelCenterBtn = document.getElementById('wheel-center-btn');
    const wheelResultCard = document.getElementById('wheel-result-card');
    const wheelResultIcon = document.getElementById('wheel-result-icon');
    const wheelResultTitle = document.getElementById('wheel-result-title');
    const wheelResultDesc = document.getElementById('wheel-result-desc');
    const wheelClaimBtn = document.getElementById('wheel-claim-btn');

    const wheelPrizes = [
        {
            id: 'bacino_1',
            shortText: 'Spoiler 🎁',
            icon: '🎁',
            title: '🤫 SPOILER SUL REGALO!',
            color: '#e91e63',
            textColor: '#ffffff',
            desc: 'Non te lo dico qui, te lo dirò quando ci vediamo! 🤫'
        },
        {
            id: 'bacino_2',
            shortText: '2 Bacini',
            icon: '',
            title: ' 2 Bacini!',
            color: '#9c27b0',
            textColor: '#ffffff',
            desc: '2 bacini pronti da riscuotere subito sulle guance! 🥰'
        },
        {
            id: 'bacino_3',
            shortText: '3 Bacini',
            icon: '',
            title: ' 3 Bacini!',
            color: '#673ab7',
            textColor: '#ffffff',
            desc: '3 bacini teneri e affettuosi! 🥰'
        },
        {
            id: 'bacino_4',
            shortText: '4 Bacini',
            icon: '',
            title: ' 4 Bacini!',
            color: '#1e88e5',
            textColor: '#ffffff',
            desc: '4 bacini con lo schiocco e tanto affetto! 🥰'
        },
        {
            id: 'bacino_5',
            shortText: '5 Bacini',
            icon: '',
            title: ' 5 Bacini!',
            color: '#00897b',
            textColor: '#ffffff',
            desc: '5 bacini speciali tutti per la festeggiata! 🥰'
        },
        {
            id: 'bacino_6',
            shortText: '6 Bacini',
            icon: '',
            title: ' 6 Bacini!',
            color: '#43a047',
            textColor: '#ffffff',
            desc: '6 bacini rumorosi e coccolosi! 🥰'
        },
        {
            id: 'bacino_7',
            shortText: '7 Bacini',
            icon: '',
            title: ' 7 Bacini!',
            color: '#fb8c00',
            textColor: '#ffffff',
            desc: '7 bacini infiniti da dare uno dopo l\'altro! 🥰'
        },
        {
            id: 'pranzo_gelato',
            shortText: 'PRANZO-GELATO',
            icon: '🍨',
            title: ' PRANZO-GELATO 🎉',
            color: '#d50000',
            textColor: '#ffffff',
            desc: 'PRANZIAMO FUORI CON IL GELATO (PRIMA CHE CHIUDANO LE GELATERIE), PAGO IO. inoltre ti do taaaaanti bacini'
        }
    ];

    let currentWheelAngle = 0;
    let isWheelSpinning = false;
    let lastWinningPrize = null;

    // Pulisce localStorage da eventuali premi salvati in precedenza
    try { localStorage.removeItem('bday_claimed_prizes'); } catch (e) { }

    function drawWheel() {
        if (!wheelCanvas) return;
        const ctx = wheelCanvas.getContext('2d');
        const width = wheelCanvas.width;
        const height = wheelCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = centerX - 12;

        const numSlices = wheelPrizes.length;
        const arc = (2 * Math.PI) / numSlices;

        ctx.clearRect(0, 0, width, height);

        // Bordo esterno dorato con ombreggiatura
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();

        // Disegno degli 8 spicchi
        for (let i = 0; i < numSlices; i++) {
            const prize = wheelPrizes[i];
            const startAngle = i * arc;
            const endAngle = startAngle + arc;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();

            // Bordi dorati tra gli spicchi
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Gradiente radiale per dare profondità e brillantezza
            const grad = ctx.createRadialGradient(centerX, centerY, 35, centerX, centerY, radius);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.05)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
            ctx.fillStyle = grad;
            ctx.fill();

            // Testo e Icona lungo il raggio dello spicchio
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + arc / 2);

            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = prize.textColor;
            ctx.font = prize.id === 'pranzo_gelato' ? 'bold 13.5px "Outfit", "Inter", sans-serif' : 'bold 15px "Outfit", "Inter", sans-serif';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 6;
            ctx.fillText(prize.shortText, radius - 30, 0);

            // Icona verso l'esterno
            ctx.font = '18px sans-serif';
            ctx.fillText(prize.icon, radius - 6, 0);

            ctx.restore();
            ctx.restore();
        }

        // Cerchietti / Lampadine decorative sul perimetro dorato
        for (let j = 0; j < numSlices * 2; j++) {
            const dotAngle = (j * Math.PI) / numSlices;
            const dotX = centerX + (radius + 4) * Math.cos(dotAngle);
            const dotY = centerY + (radius + 4) * Math.sin(dotAngle);
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3.5, 0, 2 * Math.PI);
            ctx.fillStyle = j % 2 === 0 ? '#ffffff' : '#ffd700';
            ctx.fill();
        }
    }

    drawWheel();

    function spinTheWheel() {
        if (isWheelSpinning) return;
        isWheelSpinning = true;

        if (wheelResultCard) wheelResultCard.classList.add('hidden');
        if (wheelPointer) wheelPointer.classList.add('ticking');
        if (wheelSpinBtn) wheelSpinBtn.disabled = true;
        if (wheelCenterBtn) wheelCenterBtn.disabled = true;

        // Ruota truccata: seleziona SEMPRE 'PRANZO-GELATO'!
        const targetPrizeIndex = wheelPrizes.findIndex(p => p.id === 'pranzo_gelato');
        const winningIndex = targetPrizeIndex !== -1 ? targetPrizeIndex : 7;
        lastWinningPrize = wheelPrizes[winningIndex];

        // Calcolo rotazione: puntatore a 270° (in alto).
        // Centro dello spicchio i: i * 45° + 22.5°
        const sliceAngle = 45;
        const targetSliceCenter = (winningIndex * sliceAngle) + 22.5;

        // Piccolo jitter casuale (+/- 4 gradi) per dare effetto fisico realistico,
        // rimanendo SEMPRE perfettamente al centro dello spicchio PRANZO-GELATO (ampio 45°)
        const jitter = (Math.random() * 8) - 4;

        // Quanti giri completi (da 5 a 7 giri completi ad alta velocità)
        const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;

        // Angolo esatto per far fermare lo spicchio sotto la freccia a 270°
        const normalizedCurrent = currentWheelAngle % 360;
        const deltaToTarget = ((270 - targetSliceCenter - normalizedCurrent) % 360 + 360) % 360;
        const nextTargetAngle = currentWheelAngle + fullSpins + deltaToTarget + jitter;

        currentWheelAngle = nextTargetAngle;

        if (wheelRotator) {
            wheelRotator.style.transition = 'transform 4.8s cubic-bezier(0.12, 0.95, 0.22, 1)';
            wheelRotator.style.transform = `rotate(${currentWheelAngle}deg)`;
        }

        setTimeout(() => {
            onWheelSpinEnd(lastWinningPrize);
        }, 4900);
    }

    function onWheelSpinEnd(prize) {
        isWheelSpinning = false;
        if (wheelPointer) wheelPointer.classList.remove('ticking');

        // Ruota usata: disabilita per sempre i bottoni (si gira una sola volta!)
        if (wheelSpinBtn) {
            wheelSpinBtn.disabled = true;
            wheelSpinBtn.innerText = '🎡 Ruota già girata!';
        }
        if (wheelCenterBtn) {
            wheelCenterBtn.disabled = true;
        }

        triggerFullConfettiExplosion();

        if (wheelResultCard && prize) {
            if (wheelResultIcon) wheelResultIcon.innerText = prize.icon;
            if (wheelResultTitle) wheelResultTitle.innerText = prize.title;
            if (wheelResultDesc) wheelResultDesc.innerText = prize.desc;
            wheelResultCard.classList.remove('hidden');
            wheelResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    if (wheelSpinBtn) wheelSpinBtn.addEventListener('click', spinTheWheel);
    if (wheelCenterBtn) wheelCenterBtn.addEventListener('click', spinTheWheel);

    if (wheelClaimBtn) {
        wheelClaimBtn.addEventListener('click', () => {
            if (!lastWinningPrize) return;
            triggerMiniSparkle(wheelClaimBtn);
            wheelClaimBtn.innerText = '✅ Riscattato!';
            setTimeout(() => {
                wheelClaimBtn.innerText = '🤍 Riscatta Premio';
            }, 2500);
        });
    }

    // -------------------------------------------------------------
    // GESTIONE MEMORY DELLE FACCE BUFFE (16 CARTE X 16 ANNI) 🃏
    // -------------------------------------------------------------
    const memoryGrid = document.getElementById('memory-grid');
    const memoryPairsCount = document.getElementById('memory-pairs-count');
    const memoryMovesCount = document.getElementById('memory-moves-count');
    const memoryResetBtn = document.getElementById('memory-reset-btn');
    const memoryVictoryCard = document.getElementById('memory-victory-card');
    const victoryMovesFinal = document.getElementById('victory-moves-final');
    const memoryReplayBtn = document.getElementById('memory-replay-btn');

    const funnyPhotos = [
        'Faccia1.jpeg',
        'Faccia2.jpeg',
        'Faccia3.jpeg',
        'Faccia4.jpeg',
        'Faccia5.jpeg',
        'Faccia6.jpeg',
        'Faccia7.jpeg',
        'Faccia8.jpeg'
    ];

    let memoryCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let movesCount = 0;
    let isMemoryLocked = false;

    function initMemoryGame() {
        if (!memoryGrid) return;
        memoryGrid.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        movesCount = 0;
        isMemoryLocked = false;

        if (memoryPairsCount) memoryPairsCount.innerText = '0 / 8';
        if (memoryMovesCount) memoryMovesCount.innerText = '0';
        if (memoryVictoryCard) memoryVictoryCard.classList.add('hidden');

        // Crea 16 carte (8 foto duplicate)
        const deck = [];
        funnyPhotos.forEach((photo, idx) => {
            deck.push({ id: `photo-${idx}-a`, photoSrc: photo });
            deck.push({ id: `photo-${idx}-b`, photoSrc: photo });
        });

        // Fisher-Yates Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        memoryCards = deck;

        // Render carte
        deck.forEach(cardData => {
            const cardEl = document.createElement('div');
            cardEl.className = 'mem-card';
            cardEl.dataset.photo = cardData.photoSrc;
            cardEl.dataset.id = cardData.id;

            cardEl.innerHTML = `
                <div class="mem-card-inner">
                    <div class="mem-card-back-side">
                        <div class="mem-card-pattern">
                            <span class="mem-card-crown">16</span>
                            <span class="mem-card-heart">🤍</span>
                        </div>
                    </div>
                    <div class="mem-card-front-side">
                        <img src="${cardData.photoSrc}" alt="Faccia buffa" loading="lazy" />
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', () => handleCardClick(cardEl));
            memoryGrid.appendChild(cardEl);
        });
    }

    function handleCardClick(cardEl) {
        if (isMemoryLocked) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        cardEl.classList.add('flipped');
        flippedCards.push(cardEl);

        if (flippedCards.length === 2) {
            movesCount++;
            if (memoryMovesCount) memoryMovesCount.innerText = movesCount;

            const [card1, card2] = flippedCards;
            const photo1 = card1.dataset.photo;
            const photo2 = card2.dataset.photo;

            if (photo1 === photo2) {
                // Coppia trovata!
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                if (memoryPairsCount) memoryPairsCount.innerText = `${matchedPairs} / 8`;
                triggerMiniSparkle(card2);
                flippedCards = [];

                if (matchedPairs === 8) {
                    onMemoryVictory();
                }
            } else {
                // Non combaciano, rigirale dopo breve pausa
                isMemoryLocked = true;
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    isMemoryLocked = false;
                }, 900);
            }
        }
    }

    function onMemoryVictory() {
        triggerFullConfettiExplosion();
        if (victoryMovesFinal) victoryMovesFinal.innerText = movesCount;
        if (memoryVictoryCard) {
            memoryVictoryCard.classList.remove('hidden');
            memoryVictoryCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    if (memoryResetBtn) {
        memoryResetBtn.addEventListener('click', () => {
            initMemoryGame();
        });
    }

    if (memoryReplayBtn) {
        memoryReplayBtn.addEventListener('click', () => {
            initMemoryGame();
            const memorySection = document.getElementById('bday-memory-section');
            if (memorySection) {
                memorySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Inizializza il memory all'avvio
    initMemoryGame();

    // -------------------------------------------------------------
    // 5. Effetti Confetti & Celebrazione
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

    // -------------------------------------------------------------
    // 6. Audio Soundtrack Player
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
    // 7. Navigazione e Ritorno alla Schermata del PIN
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

    // -------------------------------------------------------------
    // SEZIONE: 16 MOTIVI PER CUI TI AMO 🌟
    // -------------------------------------------------------------
    const motiviGrid = document.getElementById('motivi-grid');

    const motiviList = [
        { num: 1,  emoji: '😍', testo: 'sei bellissima' },
        { num: 2,  emoji: '😂', testo: 'sei molto simpatica eheh' },
        { num: 3,  emoji: '😁', testo: 'il tuo sorriso' },
        { num: 4,  emoji: '🥰', testo: 'le tue palle!' },
        { num: 5,  emoji: '👀', testo: 'come mi guardi' },
        { num: 6,  emoji: '😜', testo: 'come scherzi con me' },
        { num: 7,  emoji: '🌟', testo: '...' },
        { num: 8,  emoji: '💫', testo: '...' },
        { num: 9,  emoji: '✨', testo: '...' },
        { num: 10, emoji: '🌙', testo: '...' },
        { num: 11, emoji: '🌸', testo: '...' },
        { num: 12, emoji: '🦋', testo: '...' },
        { num: 13, emoji: '🌈', testo: '...' },
        { num: 14, emoji: '🍀', testo: '...' },
        { num: 15, emoji: '💎', testo: '...' },
        { num: 16, emoji: '🤍', testo: '...e tanto altro ancora!' },
    ];

    function buildMotiviGrid() {
        if (!motiviGrid) return;
        motiviGrid.innerHTML = '';
        motiviList.forEach(motivo => {
            const card = document.createElement('div');
            card.className = 'motivo-card';
            card.setAttribute('data-flipped', 'false');
            card.innerHTML = `
                <div class="motivo-inner">
                    <div class="motivo-front">
                        <span class="motivo-num">${motivo.num}</span>
                        <span class="motivo-star">⭐</span>
                    </div>
                    <div class="motivo-back">
                        <span class="motivo-emoji">${motivo.emoji}</span>
                        <p class="motivo-testo">${motivo.testo}</p>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                const flipped = card.getAttribute('data-flipped') === 'true';
                if (!flipped) {
                    card.setAttribute('data-flipped', 'true');
                    card.classList.add('flipped');
                    triggerMiniSparkle(card);
                } else {
                    card.setAttribute('data-flipped', 'false');
                    card.classList.remove('flipped');
                }
            });
            motiviGrid.appendChild(card);
        });
    }

    buildMotiviGrid();

    // All'apertura della pagina, se l'utente ha già fatto un click o dopo breve delay, spara coriandoli di benvenuto
    setTimeout(() => {
        triggerFullConfettiExplosion();
    }, 600);
});

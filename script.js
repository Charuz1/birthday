/**
 * BIRTHDAY SURPRISE FOR WASTHU - SCRIPT
 * Features:
 * 1. Mobile-Optimized Photo Lightbox (Tap to view full uncropped photo)
 * 2. Smooth Journal Opening
 * 3. Interactive Letter Cards (Accordion/Unfold)
 * 4. Real-time Dual Clocks (Sri Lanka & Japan)
 * 5. Voice Message Player with Cassette Animation + Web Audio Fallback
 * 6. Instant Photo Replacement (persisted in LocalStorage)
 * 7. Inline Edit Mode & Collapsible Mobile Toolbar
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     0. SEALED ENVELOPE OPENING SEQUENCE & SAKURA HEARTS SHOWER
     =================================================================== */
  const envelopeIntro = document.getElementById('envelopeIntro');
  const paperEnvelope = document.getElementById('paperEnvelope');
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
  const replayEnvelopeBtn = document.getElementById('replayEnvelopeBtn');
  const mainNotebookCard = document.querySelector('.notebook-card');
  const sakuraHeartsLayer = document.getElementById('sakuraHeartsLayer');
  let isEnvelopeOpening = false;
  let sakuraIntervalId = null;

  const SAKURA_COLORS = ['#E5D1FA', '#F2E7FE', '#D4B6F5', '#EDE0FC'];
  const HEART_COLORS = ['#8B5FBF', '#A87FE0', '#6A3D9E', '#C3A2EE'];

  function createSakuraOrHeart() {
    if (!sakuraHeartsLayer) return;
    if (sakuraHeartsLayer.childElementCount > 18) return;

    const item = document.createElement('div');
    item.className = 'falling-petal';

    const isHeart = Math.random() < 0.36;
    const size = isHeart ? (11 + Math.random() * 6) : (13 + Math.random() * 8);
    const startLeft = Math.random() * 98;
    const fallDuration = 11 + Math.random() * 7; // Slow, gentle drift (11s - 18s)
    const flutterDuration = 3.5 + Math.random() * 3;
    const swayMid = (Math.random() - 0.5) * 70;
    const swayEnd = swayMid + (Math.random() - 0.5) * 60;
    const spinEnd = (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 180);
    const opacity = (0.48 + Math.random() * 0.28).toFixed(2);

    item.style.left = `${startLeft}vw`;
    item.style.width = `${size}px`;
    item.style.height = `${size}px`;
    item.style.setProperty('--fall-duration', `${fallDuration}s`);
    item.style.setProperty('--flutter-duration', `${flutterDuration}s`);
    item.style.setProperty('--sway-mid', `${swayMid}px`);
    item.style.setProperty('--sway-end', `${swayEnd}px`);
    item.style.setProperty('--spin-end', `${spinEnd}deg`);
    item.style.setProperty('--petal-opacity', opacity);

    if (isHeart) {
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      item.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else {
      const color = SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)];
      item.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 21.5c-4.2-2.8-7-7.2-7-11.5 0-3.2 2.1-5.8 4.6-6.6 1 .1 1.8.9 2.4 2.1.6-1.2 1.4-2 2.4-2.1 2.5.8 4.6 3.4 4.6 6.6 0 4.3-2.8 8.7-7 11.5z"/></svg>`;
    }

    item.addEventListener('animationend', () => item.remove());
    sakuraHeartsLayer.appendChild(item);
  }

  function startSakuraShower() {
    if (!sakuraHeartsLayer) return;
    stopSakuraShower();

    // Gentle initial release right as the envelope opens
    for (let i = 0; i < 6; i++) {
      setTimeout(createSakuraOrHeart, i * 240);
    }

    sakuraIntervalId = setInterval(createSakuraOrHeart, 950);
  }

  function stopSakuraShower() {
    if (sakuraIntervalId) {
      clearInterval(sakuraIntervalId);
      sakuraIntervalId = null;
    }
    if (sakuraHeartsLayer) {
      sakuraHeartsLayer.innerHTML = '';
    }
  }

  if (envelopeIntro && paperEnvelope) {
    document.body.classList.add('envelope-locked');

    function triggerEnvelopeOpen() {
      if (isEnvelopeOpening) return;
      isEnvelopeOpening = true;

      paperEnvelope.classList.add('is-opening');
      envelopeIntro.classList.add('is-opening-state');

      setTimeout(() => {
        envelopeIntro.classList.add('is-dismissed');
        document.body.classList.remove('envelope-locked');
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (mainNotebookCard) {
          mainNotebookCard.classList.remove('is-revealed');
          void mainNotebookCard.offsetWidth;
          mainNotebookCard.classList.add('is-revealed');
        }
        startSakuraShower();
      }, 1350);
    }

    paperEnvelope.addEventListener('click', triggerEnvelopeOpen);
    if (openEnvelopeBtn) {
      openEnvelopeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerEnvelopeOpen();
      });
    }

    paperEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnvelopeOpen();
      }
    });

    if (replayEnvelopeBtn) {
      replayEnvelopeBtn.addEventListener('click', () => {
        isEnvelopeOpening = false;
        stopSakuraShower();
        paperEnvelope.classList.remove('is-opening');
        envelopeIntro.classList.remove('is-opening-state', 'is-dismissed');
        document.body.classList.add('envelope-locked');
        if (mainNotebookCard) {
          mainNotebookCard.classList.remove('is-revealed');
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  } else {
    startSakuraShower();
  }

  /* ===================================================================
     1. LOCALSTORAGE RESTORATION (Text & Photos)
     =================================================================== */
  const STORAGE_KEY_TEXT = 'wasthu_birthday_texts_v2';
  const STORAGE_KEY_PHOTOS = 'wasthu_birthday_photos_v2';

  // Restore custom saved text
  try {
    const savedTexts = JSON.parse(localStorage.getItem(STORAGE_KEY_TEXT) || '{}');

    // Clear legacy subtitles if cached in localStorage from earlier version
    let cacheUpdated = false;
    if (savedTexts.letters_title && savedTexts.letters_title.includes('Mage Hithata')) {
      delete savedTexts.letters_title;
      cacheUpdated = true;
    }
    if (savedTexts.voice_title && savedTexts.voice_title.includes('Mage Handin')) {
      delete savedTexts.voice_title;
      cacheUpdated = true;
    }
    if (cacheUpdated) {
      localStorage.setItem(STORAGE_KEY_TEXT, JSON.stringify(savedTexts));
    }

    document.querySelectorAll('.editable[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (savedTexts[key]) {
        el.innerHTML = savedTexts[key];
      }
    });
  } catch (err) {
    console.warn('Could not read saved texts:', err);
  }

  // Restore custom photos
  try {
    const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
    Object.keys(savedPhotos).forEach(photoId => {
      const targetContainer = document.querySelector(`[data-photo-id="${photoId}"] img`);
      if (targetContainer && savedPhotos[photoId]) {
        targetContainer.src = savedPhotos[photoId];
      }
    });
  } catch (err) {
    console.warn('Could not read saved photos:', err);
  }


  /* ===================================================================
     2. PHOTO LIGHTBOX MODAL (TAP TO VIEW FULL UNRESOLVED ON MOBILE)
     =================================================================== */
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, caption) {
    if (!photoLightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }
    photoLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach tap event to all photos (polaroids and timeline slots)
  document.querySelectorAll('.photo-frame, .timeline-photo-slot').forEach(slot => {
    slot.addEventListener('click', (e) => {
      // If clicking directly on the file input, allow upload dialog
      if (e.target.classList.contains('photo-input') || e.target.closest('.photo-overlay-upload')) {
        return;
      }
      const img = slot.querySelector('img');
      if (img && img.src) {
        const caption = img.getAttribute('data-caption') || 
                        slot.closest('article, .timeline-card')?.querySelector('.polaroid-caption, .timeline-year-title')?.textContent || 
                        'Wasthu ❤️';
        openLightbox(img.src, caption);
      }
    });
  });


  /* ===================================================================
     3. OPENING SURPRISE SMOOTH SCROLL
     =================================================================== */
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', () => {
      const journalContent = document.getElementById('journalContent');
      if (journalContent) {
        journalContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }


  /* ===================================================================
     3B. INTERACTIVE 25TH BIRTHDAY CAKE (TAP TO BLOW CANDLE -> REVEAL 25)
     =================================================================== */
  const cakeStage = document.getElementById('cakeStage');
  const cakeTapHint = document.getElementById('cakeTapHint');

  if (cakeStage) {
    function toggleBirthdayCandle() {
      const nowBlown = cakeStage.classList.toggle('is-blown');

      if (nowBlown) {
        if (cakeTapHint) {
          cakeTapHint.textContent = 'Wish granted! Suba 25 weni upandinayak wewa mage pana 💜 (Tap again to relight)';
          cakeTapHint.classList.add('is-wish-granted');
        }
        // Gentle celebratory sakura & hearts burst
        for (let i = 0; i < 10; i++) {
          setTimeout(createSakuraOrHeart, i * 110);
        }
      } else {
        if (cakeTapHint) {
          cakeTapHint.textContent = '✨ Tap the cake to blow out the candle';
          cakeTapHint.classList.remove('is-wish-granted');
        }
      }
    }

    cakeStage.addEventListener('click', toggleBirthdayCandle);
    cakeStage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBirthdayCandle();
      }
    });
  }


  /* ===================================================================
     4. INTERACTIVE LETTERS (TAP ANYWHERE TO UNFOLD / READ)
     =================================================================== */
  const letterCards = document.querySelectorAll('.letter-card');
  letterCards.forEach((card) => {
    const hint = card.querySelector('.envelope-hint');
    const tab = card.querySelector('.envelope-tab');

    // Ensure both letters start folded so Wasthu can tap each one to open & read
    card.classList.remove('open');
    card.classList.add('folded');
    if (hint) hint.textContent = 'Tap to open & read';

    function openLetter() {
      card.classList.remove('folded');
      card.classList.add('open');
      if (hint) hint.textContent = 'Tap header to fold';
    }

    function foldLetter() {
      card.classList.remove('open');
      card.classList.add('folded');
      if (hint) hint.textContent = 'Tap to open & read';
    }

    // Tap anywhere on a folded letter card to unfold & read
    card.addEventListener('click', (e) => {
      if (card.classList.contains('folded')) {
        openLetter();
        return;
      }
      // When already open, tapping the envelope header tab folds it back
      if (tab && tab.contains(e.target)) {
        foldLetter();
      }
    });
  });


  /* ===================================================================
     5. REAL-TIME DUAL CLOCKS (COLOMBO & TOKYO)
     =================================================================== */
  const slTimeEl = document.getElementById('slTime');
  const slDateEl = document.getElementById('slDate');
  const jpTimeEl = document.getElementById('jpTime');
  const jpDateEl = document.getElementById('jpDate');

  function updateDualClocks() {
    const now = new Date();

    // Sri Lanka Time (Asia/Colombo)
    try {
      const slTimeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);

      const slDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now);

      if (slTimeEl) slTimeEl.textContent = slTimeStr;
      if (slDateEl) slDateEl.textContent = slDateStr;
    } catch (e) {
      if (slTimeEl) slTimeEl.textContent = now.toLocaleTimeString();
    }

    // Japan Time (Asia/Tokyo)
    try {
      const jpTimeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);

      const jpDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now);

      if (jpTimeEl) jpTimeEl.textContent = jpTimeStr;
      if (jpDateEl) jpDateEl.textContent = jpDateStr;
    } catch (e) {
      if (jpTimeEl) jpTimeEl.textContent = now.toLocaleTimeString();
    }
  }

  updateDualClocks();
  setInterval(updateDualClocks, 1000);


  /* ===================================================================
     6. CASSETTE AUDIO PLAYER (VOICE MESSAGE)
     =================================================================== */
  const realAudio = document.getElementById('realAudio');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const seekSlider = document.getElementById('seekSlider');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const volumeSlider = document.getElementById('volumeSlider');
  const spoolLeft = document.getElementById('spoolLeft');
  const spoolRight = document.getElementById('spoolRight');
  const waveform = document.getElementById('waveform');
  const audioFileInput = document.getElementById('audioFileInput');
  const audioLoadedMsg = document.getElementById('audioLoadedMsg');

  let isPlaying = false;
  let synthInterval = null;
  let simulatedTime = 0;
  const SIMULATED_MAX = 150;

  let realAudioAvailable = false;

  function syncAudioDuration() {
    if (totalDurationEl && realAudio && isFinite(realAudio.duration) && realAudio.duration > 0) {
      totalDurationEl.textContent = formatTime(realAudio.duration);
    }
  }

  if (realAudio && realAudio.readyState >= 1) {
    realAudioAvailable = true;
    syncAudioDuration();
  }

  realAudio.addEventListener('canplaythrough', () => {
    realAudioAvailable = true;
    syncAudioDuration();
    if (audioLoadedMsg) audioLoadedMsg.textContent = 'Voice file connected';
  });

  realAudio.addEventListener('loadedmetadata', () => {
    realAudioAvailable = true;
    syncAudioDuration();
  });

  realAudio.addEventListener('durationchange', syncAudioDuration);

  realAudio.addEventListener('error', () => {
    realAudioAvailable = false;
    if (audioLoadedMsg) audioLoadedMsg.textContent = 'Demo melody mode (Add voice file)';
  });

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  let audioCtx = null;
  const synthNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
  let noteIndex = 0;

  function playSoftNote() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = synthNotes[noteIndex % synthNotes.length];
      noteIndex++;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const masterVol = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08 * masterVol, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      // AudioContext unavailable
    }
  }

  function startPlaybackVisuals() {
    isPlaying = true;
    if (playIcon) playIcon.textContent = '⏸';
    if (spoolLeft) spoolLeft.classList.add('spinning');
    if (spoolRight) spoolRight.classList.add('spinning');
    if (waveform) waveform.classList.add('playing');
  }

  function stopPlaybackVisuals() {
    isPlaying = false;
    if (playIcon) playIcon.textContent = '▶';
    if (spoolLeft) spoolLeft.classList.remove('spinning');
    if (spoolRight) spoolRight.classList.remove('spinning');
    if (waveform) waveform.classList.remove('playing');
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        if (realAudio && !realAudio.paused) {
          realAudio.pause();
        }
        stopPlaybackVisuals();
      } else {
        if (realAudio && (realAudioAvailable || realAudio.currentSrc || realAudio.src)) {
          realAudio.play().then(() => {
            realAudioAvailable = true;
            startPlaybackVisuals();
          }).catch(() => {
            startSimulatedPlayback();
          });
        } else {
          startSimulatedPlayback();
        }
      }
    });
  }

  function startSimulatedPlayback() {
    startPlaybackVisuals();
    playSoftNote();
    synthInterval = setInterval(() => {
      simulatedTime += 1;
      if (simulatedTime > SIMULATED_MAX) {
        simulatedTime = 0;
        stopPlaybackVisuals();
        return;
      }
      playSoftNote();
      if (currentTimeEl) currentTimeEl.textContent = formatTime(simulatedTime);
      if (seekSlider) seekSlider.value = (simulatedTime / SIMULATED_MAX) * 100;
    }, 1000);
  }

  realAudio.addEventListener('timeupdate', () => {
    if (!realAudio.duration) return;
    const progress = (realAudio.currentTime / realAudio.duration) * 100;
    if (seekSlider) seekSlider.value = progress;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(realAudio.currentTime);
  });

  realAudio.addEventListener('loadedmetadata', () => {
    if (totalDurationEl && realAudio.duration) {
      totalDurationEl.textContent = formatTime(realAudio.duration);
    }
  });

  realAudio.addEventListener('ended', () => {
    stopPlaybackVisuals();
  });

  if (seekSlider) {
    seekSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (realAudioAvailable && realAudio.duration) {
        realAudio.currentTime = (val / 100) * realAudio.duration;
      } else {
        simulatedTime = (val / 100) * SIMULATED_MAX;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(simulatedTime);
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      realAudio.volume = parseFloat(e.target.value);
    });
  }

  if (audioFileInput) {
    audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        realAudio.src = objectUrl;
        realAudioAvailable = true;
        realAudio.load();
        if (audioLoadedMsg) {
          audioLoadedMsg.textContent = `✓ Loaded: ${file.name}`;
          audioLoadedMsg.style.color = '#72C481';
        }
        stopPlaybackVisuals();
      }
    });
  }


  /* ===================================================================
     7. PHOTO UPLOAD & PERSISTENCE (SCRAPBOOK & TIMELINE)
     =================================================================== */
  const photoInputs = document.querySelectorAll('.photo-input');
  photoInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const targetId = input.getAttribute('data-target');
      if (!file || !targetId) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const targetImg = document.querySelector(`[data-photo-id="${targetId}"] img`);
        if (targetImg) {
          targetImg.src = dataUrl;
        }

        try {
          const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY_PHOTOS) || '{}');
          savedPhotos[targetId] = dataUrl;
          localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(savedPhotos));
          showToast(`Photo for "${targetId}" updated and saved!`);
        } catch (err) {
          console.warn('LocalStorage limit:', err);
          showToast('Photo displayed on screen!');
        }
      };
      reader.readAsDataURL(file);
    });
  });


  /* ===================================================================
     8. INLINE EDIT MODE & COLLAPSIBLE MOBILE TOOLBAR
     =================================================================== */
  const toggleBarBtn = document.getElementById('toggleBarBtn');
  const personalizeBar = document.getElementById('personalizeBar');
  const hideBarBtn = document.getElementById('hideBarBtn');
  const toggleEditModeBtn = document.getElementById('toggleEditModeBtn');
  const editModeStatus = document.getElementById('editModeStatus');
  const saveChangesBtn = document.getElementById('saveChangesBtn');
  const resetChangesBtn = document.getElementById('resetChangesBtn');

  let editModeActive = false;

  if (toggleBarBtn && personalizeBar) {
    toggleBarBtn.addEventListener('click', () => {
      personalizeBar.classList.toggle('open');
    });
  }

  if (hideBarBtn && personalizeBar) {
    hideBarBtn.addEventListener('click', () => {
      personalizeBar.classList.remove('open');
    });
  }

  if (toggleEditModeBtn) {
    toggleEditModeBtn.addEventListener('click', () => {
      editModeActive = !editModeActive;
      document.querySelectorAll('.editable').forEach(el => {
        el.setAttribute('contenteditable', editModeActive ? 'true' : 'false');
      });

      if (editModeStatus) {
        editModeStatus.textContent = editModeActive ? 'ON' : 'OFF';
      }
      toggleEditModeBtn.style.background = editModeActive ? 'var(--rose-soft)' : '';

      if (editModeActive) {
        letterCards.forEach(card => {
          card.classList.remove('folded');
          card.classList.add('open');
          const hint = card.querySelector('.envelope-hint');
          if (hint) hint.textContent = 'Tap header to fold';
        });
        showToast('Edit Mode ON: Click any text directly to edit it!');
      } else {
        showToast('Edit Mode OFF');
      }
    });
  }

  if (saveChangesBtn) {
    saveChangesBtn.addEventListener('click', () => {
      const textData = {};
      document.querySelectorAll('.editable[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        textData[key] = el.innerHTML;
      });

      try {
        localStorage.setItem(STORAGE_KEY_TEXT, JSON.stringify(textData));
        showToast('✓ All your words saved to this browser!');
      } catch (e) {
        console.error(e);
        showToast('Could not save words.');
      }
    });
  }

  if (resetChangesBtn) {
    resetChangesBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all custom words and photos back to default?')) {
        localStorage.removeItem(STORAGE_KEY_TEXT);
        localStorage.removeItem(STORAGE_KEY_PHOTOS);
        location.reload();
      }
    });
  }


  /* ===================================================================
     9. TOAST NOTIFICATION
     =================================================================== */
  function showToast(message) {
    let toast = document.getElementById('journalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'journalToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = '#4A2B73';
      toast.style.color = '#FFF';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '30px';
      toast.style.fontSize = '0.88rem';
      toast.style.boxShadow = '0 6px 20px rgba(74, 43, 115, 0.28)';
      toast.style.zIndex = '9999';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3200);
  }


  /* ===================================================================
     10. SMOOTH SCROLL-REVEAL & ACTIVE NAVBAR PILL TRACKING
     =================================================================== */
  const revealTargets = document.querySelectorAll(
    '.section-header, .polaroid-card, .timeline-entry, .letter-card, .cassette-card, .connection-board'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // Highlight active chapter in floating navbar
  const chapterSections = document.querySelectorAll('.section-block[id]');
  const navTabs = document.querySelectorAll('.nav-tab[href^="#"]');

  if ('IntersectionObserver' in window && chapterSections.length && navTabs.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = `#${entry.target.id}`;
            navTabs.forEach((tab) => {
              tab.classList.toggle('active', tab.getAttribute('href') === activeId);
            });
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px' }
    );

    chapterSections.forEach((sec) => navObserver.observe(sec));
  }

});

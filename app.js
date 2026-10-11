/**
 * THE WEDDING OF RIFKI & AINUN - JAVASCRIPT APPLICATION
 * Features:
 * - Dynamic URL Guest Name Parser (?to=...)
 * - Background Audio with Floating Vinyl Player & Web Audio Fallback
 * - Live Countdown Timer to 5 November 2026
 * - Romantic Falling Flower Petals Canvas
 * - RSVP Form with LocalStorage Persistence & Real-time Message Board
 * - One-click Copy to Clipboard with Toast Notification
 * - Interactive Scroll Spy & Reveal Animations
 */

// =========================================================================
// GOOGLE SHEETS / APPS SCRIPT WEB APP ENDPOINT CONFIGURATION
// Tempel URL Web App dari Google Apps Script Anda di bawah ini:
// Contoh: 'https://script.google.com/macros/s/AKfycb.../exec'
// =========================================================================
const GOOGLE_SCRIPT_URL = '';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Guest Name Parser
  initGuestName();

  // 2. Petal Falling Animation
  initPetalAnimation();

  // 3. Audio Player & Cover Unlock
  initAudioAndCover();

  // 4. Live Countdown Timer
  initCountdownTimer();

  // 5. RSVP & Wishes System (Google Sheets + LocalStorage)
  initRsvpAndWishes();

  // 6. Copy Account Numbers with Toast
  initClipboardButtons();

  // 7. Scroll Spy & Scroll Reveal
  initScrollFeatures();
});

/* =========================================================================
   1. GUEST NAME PARSER (?to=Nama+Tamu atau ?nama=... atau ?guest=...)
   ========================================================================= */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('nama') || urlParams.get('u') || urlParams.get('guest');
  const guestNameElement = document.getElementById('guestName');
  const formNameInput = document.getElementById('formName');

  if (guestParam) {
    // Sanitize and decode name
    const cleanedName = decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
    if (guestNameElement && cleanedName) {
      guestNameElement.textContent = cleanedName;
    }
    if (formNameInput && cleanedName && cleanedName.toLowerCase() !== 'tamu undangan') {
      formNameInput.value = cleanedName;
    }
  }
}

/* =========================================================================
   2. FALLING FLOWER PETALS (CANVAS)
   ========================================================================= */
function initPetalAnimation() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Load custom flower image provided by user
  const flowerImg = new Image();
  let isImageLoaded = false;
  flowerImg.onload = () => {
    isImageLoaded = true;
  };
  flowerImg.onerror = () => {
    if (!flowerImg.src.includes('asset 1')) {
      flowerImg.src = 'asset 1/flower_petal.png';
    }
  };
  flowerImg.src = 'flower_petal.png';

  const petals = [];
  const TOTAL_PETALS = 24;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      // Size: 13px to 22px width
      this.width = Math.random() * 9 + 13;
      this.height = this.width * (96 / 83); // preserve aspect ratio of cropped flower
      this.speedY = Math.random() * 0.9 + 0.6;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.opacity = Math.random() * 0.35 + 0.65;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 35 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (isImageLoaded) {
        ctx.drawImage(flowerImg, -this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241, 247, 222, 0.7)';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const petal of petals) {
      petal.update();
      petal.draw();
    }
    requestAnimationFrame(render);
  }

  render();
}

/* =========================================================================
   3. AUDIO PLAYER & OPEN INVITATION
   ========================================================================= */
function initAudioAndCover() {
  const coverSection = document.getElementById('cover');
  const openBtn = document.getElementById('openInvitationBtn');
  const audioToggle = document.getElementById('audioToggle');
  const vinylDisc = document.getElementById('vinylDisc');
  const audioIcon = document.getElementById('audioIcon');
  const bgm = document.getElementById('bgm');
  const bottomNav = document.getElementById('bottomNav');

  let isPlaying = false;
  let synthAudioActive = false;

  // Auto-unlock if query param present (preview / test)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('unlocked') === '1' && coverSection) {
    coverSection.classList.add('unlocked');
    coverSection.style.display = 'none';
    if (bottomNav) bottomNav.classList.add('active');

    const scrollToId = urlParams.get('scrollto');
    if (scrollToId) {
      const targetEl = document.getElementById(scrollToId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }
  }

  // Open Invitation Handler
  if (openBtn && coverSection) {
    openBtn.addEventListener('click', () => {
      coverSection.classList.add('unlocked');
      if (bottomNav) {
        bottomNav.classList.add('active');
      }

      // Smooth scroll to top of hero
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }

      // Play audio
      startMusic();
    });
  }

  // Audio Toggle Button
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        startMusic();
      }
    });
  }

  function startMusic() {
    if (!bgm) return;
    const playPromise = bgm.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updateAudioUI(true);
        })
        .catch(err => {
          console.warn('Audio element play failed, falling back to Web Audio Piano melody:', err);
          startWebAudioPiano();
          isPlaying = true;
          updateAudioUI(true);
        });
    }
  }

  function pauseMusic() {
    if (bgm && !bgm.paused) {
      bgm.pause();
    }
    if (synthAudioActive) {
      stopWebAudioPiano();
    }
    isPlaying = false;
    updateAudioUI(false);
  }

  function updateAudioUI(playing) {
    if (vinylDisc) {
      if (playing) {
        vinylDisc.classList.add('playing');
        audioIcon.className = 'fa-solid fa-music';
      } else {
        vinylDisc.classList.remove('playing');
        audioIcon.className = 'fa-solid fa-play';
      }
    }
  }

  // Romantic Web Audio Piano Synthesizer Fallback (Canon in D Arpeggio)
  let audioCtx = null;
  let synthInterval = null;

  function startWebAudioPiano() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
      synthAudioActive = true;

      // Canon in D chord progression notes (Hz)
      const canonNotes = [
        [293.66, 369.99, 440.0, 587.33], // D maj
        [220.0, 277.18, 329.63, 440.0],  // A maj
        [246.94, 293.66, 369.99, 493.88], // B min
        [185.0, 220.0, 277.18, 369.99],  // F# min
        [196.0, 246.94, 293.66, 392.0],  // G maj
        [146.83, 220.0, 293.66, 440.0],  // D maj
        [196.0, 246.94, 293.66, 392.0],  // G maj
        [220.0, 277.18, 329.63, 440.0]   // A maj
      ];

      let chordIdx = 0;
      let noteInChord = 0;

      synthInterval = setInterval(() => {
        if (!synthAudioActive || !audioCtx) return;
        const currentChord = canonNotes[chordIdx];
        const freq = currentChord[noteInChord];

        playTone(freq, 0.8);

        noteInChord++;
        if (noteInChord >= currentChord.length) {
          noteInChord = 0;
          chordIdx = (chordIdx + 1) % canonNotes.length;
        }
      }, 350);

    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  function playTone(frequency, duration) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // Warm, soft piano-like tone
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function stopWebAudioPiano() {
    synthAudioActive = false;
    if (synthInterval) clearInterval(synthInterval);
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
      audioCtx = null;
    }
  }
}

/* =========================================================================
   4. COUNTDOWN TIMER (5 November 2026 08:00 WIB)
   ========================================================================= */
function initCountdownTimer() {
  // 5 November 2026 08:00:00 WIB (UTC+7)
  const targetDate = new Date('2026-11-05T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* =========================================================================
   5. RSVP & WISHES SYSTEM (GOOGLE SHEETS + LOCALSTORAGE)
   ========================================================================= */
function initRsvpAndWishes() {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');
  const wishesCount = document.getElementById('wishesCount');
  const btnSubmit = document.getElementById('btnSubmitRsvp');

  const STORAGE_KEY = 'wedding_wishes_rifki_ainun';

  // Seed initial heartfelt wishes matching master reference
  const defaultWishes = [
    {
      name: 'Fitri',
      status: 'Hadir',
      message: 'Lancar terus yaa..',
      time: '1 jam yang lalu'
    },
    {
      name: 'Affa',
      status: 'Tidak Hadir',
      message: 'Lancar yaa',
      time: '3 jam yang lalu'
    },
    {
      name: 'Daffa & Tim Engineer',
      status: 'Hadir',
      message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat menempuh hidup baru Rifki & Ainun! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      time: '5 jam yang lalu'
    },
    {
      name: 'Annisa Rahma & Keluarga',
      status: 'Hadir',
      message: 'Masya Allah terharu banget melihat perjalanan cinta kalian dari masa kuliah ITB sampai sekarang pelaminan. Selamat yaa Unun dan Rifki! Bahagia selamanya.',
      time: '1 hari yang lalu'
    }
  ];

  function getWishes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultWishes;
    }
  }

  function renderWishes(customData) {
    if (!wishesList) return;
    const wishes = customData || getWishes();
    if (wishesCount) wishesCount.textContent = wishes.length;

    wishesList.innerHTML = wishes
      .map(wish => {
        return `
          <div class="wish-item">
            <div class="wish-author-line">${escapeHTML(wish.name)} - ${escapeHTML(wish.status)}</div>
            <p class="wish-text">${escapeHTML(wish.message)}</p>
          </div>
        `;
      })
      .join('');
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 1. Ambil data ucapan live dari Google Sheets jika URL sudah dikonfigurasi
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim().startsWith('http')) {
    fetch(GOOGLE_SCRIPT_URL)
      .then(res => res.json())
      .then(result => {
        if (result && result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
          renderWishes(result.data);
        }
      })
      .catch(err => {
        console.warn('Google Sheets live fetch notice:', err);
      });
  }

  // 2. Submit form RSVP ke Google Sheets & LocalStorage
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const messageInput = document.getElementById('formMessage');
      const attendanceRadio = document.querySelector('input[name="attendance"]:checked');

      if (!nameInput.value.trim() || !messageInput.value.trim()) return;

      const newWish = {
        name: nameInput.value.trim(),
        status: attendanceRadio ? attendanceRadio.value : 'Hadir',
        message: messageInput.value.trim(),
        time: 'Baru saja'
      };

      // Optimistic instant UI update
      const currentWishes = getWishes();
      currentWishes.unshift(newWish);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWishes));
      renderWishes(currentWishes);

      const submittedMsg = messageInput.value;
      messageInput.value = '';

      // Tampilkan indikator loading jika terhubung ke Google Sheets
      const originalBtnHTML = btnSubmit ? btnSubmit.innerHTML : '';
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
      }

      showToast('Doa & Konfirmasi Anda berhasil terkirim. Terima kasih!');

      // Kirim data ke Google Sheets Web App jika URL aktif
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim().startsWith('http')) {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newWish.name,
            attendance: newWish.status,
            message: newWish.message
          })
        })
          .then(() => {
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML = originalBtnHTML;
            }
          })
          .catch(err => {
            console.warn('Google Sheets submit notice:', err);
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML = originalBtnHTML;
            }
          });
      } else {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  renderWishes();
}

/* =========================================================================
   6. COPY ACCOUNT NUMBER WITH TOAST
   ========================================================================= */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy-account, .btn-slot-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-account');
      const bankName = btn.getAttribute('data-bank') || 'Informasi';

      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`${bankName} berhasil disalin ke clipboard!`);
        });
      } else {
        // Fallback for older browsers / insecure origins
        const tempInput = document.createElement('textarea');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`${bankName} berhasil disalin ke clipboard!`);
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* =========================================================================
   7. SCROLL SPY & REVEAL ANIMATIONS
   ========================================================================= */
function initScrollFeatures() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .pop-out-scroll');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedElements.forEach(el => observer.observe(el));

  // Bottom Nav Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-target') === currentSection) {
        item.classList.add('active');
      }
    });
  });

  // Scroll indicator click
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const quote = document.getElementById('quote');
      if (quote) {
        quote.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

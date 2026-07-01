/* ─────────────────────────────────────────────────────────────────
   main.js — Campus Goes To School · SMAN 6 Depok
──────────────────────────────────────────────────────────────── */

'use strict';

// ══════════════════════════════════════ THEME (DARK MODE) ══
const ThemeModule = (() => {
  const root          = document.documentElement;
  const toggleDesktop = document.getElementById('themeToggle');
  const toggleMobile  = document.getElementById('themeToggleMobile');
  const mobileState   = document.getElementById('themeToggleMobileState');
  const STORAGE_KEY   = 'hexa-theme';

  function getTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyLabel() {
    if (mobileState) {
      mobileState.textContent = getTheme() === 'dark' ? 'Gelap' : 'Terang';
    }
    const isDark = getTheme() === 'dark';
    toggleDesktop?.setAttribute('aria-label', isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
    toggleMobile?.setAttribute('aria-label', isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    applyLabel();
  }

  function toggle() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  toggleDesktop?.addEventListener('click', toggle);
  toggleMobile?.addEventListener('click', toggle);

  applyLabel();
})();


// ══════════════════════════════════════ SLIDER ══
const SliderModule = (() => {
  const slides     = document.querySelectorAll('.slide');
  const dots       = document.querySelectorAll('.slider__dot');
  const prevBtn    = document.getElementById('sliderPrev');
  const nextBtn    = document.getElementById('sliderNext');

  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const DELAY  = 5000; // auto-play interval (ms)

  function goTo(index) {
    // Remove active from current
    slides[current].classList.remove('slide--active');
    dots[current].classList.remove('slider__dot--active');

    // Clamp index
    current = (index + slides.length) % slides.length;

    // Activate new
    slides[current].classList.add('slide--active');
    dots[current].classList.add('slider__dot--active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, DELAY);
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Arrow buttons
  nextBtn?.addEventListener('click', () => { next(); startAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); startAuto(); });

  // Dot buttons
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  // Touch / swipe support
  let touchStartX = 0;
  const sliderEl = document.getElementById('slider');

  sliderEl?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  sliderEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  // Pause on hover
  sliderEl?.addEventListener('mouseenter', stopAuto);
  sliderEl?.addEventListener('mouseleave', startAuto);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  startAuto();
})();


// ══════════════════════════════════════ HEADER ══
const HeaderModule = (() => {
  const header = document.getElementById('header');
  if (!header) return;

  // Scroll shadow
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.header__nav-link');

  const observerOpts = {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href')?.slice(1);
          link.classList.toggle('active', href === entry.target.id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));
})();


// ══════════════════════════════════════ HAMBURGER / MOBILE DRAWER ══
const DrawerModule = (() => {
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer    = document.getElementById('mobileDrawer');
  const backdrop  = document.getElementById('drawerBackdrop');

  if (!hamburger || !drawer) return;

  function open() {
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggle() {
    drawer.classList.contains('open') ? close() : open();
  }

  hamburger.addEventListener('click', toggle);
  backdrop?.addEventListener('click', close);

  // Close when a drawer link is clicked
  document.querySelectorAll('[data-close-drawer]').forEach(el => {
    el.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Close when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) close();
  });
})();


// ══════════════════════════════════════ SCROLL REVEAL ══
const RevealModule = (() => {
  // Add reveal class to target elements
  const targets = [
    '.stat-card',
    '.uni-card',
    '.about__text',
    '.about__stats',
    '.cta-strip__inner',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ══════════════════════════════════════ SMOOTH ANCHOR SCROLL ══
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href')?.slice(1);
    const target   = targetId ? document.getElementById(targetId) : null;
    if (!target) return;

    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      10
    ) || 72;

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerH - 12,
      behavior: 'smooth'
    });
  });
});


// ══════════════════════════════════════ COUNTDOWN UTBK ══
const CountdownModule = (() => {
  // Target: UTBK 2026 — 12 Juli 2026, 07:00 WIB
  const TARGET = new Date('2026-07-12T07:00:00+07:00');

  const elDays  = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMins  = document.getElementById('cdMins');
  const elSecs  = document.getElementById('cdSecs');

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }

    elDays.textContent  = pad(Math.floor(diff / 86400000));
    elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    elMins.textContent  = pad(Math.floor((diff % 3600000)  / 60000));
    elSecs.textContent  = pad(Math.floor((diff % 60000)    / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();


// ══════════════════════════════════════ POMODORO ══
const PomodoroModule = (() => {
  const MODES = {
    focus: { label: 'Fokus 25m',      secs: 25 * 60, isBreak: false },
    short: { label: 'Istirahat 5m',   secs:  5 * 60, isBreak: true  },
    long:  { label: 'Istirahat 15m',  secs: 15 * 60, isBreak: true  },
  };

  const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 → ~326.7

  const pomTime    = document.getElementById('pomTime');
  const pomSession = document.getElementById('pomSession');
  const pomRing    = document.getElementById('pomRing');
  const pomToggle  = document.getElementById('pomToggle');
  const pomReset   = document.getElementById('pomReset');
  const pomSkip    = document.getElementById('pomSkip');
  const pomIcon    = document.getElementById('pomIcon');
  const modeTabs   = document.querySelectorAll('.pomodoro__tab');
  const pomCard    = document.querySelector('.pomodoro');

  if (!pomTime) return;

  let currentMode = 'focus';
  let totalSecs   = MODES.focus.secs;
  let remaining   = totalSecs;
  let running     = false;
  let ticker      = null;
  let sessionCount = 1;

  const playIcon  = `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`;
  const pauseIcon = `<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>`;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  function updateRing() {
    const progress  = remaining / totalSecs;
    const offset    = CIRCUMFERENCE * (1 - progress);
    pomRing.style.strokeDashoffset = offset;
  }

  function updateDisplay() {
    pomTime.textContent = formatTime(remaining);
    updateRing();
  }

  function setMode(mode) {
    stop();
    currentMode = mode;
    totalSecs   = MODES[mode].secs;
    remaining   = totalSecs;
    pomCard.classList.toggle('pomodoro--break', MODES[mode].isBreak);
    modeTabs.forEach(t => t.classList.toggle('pomodoro__tab--active', t.dataset.mode === mode));
    updateDisplay();
  }

  function start() {
    running = true;
    pomIcon.innerHTML = pauseIcon;
    ticker = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        stop();
        notify();
        // Auto-advance: focus → short break, and back
        if (currentMode === 'focus') {
          sessionCount++;
          pomSession.textContent = `Sesi ke-${sessionCount}`;
          setMode(sessionCount % 4 === 0 ? 'long' : 'short');
        } else {
          setMode('focus');
        }
      }
    }, 1000);
  }

  function stop() {
    running = false;
    pomIcon.innerHTML = playIcon;
    clearInterval(ticker);
    ticker = null;
  }

  function toggle() { running ? stop() : start(); }

  function reset() {
    stop();
    remaining = totalSecs;
    updateDisplay();
  }

  function skipToNext() {
    stop();
    if (currentMode === 'focus') {
      sessionCount++;
      pomSession.textContent = `Sesi ke-${sessionCount}`;
      setMode('short');
    } else {
      setMode('focus');
    }
  }

  function notify() {
    const msg = MODES[currentMode].isBreak ? 'Istirahat selesai! Waktunya fokus lagi.' : 'Sesi fokus selesai! Istirahat dulu.';
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', { body: msg });
    }
    // Simple audio beep via Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    } catch(e) {}
  }

  pomToggle?.addEventListener('click', toggle);
  pomReset?.addEventListener('click', reset);
  pomSkip?.addEventListener('click', skipToNext);
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Request notification permission on first interaction
  pomToggle?.addEventListener('click', () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, { once: true });

  updateDisplay();
})();


// ══════════════════════════════════════ KALKULATOR SKOR UTBK ══
const CalcModule = (() => {
  const btnCalc  = document.getElementById('calcBtn');
  const selPTN   = document.getElementById('calcPTN');
  const inpTPS   = document.getElementById('calcTPS');
  const inpLit   = document.getElementById('calcLit');
  const result   = document.getElementById('calcResult');
  const lblLabel = document.getElementById('calcLabel');
  const lblGap   = document.getElementById('calcGap');
  const fill     = document.getElementById('calcFill');
  const pct      = document.getElementById('calcPct');
  const msg      = document.getElementById('calcMsg');

  if (!btnCalc) return;

  const messages = [
    { min: 0,  max: 50,  text: 'Masih jauh dari target. Konsisten latihan tryout setiap hari dan fokus pada materi TPS yang lemah.' },
    { min: 50, max: 70,  text: 'Progres bagus! Kamu sudah separuh jalan. Intensifkan tryout dan pelajari soal-soal tahun sebelumnya.' },
    { min: 70, max: 85,  text: 'Hampir sampai! Pertahankan pola belajar dan jangan kendor di bulan terakhir sebelum UTBK.' },
    { min: 85, max: 95,  text: 'Sangat dekat dengan target! Fokus pada akurasi dan manajemen waktu saat ujian.' },
    { min: 95, max: 101, text: 'Kamu sudah di zona aman! Tetap jaga kondisi, istirahat cukup, dan percaya diri.' },
  ];

  function getMsg(percentage) {
    return messages.find(m => percentage >= m.min && percentage < m.max)?.text || '';
  }

  btnCalc.addEventListener('click', () => {
    const target  = parseFloat(selPTN.value);
    const tps     = parseFloat(inpTPS.value);
    const lit     = parseFloat(inpLit.value);

    if (!target || isNaN(tps) || isNaN(lit)) {
      selPTN.style.borderColor  = !target  ? 'var(--color-primary)' : '';
      inpTPS.style.borderColor  = isNaN(tps) ? 'var(--color-primary)' : '';
      inpLit.style.borderColor  = isNaN(lit) ? 'var(--color-primary)' : '';
      return;
    }

    [selPTN, inpTPS, inpLit].forEach(el => el.style.borderColor = '');

    const avg       = (tps + lit) / 2;
    const ratio     = Math.min(avg / target, 1);
    const pctVal    = Math.round(ratio * 100);
    const gap       = Math.round(target - avg);

    lblLabel.textContent = `Rata-rata tryoutmu: ${avg.toFixed(0)} / Target: ${target}`;
    lblGap.innerHTML = gap > 0
      ? `Kurang ${gap} poin`
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:-2px;margin-right:4px"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Sudah melampaui target!';
    lblGap.style.color   = gap > 0 ? 'var(--color-text-muted)' : '#059669';

    // Animate fill
    requestAnimationFrame(() => {
      fill.style.width = `${pctVal}%`;
      fill.style.background = gap <= 0
        ? 'linear-gradient(90deg, #10b981, #34d399)'
        : 'linear-gradient(90deg, var(--color-primary), #ff8c00)';
    });

    pct.textContent = `${pctVal}%`;
    pct.style.color = gap <= 0 ? '#059669' : 'var(--color-primary)';
    msg.textContent = getMsg(pctVal);

    result.style.display = 'flex';
    result.style.flexDirection = 'column';
  });
})();

// ══════════════════════════════════════ CONTACT FORM — WHATSAPP ══
const ContactModule = (() => {
  const nameInput  = document.getElementById('contactName');
  const classInput = document.getElementById('contactClass');
  const msgInput   = document.getElementById('contactMsg');
  const sendBtn    = document.getElementById('contactSendBtn');
  const charCount  = document.getElementById('charCount');

  if (!sendBtn) return;

  // Nomor WA Guru BK (ganti dengan nomor asli, tanpa tanda + dan spasi)
  const WA_NUMBER = '6282112345678';

  // Live char counter
  msgInput?.addEventListener('input', () => {
    const len = msgInput.value.length;
    if (charCount) charCount.textContent = len;
    charCount?.closest('.contact__field')
      ?.querySelector('.contact__char-count')
      ?.classList.toggle('contact__char-count--warn', len > 450);
  });

  // Highlight empty field with shake
  function shake(el) {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = 'contactShake 0.35s ease';
    });
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  function setError(input, hasError) {
    input.style.borderColor = hasError ? 'var(--color-primary)' : '';
    input.style.boxShadow   = hasError ? '0 0 0 3px rgba(232,93,4,0.12)' : '';
    if (hasError) shake(input);
  }

  sendBtn.addEventListener('click', () => {
    const name    = nameInput?.value.trim()  || '';
    const kelas   = classInput?.value        || '';
    const pesan   = msgInput?.value.trim()   || '';

    let valid = true;
    setError(nameInput,  !name);  if (!name)  valid = false;
    setError(classInput, !kelas); if (!kelas) valid = false;
    setError(msgInput,   !pesan); if (!pesan) valid = false;

    if (!valid) return;

    // Reset border
    [nameInput, classInput, msgInput].forEach(el => setError(el, false));

    // Build WA message
    const text = encodeURIComponent(
      `Halo Pak/Bu Guru BK SMAN 6 Depok 👋\n\n` +
      `Nama  : ${name}\n` +
      `Kelas : ${kelas}\n\n` +
      `Pertanyaan:\n${pesan}\n\n` +
      `— Terima kasih 🙏`
    );

    // Open WhatsApp
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');

    // Show success toast
    const existing = document.querySelector('.contact__toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'contact__toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      WhatsApp terbuka! Periksa pesanmu dan kirim ke Guru BK.
    `;
    sendBtn.insertAdjacentElement('afterend', toast);

    // Auto-clear fields
    nameInput.value  = '';
    classInput.value = '';
    msgInput.value   = '';
    if (charCount) charCount.textContent = '0';

    // Remove toast after 6s
    setTimeout(() => toast.remove(), 6000);
  });
})();

// ══════════════════════════════════════ ROADMAP FILTER ══
(() => {
  const filterBtns = document.querySelectorAll('.roadmap__filter-btn');
  const rows = document.querySelectorAll('.roadmap__row');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('roadmap__filter-btn--active'));
      btn.classList.add('roadmap__filter-btn--active');

      const filter = btn.dataset.filter;

      rows.forEach(row => {
        if (filter === 'all' || row.dataset.jalur === filter) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
    });
  });
})();

// ══════════════════════════════════════ GALLERY LIGHTBOX ══
const LightboxModule = (() => {
  const lightbox   = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lightboxBackdrop');
  const img        = document.getElementById('lightboxImg');
  const loader     = document.getElementById('lightboxLoader');
  const caption    = document.getElementById('lightboxCaption');
  const counter    = document.getElementById('lightboxCounter');
  const btnClose   = document.getElementById('lightboxClose');
  const btnPrev    = document.getElementById('lightboxPrev');
  const btnNext    = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Kumpulkan semua item gallery yang bisa diklik
  const items = Array.from(document.querySelectorAll('[data-lightbox]'));
  let current = 0;

  // ── Open / close ──────────────────────────────────────────
  function open(index) {
    current = index;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    loadImage(current);
    updateNav();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Reset image state untuk animasi masuk berikutnya
    setTimeout(() => {
      img.classList.remove('loaded');
      img.src = '';
    }, 300);
  }

  // ── Load gambar ──────────────────────────────────────────
  function loadImage(index) {
    const item = items[index];
    if (!item) return;

    const src     = item.dataset.src || '';
    const cap     = item.dataset.caption || '';

    // Reset state
    img.classList.remove('loaded');
    loader.classList.remove('hidden');
    caption.textContent = cap;
    counter.textContent = `${index + 1} / ${items.length}`;

    // Load gambar
    const tmp = new Image();
    tmp.onload = () => {
      img.src = src;
      img.alt = cap;
      loader.classList.add('hidden');
      // Beri sedikit delay supaya transition terasa
      requestAnimationFrame(() => {
        requestAnimationFrame(() => img.classList.add('loaded'));
      });
    };
    tmp.onerror = () => {
      loader.classList.add('hidden');
      img.src = src; // tetap tampilkan (fallback browser)
      img.classList.add('loaded');
    };
    tmp.src = src;
  }

  // ── Navigasi ─────────────────────────────────────────────
  function prev() {
    if (current > 0) {
      current--;
      img.classList.remove('loaded');
      setTimeout(() => loadImage(current), 150);
      updateNav();
    }
  }

  function next() {
    if (current < items.length - 1) {
      current++;
      img.classList.remove('loaded');
      setTimeout(() => loadImage(current), 150);
      updateNav();
    }
  }

  function updateNav() {
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === items.length - 1;
  }

  // ── Event listeners ───────────────────────────────────────
  // Klik tiap item gallery
  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  // Keyboard: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe touch support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });
})();
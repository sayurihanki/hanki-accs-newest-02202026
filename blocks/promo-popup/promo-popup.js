/**
 * Promo Popup Spinner Wheel Block
 * Premium glassmorphic pop-up with configurable themes, entry triggers, and spinner wheel.
 *
 * Content Model:
 *   Config rows: key | value (2 cells)
 *   Promo rows: Label | Description/Code | CTA URL (3 cells)
 */

const STORAGE_PREFIX = 'promo_popup_seen_';

const SEGMENT_COLORS = {
  purple: ['#a78bfa', '#c4b5fd', '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#c4b5fd', '#8b5cf6'],
  emerald: ['#34d399', '#6ee7b7', '#10b981', '#34d399', '#6ee7b7', '#10b981'],
  sunset: ['#fb923c', '#fde68a', '#f97316', '#fb923c', '#fde68a', '#f97316'],
  midnight: ['#6366f1', '#818cf8', '#4f46e5', '#6366f1', '#818cf8', '#4f46e5'],
  minimal: ['#e5e7eb', '#d1d5db', '#9ca3af', '#e5e7eb', '#d1d5db', '#9ca3af'],
};

const CONFIG_KEYS = [
  'trigger', 'triggerdelay', 'triggerscroll', 'storageduration',
  'headline', 'subheadline', 'spinbuttontext', 'nothankstext',
  'resultheadline', 'ctabuttontext', 'theme', 'showorbbg', 'showconfetti',
  'spinduration',
];

/* ─── Utilities ─────────────────────────────────────────────────── */

function getBlockId(block) {
  const idx = [...document.querySelectorAll('.promo-popup')].indexOf(block);
  return `block_${idx}`;
}

function getStorageKey(blockId) {
  return `${STORAGE_PREFIX}${blockId}`;
}

function hasBeenSeen(blockId, duration) {
  try {
    if (duration === 'session' || duration === '0') {
      return !!sessionStorage.getItem(getStorageKey(blockId));
    }
    const raw = localStorage.getItem(getStorageKey(blockId));
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(getStorageKey(blockId));
      return false;
    }
    return true;
  } catch { return false; }
}

function markSeen(blockId, duration) {
  try {
    if (duration === 'session' || duration === '0') {
      sessionStorage.setItem(getStorageKey(blockId), '1');
    } else {
      const days = parseFloat(duration) || 1;
      const expires = Date.now() + days * 86_400_000;
      localStorage.setItem(getStorageKey(blockId), JSON.stringify({ expires }));
    }
  } catch { /* storage blocked */ }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getTextContent(el) {
  if (!el) return '';
  const p = el.querySelector('p');
  return (p ? p.textContent : el.textContent || '').trim();
}

/* ─── Parse block content ────────────────────────────────────────── */

function parseBlock(block) {
  const config = {
    trigger: 'time',
    triggerDelay: 3,
    triggerScroll: 50,
    storageDuration: '1',
    headline: 'Spin to Win!',
    subheadline: 'One spin, one exclusive deal — just for you.',
    spinButtonText: 'Spin the Wheel',
    noThanksText: 'No thanks',
    resultHeadline: 'You won!',
    ctaButtonText: 'Claim Offer',
    theme: 'purple',
    showOrbBg: true,
    showConfetti: true,
    spinDuration: 4,
  };

  // Read from block.dataset (DA.live model fields)
  const ds = block.dataset;
  if (ds.headline) config.headline = ds.headline;
  if (ds.subheadline) config.subheadline = ds.subheadline;
  if (ds.trigger) config.trigger = ds.trigger;
  if (ds.triggerDelay) config.triggerDelay = parseFloat(ds.triggerDelay) || 3;
  if (ds.triggerScroll) config.triggerScroll = parseFloat(ds.triggerScroll) || 50;
  if (ds.storageDuration !== undefined) {
    config.storageDuration = String(ds.storageDuration);
  }
  if (ds.spinButtonText) config.spinButtonText = ds.spinButtonText;
  if (ds.noThanksText) config.noThanksText = ds.noThanksText;
  if (ds.resultHeadline) config.resultHeadline = ds.resultHeadline;
  if (ds.ctaButtonText) config.ctaButtonText = ds.ctaButtonText;
  if (ds.theme) config.theme = ds.theme;
  if (ds.showOrbBg !== undefined) config.showOrbBg = ds.showOrbBg !== 'false';
  if (ds.showConfetti !== undefined) config.showConfetti = ds.showConfetti !== 'false';
  if (ds.spinDuration) {
    const d = parseFloat(ds.spinDuration) || 4;
    config.spinDuration = Math.min(8, Math.max(3, d));
  }

  const promotions = [];
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length === 2) {
      const key = getTextContent(cells[0]).toLowerCase().replace(/[-\s]/g, '');
      const val = getTextContent(cells[1]);
      if (CONFIG_KEYS.includes(key)) {
        const map = {
          trigger: 'trigger',
          triggerdelay: 'triggerDelay',
          triggerscroll: 'triggerScroll',
          storageduration: 'storageDuration',
          headline: 'headline',
          subheadline: 'subheadline',
          spinbuttontext: 'spinButtonText',
          nothankstext: 'noThanksText',
          resultheadline: 'resultHeadline',
          ctabuttontext: 'ctaButtonText',
          theme: 'theme',
          showorbbg: 'showOrbBg',
          showconfetti: 'showConfetti',
          spinduration: 'spinDuration',
        };
        const cfgKey = map[key];
        if (cfgKey) {
          const numKeys = ['triggerdelay', 'triggerscroll', 'spinduration'];
          config[cfgKey] = numKeys.includes(key)
            ? parseFloat(val) || config[cfgKey]
            : val;
          if (key === 'showorbbg') config.showOrbBg = val !== 'false';
          if (key === 'showconfetti') config.showConfetti = val !== 'false';
        }
      } else {
        const label = getTextContent(cells[0]).replace(/\s+/g, ' ').trim();
        const descCell = cells[1];
        const description = descCell ? (descCell.innerHTML || descCell.textContent || '').trim() : '';
        if (label) promotions.push({ label, description, cta: null });
      }
    } else if (cells.length >= 2) {
      const key = getTextContent(cells[0]).toLowerCase().replace(/[-\s]/g, '');
      if (CONFIG_KEYS.includes(key)) return; /* skip config rows */
      const label = getTextContent(cells[0]).replace(/\s+/g, ' ').trim();
      const descCell = cells[1];
      const description = descCell ? (descCell.innerHTML || descCell.textContent || '').trim() : '';
      const ctaEl = cells[2]?.querySelector('a');
      let cta = null;
      if (ctaEl) {
        const raw = (ctaEl.getAttribute('href') || '').trim();
        const blocked = /^(javascript|data|vbscript):/i.test(raw);
        const allowed = /^(https?:|mailto:|tel:|\/|\.)/i;
        if (raw && !blocked && allowed.test(raw)) {
          cta = { text: ctaEl.textContent.trim() || config.ctaButtonText, href: raw };
        }
      }
      if (label) promotions.push({ label, description, cta });
    }
  });

  return { config, promotions };
}

/* ─── Build Wheel DOM ────────────────────────────────────────────── */

function buildWheel(promotions, theme) {
  const n = promotions.length;
  const degPer = 360 / n;
  const colors = SEGMENT_COLORS[theme] || SEGMENT_COLORS.purple;

  const wheel = document.createElement('div');
  wheel.className = 'pp-wheel';

  const stops = promotions.map((_, i) => {
    const color = colors[i % colors.length];
    const start = (i * degPer).toFixed(2);
    const end = ((i + 1) * degPer).toFixed(2);
    return `${color} ${start}deg ${end}deg`;
  }).join(', ');
  wheel.style.background = `conic-gradient(${stops})`;

  promotions.forEach((promo, i) => {
    const mid = (i + 0.5) * degPer;
    const label = document.createElement('div');
    label.className = 'pp-segment-label';
    label.textContent = promo.label;
    label.style.transform = `rotate(${mid}deg) translateX(56px)`;
    wheel.appendChild(label);
  });

  const cap = document.createElement('div');
  cap.className = 'pp-wheel-cap';
  cap.innerHTML = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="20" fill="white" stroke="currentColor" stroke-width="2"/>
    <path d="M22 11 L25 18.5 L33 18.5 L27 23.5 L29.5 31 L22 26 L14.5 31 L17 23.5 L11 18.5 L19 18.5Z" fill="currentColor" opacity="0.9"/>
  </svg>`;
  wheel.appendChild(cap);

  return wheel;
}

/* ─── Build Overlay DOM ──────────────────────────────────────────── */

function buildOverlay(config, promotions) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'pp-headline-id');
  overlay.setAttribute('aria-describedby', 'pp-subheadline-id');

  if (config.showOrbBg) {
    overlay.classList.add('pp-overlay--orbs');
  }
  overlay.dataset.theme = config.theme || 'purple';

  const modal = document.createElement('div');
  modal.className = 'pp-modal';

  if (config.showOrbBg) {
    const orbContainer = document.createElement('div');
    orbContainer.className = 'pp-orb-container';
    orbContainer.innerHTML = `
      <div class="pp-orb pp-orb--1"></div>
      <div class="pp-orb pp-orb--2"></div>
      <div class="pp-orb pp-orb--3"></div>
      <div class="pp-orb pp-orb--4"></div>
    `;
    modal.appendChild(orbContainer);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'pp-close';
  closeBtn.type = 'button';
  closeBtn.innerHTML = '<span class="pp-close-x"></span>';
  closeBtn.setAttribute('aria-label', 'Close popup');

  const header = document.createElement('div');
  header.className = 'pp-header';
  header.innerHTML = `
    <div class="pp-sparkle pp-sparkle--1">✦</div>
    <div class="pp-sparkle pp-sparkle--2">✦</div>
    <div class="pp-sparkle pp-sparkle--3">✦</div>
    <h2 id="pp-headline-id" class="pp-headline">${config.headline}</h2>
    <p id="pp-subheadline-id" class="pp-subheadline">${config.subheadline}</p>
  `;

  const wheelWrap = document.createElement('div');
  wheelWrap.className = 'pp-wheel-wrap';

  const pointer = document.createElement('div');
  pointer.className = 'pp-pointer';
  pointer.innerHTML = `<svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 32 L0 0 L24 0 Z" fill="#1a1a2e"/>
    <path d="M12 26 L2 2 L22 2 Z" fill="currentColor"/>
  </svg>`;

  const wheel = buildWheel(promotions, config.theme);
  wheelWrap.appendChild(pointer);
  wheelWrap.appendChild(wheel);

  const spinBtn = document.createElement('button');
  spinBtn.className = 'pp-spin-btn';
  spinBtn.type = 'button';
  spinBtn.textContent = config.spinButtonText;

  const resultArea = document.createElement('div');
  resultArea.className = 'pp-result';
  resultArea.setAttribute('aria-live', 'polite');

  const noThanks = document.createElement('button');
  noThanks.className = 'pp-no-thanks';
  noThanks.type = 'button';
  noThanks.textContent = config.noThanksText;

  modal.appendChild(closeBtn);
  modal.appendChild(header);
  modal.appendChild(wheelWrap);
  modal.appendChild(spinBtn);
  modal.appendChild(resultArea);
  modal.appendChild(noThanks);
  overlay.appendChild(modal);

  /* ── Spin Logic ── */
  let hasSpun = false;
  let currentRotation = 0;
  const duration = config.spinDuration * 1000;

  function doSpin() {
    if (hasSpun) return;
    hasSpun = true;
    spinBtn.disabled = true;
    spinBtn.textContent = 'Spinning…';

    const n = promotions.length;
    const segIdx = Math.floor(Math.random() * n);
    const degPer = 360 / n;
    const baseOffset = (n - segIdx) * degPer - degPer / 2;
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetDeg = currentRotation + extraSpins + baseOffset - (currentRotation % 360);

    const spinDuration = prefersReducedMotion() ? 200 : duration;
    wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    wheel.style.transform = `rotate(${targetDeg}deg)`;
    currentRotation = targetDeg;

    const promo = promotions[segIdx];

    const handleEnd = () => {
      wheel.removeEventListener('transitionend', handleEnd);
      revealResult(promo);
    };

    if (prefersReducedMotion()) {
      setTimeout(handleEnd, spinDuration + 50);
    } else {
      wheel.addEventListener('transitionend', handleEnd);
    }
  }

  function revealResult(promo) {
    spinBtn.style.display = 'none';
    noThanks.textContent = 'Close';

    const ctaHtml = promo.cta
      ? `<a class="pp-result-cta" href="${promo.cta.href}" rel="noopener noreferrer">${promo.cta.text}</a>`
      : '';

    resultArea.innerHTML = `
      <div class="pp-result-inner">
        <div class="pp-result-badge">${config.resultHeadline}</div>
        <div class="pp-result-label">${promo.label}</div>
        ${promo.description ? `<div class="pp-result-desc">${promo.description}</div>` : ''}
        ${ctaHtml}
      </div>
    `;
    resultArea.classList.add('pp-result--visible');

    if (config.showConfetti && !prefersReducedMotion()) {
      launchConfetti(modal);
    }
  }

  function closeOverlay() {
    document.removeEventListener('keydown', overlay._keyHandler);
    overlay.classList.add('pp-overlay--closing');
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      document.body.classList.remove('pp-no-scroll');
    }, { once: true });
  }

  spinBtn.addEventListener('click', doSpin);
  closeBtn.addEventListener('click', closeOverlay);
  noThanks.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  const focusable = () => [...modal.querySelectorAll('button, a[href]')].filter((el) => !el.disabled);

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeOverlay();
      return;
    }
    if (e.key === 'Tab') {
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  overlay._keyHandler = handleKey;

  return { overlay, focusFirst: () => focusable()[0]?.focus() };
}

/* ─── Confetti ───────────────────────────────────────────────────── */

function launchConfetti(container) {
  const colors = ['#a78bfa', '#34d399', '#fb923c', '#6366f1', '#f472b6', '#fde68a'];
  for (let i = 0; i < 60; i += 1) {
    const c = document.createElement('div');
    c.className = 'pp-confetti';
    c.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${0.8 + Math.random() * 0.8}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

/* ─── Entry Triggers ─────────────────────────────────────────────── */

function setupTrigger(config, showFn) {
  const { trigger, triggerDelay, triggerScroll } = config;

  if (trigger === 'immediate') { showFn(); return; }

  if (trigger === 'time') {
    setTimeout(showFn, (triggerDelay || 3) * 1000);
    return;
  }

  if (trigger === 'scroll') {
    const threshold = (triggerScroll || 50) / 100;
    const check = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) { showFn(); return; }
      const scrolled = window.scrollY / maxScroll;
      if (scrolled >= threshold) {
        window.removeEventListener('scroll', check);
        showFn();
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    return;
  }

  if (trigger === 'exit') {
    const check = (e) => {
      if (e.clientY < 10) {
        document.removeEventListener('mouseout', check);
        showFn();
      }
    };
    document.addEventListener('mouseout', check);
    return;
  }

  if (trigger === 'first-interaction') {
    const handler = () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('scroll', handler);
      showFn();
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('scroll', handler, { once: true, passive: true });
    return;
  }

  setTimeout(showFn, (triggerDelay || 3) * 1000);
}

/* ─── Main Decorate ──────────────────────────────────────────────── */

export default function decorate(block) {
  const { config, promotions } = parseBlock(block);

  if (!promotions.length) {
    block.hidden = true;
    return;
  }

  const blockId = getBlockId(block);
  block.innerHTML = '';
  block.hidden = true;

  function showPopup() {
    if (hasBeenSeen(blockId, config.storageDuration)) return;
    markSeen(blockId, config.storageDuration);

    const { overlay, focusFirst } = buildOverlay(config, promotions);
    document.addEventListener('keydown', overlay._keyHandler);
    document.body.appendChild(overlay);
    document.body.classList.add('pp-no-scroll');

    requestAnimationFrame(() => {
      overlay.classList.add('pp-overlay--visible');
      setTimeout(focusFirst, 100);
    });
  }

  setupTrigger(config, showPopup);
}

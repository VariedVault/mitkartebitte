import { speak } from '../tts.js';
import { PRONOUN_LABELS } from '../data/verbs.js';

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v; // only ever used with trusted, static app strings
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function progressRing(percent, { size = 54, stroke = 6 } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, percent)) / 100) * c;
  const wrap = el('div', { class: 'ring-wrap', style: `width:${size}px;height:${size}px` });
  wrap.innerHTML = `
    <svg width="${size}" height="${size}">
      <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"></circle>
      <circle class="ring-fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
        stroke-dasharray="${c}" stroke-dashoffset="${c}"></circle>
    </svg>
    <span class="ring-label" style="font-size:${size * 0.26}px">${Math.round(percent)}%</span>`;
  requestAnimationFrame(() => {
    const fill = wrap.querySelector('.ring-fill');
    if (fill) fill.style.strokeDashoffset = String(offset);
  });
  return wrap;
}

export function speakerButton(text, label) {
  return el(
    'button',
    { class: 'speaker-btn', 'aria-label': label || `Listen: ${text}`, type: 'button', onclick: () => speak(text) },
    '🔊'
  );
}

export function pronounChip(pronoun) {
  return el('span', { class: `chip pron-${pronoun}` }, PRONOUN_LABELS[pronoun] || pronoun);
}

export function typeLabel(type) {
  return el('span', { class: `chip type-${type}` }, type);
}

/**
 * Read-only, reverse-chronological list of this session's answered questions.
 * `history` entries: { prompt, userAnswer, correctAnswer, correct }. `userAnswer` may be
 * omitted for self-graded (flip-card) sessions where there's nothing typed to show.
 * Purely a viewer - never lets you re-submit or change a past answer.
 */
export function reviewList(history, onBack, backLabel = 'Back') {
  const wrap = el('div', { class: 'card' });
  wrap.appendChild(el('h3', {}, 'This session so far'));
  if (!history.length) {
    wrap.appendChild(el('p', { style: 'color:var(--ink-soft)' }, 'Nothing answered yet.'));
  } else {
    const list = el('div', { style: 'display:flex;flex-direction:column;gap:8px;margin-top:10px;max-height:55vh;overflow-y:auto' });
    [...history].reverse().forEach((entry, i) => {
      const num = history.length - i;
      const good = entry.correct;
      list.appendChild(
        el(
          'div',
          {
            style: `border-left:4px solid ${good ? 'var(--correct)' : 'var(--incorrect)'};padding:8px 12px;background:${good ? 'rgba(72,209,122,0.12)' : 'rgba(255,92,92,0.1)'};border-radius:8px`,
          },
          [
            el('div', { style: 'font-size:11px;color:var(--ink-soft);font-family:var(--font-mono)' }, `#${num} · ${entry.prompt}`),
            el('div', { style: 'font-family:var(--font-mono);font-size:14px;margin-top:3px' }, [
              entry.userAnswer != null ? el('span', { style: `font-weight:700;color:${good ? '#1a7a44' : '#a1341f'}` }, entry.userAnswer) : null,
              !good ? el('span', { style: 'color:var(--ink-soft)' }, entry.userAnswer != null ? `  →  ${entry.correctAnswer}` : entry.correctAnswer) : null,
              good && entry.userAnswer == null ? el('span', { style: 'font-weight:700;color:#1a7a44' }, entry.correctAnswer) : null,
            ]),
          ]
        )
      );
    });
    wrap.appendChild(list);
  }
  const backBtn = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:14px' }, backLabel);
  backBtn.addEventListener('click', onBack);
  wrap.appendChild(backBtn);
  return wrap;
}

const UMLAUT_KEYS = ['ä', 'ö', 'ü', 'ß'];

/**
 * Virtual-keyboard bar for the umlaut/ß characters most on-screen keyboards hide behind a
 * long-press. Takes one input or an array of inputs (e.g. every cell of a conjugation
 * table) sharing a single bar, and always inserts into whichever of them the user last
 * focused - never a hardcoded/first one. This is the ONE shared implementation; every
 * view with a typed-answer input should call this instead of rolling its own bar.
 */
export function keyboardHelper(inputs) {
  const list = [].concat(inputs);
  const bar = el('div', { class: 'keyboard-helper' });
  let active = list[0] || null;
  for (const input of list) {
    input.addEventListener('focus', () => { active = input; });
  }
  function insert(ch) {
    const input = active;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + ch + input.value.slice(end);
    const caret = start + ch.length;
    input.focus();
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  for (const ch of UMLAUT_KEYS) {
    const btn = el('button', { type: 'button' }, ch);
    // Tapping a button would otherwise blur the input first (losing both
    // document.activeElement and, on some browsers, the caret/selection) before any handler
    // runs - preventDefault on mousedown/touchstart keeps the input focused throughout.
    // Touch is handled on touchend rather than relying on click: preventDefault-ing
    // touchstart also suppresses the browser's synthetic post-touch click entirely (spec
    // behavior), so a touch-only flow that waited for click would silently do nothing.
    let touchHandled = false;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); touchHandled = true; }, { passive: false });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (touchHandled) { touchHandled = false; insert(ch); }
    });
    btn.addEventListener('touchcancel', () => { touchHandled = false; });
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => insert(ch)); // mouse clicks + keyboard (Enter/Space) activation
    bar.appendChild(btn);
  }
  return bar;
}

/** Small "← Back to X" link, styled for the dark page background (not inside a card). */
export function backLink(label, onClick) {
  const link = el('button', { class: 'btn', style: 'font-size:12.5px;padding:7px 12px;margin-bottom:14px;background:transparent;border-color:rgba(255,255,255,0.25)' }, `← ${label}`);
  link.addEventListener('click', onClick);
  return link;
}

export function toast(container, message) {
  let node = container.querySelector('.status-msg');
  if (!node) {
    node = el('p', { class: 'status-msg', role: 'status', 'aria-live': 'polite' });
    container.appendChild(node);
  }
  node.textContent = message;
  window.clearTimeout(node._t);
  node._t = window.setTimeout(() => (node.textContent = ''), 3500);
}

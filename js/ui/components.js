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

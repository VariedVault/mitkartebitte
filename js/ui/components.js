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

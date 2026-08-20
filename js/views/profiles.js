import * as store from '../store.js';
import { el } from '../ui/components.js';

export async function renderProfiles(container, { onSelected }) {
  container.innerHTML = '';
  container.appendChild(el('h1', {}, 'Who’s learning?'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, 'Each profile keeps its own progress, deck, and pace — nothing is shared.'));

  const grid = el('div', { class: 'profile-grid' });
  container.appendChild(grid);

  function draw() {
    grid.innerHTML = '';
    const profiles = store.listProfiles();
    for (const profile of profiles) {
      grid.appendChild(profileCard(profile));
    }
    grid.appendChild(newProfileCard());
  }

  function profileCard(profile) {
    const card = el('div', { class: 'profile-card' });
    const avatar = el('div', { class: 'avatar-lg' }, profile.name.slice(0, 1).toUpperCase());
    const nameEl = el('div', { class: 'name' }, profile.name);
    const selectBtn = el('button', { class: 'btn btn-block', style: 'margin-top:10px;font-size:12px;padding:8px' }, 'Continue');
    selectBtn.addEventListener('click', () => onSelected(profile.id));
    const renameBtn = el('button', { class: 'btn', style: 'margin-top:6px;font-size:11px;padding:6px;width:100%;background:transparent;border-color:var(--cream-line);color:var(--ink-soft)' }, 'Rename');
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startRename(card, profile);
    });
    card.appendChild(avatar);
    card.appendChild(nameEl);
    card.appendChild(selectBtn);
    card.appendChild(renameBtn);
    return card;
  }

  function startRename(card, profile) {
    card.innerHTML = '';
    const input = el('input', { class: 'field', value: profile.name, style: 'text-align:center;color:var(--ink);background:white;border:1px solid var(--cream-line)' });
    const save = el('button', { class: 'btn btn-primary', style: 'margin-top:8px;width:100%;font-size:12px;padding:8px' }, 'Save');
    save.addEventListener('click', () => {
      const name = input.value.trim();
      if (name) store.renameProfile(profile.id, name);
      draw();
    });
    card.appendChild(el('div', { class: 'avatar-lg' }, profile.name.slice(0, 1).toUpperCase()));
    card.appendChild(input);
    card.appendChild(save);
    input.focus();
    input.select();
  }

  function newProfileCard() {
    const card = el('div', { class: 'profile-card', style: 'display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer' });
    card.appendChild(el('div', { class: 'avatar-lg', style: 'background:var(--gold);color:var(--felt-900);font-size:26px' }, '+'));
    card.appendChild(el('div', { class: 'name' }, 'New learner'));
    card.addEventListener('click', () => {
      const profile = store.createProfile('New learner');
      startRenameNew(profile);
    });
    return card;
  }

  function startRenameNew(profile) {
    draw();
    const cards = grid.querySelectorAll('.profile-card');
    const last = cards[cards.length - 2]; // the freshly-added profile, before the "+ New" card
    if (last) startRename(last, profile);
  }

  draw();
}

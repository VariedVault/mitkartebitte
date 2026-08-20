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
    const selectBtn = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:10px;font-size:13px;padding:9px' }, 'Continue');
    selectBtn.addEventListener('click', () => onSelected(profile.id));
    const renameBtn = el('button', { class: 'btn', style: 'margin-top:8px;font-size:11px;padding:6px;width:100%;background:transparent;border-color:var(--cream-line);color:var(--ink-soft)' }, 'Rename');
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startRename(card, profile);
    });
    card.appendChild(avatar);
    card.appendChild(nameEl);
    card.appendChild(selectBtn);
    card.appendChild(renameBtn);
    if (store.listProfiles().length > 1) {
      const removeBtn = el('button', { style: 'margin-top:6px;font-size:10.5px;padding:4px;width:100%;background:none;border:none;color:var(--ink-soft);text-decoration:underline;opacity:.7' }, 'Remove');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.confirm(`Remove "${profile.name}"? This deletes that profile's progress and can't be undone.`)) {
          store.deleteProfile(profile.id);
          draw();
        }
      });
      card.appendChild(removeBtn);
    }
    return card;
  }

  function startRename(card, profile) {
    card.innerHTML = '';
    const input = el('input', {
      value: profile.name,
      style: 'width:100%;box-sizing:border-box;text-align:center;color:var(--ink);background:white;border:1px solid var(--cream-line);border-radius:8px;padding:8px 10px;font-size:14px',
    });
    const save = el('button', { class: 'btn btn-primary', style: 'margin-top:8px;width:100%;font-size:12px;padding:8px' }, 'Save');
    save.addEventListener('click', () => {
      const name = input.value.trim();
      if (name) store.renameProfile(profile.id, name);
      draw();
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); save.click(); } });
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

import * as store from '../store.js';
import { el, toast } from '../ui/components.js';

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function heatmapGrid(activity) {
  const grid = el('div', { class: 'heatmap-grid' });
  const days = 84;
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = activity[key] || 0;
    const cell = el('div', { class: `heatmap-cell${count > 0 ? ' active' : ''}`, title: `${key}: ${count} session${count === 1 ? '' : 's'}`, style: count > 2 ? 'opacity:1' : count > 0 ? 'opacity:.65' : '' });
    grid.appendChild(cell);
  }
  return grid;
}

export async function renderDataPanel(container, { profileId }) {
  container.innerHTML = '';
  const profile = store.listProfiles().find((p) => p.id === profileId);
  container.appendChild(el('h1', {}, 'Settings'));

  // Name card
  const nameCard = el('div', { class: 'card' });
  nameCard.appendChild(el('h3', {}, 'Your name'));
  const nameRow = el('div', { style: 'display:flex;gap:8px;margin-top:8px' });
  const nameInput = el('input', {
    value: profile?.name || '',
    style: 'flex:1;min-width:0;background:white;color:var(--ink);border:1px solid var(--cream-line);border-radius:8px;padding:9px 11px;font-size:14px',
  });
  const saveNameBtn = el('button', { class: 'btn btn-primary' }, 'Save');
  saveNameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
      store.renameProfile(profileId, name);
      toast(nameCard, 'Saved.');
    }
  });
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveNameBtn.click(); } });
  nameRow.appendChild(nameInput);
  nameRow.appendChild(saveNameBtn);
  nameCard.appendChild(nameRow);
  container.appendChild(nameCard);

  // Settings card
  const settingsCard = el('div', { class: 'card' });
  const settings = store.getSettings(profileId);
  settingsCard.appendChild(el('h3', {}, 'Activity heatmap'));
  settingsCard.appendChild(el('p', {}, 'Purely optional, off by default. Shows when you practiced - never a streak to protect, never a guilt trip for a skipped day.'));
  const toggleRow = el('label', { style: 'display:flex;align-items:center;gap:10px;cursor:pointer;margin:10px 0' });
  const checkbox = el('input', { type: 'checkbox' });
  checkbox.checked = !!settings.heatmapEnabled;
  toggleRow.appendChild(checkbox);
  toggleRow.appendChild(el('span', {}, 'Show my activity heatmap'));
  settingsCard.appendChild(toggleRow);
  const heatmapWrap = el('div', { style: 'margin-top:10px' });
  settingsCard.appendChild(heatmapWrap);

  function drawHeatmap() {
    heatmapWrap.innerHTML = '';
    if (checkbox.checked) heatmapWrap.appendChild(heatmapGrid(store.getActivity(profileId)));
  }
  checkbox.addEventListener('change', () => {
    store.setSetting(profileId, 'heatmapEnabled', checkbox.checked);
    drawHeatmap();
  });
  drawHeatmap();
  container.appendChild(settingsCard);

  // Backup card
  const backupCard = el('div', { class: 'card' });
  backupCard.appendChild(el('h3', {}, 'Export / import'));
  backupCard.appendChild(el('p', {}, 'Everything lives only in this browser. Export a backup, or move your progress to another device by exporting here and importing there.'));
  const toolbar = el('div', { class: 'toolbar' });
  const exportBtn = el('button', { class: 'btn' }, 'Export my progress');
  exportBtn.addEventListener('click', () => {
    downloadJSON(store.exportProfile(profileId), `mit-karte-bitte_${(profile?.name || 'progress').toLowerCase().replace(/\s+/g, '-')}.json`);
    toast(backupCard, 'Exported.');
  });
  const importBtn = el('button', { class: 'btn btn-primary' }, 'Import backup');
  const fileInput = el('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only' });
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!window.confirm('This replaces your current progress with the file you pick. Continue?')) {
      fileInput.value = '';
      return;
    }
    try {
      const text = await file.text();
      store.importIntoProfile(profileId, JSON.parse(text));
      toast(backupCard, 'Restored. Reloading...');
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      toast(backupCard, 'Could not read that file - is it a mit Karte, bitte export?');
    }
    fileInput.value = '';
  });
  toolbar.appendChild(exportBtn);
  toolbar.appendChild(importBtn);
  toolbar.appendChild(fileInput);
  backupCard.appendChild(toolbar);
  container.appendChild(backupCard);

  // Clear this profile — everyday, safe reset
  const clearCard = el('div', { class: 'card' });
  clearCard.appendChild(el('h3', {}, 'Clear this profile'));
  clearCard.appendChild(el('p', {}, `Resets ${profile ? `"${profile.name}"` : 'this profile'}'s course progress, checkpoint results, and SRS deck back to zero. Your name and settings stay as they are. Other profiles, if you have any, are not touched.`));
  const clearBtn = el('button', { class: 'btn' }, 'Clear this profile');
  clearBtn.addEventListener('click', () => {
    const ok = window.confirm(
      `Clear all progress for "${profile?.name || 'this profile'}"?\n\nThis permanently deletes this profile's course progress, checkpoint results, and SRS (spaced-repetition) deck. This cannot be undone. Your profile name and settings are kept.`
    );
    if (!ok) return;
    store.clearProfileData(profileId);
    toast(clearCard, 'Cleared. Reloading...');
    setTimeout(() => location.reload(), 900);
  });
  clearCard.appendChild(clearBtn);
  container.appendChild(clearCard);

  // Reset all data — danger zone, full factory reset
  const dangerCard = el('div', { class: 'card card-danger' });
  dangerCard.appendChild(el('h3', {}, '⚠️ Reset all data'));
  dangerCard.appendChild(
    el('p', { style: 'color:#7a3a2f' }, 'Deletes every profile on this device — not just this one — along with all of their progress, decks, and settings. This is a full factory reset of the app in this browser. There is no undo.')
  );
  const resetBtn = el('button', { class: 'btn btn-danger' }, 'Reset all data');
  resetBtn.addEventListener('click', () => {
    const ok = window.confirm(
      'Reset ALL data?\n\nThis permanently deletes EVERY profile on this device (not just this one) and all of their progress, decks, and settings. This cannot be undone.\n\nType-to-confirm is skipped here, so make sure you mean it — click OK only if you want a full factory reset.'
    );
    if (!ok) return;
    store.resetAllData();
    toast(dangerCard, 'All data cleared. Reloading...');
    // location.reload() alone would keep the current #/data hash, skipping straight back to
    // Settings instead of the fresh-profile onboarding gate. Drop the hash first.
    setTimeout(() => location.replace(location.pathname + location.search), 900);
  });
  dangerCard.appendChild(resetBtn);
  container.appendChild(dangerCard);
}

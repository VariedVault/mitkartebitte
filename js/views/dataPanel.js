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
  container.appendChild(el('h1', {}, 'Backup, transfer & settings'));

  // Settings card
  const settingsCard = el('div', { class: 'card' });
  const settings = store.getSettings(profileId);
  settingsCard.appendChild(el('h3', {}, 'Activity heatmap'));
  settingsCard.appendChild(el('p', {}, 'Purely optional, off by default. Shows when you practiced — never a streak to protect, never a guilt trip for a skipped day.'));
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
  const exportOneBtn = el('button', { class: 'btn' }, `Export "${profile?.name}"`);
  exportOneBtn.addEventListener('click', () => {
    downloadJSON(store.exportProfile(profileId), `mit-karte-bitte_${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    toast(backupCard, 'Exported.');
  });
  const exportAllBtn = el('button', { class: 'btn' }, 'Export ALL profiles');
  exportAllBtn.addEventListener('click', () => {
    downloadJSON(store.exportAllProfiles(), 'mit-karte-bitte_all-profiles.json');
    toast(backupCard, 'Exported all profiles.');
  });
  const importBtn = el('button', { class: 'btn btn-primary' }, 'Import file');
  const fileInput = el('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only' });
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const count = store.importData(JSON.parse(text));
      toast(backupCard, `Imported ${count} profile(s). Switch to them from the Profile tab.`);
    } catch (e) {
      toast(backupCard, 'Could not read that file — is it a mit Karte, bitte export?');
    }
    fileInput.value = '';
  });
  toolbar.appendChild(exportOneBtn);
  toolbar.appendChild(exportAllBtn);
  toolbar.appendChild(importBtn);
  toolbar.appendChild(fileInput);
  backupCard.appendChild(toolbar);
  container.appendChild(backupCard);

  const switchBtn = el('button', { class: 'btn btn-block', style: 'margin-top:16px' }, 'Switch profile');
  switchBtn.addEventListener('click', () => { location.hash = '/profiles'; });
  container.appendChild(switchBtn);
}

// SpeechSynthesis wrapper. Free, browser-native, v1. Degrades quietly if unavailable.

let voicesReady = false;
let germanVoice = null;

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  if (voices.length) {
    germanVoice = voices.find((v) => v.lang === 'de-DE') || voices.find((v) => v.lang?.startsWith('de')) || null;
    voicesReady = true;
  }
}

export function initTTS() {
  if (!('speechSynthesis' in window)) return;
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

export function isTTSAvailable() {
  return 'speechSynthesis' in window;
}

export function speak(text) {
  if (!('speechSynthesis' in window) || !text) return;
  try {
    speechSynthesis.cancel(); // don't stack overlapping utterances
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'de-DE';
    if (germanVoice) utter.voice = germanVoice;
    utter.rate = 0.95;
    speechSynthesis.speak(utter);
  } catch {
    /* speech synthesis failed silently - no German voice, blocked by browser, etc. */
  }
}

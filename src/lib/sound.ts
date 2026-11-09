// UI sounds (design-studio sound rules): off by default, a labelled toggle,
// the choice kept in localStorage["ui-sound"], tones from the Web Audio API.
const SOUND_KEY = 'ui-sound';
let audioContext: AudioContext | undefined;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveSoundChoice(isOn: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, isOn ? 'on' : 'off');
  } catch {
    // Storage blocked: sound stays off on the next visit.
  }
}

export function playTone(frequencyHz: number, durationMs = 120): void {
  if (!isSoundOn()) return;
  try {
    audioContext ??= new AudioContext();
    const now = audioContext.currentTime;
    const end = now + durationMs / 1000;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequencyHz;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, end);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(end);
  } catch {
    // No audio support: the visible message still shows.
  }
}

export const playSuccess = () => playTone(880);

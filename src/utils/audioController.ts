import { MarioSoundscapeId } from './engagementFeatures';
import { SoundPackId } from '../types/laborLaw';

export type TabSfxType = 'pipe' | 'jump' | 'coin' | 'stomp';
export type CardSfxType = 'powerup' | 'coin' | 'fireball' | 'oneup';
export type QuizSfxType = 'fanfare' | 'star' | 'oneup';

export interface SoundPackInfo {
  id: SoundPackId;
  name: string;
  badge: string;
  era: string;
  description: string;
  defaultPrice: number;
  previewTone: string;
  leadWave: OscillatorType;
}

export const SOUND_PACK_DEFINITIONS: SoundPackInfo[] = [
  {
    id: 'sound_default',
    name: 'Mushroom Kingdom Classic',
    badge: 'Classic 8-Bit',
    era: '1985 Arcade',
    description: 'Iconic Mario chiptune tones with balanced square waves and snappy arpeggios.',
    defaultPrice: 0,
    previewTone: 'Classic Coin & Jump',
    leadWave: 'square',
  },
  {
    id: 'sound_nes_8bit',
    name: 'NES 8-Bit Chiptune Pack',
    badge: 'NES 1985',
    era: '8-Bit Console',
    description: 'Crisp square-wave and triangle-wave sound effects inspired by the 1985 NES original.',
    defaultPrice: 30,
    previewTone: 'Crisp Pulse Waves',
    leadWave: 'square',
  },
  {
    id: 'sound_snes_16bit',
    name: 'SNES 16-Bit Super Chime',
    badge: 'SNES 1990',
    era: '16-Bit Super',
    description: 'Rich stereo brass, crystal bell overtones, and dual-oscillator warmth from Super Mario World.',
    defaultPrice: 45,
    previewTone: 'Stereo Harmonic Sparkle',
    leadWave: 'triangle',
  },
  {
    id: 'sound_zen_lofi',
    name: 'Zen Lofi Study Chimes',
    badge: 'Zen Study',
    era: 'Acoustic Calm',
    description: 'Gentle pure-sine kalimba tones and warm mellow resonance for soothing deep-focus Bar review sessions.',
    defaultPrice: 50,
    previewTone: 'Warm Kalimba Bell',
    leadWave: 'sine',
  },
  {
    id: 'sound_galaxy_synth',
    name: 'Cosmic Galaxy Synth Pack',
    badge: 'Galaxy 2007',
    era: 'Cosmic Spatial',
    description: 'Ethereal star arpeggios, shimmering space harmonics, and celestial chime cascades.',
    defaultPrice: 60,
    previewTone: 'Starlight Arpeggio',
    leadWave: 'sine',
  },
  {
    id: 'sound_bowser_metal',
    name: 'Bowser Lava Rock Overdrive',
    badge: 'Magma Rock',
    era: 'Fiery Heavy Metal',
    description: 'Boiling sawtooth distortion, crunchy sub-bass power, and intense courtroom boss energy.',
    defaultPrice: 65,
    previewTone: 'Sawtooth Power Riff',
    leadWave: 'sawtooth',
  },
];

export interface SoundPackSynthProfile {
  id: SoundPackId;
  leadWave: OscillatorType;
  bassWave: OscillatorType;
  sfxWave: OscillatorType;
  pitchMultiplier: number;
  tempoScale: number;
  harmonicRatio: number | null;
  harmonicWave: OscillatorType;
  harmonicGain: number;
  attackSec: number;
  releaseScale: number;
  lowpassHz: number | null;
  signatureLoopMs: number;
  signatureSteps: { f: number; b?: number; d: number }[];
}

export const SOUND_PACK_SYNTH_PROFILES: Record<SoundPackId, SoundPackSynthProfile> = {
  sound_default: {
    id: 'sound_default',
    leadWave: 'triangle',
    bassWave: 'sine',
    sfxWave: 'square',
    pitchMultiplier: 1.0,
    tempoScale: 1.0,
    harmonicRatio: null,
    harmonicWave: 'sine',
    harmonicGain: 0,
    attackSec: 0.008,
    releaseScale: 1.0,
    lowpassHz: null,
    signatureLoopMs: 4200,
    signatureSteps: [
      { f: 659.25, b: 164.81, d: 0.22 },
      { f: 659.25, d: 0.22 },
      { f: 0, d: 0.14 },
      { f: 659.25, b: 196.0, d: 0.22 },
      { f: 523.25, d: 0.18 },
      { f: 659.25, b: 261.63, d: 0.28 },
      { f: 783.99, b: 196.0, d: 0.42 },
      { f: 392.0, b: 98.0, d: 0.42 },
      { f: 523.25, b: 130.81, d: 0.3 },
      { f: 392.0, b: 98.0, d: 0.28 },
      { f: 329.63, b: 82.41, d: 0.3 },
      { f: 440.0, b: 110.0, d: 0.26 },
      { f: 493.88, b: 123.47, d: 0.26 },
      { f: 440.0, b: 110.0, d: 0.32 },
    ],
  },
  sound_nes_8bit: {
    id: 'sound_nes_8bit',
    leadWave: 'square',
    bassWave: 'triangle',
    sfxWave: 'square',
    pitchMultiplier: 1.0,
    tempoScale: 0.92,
    harmonicRatio: 0.5,
    harmonicWave: 'triangle',
    harmonicGain: 0.22,
    attackSec: 0.004,
    releaseScale: 0.85,
    lowpassHz: 3800,
    signatureLoopMs: 3900,
    signatureSteps: [
      { f: 523.25, b: 130.81, d: 0.2 },
      { f: 659.25, b: 164.81, d: 0.2 },
      { f: 783.99, b: 196.0, d: 0.2 },
      { f: 1046.5, b: 261.63, d: 0.28 },
      { f: 783.99, b: 196.0, d: 0.2 },
      { f: 659.25, b: 164.81, d: 0.24 },
      { f: 587.33, b: 146.83, d: 0.2 },
      { f: 698.46, b: 174.61, d: 0.2 },
      { f: 880.0, b: 220.0, d: 0.28 },
      { f: 783.99, b: 196.0, d: 0.22 },
      { f: 659.25, b: 164.81, d: 0.22 },
      { f: 523.25, b: 130.81, d: 0.34 },
      { f: 392.0, b: 98.0, d: 0.26 },
      { f: 523.25, b: 130.81, d: 0.36 },
    ],
  },
  sound_snes_16bit: {
    id: 'sound_snes_16bit',
    leadWave: 'triangle',
    bassWave: 'triangle',
    sfxWave: 'triangle',
    pitchMultiplier: 1.0,
    tempoScale: 0.98,
    harmonicRatio: 1.004,
    harmonicWave: 'sine',
    harmonicGain: 0.55,
    attackSec: 0.014,
    releaseScale: 1.18,
    lowpassHz: 4200,
    signatureLoopMs: 4600,
    signatureSteps: [
      { f: 587.33, b: 146.83, d: 0.26 },
      { f: 739.99, b: 185.0, d: 0.24 },
      { f: 880.0, b: 220.0, d: 0.28 },
      { f: 1174.66, b: 293.66, d: 0.38 },
      { f: 987.77, b: 246.94, d: 0.26 },
      { f: 880.0, b: 220.0, d: 0.3 },
      { f: 739.99, b: 185.0, d: 0.26 },
      { f: 659.25, b: 164.81, d: 0.28 },
      { f: 587.33, b: 146.83, d: 0.26 },
      { f: 739.99, b: 185.0, d: 0.26 },
      { f: 880.0, b: 220.0, d: 0.34 },
      { f: 739.99, b: 146.83, d: 0.42 },
    ],
  },
  sound_zen_lofi: {
    id: 'sound_zen_lofi',
    leadWave: 'sine',
    bassWave: 'sine',
    sfxWave: 'sine',
    pitchMultiplier: 0.8909,
    tempoScale: 1.25,
    harmonicRatio: 0.5,
    harmonicWave: 'sine',
    harmonicGain: 0.38,
    attackSec: 0.032,
    releaseScale: 1.4,
    lowpassHz: 1650,
    signatureLoopMs: 5600,
    signatureSteps: [
      { f: 523.25, b: 130.81, d: 0.42 },
      { f: 659.25, b: 196.0, d: 0.38 },
      { f: 783.99, b: 164.81, d: 0.44 },
      { f: 987.77, b: 246.94, d: 0.52 },
      { f: 880.0, b: 220.0, d: 0.42 },
      { f: 659.25, b: 164.81, d: 0.4 },
      { f: 587.33, b: 146.83, d: 0.44 },
      { f: 783.99, b: 196.0, d: 0.46 },
      { f: 659.25, b: 130.81, d: 0.54 },
      { f: 523.25, b: 130.81, d: 0.6 },
    ],
  },
  sound_galaxy_synth: {
    id: 'sound_galaxy_synth',
    leadWave: 'sine',
    bassWave: 'triangle',
    sfxWave: 'sine',
    pitchMultiplier: 1.1225,
    tempoScale: 1.08,
    harmonicRatio: 2.0,
    harmonicWave: 'sine',
    harmonicGain: 0.32,
    attackSec: 0.02,
    releaseScale: 1.32,
    lowpassHz: 5200,
    signatureLoopMs: 4900,
    signatureSteps: [
      { f: 659.25, b: 164.81, d: 0.28 },
      { f: 880.0, b: 220.0, d: 0.28 },
      { f: 987.77, b: 246.94, d: 0.28 },
      { f: 1318.51, b: 329.63, d: 0.42 },
      { f: 1174.66, b: 293.66, d: 0.3 },
      { f: 987.77, b: 246.94, d: 0.3 },
      { f: 880.0, b: 220.0, d: 0.32 },
      { f: 783.99, b: 196.0, d: 0.32 },
      { f: 987.77, b: 246.94, d: 0.34 },
      { f: 1318.51, b: 329.63, d: 0.44 },
      { f: 880.0, b: 220.0, d: 0.48 },
    ],
  },
  sound_bowser_metal: {
    id: 'sound_bowser_metal',
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    sfxWave: 'sawtooth',
    pitchMultiplier: 0.7491,
    tempoScale: 0.88,
    harmonicRatio: 1.4983,
    harmonicWave: 'triangle',
    harmonicGain: 0.42,
    attackSec: 0.006,
    releaseScale: 0.95,
    lowpassHz: 2400,
    signatureLoopMs: 3800,
    signatureSteps: [
      { f: 293.66, b: 73.42, d: 0.22 },
      { f: 293.66, b: 73.42, d: 0.2 },
      { f: 349.23, b: 87.31, d: 0.24 },
      { f: 440.0, b: 110.0, d: 0.28 },
      { f: 415.3, b: 103.83, d: 0.3 },
      { f: 349.23, b: 87.31, d: 0.24 },
      { f: 329.63, b: 82.41, d: 0.24 },
      { f: 293.66, b: 73.42, d: 0.28 },
      { f: 261.63, b: 65.41, d: 0.24 },
      { f: 329.63, b: 82.41, d: 0.24 },
      { f: 293.66, b: 73.42, d: 0.42 },
    ],
  },
};


export interface SoundToggles {
  jump: boolean;
  coin: boolean;
  powerup: boolean;
  pipe: boolean;
  stomp: boolean;
  fireball: boolean;
  boss: boolean;
  fanfare: boolean;
}

export interface AudioSettings {
  enabled: boolean; // Master toggle
  sfxEnabled: boolean; // Sound effects toggle
  musicEnabled: boolean; // Retro BGM chiptune music toggle (Pause/Resume)
  soundscape: MarioSoundscapeId; // Overworld | Underground | Castle | Star Road
  soundPack: SoundPackId; // Equipped Audio Pack
  volume: number; // 0.0 to 1.0 (SFX volume)
  musicVolume: number; // 0.0 to 1.0 (Music volume)
  tabSfx: TabSfxType;
  cardSfx: CardSfxType;
  quizSfx: QuizSfxType;
  soundToggles: SoundToggles;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  sfxEnabled: true,
  musicEnabled: false,
  soundscape: 'overworld',
  soundPack: 'sound_default',
  volume: 0.8,
  musicVolume: 0.42,
  tabSfx: 'pipe',
  cardSfx: 'coin',
  quizSfx: 'fanfare',
  soundToggles: {
    jump: true,
    coin: true,
    powerup: true,
    pipe: true,
    stomp: true,
    fireball: true,
    boss: true,
    fanfare: true,
  },
};

export interface NoteStep {
  f: number; // Lead frequency (0 = rest)
  b?: number; // Optional bass frequency
  d: number; // Duration in seconds
}

export interface ModuleAudioProfile {
  worldId: string;
  moduleNumber: number;
  label: string;
  soundscape: MarioSoundscapeId;
  leadWave: OscillatorType;
  bassWave: OscillatorType;
  loopMs: number;
  gainScale: number;
  bgmSteps: NoteStep[];
  entryCue: { f: number; d: number; wave?: OscillatorType }[];
}

export const AUDIO_PURCHASE_LEDGER_KEY = 'mario_audio_purchase_ledger_v1';
export const ACTIVE_AUDIO_MODULE_KEY = 'mario_active_audio_module_v1';

const wavLoopCache = new Map<string, string>();

function sampleOscillatorWave(phase: number, wave: OscillatorType): number {
  const t = phase - Math.floor(phase);
  switch (wave) {
    case 'square':
      return t < 0.5 ? 0.72 : -0.72;
    case 'sawtooth':
      return (2 * t - 1) * 0.78;
    case 'triangle':
      return (1 - 4 * Math.abs(Math.round(t - 0.25) - (t - 0.25))) * 0.92;
    case 'sine':
    default:
      return Math.sin(2 * Math.PI * t);
  }
}

function encodeBytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode(...slice);
    }
    return btoa(binary);
  }
  const nodeBuffer = (globalThis as unknown as { Buffer?: { from(b: Uint8Array): { toString(enc: string): string } } }).Buffer;
  if (nodeBuffer) {
    return nodeBuffer.from(bytes).toString('base64');
  }
  return '';
}

/**
 * Synthesizes a seamless, persistent 16-bit mono PCM WAV audio loop data URI
 * for any module/soundscape track and equipped SoundPackId.
 * Cached in memory so switching modules or packs is instantaneous and zero-GC.
 */
export function synthesizeLoopWavDataUri(
  trackKey: string,
  packId: SoundPackId = 'sound_default'
): string {
  const cacheKey = `${trackKey}::${packId}`;
  const cached = wavLoopCache.get(cacheKey);
  if (cached) return cached;

  const packProfile = SOUND_PACK_SYNTH_PROFILES[packId] || SOUND_PACK_SYNTH_PROFILES.sound_default;
  const isCustomPack = packProfile.id !== 'sound_default';
  const moduleProfile = MODULE_AUDIO_PROFILES[trackKey] || null;
  const fallbackScape: MarioSoundscapeId =
    trackKey === 'underground' || trackKey === 'castle' || trackKey === 'star_road'
      ? trackKey
      : 'overworld';

  const useSignature = isCustomPack && !moduleProfile && fallbackScape === 'overworld';
  const steps = moduleProfile
    ? moduleProfile.bgmSteps
    : useSignature
    ? packProfile.signatureSteps
    : SOUNDSCAPE_SEQUENCES[fallbackScape].steps;

  const leadWave = moduleProfile
    ? isCustomPack
      ? packProfile.leadWave
      : moduleProfile.leadWave
    : useSignature
    ? packProfile.leadWave
    : isCustomPack
    ? packProfile.leadWave
    : SOUNDSCAPE_SEQUENCES[fallbackScape].leadWave;

  const bassWave = moduleProfile
    ? isCustomPack
      ? packProfile.bassWave
      : moduleProfile.bassWave
    : useSignature
    ? packProfile.bassWave
    : isCustomPack
    ? packProfile.bassWave
    : SOUNDSCAPE_SEQUENCES[fallbackScape].bassWave;

  const pitchScale = useSignature ? 1.0 : packProfile.pitchMultiplier;
  const tempoScale = useSignature ? 1.0 : packProfile.tempoScale;

  // Repeat shorter phrases twice so every persistent WAV loop is a full multi-bar arrangement (>= 5.5s)
  const rawDur = steps.reduce((acc, s) => acc + Math.max(0.08, s.d * tempoScale), 0);
  const repeats = rawDur < 5.0 ? 2 : 1;
  const expandedSteps: NoteStep[] = [];
  for (let r = 0; r < repeats; r++) {
    expandedSteps.push(...steps);
  }

  const sampleRate = 22050;
  const totalSec = expandedSteps.reduce((acc, s) => acc + Math.max(0.08, s.d * tempoScale), 0);
  const numSamples = Math.max(2205, Math.floor(totalSec * sampleRate));
  const pcm = new Float32Array(numSamples);

  let cursorSample = 0;
  let leadPhase = 0;
  let harmPhase = 0;
  let bassPhase = 0;

  for (const step of expandedSteps) {
    const durSec = Math.max(0.08, step.d * tempoScale);
    const stepSamples = Math.min(numSamples - cursorSample, Math.floor(durSec * sampleRate));
    if (stepSamples <= 0) break;

    const attackSamples = Math.max(12, Math.floor(Math.min(packProfile.attackSec, durSec * 0.3) * sampleRate));
    const leadFreq = step.f > 0 ? step.f * pitchScale : 0;
    const harmFreq =
      leadFreq > 0 && packProfile.harmonicRatio ? leadFreq * packProfile.harmonicRatio : 0;
    const bassFreq = step.b && step.b > 0 ? step.b * pitchScale : 0;

    for (let i = 0; i < stepSamples; i++) {
      const progress = i / stepSamples;
      const env =
        i < attackSamples
          ? i / attackSamples
          : Math.max(0.02, Math.pow(1 - progress, 1.35 / Math.max(0.7, packProfile.releaseScale)));

      let sample = 0;
      if (leadFreq > 0) {
        leadPhase += leadFreq / sampleRate;
        sample += sampleOscillatorWave(leadPhase, leadWave) * 0.42 * env;
        if (harmFreq > 0 && packProfile.harmonicGain > 0) {
          harmPhase += harmFreq / sampleRate;
          sample +=
            sampleOscillatorWave(harmPhase, packProfile.harmonicWave) *
            0.22 *
            packProfile.harmonicGain *
            env;
        }
      }
      if (bassFreq > 0) {
        bassPhase += bassFreq / sampleRate;
        const bassEnv = Math.max(0.04, 1 - progress * 0.78);
        sample += sampleOscillatorWave(bassPhase, bassWave) * 0.28 * bassEnv;
      }

      pcm[cursorSample + i] += sample;
    }

    cursorSample += stepSamples;
  }

  // Gentle 1-pole lowpass smoothing when pack specifies lowpassHz + click-free loop boundary fade (8ms)
  if (packProfile.lowpassHz) {
    const rc = 1 / (2 * Math.PI * packProfile.lowpassHz);
    const dt = 1 / sampleRate;
    const alpha = dt / (rc + dt);
    let prev = 0;
    for (let i = 0; i < numSamples; i++) {
      prev = prev + alpha * (pcm[i] - prev);
      pcm[i] = prev;
    }
  }

  const fadeSamples = Math.min(180, Math.floor(numSamples * 0.02));
  for (let i = 0; i < fadeSamples; i++) {
    const g = i / fadeSamples;
    pcm[i] *= g;
    pcm[numSamples - 1 - i] *= g;
  }

  const byteRate = sampleRate * 2;
  const dataSize = numSamples * 2;
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  const writeAscii = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16-bit
  writeAscii(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-0.98, Math.min(0.98, pcm[i]));
    view.setInt16(44 + i * 2, Math.round(clamped * 32767), true);
  }

  const base64 = encodeBytesToBase64(new Uint8Array(wavBuffer));
  const uri = `data:audio/wav;base64,${base64}`;
  wavLoopCache.set(cacheKey, uri);
  return uri;
}

/**
 * Centralized Module 1–6 & Holidays Audio Mapping Registry.
 * Explicitly ensures Modules 2–5 (as well as Module 1, Module 6, and Holidays)
 * have distinct, verified background chiptune loops and interactive entry cues.
 */
export const MODULE_AUDIO_PROFILES: Record<string, ModuleAudioProfile> = {
  world1: {
    worldId: 'world1',
    moduleNumber: 1,
    label: "Module 1 · Yoshi's Island (Hours of Work)",
    soundscape: 'overworld',
    leadWave: 'square',
    bassWave: 'triangle',
    loopMs: 3200,
    gainScale: 0.075,
    bgmSteps: [
      { f: 659.25, b: 196.0, d: 0.14 },
      { f: 0, d: 0.04 },
      { f: 659.25, b: 196.0, d: 0.14 },
      { f: 0, d: 0.12 },
      { f: 659.25, b: 196.0, d: 0.14 },
      { f: 0, d: 0.12 },
      { f: 523.25, b: 130.81, d: 0.14 },
      { f: 659.25, b: 164.81, d: 0.18 },
      { f: 0, d: 0.08 },
      { f: 783.99, b: 196.0, d: 0.28 },
      { f: 0, d: 0.24 },
      { f: 392.0, b: 98.0, d: 0.28 },
      { f: 0, d: 0.24 },
      { f: 523.25, b: 130.81, d: 0.2 },
      { f: 392.0, b: 196.0, d: 0.2 },
      { f: 329.63, b: 164.81, d: 0.24 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 523.25, d: 0.1, wave: 'square' },
      { f: 659.25, d: 0.1, wave: 'square' },
      { f: 783.99, d: 0.14, wave: 'square' },
      { f: 1046.5, d: 0.32, wave: 'square' },
    ],
  },
  world2: {
    worldId: 'world2',
    moduleNumber: 2,
    label: 'Module 2 · Donut Plains (Rest, Holidays & 13th Month)',
    soundscape: 'overworld',
    leadWave: 'triangle',
    bassWave: 'square',
    loopMs: 3000,
    gainScale: 0.082,
    bgmSteps: [
      { f: 349.23, b: 174.61, d: 0.16 },
      { f: 440.0, b: 220.0, d: 0.16 },
      { f: 523.25, b: 130.81, d: 0.18 },
      { f: 587.33, b: 146.83, d: 0.18 },
      { f: 659.25, b: 164.81, d: 0.2 },
      { f: 523.25, b: 130.81, d: 0.18 },
      { f: 440.0, b: 220.0, d: 0.22 },
      { f: 0, d: 0.14 },
      { f: 392.0, b: 196.0, d: 0.18 },
      { f: 523.25, b: 130.81, d: 0.18 },
      { f: 659.25, b: 164.81, d: 0.22 },
      { f: 783.99, b: 196.0, d: 0.32 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 349.23, d: 0.12, wave: 'triangle' },
      { f: 440.0, d: 0.12, wave: 'triangle' },
      { f: 523.25, d: 0.14, wave: 'square' },
      { f: 587.33, d: 0.14, wave: 'square' },
      { f: 659.25, d: 0.16, wave: 'triangle' },
      { f: 783.99, d: 0.35, wave: 'square' },
    ],
  },
  world3: {
    worldId: 'world3',
    moduleNumber: 3,
    label: 'Module 3 · Vanilla Dome (Wages & Contracting)',
    soundscape: 'underground',
    leadWave: 'triangle',
    bassWave: 'square',
    loopMs: 2900,
    gainScale: 0.088,
    bgmSteps: [
      { f: 261.63, b: 130.81, d: 0.14 },
      { f: 523.25, b: 261.63, d: 0.14 },
      { f: 220.0, b: 110.0, d: 0.14 },
      { f: 440.0, b: 220.0, d: 0.14 },
      { f: 233.08, b: 116.54, d: 0.14 },
      { f: 466.16, b: 233.08, d: 0.18 },
      { f: 0, d: 0.44 },
      { f: 174.61, b: 87.31, d: 0.14 },
      { f: 349.23, b: 174.61, d: 0.14 },
      { f: 146.83, b: 73.42, d: 0.14 },
      { f: 293.66, b: 146.83, d: 0.14 },
      { f: 155.56, b: 77.78, d: 0.14 },
      { f: 311.13, b: 155.56, d: 0.2 },
      { f: 0, d: 0.4 },
    ],
    entryCue: [
      { f: 293.66, d: 0.14, wave: 'triangle' },
      { f: 349.23, d: 0.14, wave: 'sine' },
      { f: 440.0, d: 0.14, wave: 'triangle' },
      { f: 523.25, d: 0.16, wave: 'sine' },
      { f: 587.33, d: 0.38, wave: 'triangle' },
    ],
  },
  world4: {
    worldId: 'world4',
    moduleNumber: 4,
    label: 'Module 4 · Forest of Illusion (Special Worker Groups)',
    soundscape: 'star_road',
    leadWave: 'sine',
    bassWave: 'triangle',
    loopMs: 3300,
    gainScale: 0.09,
    bgmSteps: [
      { f: 329.63, b: 164.81, d: 0.22 },
      { f: 415.3, b: 207.65, d: 0.22 },
      { f: 493.88, b: 246.94, d: 0.24 },
      { f: 659.25, b: 164.81, d: 0.28 },
      { f: 587.33, b: 146.83, d: 0.24 },
      { f: 493.88, b: 246.94, d: 0.24 },
      { f: 415.3, b: 207.65, d: 0.24 },
      { f: 493.88, b: 246.94, d: 0.32 },
      { f: 0, d: 0.26 },
    ],
    entryCue: [
      { f: 329.63, d: 0.12, wave: 'sine' },
      { f: 415.3, d: 0.12, wave: 'sine' },
      { f: 493.88, d: 0.14, wave: 'triangle' },
      { f: 659.25, d: 0.14, wave: 'sine' },
      { f: 783.99, d: 0.32, wave: 'sine' },
    ],
  },
  world5: {
    worldId: 'world5',
    moduleNumber: 5,
    label: "Module 5 · Bowser's Castle (Protective & Social Laws)",
    soundscape: 'castle',
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    loopMs: 2500,
    gainScale: 0.068,
    bgmSteps: [
      { f: 293.66, b: 73.42, d: 0.11 },
      { f: 277.18, d: 0.11 },
      { f: 293.66, d: 0.11 },
      { f: 311.13, d: 0.11 },
      { f: 293.66, b: 73.42, d: 0.11 },
      { f: 277.18, d: 0.11 },
      { f: 293.66, d: 0.11 },
      { f: 329.63, d: 0.14 },
      { f: 293.66, b: 69.3, d: 0.11 },
      { f: 277.18, d: 0.11 },
      { f: 293.66, d: 0.11 },
      { f: 349.23, d: 0.16 },
      { f: 311.13, b: 77.78, d: 0.22 },
      { f: 277.18, b: 69.3, d: 0.28 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 146.83, d: 0.14, wave: 'sawtooth' },
      { f: 174.61, d: 0.14, wave: 'sawtooth' },
      { f: 220.0, d: 0.16, wave: 'sawtooth' },
      { f: 293.66, d: 0.18, wave: 'sawtooth' },
      { f: 349.23, d: 0.36, wave: 'sawtooth' },
    ],
  },
  world6: {
    worldId: 'world6',
    moduleNumber: 6,
    label: "Module 6 · Peach's Royal Sanctuary (Statutory Leaves)",
    soundscape: 'star_road',
    leadWave: 'sine',
    bassWave: 'triangle',
    loopMs: 3500,
    gainScale: 0.095,
    bgmSteps: [
      { f: 523.25, b: 261.63, d: 0.26 },
      { f: 659.25, d: 0.26 },
      { f: 783.99, b: 329.63, d: 0.26 },
      { f: 987.77, d: 0.34 },
      { f: 880.0, b: 220.0, d: 0.26 },
      { f: 783.99, d: 0.26 },
      { f: 659.25, b: 196.0, d: 0.3 },
      { f: 587.33, b: 174.61, d: 0.3 },
      { f: 659.25, d: 0.26 },
      { f: 783.99, b: 196.0, d: 0.4 },
      { f: 0, d: 0.28 },
    ],
    entryCue: [
      { f: 392.0, d: 0.12, wave: 'sine' },
      { f: 493.88, d: 0.12, wave: 'sine' },
      { f: 587.33, d: 0.14, wave: 'triangle' },
      { f: 783.99, d: 0.16, wave: 'sine' },
      { f: 987.77, d: 0.36, wave: 'sine' },
    ],
  },
  holidays: {
    worldId: 'holidays',
    moduleNumber: 7,
    label: 'Holiday Pay Star Hub (Proclamation No. 727)',
    soundscape: 'star_road',
    leadWave: 'sine',
    bassWave: 'triangle',
    loopMs: 3400,
    gainScale: 0.09,
    bgmSteps: [
      { f: 587.33, b: 196.0, d: 0.24 },
      { f: 783.99, d: 0.24 },
      { f: 987.77, b: 246.94, d: 0.26 },
      { f: 1174.66, d: 0.32 },
      { f: 987.77, b: 220.0, d: 0.26 },
      { f: 783.99, d: 0.26 },
      { f: 659.25, b: 164.81, d: 0.32 },
      { f: 783.99, b: 196.0, d: 0.38 },
      { f: 0, d: 0.28 },
    ],
    entryCue: [
      { f: 523.25, d: 0.11, wave: 'sine' },
      { f: 659.25, d: 0.11, wave: 'sine' },
      { f: 783.99, d: 0.13, wave: 'triangle' },
      { f: 1046.5, d: 0.34, wave: 'sine' },
    ],
  },
  wages_matrix: {
    worldId: 'wages_matrix',
    moduleNumber: 8,
    label: '17 Regions Minimum Wage & Kasambahay Hub',
    soundscape: 'underground',
    leadWave: 'triangle',
    bassWave: 'sine',
    loopMs: 3200,
    gainScale: 0.085,
    bgmSteps: [
      { f: 440.0, b: 110.0, d: 0.22 },
      { f: 523.25, b: 130.81, d: 0.22 },
      { f: 659.25, b: 164.81, d: 0.24 },
      { f: 587.33, b: 146.83, d: 0.22 },
      { f: 523.25, b: 130.81, d: 0.24 },
      { f: 440.0, b: 110.0, d: 0.28 },
      { f: 392.0, b: 98.0, d: 0.24 },
      { f: 493.88, b: 123.47, d: 0.24 },
      { f: 440.0, b: 110.0, d: 0.34 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 329.63, d: 0.1, wave: 'triangle' },
      { f: 440.0, d: 0.1, wave: 'triangle' },
      { f: 523.25, d: 0.12, wave: 'triangle' },
      { f: 659.25, d: 0.28, wave: 'triangle' },
    ],
  },
  calculator: {
    worldId: 'calculator',
    moduleNumber: 9,
    label: 'Warp Zone Multiplier & Wage Calculator',
    soundscape: 'underground',
    leadWave: 'square',
    bassWave: 'triangle',
    loopMs: 3000,
    gainScale: 0.08,
    bgmSteps: [
      { f: 523.25, b: 130.81, d: 0.18 },
      { f: 659.25, b: 164.81, d: 0.18 },
      { f: 783.99, b: 196.0, d: 0.2 },
      { f: 659.25, b: 164.81, d: 0.18 },
      { f: 587.33, b: 146.83, d: 0.2 },
      { f: 698.46, b: 174.61, d: 0.2 },
      { f: 880.0, b: 220.0, d: 0.26 },
      { f: 783.99, b: 196.0, d: 0.28 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 392.0, d: 0.1, wave: 'square' },
      { f: 523.25, d: 0.1, wave: 'square' },
      { f: 659.25, d: 0.12, wave: 'square' },
      { f: 783.99, d: 0.26, wave: 'square' },
    ],
  },
  quiz: {
    worldId: 'quiz',
    moduleNumber: 10,
    label: "Bowser's Bar Quest & Boss Courtroom",
    soundscape: 'castle',
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    loopMs: 2800,
    gainScale: 0.074,
    bgmSteps: [
      { f: 220.0, b: 110.0, d: 0.16 },
      { f: 261.63, b: 130.81, d: 0.16 },
      { f: 329.63, b: 164.81, d: 0.18 },
      { f: 311.13, b: 155.56, d: 0.2 },
      { f: 293.66, b: 146.83, d: 0.18 },
      { f: 261.63, b: 130.81, d: 0.18 },
      { f: 246.94, b: 123.47, d: 0.22 },
      { f: 329.63, b: 82.41, d: 0.28 },
      { f: 220.0, b: 110.0, d: 0.3 },
      { f: 0, d: 0.18 },
    ],
    entryCue: [
      { f: 220.0, d: 0.12, wave: 'sawtooth' },
      { f: 261.63, d: 0.12, wave: 'sawtooth' },
      { f: 329.63, d: 0.14, wave: 'sawtooth' },
      { f: 440.0, d: 0.3, wave: 'sawtooth' },
    ],
  },
  vault: {
    worldId: 'vault',
    moduleNumber: 11,
    label: 'Super Mario Labor Arcade Vault',
    soundscape: 'overworld',
    leadWave: 'square',
    bassWave: 'triangle',
    loopMs: 2900,
    gainScale: 0.08,
    bgmSteps: [
      { f: 523.25, b: 130.81, d: 0.16 },
      { f: 659.25, b: 164.81, d: 0.16 },
      { f: 783.99, b: 196.0, d: 0.16 },
      { f: 1046.5, b: 261.63, d: 0.24 },
      { f: 880.0, b: 220.0, d: 0.18 },
      { f: 783.99, b: 196.0, d: 0.18 },
      { f: 659.25, b: 164.81, d: 0.2 },
      { f: 783.99, b: 196.0, d: 0.28 },
      { f: 0, d: 0.18 },
    ],
    entryCue: [
      { f: 523.25, d: 0.09, wave: 'square' },
      { f: 659.25, d: 0.09, wave: 'square' },
      { f: 783.99, d: 0.1, wave: 'square' },
      { f: 1046.5, d: 0.28, wave: 'square' },
    ],
  },
  shop: {
    worldId: 'shop',
    moduleNumber: 12,
    label: "Toad's Item & Audio Shop",
    soundscape: 'overworld',
    leadWave: 'triangle',
    bassWave: 'sine',
    loopMs: 3200,
    gainScale: 0.088,
    bgmSteps: [
      { f: 587.33, b: 146.83, d: 0.2 },
      { f: 659.25, b: 196.0, d: 0.18 },
      { f: 783.99, b: 196.0, d: 0.22 },
      { f: 659.25, b: 164.81, d: 0.2 },
      { f: 523.25, b: 130.81, d: 0.22 },
      { f: 587.33, b: 146.83, d: 0.22 },
      { f: 659.25, b: 196.0, d: 0.28 },
      { f: 523.25, b: 130.81, d: 0.32 },
      { f: 0, d: 0.2 },
    ],
    entryCue: [
      { f: 523.25, d: 0.1, wave: 'triangle' },
      { f: 659.25, d: 0.1, wave: 'triangle' },
      { f: 783.99, d: 0.12, wave: 'triangle' },
      { f: 987.77, d: 0.28, wave: 'triangle' },
    ],
  },
};

const SOUNDSCAPE_SEQUENCES: Record<
  MarioSoundscapeId,
  {
    leadWave: OscillatorType;
    bassWave: OscillatorType;
    loopMs: number;
    gainScale: number;
    steps: NoteStep[];
  }
> = {
  overworld: {
    leadWave: MODULE_AUDIO_PROFILES.world1.leadWave,
    bassWave: MODULE_AUDIO_PROFILES.world1.bassWave,
    loopMs: MODULE_AUDIO_PROFILES.world1.loopMs,
    gainScale: MODULE_AUDIO_PROFILES.world1.gainScale,
    steps: MODULE_AUDIO_PROFILES.world1.bgmSteps,
  },
  underground: {
    leadWave: MODULE_AUDIO_PROFILES.world3.leadWave,
    bassWave: MODULE_AUDIO_PROFILES.world3.bassWave,
    loopMs: MODULE_AUDIO_PROFILES.world3.loopMs,
    gainScale: MODULE_AUDIO_PROFILES.world3.gainScale,
    steps: MODULE_AUDIO_PROFILES.world3.bgmSteps,
  },
  castle: {
    leadWave: MODULE_AUDIO_PROFILES.world5.leadWave,
    bassWave: MODULE_AUDIO_PROFILES.world5.bassWave,
    loopMs: MODULE_AUDIO_PROFILES.world5.loopMs,
    gainScale: MODULE_AUDIO_PROFILES.world5.gainScale,
    steps: MODULE_AUDIO_PROFILES.world5.bgmSteps,
  },
  star_road: {
    leadWave: MODULE_AUDIO_PROFILES.world6.leadWave,
    bassWave: MODULE_AUDIO_PROFILES.world6.bassWave,
    loopMs: MODULE_AUDIO_PROFILES.world6.loopMs,
    gainScale: MODULE_AUDIO_PROFILES.world6.gainScale,
    steps: MODULE_AUDIO_PROFILES.world6.bgmSteps,
  },
};

export interface RestoreAudioResult {
  restoredPacks: SoundPackId[];
  newlyRecoveredCount: number;
  activePack: SoundPackId;
  modulesVerified: string[];
}

type AudioListener = (settings: AudioSettings) => void;

export class AudioController {
  private ctx: AudioContext | null = null;
  private bgmAudioEl: HTMLAudioElement | null = null;
  private activeLoopUri: string | null = null;
  private activeLoopSignature: string | null = null;
  private unlockListenerAttached: boolean = false;
  public settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private activeModuleOverride: string | null = null;
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    this.loadSettings();
    this.attachAutoplayUnlockListener();
  }

  private attachAutoplayUnlockListener() {
    if (this.unlockListenerAttached || typeof window === 'undefined') return;
    this.unlockListenerAttached = true;
    const tryUnlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.settings.enabled && this.settings.musicEnabled) {
        if (this.bgmAudioEl && this.bgmAudioEl.paused) {
          this.bgmAudioEl.play().catch(() => {});
        } else if (!this.isBgmPlaying) {
          this.startBgm();
        }
      }
    };
    window.addEventListener('pointerdown', tryUnlock, { passive: true });
    window.addEventListener('keydown', tryUnlock, { passive: true });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const snapshot = {
      ...this.settings,
      soundToggles: { ...this.settings.soundToggles },
    };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  public get enabled(): boolean {
    return this.settings.enabled;
  }

  public set enabled(val: boolean) {
    this.updateSettings({ enabled: val });
  }

  public get bgmPlaying(): boolean {
    return this.isBgmPlaying && this.settings.enabled && this.settings.musicEnabled;
  }

  public get activeModuleId(): string | null {
    return this.activeModuleOverride;
  }

  public getActiveLoopDataUri(): string | null {
    return this.activeLoopUri;
  }

  public getActiveTrackLabel(): string {
    if (this.activeModuleOverride && MODULE_AUDIO_PROFILES[this.activeModuleOverride]) {
      return MODULE_AUDIO_PROFILES[this.activeModuleOverride].label;
    }
    const pack = SOUND_PACK_DEFINITIONS.find((p) => p.id === this.settings.soundPack);
    return pack ? `${pack.name} (${this.settings.soundscape})` : 'Mushroom Kingdom Overworld';
  }

  /**
   * Verifies that Modules 1–6 (especially Modules 2–5 and 6) plus Holidays
   * all have valid BGM and interactive SFX sequences mapped.
   */
  public verifyModuleAudioMappings(): { valid: boolean; modules: string[] } {
    const requiredModules = ['world1', 'world2', 'world3', 'world4', 'world5', 'world6', 'holidays'];
    const verified = requiredModules.filter((id) => {
      const profile = MODULE_AUDIO_PROFILES[id];
      return Boolean(
        profile &&
          profile.bgmSteps.length >= 8 &&
          profile.entryCue.length >= 4 &&
          profile.loopMs >= 2000
      );
    });
    return {
      valid: verified.length === requiredModules.length,
      modules: verified,
    };
  }

  public getModuleAudioProfile(worldId: string): ModuleAudioProfile {
    return MODULE_AUDIO_PROFILES[worldId] || MODULE_AUDIO_PROFILES.world1;
  }

  /**
   * Synchronizes the centralized AudioController when navigating across Modules 1–6,
   * Holidays, Wage Matrix, Calculator, Boss Quest, Game Vault, or Toad's Shop.
   * Updates the persistent BGM loop track and optionally plays the signature entry chime.
   */
  public syncModuleAudio(worldId: string, playEntryCue: boolean = true) {
    const profile = MODULE_AUDIO_PROFILES[worldId];
    if (profile) {
      const prevModule = this.activeModuleOverride;
      this.activeModuleOverride = worldId;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(ACTIVE_AUDIO_MODULE_KEY, worldId);
        } catch {
          // ignore
        }
      }
      if (this.settings.soundscape !== profile.soundscape) {
        this.settings = { ...this.settings, soundscape: profile.soundscape };
        this.saveSettings();
      }
      if (
        this.settings.enabled &&
        this.settings.musicEnabled &&
        (prevModule !== worldId || !this.isBgmPlaying)
      ) {
        this.startBgm();
      }
      this.notifyListeners();
    } else {
      this.activeModuleOverride = null;
    }

    if (playEntryCue) {
      this.playWorldTheme(worldId);
    }
  }

  public loadSettings() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_audio_settings');
        const legacyPack = localStorage.getItem('mario_active_soundpack');
        const savedModule = localStorage.getItem(ACTIVE_AUDIO_MODULE_KEY);
        if (savedModule && MODULE_AUDIO_PROFILES[savedModule]) {
          this.activeModuleOverride = savedModule;
        }
        if (saved) {
          const parsed = JSON.parse(saved);
          this.settings = {
            ...DEFAULT_AUDIO_SETTINGS,
            ...parsed,
            soundscape: parsed.soundscape || 'overworld',
            soundPack: (parsed.soundPack || legacyPack || 'sound_default') as SoundPackId,
            soundToggles: {
              ...DEFAULT_AUDIO_SETTINGS.soundToggles,
              ...(parsed.soundToggles || {}),
            },
          };
        } else if (legacyPack) {
          this.settings.soundPack = legacyPack as SoundPackId;
        }
      } catch {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS };
      }
    }
  }

  public saveSettings() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mario_audio_settings', JSON.stringify(this.settings));
        if (this.settings.soundPack) {
          localStorage.setItem('mario_active_soundpack', this.settings.soundPack);
        }
      } catch {
        // storage fallback
      }
    }
  }

  private syncPersistentElementVolume() {
    if (!this.bgmAudioEl) return;
    const rawVol = Math.max(0, Math.min(1, this.settings.musicVolume ?? 0.42));
    this.bgmAudioEl.volume = Math.min(1, rawVol * 0.72);
    this.bgmAudioEl.muted = !this.settings.enabled || !this.settings.musicEnabled;
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    const prevMusic = this.settings.musicEnabled;
    const prevEnabled = this.settings.enabled;
    const prevSoundscape = this.settings.soundscape;
    const prevSoundPack = this.settings.soundPack;

    if (partial.soundscape && partial.soundscape !== prevSoundscape) {
      this.activeModuleOverride = null;
    }

    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
    this.syncPersistentElementVolume();

    if (!this.settings.enabled || !this.settings.musicEnabled) {
      this.stopBgm();
    } else if (
      this.settings.enabled &&
      this.settings.musicEnabled &&
      (!prevMusic ||
        !prevEnabled ||
        prevSoundscape !== this.settings.soundscape ||
        prevSoundPack !== this.settings.soundPack ||
        !this.isBgmPlaying)
    ) {
      this.startBgm();
    }

    this.notifyListeners();
  }

  public getActivePackProfile(): SoundPackSynthProfile {
    const id = this.settings.soundPack || 'sound_default';
    return SOUND_PACK_SYNTH_PROFILES[id] || SOUND_PACK_SYNTH_PROFILES.sound_default;
  }

  public isMusicPlaying(): boolean {
    return Boolean(this.isBgmPlaying && this.settings.enabled && this.settings.musicEnabled);
  }

  /**
   * Records a purchased SoundPackId in the persistent audio purchase ledger
   * so it can always be recovered even if session unlocked items are reset.
   */
  public recordAudioPackPurchase(packId: SoundPackId) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(AUDIO_PURCHASE_LEDGER_KEY);
      const ledger: SoundPackId[] = raw ? JSON.parse(raw) : ['sound_default'];
      const next = Array.from(new Set<SoundPackId>(['sound_default', ...ledger, packId]));
      localStorage.setItem(AUDIO_PURCHASE_LEDGER_KEY, JSON.stringify(next));
    } catch {
      // storage fallback
    }
  }

  // Set & Equip Audio Pack from Store or Audio Settings — activates full continuous BGM + app-wide SFX when interactive!
  public setSoundPack(packId: SoundPackId, playDemo: boolean = true) {
    this.recordAudioPackPurchase(packId);
    if (playDemo) {
      this.updateSettings({
        enabled: true,
        musicEnabled: true,
        soundPack: packId,
      });
      if (this.settings.sfxEnabled !== false) {
        this.previewSoundPack(packId);
      }
    } else {
      this.updateSettings({ soundPack: packId });
    }
  }

  // Play or pause continuous full-track BGM for a specific SoundPack directly from Toad's Shop
  public toggleSoundPackFullTrack(packId: SoundPackId): boolean {
    this.recordAudioPackPurchase(packId);
    const isSamePackPlaying =
      this.settings.soundPack === packId &&
      this.settings.enabled &&
      this.settings.musicEnabled &&
      this.isBgmPlaying;

    if (isSamePackPlaying) {
      this.updateSettings({ musicEnabled: false });
      return false;
    }

    this.updateSettings({
      enabled: true,
      musicEnabled: true,
      soundPack: packId,
    });
    return true;
  }

  // Interactive sample/preview for any audio pack
  public previewSoundPack(packId: SoundPackId) {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.32);
      if (!master) return;

      switch (packId) {
        case 'sound_zen_lofi': {
          const notes = [587.33, 783.99, 987.77, 1174.66];
          notes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.09);
            gain.gain.setValueAtTime(0.01, now + i * 0.09);
            gain.gain.linearRampToValueAtTime(0.75, now + i * 0.09 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.45);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.09);
            osc.stop(now + i * 0.09 + 0.45);
          });
          break;
        }
        case 'sound_snes_16bit': {
          const chordNotes = [
            { f: 523.25, d: 0.1 },
            { f: 659.25, d: 0.1 },
            { f: 783.99, d: 0.1 },
            { f: 1046.5, d: 0.32 },
          ];
          let offset = 0;
          chordNotes.forEach((step) => {
            const osc1 = this.ctx!.createOscillator();
            const osc2 = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc1.type = 'triangle';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(step.f, now + offset);
            osc2.frequency.setValueAtTime(step.f * 1.004, now + offset);
            gain.gain.setValueAtTime(0.85, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + step.d);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(master);
            osc1.start(now + offset);
            osc2.start(now + offset);
            osc1.stop(now + offset + step.d);
            osc2.stop(now + offset + step.d);
            offset += step.d * 0.88;
          });
          break;
        }
        case 'sound_galaxy_synth': {
          const galaxyNotes = [659.25, 880.0, 1174.66, 1318.51, 1760.0];
          galaxyNotes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.065);
            gain.gain.setValueAtTime(0.7, now + i * 0.065);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.38);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.065);
            osc.stop(now + i * 0.065 + 0.38);
          });
          break;
        }
        case 'sound_bowser_metal': {
          const riffNotes = [146.83, 220.0, 293.66, 440.0];
          riffNotes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const sub = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sawtooth';
            sub.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            sub.frequency.setValueAtTime(f / 2, now + i * 0.06);
            gain.gain.setValueAtTime(0.8, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);
            osc.connect(gain);
            sub.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.06);
            sub.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.28);
            sub.stop(now + i * 0.06 + 0.28);
          });
          break;
        }
        case 'sound_nes_8bit': {
          const nesNotes = [261.63, 329.63, 392.0, 523.25, 659.25];
          nesNotes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            gain.gain.setValueAtTime(0.8, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.16);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.16);
          });
          break;
        }
        case 'sound_default':
        default: {
          this.playPowerUp();
          break;
        }
      }
    } catch {
      // fallback
    }
  }

  // Toggle background music directly from Navbar (Pause / Resume)
  public toggleBgm(): boolean {
    const nextMusic = !(this.settings.enabled && this.settings.musicEnabled);
    if (nextMusic && !this.settings.enabled) {
      this.updateSettings({ enabled: true, musicEnabled: true });
    } else {
      this.updateSettings({ musicEnabled: nextMusic });
    }
    return nextMusic;
  }

  // Switch active Mario ambient soundscape
  public setSoundscape(soundscape: MarioSoundscapeId, autoStartMusic: boolean = true) {
    this.activeModuleOverride = null;
    if (autoStartMusic) {
      this.updateSettings({
        enabled: true,
        musicEnabled: true,
        soundscape,
      });
    } else {
      this.updateSettings({ soundscape });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getMasterGain(now: number, baseLevel: number = 0.2) {
    if (!this.ctx || !this.settings.enabled || this.settings.sfxEnabled === false) return null;
    const gain = this.ctx.createGain();
    const effectiveVol = Math.max(0.01, (this.settings.volume ?? 0.8) * baseLevel);
    gain.gain.setValueAtTime(effectiveVol, now);
    gain.connect(this.ctx.destination);
    return gain;
  }

  // Persistent Multi-Bar Loop Engine (Bundled 16-bit PCM WAV <audio loop> + WebAudio Fallback)
  public startBgm() {
    if (!this.settings.enabled || !this.settings.musicEnabled) return;

    const packProfile = this.getActivePackProfile();
    const resolvedTrackKey =
      this.activeModuleOverride && MODULE_AUDIO_PROFILES[this.activeModuleOverride]
        ? this.activeModuleOverride
        : SOUNDSCAPE_SEQUENCES[this.settings.soundscape]
        ? this.settings.soundscape
        : 'overworld';

    const signature = `${resolvedTrackKey}::${packProfile.id}`;
    const wavUri = synthesizeLoopWavDataUri(resolvedTrackKey, packProfile.id);
    this.activeLoopUri = wavUri;

    // Prefer native persistent <audio loop> element backed by bundled PCM WAV data URI
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      if (this.bgmInterval !== null) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      try {
        if (!this.bgmAudioEl) {
          this.bgmAudioEl = new Audio();
          this.bgmAudioEl.loop = true;
          this.bgmAudioEl.preload = 'auto';
        }
        if (this.activeLoopSignature !== signature || this.bgmAudioEl.src !== wavUri) {
          this.bgmAudioEl.pause();
          this.bgmAudioEl.src = wavUri;
          this.bgmAudioEl.loop = true;
          this.activeLoopSignature = signature;
        }
        this.syncPersistentElementVolume();
        this.isBgmPlaying = true;
        const playPromise = this.bgmAudioEl.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Autoplay blocked until first pointerdown/keydown; attachAutoplayUnlockListener resumes automatically
          });
        }
        return;
      } catch {
        // Fall through to WebAudio scheduler if HTMLAudioElement fails
      }
    }

    this.stopBgm();
    this.activeLoopUri = wavUri;
    this.activeLoopSignature = signature;
    this.isBgmPlaying = true;
    this.initCtx();
    if (!this.ctx) return;

    const isCustomPack = packProfile.id !== 'sound_default';
    const moduleProfile =
      this.activeModuleOverride && MODULE_AUDIO_PROFILES[this.activeModuleOverride]
        ? MODULE_AUDIO_PROFILES[this.activeModuleOverride]
        : null;

    const trackKey: MarioSoundscapeId = SOUNDSCAPE_SEQUENCES[this.settings.soundscape]
      ? this.settings.soundscape
      : 'overworld';

    const useSignatureArrangement =
      isCustomPack && !moduleProfile && trackKey === 'overworld';

    const baseSeq = moduleProfile
      ? {
          leadWave: isCustomPack ? packProfile.leadWave : moduleProfile.leadWave,
          bassWave: isCustomPack ? packProfile.bassWave : moduleProfile.bassWave,
          loopMs: Math.round(moduleProfile.loopMs * packProfile.tempoScale),
          gainScale: moduleProfile.gainScale,
          steps: moduleProfile.bgmSteps,
        }
      : useSignatureArrangement
      ? {
          leadWave: packProfile.leadWave,
          bassWave: packProfile.bassWave,
          loopMs: packProfile.signatureLoopMs,
          gainScale: packProfile.id === 'sound_zen_lofi' ? 0.24 : 0.2,
          steps: packProfile.signatureSteps,
        }
      : {
          leadWave: isCustomPack ? packProfile.leadWave : SOUNDSCAPE_SEQUENCES[trackKey].leadWave,
          bassWave: isCustomPack ? packProfile.bassWave : SOUNDSCAPE_SEQUENCES[trackKey].bassWave,
          loopMs: Math.round(SOUNDSCAPE_SEQUENCES[trackKey].loopMs * packProfile.tempoScale),
          gainScale: SOUNDSCAPE_SEQUENCES[trackKey].gainScale,
          steps: SOUNDSCAPE_SEQUENCES[trackKey].steps,
        };

    const pitchScale = useSignatureArrangement ? 1.0 : packProfile.pitchMultiplier;
    const stepTempo = useSignatureArrangement ? 1.0 : packProfile.tempoScale;

    const playLoop = () => {
      if (
        !this.isBgmPlaying ||
        !this.ctx ||
        !this.settings.enabled ||
        !this.settings.musicEnabled
      ) {
        this.stopBgm();
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const bgmGain = this.ctx.createGain();
        const vol = Math.max(0.004, (this.settings.musicVolume ?? 0.42) * baseSeq.gainScale);
        bgmGain.gain.setValueAtTime(vol, now);

        let destinationNode: AudioNode = bgmGain;
        if (packProfile.lowpassHz && typeof this.ctx.createBiquadFilter === 'function') {
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(packProfile.lowpassHz, now);
          filter.connect(bgmGain);
          destinationNode = filter;
        }
        bgmGain.connect(this.ctx.destination);

        let timeOffset = 0;
        baseSeq.steps.forEach((step) => {
          const dur = Math.max(0.08, step.d * stepTempo);
          const releaseDur = Math.max(0.09, dur * packProfile.releaseScale);
          if (step.f > 0) {
            const leadFreq = step.f * pitchScale;
            const osc = this.ctx!.createOscillator();
            const noteGain = this.ctx!.createGain();
            osc.type = baseSeq.leadWave;
            osc.frequency.setValueAtTime(leadFreq, now + timeOffset);
            noteGain.gain.setValueAtTime(0.008, now + timeOffset);
            noteGain.gain.linearRampToValueAtTime(
              0.92,
              now + timeOffset + Math.min(packProfile.attackSec, dur * 0.35)
            );
            noteGain.gain.exponentialRampToValueAtTime(0.008, now + timeOffset + releaseDur);
            osc.connect(noteGain);
            noteGain.connect(destinationNode);
            osc.start(now + timeOffset);
            osc.stop(now + timeOffset + releaseDur);

            if (packProfile.harmonicRatio && packProfile.harmonicGain > 0) {
              const harmOsc = this.ctx!.createOscillator();
              const harmGain = this.ctx!.createGain();
              harmOsc.type = packProfile.harmonicWave;
              harmOsc.frequency.setValueAtTime(
                leadFreq * packProfile.harmonicRatio,
                now + timeOffset
              );
              harmGain.gain.setValueAtTime(packProfile.harmonicGain, now + timeOffset);
              harmGain.gain.exponentialRampToValueAtTime(0.005, now + timeOffset + releaseDur);
              harmOsc.connect(harmGain);
              harmGain.connect(destinationNode);
              harmOsc.start(now + timeOffset);
              harmOsc.stop(now + timeOffset + releaseDur);
            }
          }
          if (step.b && step.b > 0) {
            const bassOsc = this.ctx!.createOscillator();
            const bassGain = this.ctx!.createGain();
            bassOsc.type = baseSeq.bassWave;
            bassOsc.frequency.setValueAtTime(step.b * pitchScale, now + timeOffset);
            bassGain.gain.setValueAtTime(0.55, now + timeOffset);
            bassGain.gain.exponentialRampToValueAtTime(0.008, now + timeOffset + dur * 1.12);
            bassOsc.connect(bassGain);
            bassGain.connect(destinationNode);
            bassOsc.start(now + timeOffset);
            bassOsc.stop(now + timeOffset + dur * 1.12);
          }
          timeOffset += dur;
        });
      } catch {
        // audio policy fallback
      }
    };

    playLoop();
    if (typeof window !== 'undefined') {
      this.bgmInterval = window.setInterval(playLoop, baseSeq.loopMs);
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmAudioEl) {
      try {
        this.bgmAudioEl.pause();
      } catch {
        // ignore
      }
    }
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Classic Mario Coin sound shaped by active Audio Pack timbre
  playCoin() {
    if (
      !this.settings.enabled ||
      this.settings.sfxEnabled === false ||
      this.settings.soundToggles?.coin === false
    )
      return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const pack = this.settings.soundPack || 'sound_default';

      if (pack === 'sound_zen_lofi') {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1);
        noteGain.gain.setValueAtTime(0.01, now);
        noteGain.gain.linearRampToValueAtTime(0.75, now + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now);
        osc.stop(now + 0.5);
        return;
      }

      if (pack === 'sound_snes_16bit') {
        [987.77, 1318.51, 1975.53].forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();
          osc.type = idx === 2 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.035);
          noteGain.gain.setValueAtTime(0.65, now + idx * 0.035);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.42);
          osc.connect(noteGain);
          noteGain.connect(master);
          osc.start(now + idx * 0.035);
          osc.stop(now + idx * 0.035 + 0.42);
        });
        return;
      }

      if (pack === 'sound_galaxy_synth') {
        [987.77, 1318.51, 1567.98, 2093.0].forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.03);
          noteGain.gain.setValueAtTime(0.55, now + idx * 0.03);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.45);
          osc.connect(noteGain);
          noteGain.connect(master);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.45);
        });
        return;
      }

      if (pack === 'sound_bowser_metal') {
        const osc = this.ctx.createOscillator();
        const sub = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        sub.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.07);
        sub.frequency.setValueAtTime(493.88, now);
        sub.frequency.setValueAtTime(659.25, now + 0.07);
        noteGain.gain.setValueAtTime(0.8, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(noteGain);
        sub.connect(noteGain);
        noteGain.connect(master);
        osc.start(now);
        sub.start(now);
        osc.stop(now + 0.38);
        sub.stop(now + 0.38);
        return;
      }

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = pack === 'sound_nes_8bit' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + (pack === 'sound_nes_8bit' ? 0.32 : 0.42)
      );
      osc.connect(noteGain);
      noteGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio fallback
    }
  }

  // Mario Jump sound shaped by active Audio Pack timbre
  playJump() {
    if (!this.settings.enabled || this.settings.soundToggles?.jump === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.2);
      if (!master) return;

      const profile = this.getActivePackProfile();
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = profile.sfxWave;
      osc.frequency.setValueAtTime(150 * profile.pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(600 * profile.pitchMultiplier, now + 0.16);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 * profile.releaseScale);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.18 * profile.releaseScale);
    } catch {
      // Audio policy fallback
    }
  }

  // Kart Drift Spark Charge Cue (Blue / Orange / Purple)
  playDriftSpark(tier: 'blue' | 'orange' | 'purple') {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.22);
      if (!master) return;

      const baseFreq = tier === 'purple' ? 880 : tier === 'orange' ? 659.25 : 523.25;
      [baseFreq, baseFreq * 1.25].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.85, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.11);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.11);
      });
    } catch {
      // fallback
    }
  }

  // Kart Mini-Turbo Drift Release Boost Cue
  playDriftBoost(tier: 'blue' | 'orange' | 'purple') {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.28);
      if (!master) return;

      const notes =
        tier === 'purple'
          ? [523.25, 659.25, 783.99, 1046.5, 1318.51]
          : tier === 'orange'
          ? [440, 554.37, 659.25, 880]
          : [392, 523.25, 659.25];

      notes.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.035);
        gain.gain.setValueAtTime(0.75, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.18);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.18);
      });
    } catch {
      // fallback
    }
  }

  // Super Star 2x Coin Power-Up Activation Fanfare
  playSuperStarActivate() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    this.playStarTheme();
  }

  // Shortcut Map Toggle Radar Chime
  playShortcutPing() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.24);
      if (!master) return;

      [659.25, 987.77, 1318.51].forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.85, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.22);
      });
    } catch {
      // fallback
    }
  }

  // Pipe transition sound shaped by active Audio Pack timbre
  playPipe() {
    if (!this.settings.enabled || this.settings.soundToggles?.pipe === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const profile = this.getActivePackProfile();
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = profile.bassWave;
      osc.frequency.setValueAtTime(300 * profile.pitchMultiplier, now);
      osc.frequency.setValueAtTime(180 * profile.pitchMultiplier, now + 0.1);
      osc.frequency.setValueAtTime(120 * profile.pitchMultiplier, now + 0.2);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35 * profile.releaseScale);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.35 * profile.releaseScale);
    } catch {
      // fallback
    }
  }

  // Goomba / Enemy Stomp sound: low thud
  playStomp() {
    if (!this.settings.enabled || this.settings.soundToggles?.stomp === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // fallback
    }
  }

  // Wrong Quiz Answer / Damage Miss Sound: descending Mario shrink/miss cue
  playWrongAnswer() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.26);
      if (!master) return;

      const notes = [493.88, 369.99, 293.66, 196.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);
        noteGain.gain.setValueAtTime(0.9, now + idx * 0.065);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.075);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.065);
        osc.stop(now + (idx + 1) * 0.075);
      });
    } catch {
      // fallback
    }
  }

  // Classic Mario Game Over / Quiz Defeat Jingle
  playGameOver() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const seq = [
        { f: 523.25, d: 0.16 },
        { f: 392.0, d: 0.16 },
        { f: 329.63, d: 0.2 },
        { f: 440.0, d: 0.14 },
        { f: 493.88, d: 0.14 },
        { f: 440.0, d: 0.14 },
        { f: 415.3, d: 0.18 },
        { f: 466.16, d: 0.18 },
        { f: 415.3, d: 0.18 },
        { f: 392.0, d: 0.35 },
      ];

      let elapsed = 0;
      seq.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);
        elapsed += step.d * 0.92;
      });
    } catch {
      // fallback
    }
  }

  // Grand World Level-Up Celebration Fanfare
  playLevelUp() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.28);
      if (!master) return;

      const seq = [
        { f: 523.25, d: 0.09 },
        { f: 659.25, d: 0.09 },
        { f: 783.99, d: 0.09 },
        { f: 1046.5, d: 0.16 },
        { f: 783.99, d: 0.1 },
        { f: 1046.5, d: 0.12 },
        { f: 1318.51, d: 0.14 },
        { f: 1567.98, d: 0.38 },
      ];

      let elapsed = 0;
      seq.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + n.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);
        elapsed += n.d * 0.94;
      });
    } catch {
      // fallback
    }
  }

  // Pomodoro 25-Minute Study Interval Completion Alert: Mario Course Clear + 1-UP Bell
  playPomodoroFocusComplete() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const melody = [
        { f: 392.0, b: 196.0, d: 0.1 },
        { f: 523.25, b: 261.63, d: 0.1 },
        { f: 659.25, b: 329.63, d: 0.1 },
        { f: 783.99, b: 392.0, d: 0.16 },
        { f: 659.25, b: 329.63, d: 0.1 },
        { f: 783.99, b: 392.0, d: 0.14 },
        { f: 1046.5, b: 523.25, d: 0.24 },
        { f: 1318.51, b: 659.25, d: 0.34 },
      ];

      let elapsed = 0;
      melody.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(0.95, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);

        if (step.b) {
          const bass = this.ctx!.createOscillator();
          const bassGain = this.ctx!.createGain();
          bass.type = 'triangle';
          bass.frequency.setValueAtTime(step.b, now + elapsed);
          bassGain.gain.setValueAtTime(0.65, now + elapsed);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
          bass.connect(bassGain);
          bassGain.connect(master);
          bass.start(now + elapsed);
          bass.stop(now + elapsed + step.d);
        }

        elapsed += step.d * 0.94;
      });
    } catch {
      // fallback
    }
  }

  // Pomodoro 5-Minute Break Completion Alert
  playPomodoroBreakComplete() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.28);
      if (!master) return;

      const seq = [
        { f: 329.63, d: 0.08 },
        { f: 392.0, d: 0.08 },
        { f: 659.25, d: 0.08 },
        { f: 523.25, d: 0.08 },
        { f: 587.33, d: 0.08 },
        { f: 783.99, d: 0.14 },
        { f: 987.77, d: 0.09 },
        { f: 1318.51, d: 0.32 },
      ];

      let elapsed = 0;
      seq.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);
        elapsed += step.d * 0.92;
      });
    } catch {
      // fallback
    }
  }

  // Achievement Badge Unlocked Fanfare: Star Sparkle Arpeggio
  playAchievementUnlock() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.27);
      if (!master) return;

      const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);
        noteGain.gain.setValueAtTime(1, now + idx * 0.065);
        noteGain.gain.exponentialRampToValueAtTime(
          0.01,
          now + idx * 0.065 + (idx === notes.length - 1 ? 0.38 : 0.12)
        );
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + (idx === notes.length - 1 ? 0.38 : 0.12));
      });
    } catch {
      // fallback
    }
  }

  // Mystery [?] Block Bump Sound
  playQuestionBlock() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.35);
      if (!master) return;

      const bump = this.ctx.createOscillator();
      const bumpGain = this.ctx.createGain();
      bump.type = 'triangle';
      bump.frequency.setValueAtTime(140, now);
      bump.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      bumpGain.gain.setValueAtTime(1, now);
      bumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      bump.connect(bumpGain);
      bumpGain.connect(master);
      bump.start(now);
      bump.stop(now + 0.09);

      const ding = this.ctx.createOscillator();
      const dingGain = this.ctx.createGain();
      ding.type = 'sine';
      ding.frequency.setValueAtTime(987.77, now + 0.04);
      ding.frequency.setValueAtTime(1318.51, now + 0.1);
      dingGain.gain.setValueAtTime(0.8, now + 0.04);
      dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      ding.connect(dingGain);
      dingGain.connect(master);
      ding.start(now + 0.04);
      ding.stop(now + 0.32);
    } catch {
      // fallback
    }
  }

  // Fireball shoot sound
  playFireball() {
    if (!this.settings.enabled || this.settings.soundToggles?.fireball === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // fallback
    }
  }

  // Power Up sound shaped by active Audio Pack timbre
  playPowerUp() {
    if (!this.settings.enabled || this.settings.soundToggles?.powerup === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.2);
      if (!master) return;

      const profile = this.getActivePackProfile();
      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = profile.leadWave;
        osc.frequency.setValueAtTime(freq * profile.pitchMultiplier, now + idx * 0.05);
        noteGain.gain.setValueAtTime(1, now + idx * 0.05);
        noteGain.gain.exponentialRampToValueAtTime(
          0.01,
          now + (idx + 1) * 0.05 * profile.releaseScale
        );
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.05);
        osc.stop(now + (idx + 1) * 0.05 * profile.releaseScale);
      });
    } catch {
      // fallback
    }
  }

  // 1-UP Fanfare
  playOneUp() {
    if (!this.settings.enabled || this.settings.soundToggles?.fanfare === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.22);
      if (!master) return;

      const notes = [659.25, 783.99, 1318.51, 1046.5, 1174.66, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        noteGain.gain.setValueAtTime(1, now + idx * 0.07);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.07);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.07);
        osc.stop(now + (idx + 1) * 0.07);
      });
    } catch {
      // fallback
    }
  }

  // Level Clear / Castle Fanfare
  playFanfare() {
    if (!this.settings.enabled || this.settings.soundToggles?.fanfare === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const fanfare = [
        { f: 392.0, d: 0.1 },
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.15 },
        { f: 1318.51, d: 0.18 },
        { f: 1567.98, d: 0.35 },
      ];

      let elapsed = 0;
      fanfare.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + n.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);
        elapsed += n.d * 0.95;
      });
    } catch {
      // fallback
    }
  }

  // Invincible Star Theme melody snippet
  playStarTheme() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.22);
      if (!master) return;

      const starNotes = [659, 659, 659, 523, 659, 784, 392];
      starNotes.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        noteGain.gain.setValueAtTime(1, now + idx * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.08);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.08);
        osc.stop(now + (idx + 1) * 0.08);
      });
    } catch {
      // fallback
    }
  }

  // Bowser Roar / Boss Hit sound
  playBowserHit() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.35);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // fallback
    }
  }

  playTabSwitch() {
    switch (this.settings.tabSfx) {
      case 'jump':
        this.playJump();
        break;
      case 'coin':
        this.playCoin();
        break;
      case 'stomp':
        this.playStomp();
        break;
      case 'pipe':
      default:
        this.playPipe();
        break;
    }
  }

  playCardAction() {
    switch (this.settings.cardSfx) {
      case 'powerup':
        this.playPowerUp();
        break;
      case 'fireball':
        this.playFireball();
        break;
      case 'oneup':
        this.playOneUp();
        break;
      case 'coin':
      default:
        this.playCoin();
        break;
    }
  }

  playCardOpen() {
    this.playCardAction();
  }

  playClick() {
    this.playQuestionBlock();
  }

  playQuizComplete() {
    switch (this.settings.quizSfx) {
      case 'star':
        this.playStarTheme();
        break;
      case 'oneup':
        this.playOneUp();
        break;
      case 'fanfare':
      default:
        this.playFanfare();
        break;
    }
  }

  /**
   * Restores missing or previously purchased Audio Packs and re-verifies
   * Module 1–6 (especially Modules 2–5 and 6) audio profiles.
   */
  public restoreAudioPacks(): RestoreAudioResult {
    const allPacks: SoundPackId[] = SOUND_PACK_DEFINITIONS.map((p) => p.id);
    let newlyRecoveredCount = 0;
    let activePack: SoundPackId = 'sound_default';

    if (typeof window !== 'undefined') {
      try {
        let existingUnlocked: string[] = [];
        const rawUnlocked = localStorage.getItem('mario_unlocked_items');
        if (rawUnlocked) {
          existingUnlocked = JSON.parse(rawUnlocked);
        }

        let ledgerPacks: SoundPackId[] = [];
        const rawLedger = localStorage.getItem(AUDIO_PURCHASE_LEDGER_KEY);
        if (rawLedger) {
          ledgerPacks = JSON.parse(rawLedger);
        }

        const savedActive = localStorage.getItem('mario_active_soundpack') as SoundPackId | null;

        // Recover any packs recorded in the ledger, previously active, or missing from the audio bundle
        const packsToRestore = Array.from(
          new Set<SoundPackId>([
            ...allPacks,
            ...ledgerPacks.filter((p) => allPacks.includes(p)),
            ...(savedActive && allPacks.includes(savedActive) ? [savedActive] : []),
          ])
        );

        newlyRecoveredCount = packsToRestore.filter(
          (packId) => !existingUnlocked.includes(packId)
        ).length;

        const mergedUnlocked = Array.from(new Set([...existingUnlocked, ...packsToRestore]));
        localStorage.setItem('mario_unlocked_items', JSON.stringify(mergedUnlocked));
        localStorage.setItem(AUDIO_PURCHASE_LEDGER_KEY, JSON.stringify(packsToRestore));

        // Ensure audio engine is enabled and SFX ready after recovery
        activePack =
          savedActive && allPacks.includes(savedActive)
            ? savedActive
            : this.settings.soundPack && allPacks.includes(this.settings.soundPack)
            ? this.settings.soundPack
            : 'sound_default';

        this.updateSettings({
          enabled: true,
          sfxEnabled: true,
          soundPack: activePack,
        });
      } catch {
        activePack = 'sound_default';
      }
    }

    const verification = this.verifyModuleAudioMappings();
    this.playPowerUp();

    return {
      restoredPacks: allPacks,
      newlyRecoveredCount,
      activePack,
      modulesVerified: verification.modules,
    };
  }

  // Backward-compatible helper returning SoundPackId[]
  public restorePurchases(): SoundPackId[] {
    return this.restoreAudioPacks().restoredPacks;
  }

  // World-specific Ambient Theme Jingles (Modules 1 to 6 & Holidays)
  public playWorldTheme(worldId: string) {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.26);
      if (!master) return;

      const profile = MODULE_AUDIO_PROFILES[worldId] || MODULE_AUDIO_PROFILES.world1;
      const notes = profile.entryCue;

      let elapsed = 0;
      notes.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = step.wave || 'triangle';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(0.85, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);
        elapsed += step.d * 0.92;
      });
    } catch {
      // audio fallback
    }
  }
}

export const audioController = new AudioController();
export const marioAudio = audioController;

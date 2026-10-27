import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  marioAudio,
  SOUND_PACK_DEFINITIONS,
  DEFAULT_AUDIO_SETTINGS,
} from './audio';
import { SOUNDPACK_ITEMS } from '../components/ToadShop';
import { SoundPackId } from '../types/laborLaw';

// Mock localStorage for headless test runner
class MockStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

test('SOUND_PACK_DEFINITIONS contains all 6 distinct audio packs', () => {
  assert.equal(SOUND_PACK_DEFINITIONS.length, 6);
  const expectedPacks: SoundPackId[] = [
    'sound_default',
    'sound_nes_8bit',
    'sound_snes_16bit',
    'sound_zen_lofi',
    'sound_galaxy_synth',
    'sound_bowser_metal',
  ];

  expectedPacks.forEach((expectedId) => {
    const found = SOUND_PACK_DEFINITIONS.find((p) => p.id === expectedId);
    assert.ok(found, `Expected definition for ${expectedId}`);
    assert.ok(found.name.length > 0, `${expectedId} should have a non-empty name`);
    assert.ok(found.badge.length > 0, `${expectedId} should have a non-empty badge`);
    assert.ok(found.description.length > 0, `${expectedId} should have a description`);
  });
});

test('SOUNDPACK_ITEMS in ToadShop matches SoundPackId catalogue', () => {
  assert.equal(SOUNDPACK_ITEMS.length, 6);
  SOUNDPACK_ITEMS.forEach((item) => {
    assert.equal(item.category, 'soundpack');
    assert.ok(item.soundPackId, `Item ${item.id} must define soundPackId`);
    const foundDef = SOUND_PACK_DEFINITIONS.find((def) => def.id === item.soundPackId);
    assert.ok(foundDef, `Found definition for shop item soundPackId: ${item.soundPackId}`);
  });
});

test('marioAudio.setSoundPack equips pack, notifies listeners, and persists settings', () => {
  const mock = new MockStorage();
  const hadWindow = 'window' in globalThis;
  const originalWindow = (globalThis as any).window;
  const originalStorage = (globalThis as any).localStorage;

  (globalThis as any).window = globalThis;
  (globalThis as any).localStorage = mock;

  let notifiedPack: SoundPackId | null = null;
  const unsubscribe = marioAudio.subscribe((s) => {
    notifiedPack = s.soundPack;
  });

  try {
    marioAudio.setSoundPack('sound_snes_16bit', false);
    assert.equal(marioAudio.settings.soundPack, 'sound_snes_16bit');
    assert.equal(notifiedPack, 'sound_snes_16bit');

    const savedRaw = mock.getItem('mario_audio_settings');
    assert.ok(savedRaw, 'Should have saved mario_audio_settings');
    const parsed = JSON.parse(savedRaw);
    assert.equal(parsed.soundPack, 'sound_snes_16bit');

    // Switch to zen lofi
    marioAudio.setSoundPack('sound_zen_lofi', false);
    assert.equal(marioAudio.settings.soundPack, 'sound_zen_lofi');
    assert.equal(notifiedPack, 'sound_zen_lofi');
  } finally {
    unsubscribe();
    if (!hadWindow) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
    (globalThis as any).localStorage = originalStorage;
  }
});

test('marioAudio.loadSettings hydrates soundPack from localStorage accurately', () => {
  const mock = new MockStorage();
  mock.setItem('mario_active_soundpack', 'sound_galaxy_synth');
  mock.setItem(
    'mario_audio_settings',
    JSON.stringify({ ...DEFAULT_AUDIO_SETTINGS, soundPack: 'sound_galaxy_synth' })
  );

  const hadWindow = 'window' in globalThis;
  const originalWindow = (globalThis as any).window;
  const originalStorage = (globalThis as any).localStorage;

  (globalThis as any).window = globalThis;
  (globalThis as any).localStorage = mock;

  try {
    marioAudio.loadSettings();
    assert.equal(marioAudio.settings.soundPack, 'sound_galaxy_synth');
  } finally {
    if (!hadWindow) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
    (globalThis as any).localStorage = originalStorage;
  }
});

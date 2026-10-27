import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GROUP_MEMBERS,
  MARIO_SOUNDSCAPES,
  createStudyNote,
  updateStudyNote,
  deleteStudyNote,
  filterStudyNotes,
  loadStudyNotes,
  saveStudyNotes,
  computeWorldProgressMap,
  evaluateWorldLevelUp,
  WORLD_LEVELUP_BONUS_COINS,
  formatPomodoroSeconds,
  getNextPomodoroModeAfterCompletion,
  getAutoScrollMobilePosition,
  StorageLike,
} from './engagementFeatures';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
}

test('GROUP_MEMBERS contains all 9 required group members in exact spelling', () => {
  assert.equal(GROUP_MEMBERS.length, 9);
  assert.deepEqual(GROUP_MEMBERS, [
    'CORPUZ, MATTHEW CESAR',
    'CRUZ, MARY LOUISE',
    'FANGED, TRACY FAE',
    'FERNANDEZ, JELYN',
    'GARCIA, AERON STEVEN',
    'GARVIDA, MHELBOURNE',
    'MAÑALAC, ABIGAIL',
    'UNTALAN, BEYONCE HELEIN',
    'VILA, HANNAH DANIELA',
  ]);
});

test('MARIO_SOUNDSCAPES provides distinct Mario-themed ambient soundscapes', () => {
  const ids = MARIO_SOUNDSCAPES.map((s) => s.id);
  assert.deepEqual(ids, ['overworld', 'underground', 'castle', 'star_road']);
});

test('Study Notes CRUD, pinning, filtering, and localStorage persistence work cleanly', () => {
  const storage = createMemoryStorage();
  let notes = loadStudyNotes(storage);
  assert.equal(notes.length, 0);

  notes = createStudyNote(
    notes,
    {
      title: '20-Minute Brownout Rule',
      content: 'Up to 20 mins brownout is compensable hours worked.',
      worldTag: 'world1',
    },
    '2026-10-25T10:00:00.000Z'
  );
  notes = createStudyNote(
    notes,
    {
      content: 'Double Regular Holiday worked on Rest Day = 390%',
      worldTag: 'holidays',
    },
    '2026-10-25T10:05:00.000Z'
  );

  assert.equal(notes.length, 2);
  // Newer unpinned note comes first
  assert.equal(notes[0].worldTag, 'holidays');

  // Pinning world1 note moves it to the top
  const world1NoteId = notes[1].id;
  notes = updateStudyNote(
    notes,
    world1NoteId,
    { pinned: true },
    '2026-10-25T10:06:00.000Z'
  );
  assert.equal(notes[0].id, world1NoteId);
  assert.equal(notes[0].pinned, true);

  // Filter by worldTag and search query
  assert.equal(filterStudyNotes(notes, 'world1', '').length, 1);
  assert.equal(filterStudyNotes(notes, 'all', '390%').length, 1);

  // Persist & reload
  saveStudyNotes(notes, storage);
  const reloaded = loadStudyNotes(storage);
  assert.equal(reloaded.length, 2);

  // Delete note
  const afterDelete = deleteStudyNote(reloaded, world1NoteId);
  assert.equal(afterDelete.length, 1);
});

test('computeWorldProgressMap tracks completed counts, percentages, and sequential topic unlocks', () => {
  const sampleTopics = [
    { id: 'w1-a', worldId: 'world1' as const, title: 'Coverage', badge: 'Art. 82' },
    { id: 'w1-b', worldId: 'world1' as const, title: 'Hours Worked', badge: 'Art. 84' },
    { id: 'w2-a', worldId: 'world2' as const, title: 'Rest Periods', badge: 'Art. 91' },
  ];

  const initialMap = computeWorldProgressMap(sampleTopics, []);
  assert.equal(initialMap.world1.completedCount, 0);
  assert.equal(initialMap.world1.totalCount, 2);
  assert.equal(initialMap.world1.topics[0].isUnlocked, true);
  assert.equal(initialMap.world1.topics[1].isUnlocked, false);
  assert.equal(initialMap.world2.isWorldUnlocked, false);

  const afterFirst = computeWorldProgressMap(sampleTopics, ['w1-a']);
  assert.equal(afterFirst.world1.percent, 50);
  assert.equal(afterFirst.world1.topics[1].isUnlocked, true);
  assert.equal(afterFirst.world2.isWorldUnlocked, true);

  const afterWorld1Cleared = computeWorldProgressMap(sampleTopics, ['w1-a', 'w1-b']);
  assert.equal(afterWorld1Cleared.world1.isWorldCleared, true);
  assert.equal(afterWorld1Cleared.world1.percent, 100);
});

test('evaluateWorldLevelUp triggers celebration and awards bonus coins when world modules finish', () => {
  const sampleTopics = [
    { id: 'w3-a', worldId: 'world3' as const },
    { id: 'w3-b', worldId: 'world3' as const },
  ];

  // Marking 1 of 2 does not trigger Level Up
  const step1 = evaluateWorldLevelUp({
    toggledTopicId: 'w3-a',
    previousCompletedIds: [],
    nextCompletedIds: ['w3-a'],
    allTopics: sampleTopics,
    claimedWorldIds: [],
  });
  assert.equal(step1.triggered, false);

  // Marking 2 of 2 triggers Level Up + 50 coins
  const step2 = evaluateWorldLevelUp({
    toggledTopicId: 'w3-b',
    previousCompletedIds: ['w3-a'],
    nextCompletedIds: ['w3-a', 'w3-b'],
    allTopics: sampleTopics,
    claimedWorldIds: [],
  });
  assert.equal(step2.triggered, true);
  assert.equal(step2.worldId, 'world3');
  assert.equal(step2.bonusCoins, WORLD_LEVELUP_BONUS_COINS);
  assert.deepEqual(step2.updatedClaimedWorlds, ['world3']);
});

test('Pomodoro helpers format timer and transition focus/break cycles properly', () => {
  assert.equal(formatPomodoroSeconds(25 * 60), '25:00');
  assert.equal(formatPomodoroSeconds(65), '01:05');
  assert.equal(getNextPomodoroModeAfterCompletion('focus', 1), 'shortBreak');
  assert.equal(getNextPomodoroModeAfterCompletion('focus', 4), 'longBreak');
  assert.equal(getNextPomodoroModeAfterCompletion('shortBreak', 2), 'focus');
});

test('getAutoScrollMobilePosition coordinates mobile layout so scroller never covers Pomodoro or bottom nav', () => {
  // When Pomodoro modal is open, AutoScroll is hidden to keep modal unobstructed
  const modalOpen = getAutoScrollMobilePosition({ active: true, hasNotice: false, isExpanded: true });
  assert.equal(modalOpen.hidden, true);

  // When Pomodoro overlay is active on mobile, AutoScroll sits safely above both bottom nav and overlay
  const overlayActive = getAutoScrollMobilePosition({ active: true, hasNotice: false, isExpanded: false });
  assert.equal(overlayActive.hidden, false);
  assert.equal(overlayActive.bottomClass, 'bottom-[11rem]');

  // When Pomodoro overlay has stage clear / break notice, AutoScroll sits above the taller card
  const overlayNotice = getAutoScrollMobilePosition({ active: true, hasNotice: true, isExpanded: false });
  assert.equal(overlayNotice.hidden, false);
  assert.equal(overlayNotice.bottomClass, 'bottom-[18rem]');

  // When Pomodoro overlay is inactive, AutoScroll rests cleanly above the fixed mobile bottom nav bar
  const inactive = getAutoScrollMobilePosition({ active: false, hasNotice: false, isExpanded: false });
  assert.equal(inactive.hidden, false);
  assert.equal(inactive.bottomClass, 'bottom-20');
});

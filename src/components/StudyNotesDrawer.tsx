import React, { useState, useEffect, useMemo } from 'react';
import {
  NotebookPen,
  Plus,
  Trash2,
  Pin,
  Search,
  X,
  Sparkles,
  Check,
  Pencil,
  Copy,
} from 'lucide-react';
import {
  StudyNoteItem,
  loadStudyNotes,
  saveStudyNotes,
  createStudyNote,
  updateStudyNote,
  deleteStudyNote,
  filterStudyNotes,
} from '../utils/engagementFeatures';
import { WORLDS_METADATA } from '../data/laborLawData';
import { marioAudio } from '../utils/audio';

interface StudyNotesDrawerProps {
  activeWorld: string;
  activeTab: string;
  onNotesChange?: (notes: StudyNoteItem[]) => void;
}

const QUICK_MNEMONIC_TEMPLATES: { label: string; worldTag: string; title: string; content: string }[] = [
  {
    label: '20m Brownout',
    worldTag: 'world1',
    title: 'Brownout <= 20 Mins Rule',
    content: 'Power interruptions of 20 minutes or less are COMPENSABLE hours worked (Art. 84 Implementing Rules).',
  },
  {
    label: '390% Holiday',
    worldTag: 'holidays',
    title: 'Double Holiday + Rest Day = 390%',
    content: '2 Regular Holidays coincide = 200% unworked, 300% worked. Add +30% of 300% (+90%) on Rest Day = 390%!',
  },
  {
    label: '100% Service Charge',
    worldTag: 'world2',
    title: 'R.A. 11360 Service Charges',
    content: '100% distributed equally to covered rank-and-file/supervisory workers; managerial employees excluded.',
  },
  {
    label: 'D.O. 174 LOC',
    worldTag: 'world3',
    title: 'Labor-Only Contracting Test',
    content: 'No substantial capital/investment + directly related to principal business OR no control over workers = Prohibited LOC.',
  },
  {
    label: '105d Maternity / 5d SIL',
    worldTag: 'world6',
    title: 'World 6 Statutory Leaves Key Numbers',
    content: 'SIL: 5d commutable after 1 yr (Art. 95) | Maternity: 105d live (+15d solo) / 60d miscarriage (RA 11210) | Paternity: 7d first 4 (RA 8187) | Solo Parent: 7d after 6 mos (RA 11861) | VAWC: 10d (RA 9262).',
  },
];

export const StudyNotesDrawer: React.FC<StudyNotesDrawerProps> = ({
  activeWorld,
  onNotesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<StudyNoteItem[]>(() =>
    typeof window !== 'undefined' ? loadStudyNotes(window.localStorage) : []
  );

  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftWorldTag, setDraftWorldTag] = useState<string>('all');
  const [worldFilter, setWorldFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync default world tag when user switches worlds
  useEffect(() => {
    if (!editingId) {
      setDraftWorldTag(activeWorld && activeWorld !== 'all' ? activeWorld : 'all');
    }
  }, [activeWorld, editingId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveStudyNotes(notes, window.localStorage);
    }
    onNotesChange?.(notes);
  }, [notes, onNotesChange]);

  const visibleNotes = useMemo(
    () => filterStudyNotes(notes, worldFilter, searchQuery),
    [notes, worldFilter, searchQuery]
  );

  const worldTagOptions = [
    { id: 'all', label: 'General / All Worlds' },
    ...WORLDS_METADATA.map((w) => ({
      id: w.id,
      label: `W${w.worldNumber}: ${w.shortTitle}`,
    })),
    { id: 'holidays', label: 'Holidays Hub' },
    { id: 'wages_matrix', label: '17 Regions Wages' },
  ];

  const getWorldBadgeLabel = (tag: string) => {
    const found = worldTagOptions.find((o) => o.id === tag);
    return found ? found.label : 'General';
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftContent.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        updateStudyNote(prev, editingId, {
          title: draftTitle,
          content: draftContent,
          worldTag: draftWorldTag,
        })
      );
      setEditingId(null);
      marioAudio.playPowerUp();
    } else {
      setNotes((prev) =>
        createStudyNote(prev, {
          title: draftTitle,
          content: draftContent,
          worldTag: draftWorldTag,
        })
      );
      marioAudio.playCoin();
    }

    setDraftTitle('');
    setDraftContent('');
  };

  const handleStartEdit = (note: StudyNoteItem) => {
    setEditingId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setDraftWorldTag(note.worldTag);
    marioAudio.playJump();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftTitle('');
    setDraftContent('');
    marioAudio.playPipe();
  };

  const handleTogglePin = (note: StudyNoteItem) => {
    setNotes((prev) => updateStudyNote(prev, note.id, { pinned: !note.pinned }));
    marioAudio.playJump();
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => deleteStudyNote(prev, id));
    if (editingId === id) {
      setEditingId(null);
      setDraftTitle('');
      setDraftContent('');
    }
    marioAudio.playStomp();
  };

  const handleQuickTemplate = (tpl: (typeof QUICK_MNEMONIC_TEMPLATES)[number]) => {
    setNotes((prev) =>
      createStudyNote(prev, {
        title: tpl.title,
        content: tpl.content,
        worldTag: tpl.worldTag,
      })
    );
    marioAudio.playCoin();
  };

  const handleCopyNote = (note: StudyNoteItem) => {
    navigator.clipboard?.writeText(`${note.title}\n${note.content}`);
    setCopiedId(note.id);
    marioAudio.playCoin();
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <>
      {/* Persistent Floating Right-Edge Trigger Handle — Zero Horizontal Overflow */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          marioAudio.playPipe();
        }}
        data-testid="study-notes-trigger"
        aria-label={`Open Study Notes Drawer (${notes.length} saved notes)`}
        title="Open Study Notes Drawer — Jot down labor law mnemonics across tabs"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-amber-400 hover:bg-amber-300 text-slate-950 border-y-3 border-l-3 border-black rounded-l-2xl px-2 py-3 sm:px-2.5 sm:py-3.5 shadow-[-4px_4px_0_#000] flex flex-col items-center gap-1.5 cursor-pointer transition-colors select-none print:hidden"
      >
        <NotebookPen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
        <span className="text-[9px] font-black font-mario uppercase tracking-tighter leading-none [writing-mode:vertical-rl] rotate-180">
          NOTES
        </span>
        <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black inline-flex items-center justify-center border border-black leading-none tabular-nums">
          {notes.length}
        </span>
      </button>

      {/* Slide-Over Right Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/65 print:hidden">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-label="Study Notes Drawer"
            data-testid="study-notes-drawer"
            className="relative w-full max-w-md bg-[#1e293b] text-white border-l-2 border-slate-950 shadow-[-8px_0_30px_rgba(0,0,0,0.85)] h-[100dvh] flex flex-col overflow-hidden safe-top-nav safe-bottom-dock"
          >
            {/* Drawer Header */}
            <div className="bg-[#0f172a] p-4 border-b-2 border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-slate-950 shrink-0 shadow-[0_2px_0_#000]">
                  <NotebookPen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                    PERSISTENT MNEMONIC PAD
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-white font-display truncate">
                    STUDY NOTES ({notes.length})
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Study Notes Drawer"
                className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Compose / Edit Form */}
              <form
                onSubmit={handleSaveNote}
                className="bg-slate-900 rounded-2xl p-3.5 border-2 border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
                    {editingId ? 'EDIT MNEMONIC NOTE' : 'NEW DOCTRINE MNEMONIC'}
                  </span>
                  <select
                    aria-label="Note World Category"
                    value={draftWorldTag}
                    onChange={(e) => setDraftWorldTag(e.target.value)}
                    className="bg-slate-800 text-amber-300 text-xs font-bold px-2 py-1 rounded-lg border border-slate-600 focus:outline-none focus:border-amber-400"
                  >
                    {worldTagOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Optional title (e.g., Art. 94 Successive Holidays)"
                  aria-label="Mnemonic Note Title"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />

                <textarea
                  rows={3}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Jot down a quick mnemonic, statutory exception, or multiplier rule..."
                  aria-label="Mnemonic Note Content"
                  required
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 resize-y"
                />

                <div className="flex items-center justify-between gap-2">
                  {editingId ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Auto-saved to browser storage
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={!draftContent.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs font-mario border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{editingId ? 'UPDATE' : 'SAVE NOTE'}</span>
                  </button>
                </div>
              </form>

              {/* Quick 1-Tap Mnemonic Starters */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 font-mario">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-TAP BAR MNEMONIC STARTERS</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_MNEMONIC_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => handleQuickTemplate(tpl)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-600 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      + {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-700">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter saved notes..."
                    aria-label="Search Study Notes"
                    className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <select
                  aria-label="Filter Notes by World"
                  value={worldFilter}
                  onChange={(e) => setWorldFilter(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-xs font-bold px-2.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Worlds</option>
                  {worldTagOptions
                    .filter((o) => o.id !== 'all')
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Notes List */}
              {visibleNotes.length === 0 ? (
                <div className="bg-slate-900/70 border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
                  <NotebookPen className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-black text-white font-display">
                    {notes.length === 0 ? 'No study notes yet!' : 'No notes match your filter.'}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold">
                    Write your own Labor Standards mnemonics above or tap a quick starter chip. Your notes stay available as you switch across all tabs!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {visibleNotes.map((note) => (
                    <article
                      key={note.id}
                      className={`rounded-2xl p-3.5 border-2 transition-all space-y-2 ${
                        note.pinned
                          ? 'bg-amber-950/35 border-amber-400'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-[10px] font-black text-amber-300 uppercase">
                              {getWorldBadgeLabel(note.worldTag)}
                            </span>
                            {note.pinned && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black font-mario">
                                PINNED
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-sm text-white font-display break-words">
                            {note.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTogglePin(note)}
                            aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`}
                            title={note.pinned ? 'Unpin note' : 'Pin to top'}
                            className={`p-1.5 rounded-lg border cursor-pointer ${
                              note.pinned
                                ? 'bg-amber-400 text-slate-950 border-black'
                                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-600'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyNote(note)}
                            aria-label={`Copy ${note.title}`}
                            title="Copy note"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 cursor-pointer"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(note)}
                            aria-label={`Edit ${note.title}`}
                            title="Edit note"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(note.id)}
                            aria-label={`Delete ${note.title}`}
                            title="Delete note"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 font-medium whitespace-pre-wrap leading-relaxed break-words">
                        {note.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="bg-[#0f172a] px-4 py-2.5 border-t border-slate-700 text-[11px] text-slate-400 font-semibold flex items-center justify-between shrink-0">
              <span>Included optionally in Print Study Guide</span>
              <span className="text-amber-300 font-bold">localStorage Synced</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

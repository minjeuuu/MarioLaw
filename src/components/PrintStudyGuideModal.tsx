import React, { useState } from 'react';
import {
  Printer,
  X,
  Award,
  NotebookPen,
  Users,
  Calendar,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  BookOpenCheck,
  Table as TableIcon,
  Scale,
} from 'lucide-react';
import { ALL_LAW_TOPICS, WORLDS_METADATA } from '../data/laborLawData';
import { LABOR_BENEFITS_MULTIPLIER_LIST } from '../data/multiplierTable';
import {
  REGIONAL_MINIMUM_WAGES,
  KASAMBAHAY_MINIMUM_WAGES,
} from '../data/regionalWages';
import {
  GROUP_MEMBERS,
  StudyNoteItem,
  loadStudyNotes,
  DEFAULT_PRINT_FORMAT_OPTIONS,
  PrintGuideFormatOptions,
  filterTopicsForPrintGuide,
} from '../utils/engagementFeatures';
import { cleanRuleText } from '../utils/moduleFormatter';
import { marioAudio } from '../utils/audio';

interface PrintStudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTopicIds: string[];
  coins: number;
  studyNotes?: StudyNoteItem[];
}

function stripInlineLegalCitations(text: string, includeCitations: boolean): string {
  const cleaned = cleanRuleText(text);
  if (includeCitations) return cleaned;
  return cleaned
    .replace(/\s*\((?:Art\.|Arts\.|R\.A\.|P\.D\.|D\.O\.|G\.R\.|Sec\.|Labor Code)[^)]*\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function getPrintColumnWidths(colCount: number): string[] {
  if (colCount <= 2) return ['34%', '66%'];
  if (colCount === 3) return ['26%', '37%', '37%'];
  if (colCount === 4) return ['24%', '18%', '29%', '29%'];
  if (colCount === 5) return ['20%', '15%', '19%', '23%', '23%'];
  const equal = `${(100 / colCount).toFixed(2)}%`;
  return Array.from({ length: colCount }, () => equal);
}

export const PrintStudyGuideModal: React.FC<PrintStudyGuideModalProps> = ({
  isOpen,
  onClose,
  completedTopicIds,
  studyNotes,
}) => {
  const [includeGroupMembers, setIncludeGroupMembers] = useState(true);
  const [includeProgress, setIncludeProgress] = useState(true);
  const [includeMultipliers, setIncludeMultipliers] = useState(true);
  const [includeRegionalWages, setIncludeRegionalWages] = useState(true);
  const [includeLeavesMatrix, setIncludeLeavesMatrix] = useState(true);
  const [includePersonalNotes, setIncludePersonalNotes] = useState(true);
  const [matricesOnlyMode, setMatricesOnlyMode] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [formatOptions, setFormatOptions] = useState<PrintGuideFormatOptions>(
    DEFAULT_PRINT_FORMAT_OPTIONS
  );
  const [selectedWorlds, setSelectedWorlds] = useState<string[]>(() =>
    WORLDS_METADATA.map((w) => w.id)
  );

  if (!isOpen) return null;

  const resolvedNotes =
    studyNotes ??
    (typeof window !== 'undefined' ? loadStudyNotes(window.localStorage) : []);

  const totalTopics = ALL_LAW_TOPICS.length;
  const completedCount = completedTopicIds.length;
  const overallPercent = Math.min(
    100,
    Math.round((completedCount / Math.max(1, totalTopics)) * 100)
  );

  const filteredTopics = filterTopicsForPrintGuide(
    ALL_LAW_TOPICS,
    selectedWorlds,
    completedTopicIds,
    formatOptions.hideCompletedTopics
  );

  const toggleWorld = (worldId: string) => {
    marioAudio.playClick();
    setSelectedWorlds((prev) =>
      prev.includes(worldId) ? prev.filter((id) => id !== worldId) : [...prev, worldId]
    );
  };

  const updateFormat = <K extends keyof PrintGuideFormatOptions>(
    key: K,
    value: PrintGuideFormatOptions[K]
  ) => {
    marioAudio.playClick();
    setFormatOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    marioAudio.playCoin();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCompact = formatOptions.compactLayout;
  const isSerif = formatOptions.fontStyle === 'editorial_serif';
  const isNavy = formatOptions.colorAccent === 'executive_navy';

  const bodyFontClass = isSerif ? 'font-serif' : 'font-sans';
  const headingBorderClass = isNavy ? 'border-[#0f172a]' : 'border-black';
  const subtleBoxClass = isNavy
    ? 'bg-slate-50 border-slate-300'
    : 'bg-white border-slate-500';
  // High-legibility dark-ink-on-light header so matrices NEVER turn invisible white-on-white when background graphics are disabled in print!
  const tableHeaderClass = isNavy
    ? 'bg-slate-100 text-slate-950 border-b-2 border-[#0f172a]'
    : 'bg-white text-black border-b-2 border-black';

  const STATUTORY_LEAVES_MASTER_ROWS = [
    {
      leave: 'Service Incentive Leave (SIL)',
      basis: 'Art. 95, Labor Code',
      duration: '5 working days / year',
      eligibility: 'Rank-and-file with ≥ 1 year service (excludes <10 workers)',
      conversion: 'Commutable to cash at year-end if unused',
    },
    {
      leave: 'Expanded Maternity Leave',
      basis: 'R.A. No. 11210',
      duration: '105d live (+15d solo) / 60d miscarriage',
      eligibility: 'Every female worker per pregnancy regardless of civil status',
      conversion: 'Full pay (SSS + salary diff.); up to 7d transferable; non-cumulative',
    },
    {
      leave: 'Paternity Leave',
      basis: 'R.A. No. 8187',
      duration: '7 calendar days (+ up to 7d from mother = 14d)',
      eligibility: 'Married male cohabiting with legitimate spouse; first 4 deliveries',
      conversion: 'Full pay by employer; non-cumulative & non-convertible to cash',
    },
    {
      leave: 'Solo Parent Parental Leave',
      basis: 'R.A. 8972 / R.A. 11861',
      duration: '7 working days / year',
      eligibility: 'Valid Solo Parent ID + ≥ 6 months service (reduced from 1 yr)',
      conversion: 'Non-cumulative; forfeited if unused unless CBA stipulates',
    },
    {
      leave: 'Special Gynecological Leave',
      basis: 'R.A. No. 9710 (Sec. 18)',
      duration: 'Up to 2 months (full pay)',
      eligibility: '≥ 6 mos continuous aggregate service in last 12 mos + surgery',
      conversion: 'Non-cumulative & non-convertible to cash',
    },
    {
      leave: 'VAWC Victim Paid Leave',
      basis: 'R.A. No. 9262 (Sec. 43)',
      duration: 'Up to 10 days (extendible per BPO/TPO/PPO)',
      eligibility: 'Female victim-survivor with Barangay/Prosecutor/Court cert.',
      conversion: 'Non-cumulative & non-convertible to cash; administrative sanction if denied',
    },
  ];

  return (
    <div
      id="print-guide-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Print Study Guide and PDF Generator"
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-black/85 select-none overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible"
    >
      <div className="bg-slate-900 text-white w-full h-[100dvh] max-h-[100dvh] rounded-none sm:h-auto sm:max-h-[92vh] max-w-6xl sm:rounded-3xl border-0 sm:border-4 border-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pt-0 sm:pb-0 print:max-h-none print:h-auto print:max-w-full print:rounded-none print:border-0 print:shadow-none print:bg-white print:text-black print:overflow-visible">
        {/* Modal Top Bar (Hidden during window.print) */}
        <div className="bg-[#0f172a] px-4 py-3 sm:p-5 border-b-2 border-slate-700 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center text-slate-950 shadow-[0_2px_0_#000] shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-black uppercase text-amber-400 font-mario block truncate">
                PUBLICATION-GRADE BAR REVIEWER &amp; PDF EXPORT
              </span>
              <h2 className="text-base sm:text-xl font-black text-white font-display truncate">
                UNABRIDGED LABOR LAW PRINT STUDY GUIDE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowControlPanel((prev) => !prev)}
              aria-expanded={showControlPanel}
              className="min-h-[44px] px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border-2 border-slate-600 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{showControlPanel ? 'Hide Controls' : 'Format Controls'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Print Study Guide"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control Panel for Print Aesthetics & Content Toggles (Hidden during window.print) */}
        {showControlPanel && (
          <div
            data-testid="print-guide-control-panel"
            className="bg-slate-900/95 px-4 py-3.5 border-b border-slate-700 space-y-3 text-xs font-bold print:hidden flex-shrink-0 max-h-[42vh] overflow-y-auto"
          >
            {/* Primary Print Aesthetics & Content Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <label className="min-h-[44px] flex items-center justify-between gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-600">
                <span className="text-white">Compact Layout</span>
                <input
                  type="checkbox"
                  checked={formatOptions.compactLayout}
                  onChange={(e) => updateFormat('compactLayout', e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
              </label>

              <label className="min-h-[44px] flex items-center justify-between gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-600">
                <span className="text-white">Include Bar Tips</span>
                <input
                  type="checkbox"
                  checked={formatOptions.includeBarTips}
                  onChange={(e) => updateFormat('includeBarTips', e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
              </label>

              <label className="min-h-[44px] flex items-center justify-between gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-600">
                <span className="text-white">Include Legal Citations</span>
                <input
                  type="checkbox"
                  checked={formatOptions.includeLegalCitations}
                  onChange={(e) => updateFormat('includeLegalCitations', e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
              </label>

              <label className="min-h-[44px] flex items-center justify-between gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-600">
                <span className="text-white">Hide Completed Topics</span>
                <input
                  type="checkbox"
                  checked={formatOptions.hideCompletedTopics}
                  onChange={(e) => updateFormat('hideCompletedTopics', e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
              </label>
            </div>

            {/* Aesthetic Typography, Ink Palette & Pagination Row */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => updateFormat('fontStyle', 'editorial_serif')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    isSerif ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Editorial Law Serif
                </button>
                <button
                  type="button"
                  onClick={() => updateFormat('fontStyle', 'modern_sans')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    !isSerif ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Modern Clean Sans
                </button>
              </div>

              <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => updateFormat('colorAccent', 'executive_navy')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    isNavy ? 'bg-sky-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Executive Navy
                </button>
                <button
                  type="button"
                  onClick={() => updateFormat('colorAccent', 'ink_saver_bw')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    !isNavy ? 'bg-white text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ink-Saver Pure B&amp;W
                </button>
              </div>

              <label className="min-h-[38px] inline-flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200">
                <input
                  type="checkbox"
                  checked={formatOptions.pageBreakPerWorld}
                  onChange={(e) => updateFormat('pageBreakPerWorld', e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Page Break Per World</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200">
                <input
                  type="checkbox"
                  checked={formatOptions.pageBreakPerModule}
                  onChange={(e) => updateFormat('pageBreakPerModule', e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Page Break Per Module</span>
              </label>

              <label
                data-testid="toggle-matrices-only-mode"
                className="min-h-[38px] inline-flex items-center gap-2 cursor-pointer bg-emerald-950/90 hover:bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-500/70 text-emerald-200"
              >
                <input
                  type="checkbox"
                  checked={matricesOnlyMode}
                  onChange={(e) => {
                    marioAudio.playClick();
                    setMatricesOnlyMode(e.target.checked);
                  }}
                  className="accent-emerald-400"
                />
                <TableIcon className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Matrices Cheat Sheet Only</span>
              </label>
            </div>

            {/* Supplemental Reference Sections */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 text-[11px] font-semibold mr-1">
                Reference Appendices:
              </span>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includeGroupMembers}
                  onChange={(e) => setIncludeGroupMembers(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Author &amp; Group Credits</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includeProgress}
                  onChange={(e) => setIncludeProgress(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>6-World Checklist</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includeMultipliers}
                  onChange={(e) => setIncludeMultipliers(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Statutory Multipliers</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includeRegionalWages}
                  onChange={(e) => setIncludeRegionalWages(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>17 Regions Minimum Wages</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includeLeavesMatrix}
                  onChange={(e) => setIncludeLeavesMatrix(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>World 6 Leaves Matrix</span>
              </label>

              <label className="min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={includePersonalNotes}
                  onChange={(e) => setIncludePersonalNotes(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>Study Notes ({resolvedNotes.length})</span>
              </label>
            </div>

            {/* All 6 Worlds Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 text-[11px] font-semibold mr-1">
                Modules ({filteredTopics.length} topics queued):
              </span>
              {WORLDS_METADATA.map((w) => {
                const active = selectedWorlds.includes(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => toggleWorld(w.id)}
                    className={`min-h-[38px] inline-flex items-center gap-1.5 cursor-pointer px-3 py-1 rounded-lg border text-[11px] transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-black font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>
                      W{w.worldNumber}: {w.shortTitle}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedWorlds(WORLDS_METADATA.map((w) => w.id))}
                className="min-h-[38px] px-2.5 py-1 rounded-lg border border-slate-600 text-[11px] text-emerald-300 hover:bg-slate-800 cursor-pointer whitespace-nowrap"
              >
                All 6 Worlds
              </button>
            </div>
          </div>
        )}

        {/* Printable Document Preview & Print Target */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-8 bg-slate-950/60 print:overflow-visible print:p-0 print:bg-white select-text">
          <div
            id="printable-study-guide"
            data-compact={isCompact ? 'true' : 'false'}
            className={`bg-white text-slate-950 ${
              isCompact ? 'p-5 sm:p-7 space-y-4 text-[11px]' : 'p-6 sm:p-11 space-y-7 text-xs'
            } rounded-2xl shadow-2xl max-w-4xl mx-auto ${bodyFontClass} print:p-0 print:shadow-none print:max-w-full print:rounded-none`}
          >
            {/* Editorial Law Journal Masthead */}
            <header
              className={`border-b-2 ${headingBorderClass} ${
                isCompact ? 'pb-3 space-y-1' : 'pb-5 space-y-2'
              } text-center break-inside-avoid`}
            >
              <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 font-mono">
                PHILIPPINE LABOR CODE • P.D. NO. 442 (AS RENUMBERED &amp; AMENDED) • DOLE BWC HANDBOOK
              </div>
              <h1
                className={`${
                  isCompact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                } font-black text-slate-950 tracking-tight leading-tight`}
              >
                Philippine Labor Standards &amp; Statutory Welfare Reviewer
              </h1>
              <p className="text-xs text-slate-700 max-w-2xl mx-auto leading-relaxed">
                Complete Six-World Bar &amp; Law School Memory Aid covering Hours of Work, Rest &amp; Holidays, 13th Month Pay, Wages &amp; D.O. 174, Special Groups, Protective Statutes, and Statutory Leaves (World 6)
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-600 font-sans">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                  Created by Matthew (Matthew Cesar Corpuz — Main Creator)
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {currentDate}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {filteredTopics.length} Active Modules Printed
                </span>
              </div>
            </header>

            {/* Creator & Group Members Attribution Block */}
            {includeGroupMembers && (
              <section
                className={`border ${headingBorderClass} rounded-xl ${
                  isCompact ? 'p-3 space-y-1.5' : 'p-4 space-y-2.5'
                } ${subtleBoxClass} break-inside-avoid font-sans`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-900" />
                    <h2 className="font-black text-xs uppercase tracking-wide text-slate-950">
                      Memory Aid Attribution &amp; Research Cohort
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">
                    Main Creator: Matthew Cesar Corpuz
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-slate-900">
                  {GROUP_MEMBERS.map((member, idx) => (
                    <div key={member} className="flex items-baseline gap-1.5">
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums w-4 shrink-0">
                        {idx + 1}.
                      </span>
                      <span className={idx === 0 ? 'font-black underline decoration-slate-400' : 'font-medium'}>
                        {member}
                        {idx === 0 ? ' (Creator)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6-World Mastery Progress Checklist */}
            {includeProgress && (
              <section
                className={`border ${headingBorderClass} rounded-xl ${
                  isCompact ? 'p-3 space-y-2' : 'p-4 space-y-3'
                } bg-white break-inside-avoid font-sans`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-900" />
                    <h2 className="font-black text-xs uppercase tracking-wide text-slate-950">
                      Six-World Mastery Checklist
                    </h2>
                  </div>
                  <span className="font-bold text-[11px] text-slate-900 tabular-nums">
                    Mastered: {completedCount} / {totalTopics} Modules ({overallPercent}%)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
                  {WORLDS_METADATA.map((w) => {
                    const worldTopics = ALL_LAW_TOPICS.filter((t) => t.worldId === w.id);
                    const done = worldTopics.filter((t) => completedTopicIds.includes(t.id)).length;
                    return (
                      <div key={w.id} className={`p-2 border rounded-lg ${subtleBoxClass}`}>
                        <span className="font-bold block text-slate-900 truncate">
                          W{w.worldNumber}: {w.shortTitle}
                        </span>
                        <span className="text-slate-700 tabular-nums">
                          {done}/{worldTopics.length} mastered
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Personal Study Notes */}
            {includePersonalNotes && resolvedNotes.length > 0 && (
              <section className="space-y-2.5 break-inside-avoid">
                <div className={`border-b-2 ${headingBorderClass} pb-1 flex items-center gap-2`}>
                  <NotebookPen className="w-4 h-4 text-slate-900" />
                  <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                    Personal Study Notes &amp; Mnemonics ({resolvedNotes.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {resolvedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-slate-300 rounded-lg p-3 bg-white break-inside-avoid space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-bold text-slate-950">{note.title}</span>
                        <span className="font-mono text-[10px] text-slate-600">{note.worldTag}</span>
                      </div>
                      <p className="text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* I. Statutory Multipliers Reference Matrix */}
            {includeMultipliers && (
              <section className="space-y-2" data-testid="print-matrix-multipliers">
                <div className={`border-b-2 ${headingBorderClass} pb-1 flex items-center justify-between gap-2`}>
                  <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                    I. Statutory Pay Multiplier Matrix (DOLE BWC)
                  </h2>
                  <span className="text-[10px] font-mono text-slate-600">Arts. 87, 93–94 Labor Code</span>
                </div>
                <div className="w-full overflow-visible">
                  <table className="print-friendly-matrix w-full table-fixed text-left text-[10.5px] border border-slate-500 border-collapse font-sans tabular-nums">
                    <colgroup>
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '34%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '32%' }} />
                    </colgroup>
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th className="p-2 border border-slate-500 font-black">Benefit Category</th>
                        <th className="p-2 border border-slate-500 font-black">Scenario / Day Type</th>
                        <th className="p-2 border border-slate-500 font-black text-right">Rate</th>
                        <th className="p-2 border border-slate-500 font-black">Statutory Formula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LABOR_BENEFITS_MULTIPLIER_LIST.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`break-inside-avoid ${
                            isNavy && idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                          }`}
                        >
                          <td className="p-1.5 border border-slate-400 font-bold text-slate-950 align-top">
                            {row.benefit}
                          </td>
                          <td className="p-1.5 border border-slate-400 text-slate-900 align-top">
                            {row.scenario}
                          </td>
                          <td className="p-1.5 border border-slate-400 font-mono font-black text-slate-950 text-right align-top">
                            {(row.multiplierDecimal * 100).toFixed(1).replace(/\.0$/, '')}%
                          </td>
                          <td className="p-1.5 border border-slate-400 font-mono text-[10px] text-slate-900 align-top">
                            {row.formula}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* II. 17 Regions Minimum Wage & Kasambahay Matrix */}
            {includeRegionalWages && (
              <section className="space-y-2" data-testid="print-matrix-regional-wages">
                <div className={`border-b-2 ${headingBorderClass} pb-1 flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-900" />
                    <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                      II. 17 Regions Daily Minimum Wage &amp; Kasambahay Matrix
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">R.A. 6727 · R.A. 10361</span>
                </div>
                <div className="w-full overflow-visible">
                  <table className="print-friendly-matrix w-full table-fixed text-left text-[10.5px] border border-slate-500 border-collapse font-sans tabular-nums">
                    <colgroup>
                      <col style={{ width: '26%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '18%' }} />
                    </colgroup>
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th className="p-2 border border-slate-500 font-black">Region</th>
                        <th className="p-2 border border-slate-500 font-black">Effectivity</th>
                        <th className="p-2 border border-slate-500 font-black">Non-Agriculture</th>
                        <th className="p-2 border border-slate-500 font-black">Agriculture</th>
                        <th className="p-2 border border-slate-500 font-black">Kasambahay / Mo.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGIONAL_MINIMUM_WAGES.map((rw, idx) => {
                        const kas = KASAMBAHAY_MINIMUM_WAGES[idx];
                        return (
                          <tr
                            key={rw.region}
                            className={`break-inside-avoid ${
                              isNavy && idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                            }`}
                          >
                            <td className="p-1.5 border border-slate-400 font-bold text-slate-950 align-top">
                              {rw.region}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-[10px] text-slate-800 align-top">
                              {rw.effectivity}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono font-bold text-slate-950 align-top">
                              {rw.nonAgri}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-slate-900 align-top">
                              {rw.agri}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-slate-900 align-top">
                              {kas ? kas.minimumWage : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* III. World 6 Statutory Leaves Master Matrix */}
            {includeLeavesMatrix && (
              <section className="space-y-2" data-testid="print-matrix-statutory-leaves">
                <div className={`border-b-2 ${headingBorderClass} pb-1 flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-slate-900" />
                    <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                      III. World 6 Statutory Leaves Master Comparison Matrix
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">Art. 95 &amp; Special Leave Statutes</span>
                </div>
                <div className="w-full overflow-visible">
                  <table className="print-friendly-matrix w-full table-fixed text-left text-[10.5px] border border-slate-500 border-collapse font-sans tabular-nums">
                    <colgroup>
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '22%' }} />
                    </colgroup>
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th className="p-2 border border-slate-500 font-black">Statutory Leave</th>
                        <th className="p-2 border border-slate-500 font-black">Legal Basis</th>
                        <th className="p-2 border border-slate-500 font-black">Paid Duration</th>
                        <th className="p-2 border border-slate-500 font-black">Key Eligibility</th>
                        <th className="p-2 border border-slate-500 font-black">Cash Commutation &amp; Payor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATUTORY_LEAVES_MASTER_ROWS.map((row, idx) => (
                        <tr
                          key={row.leave}
                          className={`break-inside-avoid ${
                            isNavy && idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                          }`}
                        >
                          <td className="p-1.5 border border-slate-400 font-bold text-slate-950 align-top">
                            {row.leave}
                          </td>
                          <td className="p-1.5 border border-slate-400 font-mono text-[10px] text-slate-800 align-top">
                            {formatOptions.includeLegalCitations ? row.basis : 'Statutory'}
                          </td>
                          <td className="p-1.5 border border-slate-400 font-bold text-slate-950 align-top">
                            {row.duration}
                          </td>
                          <td className="p-1.5 border border-slate-400 text-slate-900 align-top">
                            {row.eligibility}
                          </td>
                          <td className="p-1.5 border border-slate-400 text-slate-900 align-top">
                            {row.conversion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* IV. Unabridged Modules Breakdown (or Embedded Module Matrices in Matrices-Only Mode) */}
            <section className={isCompact ? 'space-y-4' : 'space-y-6'}>
              <div className={`border-b-2 ${headingBorderClass} pb-1 flex items-center justify-between gap-2`}>
                <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                  {matricesOnlyMode
                    ? 'IV. Embedded Module Comparative Matrices (Worlds 1–6)'
                    : 'IV. Codified Provisions, Doctrines, Exceptions & Bar Exam Tips'}
                </h2>
                <span className="text-[10.5px] font-sans text-slate-600">
                  {matricesOnlyMode
                    ? 'Matrices-Only Cheat Sheet'
                    : formatOptions.hideCompletedTopics
                    ? 'Unmastered Focus Deck'
                    : 'Complete Unabridged Syllabus'}
                </span>
              </div>

              {filteredTopics.length === 0 ? (
                <div className="border border-slate-300 rounded-xl p-6 text-center space-y-1.5 bg-slate-50 font-sans">
                  <BookOpenCheck className="w-6 h-6 text-slate-700 mx-auto" />
                  <p className="font-bold text-xs text-slate-900">
                    All topics in your selected worlds are already marked Mastered!
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Uncheck &ldquo;Hide Completed Topics&rdquo; or enable more Worlds above to include mastered modules in your print packet.
                  </p>
                </div>
              ) : (
                WORLDS_METADATA.filter((w) => selectedWorlds.includes(w.id)).map((world, worldIdx) => {
                  const worldTopics = filteredTopics
                    .filter((t) => t.worldId === world.id)
                    .filter((t) => !matricesOnlyMode || t.rules.some((r) => Boolean(r.tableData)));
                  if (worldTopics.length === 0) return null;

                  return (
                    <div
                      key={world.id}
                      className={`${isCompact ? 'space-y-3' : 'space-y-4'} ${
                        formatOptions.pageBreakPerWorld && worldIdx > 0 ? 'print-page-break-before' : ''
                      }`}
                    >
                      {/* Clean Ink-Friendly Editorial World Banner (Never white-on-dark in print) */}
                      <div
                        className={`border-2 ${headingBorderClass} rounded-xl ${
                          isCompact ? 'px-3 py-2' : 'px-4 py-2.5'
                        } ${isNavy ? 'bg-slate-100 text-slate-950' : 'bg-white text-black'} break-inside-avoid`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-950">
                            World {world.worldNumber}: {world.title.replace(/^WORLD \d+:\s*/i, '')}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-700 tabular-nums font-bold">
                            {worldTopics.length} {worldTopics.length === 1 ? 'Module' : 'Modules'}
                          </span>
                        </div>
                        {!matricesOnlyMode && (
                          <p className="text-[11px] mt-0.5 text-slate-700">
                            {world.description}
                          </p>
                        )}
                      </div>

                      <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
                        {worldTopics.map((topic, topicIdx) => {
                          const isDone = completedTopicIds.includes(topic.id);
                          const combinedTips = [
                            ...(topic.barTips ?? []),
                            ...(topic.keyTips ?? []),
                          ];
                          const rulesToRender = matricesOnlyMode
                            ? topic.rules.filter((r) => Boolean(r.tableData))
                            : topic.rules;

                          return (
                            <article
                              key={topic.id}
                              className={`border border-slate-400 rounded-xl bg-white ${
                                isCompact ? 'p-3 space-y-2' : 'p-4 space-y-3'
                              } ${
                                formatOptions.pageBreakPerModule && topicIdx > 0
                                  ? 'print-module-break'
                                  : ''
                              }`}
                            >
                              {/* Module Header */}
                              <div className="flex items-start justify-between gap-3 border-b border-slate-300 pb-2 break-inside-avoid">
                                <div className="space-y-0.5">
                                  {formatOptions.includeLegalCitations && (
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                                      Statutory Basis: {topic.badge}
                                    </span>
                                  )}
                                  <h4
                                    className={`font-black ${
                                      isCompact ? 'text-xs sm:text-[13px]' : 'text-sm sm:text-[15px]'
                                    } text-slate-950 leading-snug`}
                                  >
                                    {topic.title}
                                  </h4>
                                </div>
                                <span className="text-[10px] font-mono font-semibold text-slate-700 shrink-0 tabular-nums">
                                  {isDone ? '[✓ MASTERED]' : '[  TO REVIEW]'}
                                </span>
                              </div>

                              {/* Summary */}
                              {!matricesOnlyMode && (
                                <p className="text-slate-900 leading-relaxed">
                                  <strong className="font-bold">Core Rule:</strong>{' '}
                                  {stripInlineLegalCitations(
                                    topic.summary,
                                    formatOptions.includeLegalCitations
                                  )}
                                </p>
                              )}

                              {/* Key Doctrines & Jurisprudence */}
                              {!matricesOnlyMode &&
                                formatOptions.includeLegalCitations &&
                                topic.keyDoctrines &&
                                topic.keyDoctrines.length > 0 && (
                                  <div
                                    className={`${subtleBoxClass} border rounded-lg ${
                                      isCompact ? 'p-2 space-y-0.5' : 'p-2.5 space-y-1'
                                    } break-inside-avoid`}
                                  >
                                    <span className="font-bold text-slate-950 block text-[10.5px] uppercase tracking-wide font-sans">
                                      Controlling Jurisprudence &amp; Legal Citations
                                    </span>
                                    <ul className="list-disc pl-4 space-y-0.5 text-slate-900">
                                      {topic.keyDoctrines.map((d, dIdx) => (
                                        <li key={dIdx}>{cleanRuleText(d)}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                              {/* Codified Rules, Subsections & Embedded Statutory Tables */}
                              <div
                                className={
                                  isCompact && !matricesOnlyMode
                                    ? 'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'
                                    : 'space-y-2.5'
                                }
                              >
                                {rulesToRender.map((rule, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className={`space-y-1.5 ${
                                      rule.tableData ? '' : 'break-inside-avoid'
                                    } ${rule.tableData && isCompact ? 'md:col-span-2' : ''}`}
                                  >
                                    <span className="font-bold text-slate-950 block break-after-avoid">
                                      {rIdx + 1}.{' '}
                                      {stripInlineLegalCitations(
                                        rule.heading,
                                        formatOptions.includeLegalCitations
                                      )}
                                    </span>
                                    {!matricesOnlyMode && rule.description && (
                                      <p className="text-slate-800 pl-3 leading-relaxed">
                                        {stripInlineLegalCitations(
                                          rule.description,
                                          formatOptions.includeLegalCitations
                                        )}
                                      </p>
                                    )}
                                    {!matricesOnlyMode && rule.items && rule.items.length > 0 && (
                                      <ul className="list-disc pl-5 space-y-0.5 text-slate-800 leading-relaxed">
                                        {rule.items.map((item, iIdx) => (
                                          <li key={iIdx}>
                                            {stripInlineLegalCitations(
                                              item,
                                              formatOptions.includeLegalCitations
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    {!matricesOnlyMode &&
                                      rule.subSections &&
                                      rule.subSections.map((sub, sIdx) => (
                                        <div key={sIdx} className="pl-4 pt-0.5 space-y-0.5">
                                          <span className="font-semibold text-slate-900 block">
                                            {stripInlineLegalCitations(
                                              sub.title,
                                              formatOptions.includeLegalCitations
                                            )}
                                          </span>
                                          <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                                            {sub.items.map((si, siIdx) => (
                                              <li key={siIdx}>
                                                {stripInlineLegalCitations(
                                                  si,
                                                  formatOptions.includeLegalCitations
                                                )}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    {rule.tableData && (
                                      <div className="w-full overflow-visible pt-0.5">
                                        <table className="print-friendly-matrix w-full table-fixed text-left text-[10.5px] border border-slate-500 border-collapse font-sans tabular-nums">
                                          <colgroup>
                                            {getPrintColumnWidths(rule.tableData.headers.length).map(
                                              (widthPct, colIdx) => (
                                                <col key={colIdx} style={{ width: widthPct }} />
                                              )
                                            )}
                                          </colgroup>
                                          <thead>
                                            <tr className={tableHeaderClass}>
                                              {rule.tableData.headers.map((h, hIdx) => (
                                                <th
                                                  key={hIdx}
                                                  className="p-1.5 border border-slate-500 font-black"
                                                >
                                                  {stripInlineLegalCitations(
                                                    h,
                                                    formatOptions.includeLegalCitations
                                                  )}
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rule.tableData.rows.map((rRow, rrIdx) => (
                                              <tr
                                                key={rrIdx}
                                                className={`break-inside-avoid ${
                                                  isNavy && rrIdx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                                                }`}
                                              >
                                                {rRow.map((cell, cIdx) => (
                                                  <td
                                                    key={cIdx}
                                                    className={`p-1.5 border border-slate-400 align-top ${
                                                      cIdx === 0
                                                        ? 'font-bold text-slate-950'
                                                        : 'text-slate-900'
                                                    }`}
                                                  >
                                                    {stripInlineLegalCitations(
                                                      cell,
                                                      formatOptions.includeLegalCitations
                                                    )}
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Statutory Exceptions */}
                              {!matricesOnlyMode && topic.exceptions && topic.exceptions.length > 0 && (
                                <div
                                  className={`${subtleBoxClass} border rounded-lg ${
                                    isCompact ? 'p-2 space-y-1' : 'p-2.5 space-y-1.5'
                                  } break-inside-avoid`}
                                >
                                  <span className="font-bold text-slate-950 block text-[10.5px] uppercase tracking-wide font-sans">
                                    General Rule &amp; Statutory Exceptions
                                  </span>
                                  {topic.exceptions.map((ex, exIdx) => (
                                    <div key={exIdx} className="space-y-0.5">
                                      <p className="font-semibold text-slate-900">
                                        General Rule:{' '}
                                        {stripInlineLegalCitations(
                                          ex.generalRule,
                                          formatOptions.includeLegalCitations
                                        )}
                                      </p>
                                      <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                                        {ex.exceptions.map((eItem, eiIdx) => (
                                          <li key={eiIdx}>
                                            {stripInlineLegalCitations(
                                              eItem,
                                              formatOptions.includeLegalCitations
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* High-Yield Bar Exam Tips & Practical Takeaway */}
                              {!matricesOnlyMode &&
                                formatOptions.includeBarTips &&
                                (combinedTips.length > 0 || topic.practicalTakeaway) && (
                                  <div
                                    className={`border ${
                                      isNavy
                                        ? 'border-amber-300 bg-amber-50/60'
                                        : 'border-slate-500 bg-white'
                                    } rounded-lg ${
                                      isCompact ? 'p-2 space-y-0.5' : 'p-2.5 space-y-1'
                                    } break-inside-avoid`}
                                  >
                                    <span className="font-bold text-slate-950 flex items-center gap-1 text-[10.5px] uppercase tracking-wide font-sans">
                                      <Sparkles className="w-3 h-3 shrink-0" />
                                      Bar Exam Memory Traps &amp; High-Yield Takeaways
                                    </span>
                                    {combinedTips.length > 0 && (
                                      <ul className="list-disc pl-4 space-y-0.5 text-slate-900">
                                        {combinedTips.map((tip, tIdx) => (
                                          <li key={tIdx}>
                                            {stripInlineLegalCitations(
                                              tip,
                                              formatOptions.includeLegalCitations
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    {topic.practicalTakeaway && (
                                      <p className="text-slate-800 pt-0.5">
                                        <strong>Practical Application:</strong>{' '}
                                        {stripInlineLegalCitations(
                                          topic.practicalTakeaway,
                                          formatOptions.includeLegalCitations
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )}
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            {/* Editorial Print Footer */}
            <footer
              className={`border-t-2 ${headingBorderClass} pt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 font-mono break-inside-avoid`}
            >
              <span>Created by Matthew • Super Mario Labor Law Memory Aid (Worlds 1–6)</span>
              <span>Unabridged Bar &amp; Law School Reviewer</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

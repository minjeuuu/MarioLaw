import React, { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  Table as TableIcon,
  LayoutList,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { cleanRuleText } from '../utils/moduleFormatter';
import { marioAudio } from '../utils/audio';

export interface MatrixCategoryTab {
  id: string;
  label: string;
  rowIndices: number[];
}

export interface InteractiveStudyMatrixProps {
  title: string;
  subtitle?: string;
  badge?: string;
  headers: string[];
  rows: string[][];
  highlightedRowIndex?: number;
  categoryTabs?: MatrixCategoryTab[];
  searchQuery?: string;
  accentColor?: 'amber' | 'emerald' | 'indigo' | 'rose';
  defaultMobileView?: 'cards' | 'table';
  testId?: string;
}

function getColumnWidths(colCount: number): string[] {
  if (colCount <= 2) return ['34%', '66%'];
  if (colCount === 3) return ['26%', '37%', '37%'];
  if (colCount === 4) return ['24%', '18%', '29%', '29%'];
  if (colCount === 5) return ['21%', '15%', '20%', '22%', '22%'];
  const equal = `${(100 / colCount).toFixed(2)}%`;
  return Array.from({ length: colCount }, () => equal);
}

function highlightText(text: string, query: string): React.ReactNode {
  const cleaned = cleanRuleText(text);
  const q = query.trim();
  if (!q) return cleaned;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = cleaned.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-300 text-slate-950 font-black px-1 rounded-xs"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function classifySemanticCellTone(rawText: string, colIndex: number): 'positive' | 'negative' | 'rate' | 'neutral' {
  if (colIndex === 0) return 'neutral';
  const text = rawText.trim();
  const lower = text.toLowerCase();

  if (
    /^(yes\b|commutable\b|allowed\b|legitimate\b|100%|paid in full|full pay)/i.test(text) ||
    lower.includes('commutable to cash') ||
    lower.includes('solidarily liable only') ||
    lower.includes('not required (covers peers')
  ) {
    return 'positive';
  }

  if (
    /^(no\b|never\b|non-cumulative|non-convertible|prohibited|forfeited|0%)/i.test(text) ||
    lower.includes('non-convertible to cash') ||
    lower.includes('labor-only') ||
    lower.includes('lacks substantial capital') ||
    lower.includes('prohibited')
  ) {
    return 'negative';
  }

  if (
    /\b(\d{1,3}%|\d+\s*(?:days?|working days?|calendar days?|months?|hrs?|hours?)|₱[\d,]+)/i.test(
      text
    ) &&
    text.length <= 46
  ) {
    return 'rate';
  }

  return 'neutral';
}

export const InteractiveStudyMatrix: React.FC<InteractiveStudyMatrixProps> = ({
  title,
  subtitle,
  badge,
  headers,
  rows,
  highlightedRowIndex = -1,
  categoryTabs,
  searchQuery = '',
  accentColor = 'amber',
  defaultMobileView = 'cards',
  testId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [localFilter, setLocalFilter] = useState<string>('');
  const [quizRecallMode, setQuizRecallMode] = useState<boolean>(false);
  const [revealedCells, setRevealedCells] = useState<Record<string, boolean>>({});
  const [mobileLayout, setMobileLayout] = useState<'cards' | 'table'>(defaultMobileView);

  const effectiveQuery = localFilter.trim() || searchQuery.trim();
  const colWidths = useMemo(() => getColumnWidths(headers.length), [headers.length]);

  const indexedRows = useMemo(() => {
    return rows
      .map((cells, originalIndex) => ({ cells, originalIndex }))
      .filter(({ cells, originalIndex }) => {
        if (activeCategory !== 'all' && categoryTabs) {
          const tab = categoryTabs.find((t) => t.id === activeCategory);
          if (tab && !tab.rowIndices.includes(originalIndex)) {
            return false;
          }
        }
        if (!localFilter.trim()) return true;
        const q = localFilter.trim().toLowerCase();
        return cells.some((c) => cleanRuleText(c).toLowerCase().includes(q));
      });
  }, [rows, activeCategory, categoryTabs, localFilter]);

  const totalMaskableCells = useMemo(() => {
    const maskCols = Math.max(0, headers.length - 1);
    return indexedRows.length * maskCols;
  }, [indexedRows.length, headers.length]);

  const revealedCount = useMemo(() => {
    let count = 0;
    indexedRows.forEach(({ originalIndex, cells }) => {
      cells.forEach((_, cIdx) => {
        if (cIdx > 0 && revealedCells[`${originalIndex}-${cIdx}`]) {
          count += 1;
        }
      });
    });
    return count;
  }, [indexedRows, revealedCells]);

  const handleToggleRecallMode = () => {
    const next = !quizRecallMode;
    setQuizRecallMode(next);
    if (!next) {
      setRevealedCells({});
    }
    marioAudio.playClick();
  };

  const handleRevealCell = (rowIdx: number, colIdx: number) => {
    const key = `${rowIdx}-${colIdx}`;
    setRevealedCells((prev) => ({ ...prev, [key]: !prev[key] }));
    marioAudio.playCoin();
  };

  const handleRevealAll = () => {
    const next: Record<string, boolean> = {};
    rows.forEach((r, rIdx) => {
      r.forEach((_, cIdx) => {
        if (cIdx > 0) next[`${rIdx}-${cIdx}`] = true;
      });
    });
    setRevealedCells(next);
    marioAudio.playPowerUp();
  };

  const handleResetMask = () => {
    setRevealedCells({});
    marioAudio.playJump();
  };

  const headerStripeClass =
    accentColor === 'emerald'
      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-b-2 border-emerald-300 dark:border-emerald-800'
      : accentColor === 'indigo'
      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-b-2 border-indigo-300 dark:border-indigo-800'
      : accentColor === 'rose'
      ? 'bg-rose-50 dark:bg-rose-950/50 border-b-2 border-rose-300 dark:border-rose-800'
      : 'bg-amber-50/90 dark:bg-slate-800/95 border-b-2 border-amber-300 dark:border-slate-700';

  const renderCellContent = (rawCell: string, rowOriginalIdx: number, colIdx: number) => {
    const cellKey = `${rowOriginalIdx}-${colIdx}`;
    const isMasked = quizRecallMode && colIdx > 0 && !revealedCells[cellKey];

    if (isMasked) {
      return (
        <button
          type="button"
          onClick={() => handleRevealCell(rowOriginalIdx, colIdx)}
          aria-label={`Reveal ${headers[colIdx]} for ${cleanRuleText(rows[rowOriginalIdx]?.[0] || 'row')}`}
          className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-dashed border-amber-500 dark:border-amber-400 text-amber-950 dark:text-amber-200 font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-300" />
          <span>Tap to Recall</span>
        </button>
      );
    }

    const tone = classifySemanticCellTone(rawCell, colIdx);
    const content = highlightText(rawCell, effectiveQuery);

    if (tone === 'positive') {
      return (
        <div
          onClick={quizRecallMode && colIdx > 0 ? () => handleRevealCell(rowOriginalIdx, colIdx) : undefined}
          className={`inline-flex items-start gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 ${
            quizRecallMode && colIdx > 0 ? 'cursor-pointer' : ''
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>{content}</span>
        </div>
      );
    }

    if (tone === 'negative') {
      return (
        <div
          onClick={quizRecallMode && colIdx > 0 ? () => handleRevealCell(rowOriginalIdx, colIdx) : undefined}
          className={`inline-flex items-start gap-1.5 font-semibold text-rose-900 dark:text-rose-300 ${
            quizRecallMode && colIdx > 0 ? 'cursor-pointer' : ''
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{content}</span>
        </div>
      );
    }

    if (tone === 'rate') {
      return (
        <span
          onClick={quizRecallMode && colIdx > 0 ? () => handleRevealCell(rowOriginalIdx, colIdx) : undefined}
          className={`inline-block font-black text-slate-950 dark:text-amber-200 bg-amber-100/85 dark:bg-amber-500/15 border border-amber-300/80 dark:border-amber-500/30 rounded-md px-2 py-0.5 tabular-nums ${
            quizRecallMode && colIdx > 0 ? 'cursor-pointer' : ''
          }`}
        >
          {content}
        </span>
      );
    }

    return (
      <span
        onClick={quizRecallMode && colIdx > 0 ? () => handleRevealCell(rowOriginalIdx, colIdx) : undefined}
        className={quizRecallMode && colIdx > 0 ? 'cursor-pointer' : ''}
      >
        {content}
      </span>
    );
  };

  return (
    <div
      data-testid={testId}
      className="print-matrix-card rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs overflow-hidden"
    >
      {/* Interactive Toolbar Header (Hidden in Print) */}
      <div className={`${headerStripeClass} p-3.5 sm:p-4 space-y-3 print:hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <TableIcon className="w-4 h-4 text-amber-700 dark:text-amber-300 shrink-0" />
              <h5 className="font-black text-sm sm:text-base font-display text-slate-950 dark:text-white leading-snug">
                {title}
              </h5>
            </div>
            {(subtitle || badge) && (
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-300 font-medium">
                {subtitle && <span>{subtitle}</span>}
                {subtitle && badge && <span aria-hidden="true">·</span>}
                {badge && (
                  <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-amber-300">
                    {badge}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Study Controls: Active Recall Drill + Mobile View Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleToggleRecallMode}
              data-testid={testId ? `${testId}-recall-toggle` : undefined}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-black border transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                quizRecallMode
                  ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600'
              }`}
            >
              {quizRecallMode ? (
                <EyeOff className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Eye className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-300" />
              )}
              <span>{quizRecallMode ? 'Exit Recall Drill' : 'Quiz Recall'}</span>
            </button>

            {/* Mobile Card vs Table View Switcher */}
            <div className="sm:hidden inline-flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMobileLayout('cards')}
                aria-label="Card view"
                className={`min-h-[34px] px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                  mobileLayout === 'cards'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-amber-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileLayout('table')}
                aria-label="Table view"
                className={`min-h-[34px] px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                  mobileLayout === 'table'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-amber-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs + Quick Row Filter + Active Recall Progress */}
        {(categoryTabs?.length || rows.length >= 4 || quizRecallMode) && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-1">
            {categoryTabs && categoryTabs.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    marioAudio.playClick();
                  }}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  All ({rows.length})
                </button>
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(tab.id);
                      marioAudio.playClick();
                    }}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                Showing {indexedRows.length} of {rows.length} statutory rows
              </span>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {quizRecallMode && (
                <div className="flex items-center gap-1.5 text-xs font-bold tabular-nums">
                  <span className="text-slate-700 dark:text-amber-300">
                    Recalled {revealedCount}/{totalMaskableCells}
                  </span>
                  <button
                    type="button"
                    onClick={handleRevealAll}
                    className="min-h-[32px] px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
                  >
                    Reveal All
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMask}
                    className="min-h-[32px] px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Mask</span>
                  </button>
                </div>
              )}

              {rows.length >= 4 && (
                <div className="relative flex-1 sm:flex-initial sm:w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={localFilter}
                    onChange={(e) => setLocalFilter(e.target.value)}
                    aria-label={`Filter ${title}`}
                    placeholder="Filter matrix..."
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print-Only Clean Header */}
      <div className="hidden print:block border-b border-slate-400 pb-1.5 mb-2">
        <strong className="text-xs font-black uppercase text-slate-950">{title}</strong>
        {badge && <span className="ml-2 text-[10px] font-mono text-slate-700">({badge})</span>}
      </div>

      {indexedRows.length === 0 ? (
        <div className="p-6 text-center text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 print:hidden">
          No statutory rows match &ldquo;{localFilter}&rdquo;.{' '}
          <button
            type="button"
            onClick={() => {
              setLocalFilter('');
              setActiveCategory('all');
            }}
            className="underline font-bold text-amber-700 dark:text-amber-300 cursor-pointer ml-1"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Scannable Cards View (Shown on <sm when mobileLayout === 'cards', hidden in print) */}
          <div
            className={`${
              mobileLayout === 'cards' ? 'block sm:hidden' : 'hidden'
            } divide-y divide-slate-200 dark:divide-slate-800 print:hidden`}
          >
            {indexedRows.map(({ cells, originalIndex }) => {
              const isHighlighted = originalIndex === highlightedRowIndex;
              return (
                <div
                  key={originalIndex}
                  className={`p-3.5 space-y-2.5 ${
                    isHighlighted
                      ? 'bg-amber-50/90 dark:bg-amber-500/10'
                      : 'bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-sm text-slate-950 dark:text-white font-display">
                      {highlightText(cells[0] || '', effectiveQuery)}
                    </span>
                    {isHighlighted && (
                      <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 shrink-0">
                        Active Topic
                      </span>
                    )}
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-xs">
                    {cells.slice(1).map((cell, idx) => {
                      const colIdx = idx + 1;
                      return (
                        <div
                          key={colIdx}
                          className="rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-2.5 space-y-1"
                        >
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {cleanRuleText(headers[colIdx] || '')}
                          </dt>
                          <dd className="text-slate-900 dark:text-slate-100 font-semibold leading-snug tabular-nums">
                            {renderCellContent(cell, originalIndex, colIdx)}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Full Interactive Table (Also shown on mobile if Table selected; hidden in print in favor of clean unmasked print table) */}
          <div
            className={`${
              mobileLayout === 'table' ? 'block' : 'hidden sm:block'
            } overflow-x-auto w-full print:hidden`}
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
              <colgroup>
                {colWidths.map((w, idx) => (
                  <col key={idx} style={{ width: w }} />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/95 text-slate-900 dark:text-amber-200 border-b-2 border-slate-300 dark:border-slate-700">
                  {headers.map((headerText, hIdx) => (
                    <th
                      key={hIdx}
                      scope="col"
                      className="p-3 font-black text-xs uppercase tracking-wide border-r last:border-r-0 border-slate-200 dark:border-slate-700/80 align-bottom"
                    >
                      {highlightText(headerText, effectiveQuery)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {indexedRows.map(({ cells, originalIndex }, visualIdx) => {
                  const isHighlighted = originalIndex === highlightedRowIndex;
                  return (
                    <tr
                      key={originalIndex}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-amber-50 dark:bg-amber-500/15'
                          : visualIdx % 2 === 1
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-amber-50/40 dark:hover:bg-slate-800/80'
                          : 'bg-white dark:bg-slate-900 hover:bg-amber-50/40 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {cells.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-3 border-r last:border-r-0 border-slate-200/80 dark:border-slate-800 align-top leading-relaxed ${
                            cIdx === 0
                              ? 'font-black text-slate-950 dark:text-white'
                              : 'font-semibold text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {renderCellContent(cell, originalIndex, cIdx)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Dedicated Unmasked Physical Paper Print Table */}
      <div className="hidden print:block w-full overflow-visible">
        <table className="print-friendly-matrix w-full text-left border-collapse tabular-nums">
          <colgroup>
            {colWidths.map((w, idx) => (
              <col key={idx} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {headers.map((h, hIdx) => (
                <th key={hIdx}>{cleanRuleText(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rRow, rrIdx) => (
              <tr key={rrIdx}>
                {rRow.map((c, cIdx) => (
                  <td key={cIdx} className={cIdx === 0 ? 'font-bold' : ''}>
                    {cleanRuleText(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

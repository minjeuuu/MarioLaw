import React, { useState } from 'react';
import { REGIONAL_MINIMUM_WAGES, KASAMBAHAY_MINIMUM_WAGES } from '../data/regionalWages';
import { Search, MapPin, Calendar, Coins, Users } from 'lucide-react';
import { marioAudio } from '../utils/audio';
import { MarioStarIcon, MarioCoinIcon } from './MarioIcons';

interface RegionalWageMatrixProps {
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const RegionalWageMatrix: React.FC<RegionalWageMatrixProps> = ({ fontSize }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'standard' | 'kasambahay'>('standard');

  const filteredStandard = REGIONAL_MINIMUM_WAGES.filter(
    (w) =>
      w.region.toLowerCase().includes(filterQuery.toLowerCase()) ||
      w.effectivity.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredKasambahay = KASAMBAHAY_MINIMUM_WAGES.filter(
    (w) =>
      w.region.toLowerCase().includes(filterQuery.toLowerCase()) ||
      w.effectivity.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 md:p-8 mario-card border-4 border-slate-950">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-lg border border-black text-xs uppercase font-mario">
              <span>ALL 17 PHILIPPINE REGIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display">
              REGIONAL MINIMUM WAGE MATRIX
            </h2>
            <p className={`${bodyTextClass} text-sky-100 max-w-2xl font-semibold text-sm sm:text-base`}>
              Official minimum wage rates across all regions (NCR, CAR, Regions I to XIII, and BARMM) for Non-Agriculture, Agriculture, and Domestic Workers (Kasambahay) with effectivity dates.
            </p>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000] shrink-0">
            <MarioStarIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
      </div>

      {/* Control Bar: Subtabs & Search Filter */}
      <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 p-4 md:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Toggle between General vs Kasambahay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => {
              setActiveSubTab('standard');
              marioAudio.playPipe();
            }}
            className={`min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm sm:text-base border-2 border-black transition-all cursor-pointer ${
              activeSubTab === 'standard'
                ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 shrink-0" />
            <span className="truncate">Industrial &amp; Agricultural Rates</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('kasambahay');
              marioAudio.playPipe();
            }}
            className={`min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm sm:text-base border-2 border-black transition-all cursor-pointer ${
              activeSubTab === 'kasambahay'
                ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0" />
            <span className="truncate">Domestic Workers (Kasambahay)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search region or date..."
            aria-label="Search region or effectivity date"
            className="w-full min-h-[44px] bg-slate-50 border-3 border-slate-800 rounded-xl pl-10 pr-9 py-2 font-bold text-base text-slate-900 focus:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-300"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              aria-label="Clear region search"
              className="absolute right-2.5 top-2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Table Display */}
      {activeSubTab === 'standard' ? (
        <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 overflow-hidden">
          <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-black">Regional Minimum Wage Rates (Non-Agriculture &amp; Agriculture)</h3>
            <span className="text-xs font-bold text-amber-400 uppercase bg-black/40 px-3 py-1 rounded-lg border border-amber-400/40 whitespace-nowrap">
              {filteredStandard.length} Regions Listed
            </span>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="block md:hidden print:hidden divide-y divide-slate-200">
            {filteredStandard.map((row, idx) => (
              <div key={idx} className="p-4 space-y-2.5 hover:bg-amber-50/60">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 font-black text-slate-950 text-sm">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{row.region}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{row.effectivity}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-blue-900 block">Non-Agriculture</span>
                    <span className="text-sm font-black text-blue-800 tabular-nums block mt-0.5">{row.nonAgri}</span>
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-emerald-900 block">Agriculture</span>
                    <span className="text-sm font-black text-emerald-800 tabular-nums block mt-0.5">{row.agri}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table with guaranteed column widths and no vertical text collapse */}
          <div className="hidden md:block print:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100 border-b-3 border-slate-400 text-slate-900 font-black text-sm lg:text-base">
                  <th className="p-4 border-r border-slate-300 min-w-[220px] whitespace-nowrap">REGION</th>
                  <th className="p-4 border-r border-slate-300 min-w-[190px] whitespace-nowrap">EFFECTIVITY DATE</th>
                  <th className="p-4 border-r border-slate-300 min-w-[170px] whitespace-nowrap">NON-AGRICULTURE</th>
                  <th className="p-4 min-w-[170px] whitespace-nowrap">AGRICULTURE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStandard.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-amber-50/80 transition-colors font-medium text-slate-900"
                  >
                    <td className="p-4 font-black border-r border-slate-200 text-sm lg:text-base min-w-[220px]">
                      <div className="flex items-center gap-2 whitespace-normal break-normal">
                        <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{row.region}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-200 font-semibold text-slate-700 whitespace-nowrap text-sm lg:text-base min-w-[190px]">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{row.effectivity}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-200 font-black text-blue-800 text-base lg:text-lg tabular-nums whitespace-nowrap min-w-[170px]">
                      {row.nonAgri}
                    </td>
                    <td className="p-4 font-black text-emerald-800 text-base lg:text-lg tabular-nums whitespace-nowrap min-w-[170px]">
                      {row.agri}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 overflow-hidden">
          <div className="bg-emerald-900 text-white p-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-black">Regional Minimum Wage for Domestic Workers (Kasambahay)</h3>
            <span className="text-xs font-bold text-amber-300 uppercase bg-black/40 px-3 py-1 rounded-lg border border-amber-400/40 whitespace-nowrap">
              {filteredKasambahay.length} Regions Listed
            </span>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="block md:hidden print:hidden divide-y divide-slate-200">
            {filteredKasambahay.map((row, idx) => (
              <div key={idx} className="p-4 space-y-2 hover:bg-amber-50/60">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 font-black text-slate-950 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.region}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{row.effectivity}</span>
                  </div>
                </div>
                <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-2.5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-rose-900">Minimum Monthly Wage</span>
                  <span className="text-base font-black text-red-700 tabular-nums">{row.minimumWage}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table with guaranteed column widths and no vertical text collapse */}
          <div className="hidden md:block print:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-slate-100 border-b-3 border-slate-400 text-slate-900 font-black text-sm lg:text-base">
                  <th className="p-4 border-r border-slate-300 min-w-[240px] whitespace-nowrap">REGION</th>
                  <th className="p-4 border-r border-slate-300 min-w-[200px] whitespace-nowrap">EFFECTIVITY DATE</th>
                  <th className="p-4 min-w-[220px] whitespace-nowrap">MINIMUM MONTHLY WAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredKasambahay.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-amber-50/80 transition-colors font-medium text-slate-900"
                  >
                    <td className="p-4 font-black border-r border-slate-200 text-sm lg:text-base min-w-[240px]">
                      <div className="flex items-center gap-2 whitespace-normal break-normal">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.region}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-200 font-semibold text-slate-700 whitespace-nowrap text-sm lg:text-base min-w-[200px]">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{row.effectivity}</span>
                      </div>
                    </td>
                    <td className="p-4 font-black text-red-700 text-base lg:text-lg tabular-nums whitespace-nowrap min-w-[220px]">
                      {row.minimumWage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note banner */}
      <div className="bg-amber-100 border-3 border-amber-500 rounded-xl p-4 text-amber-950 font-bold flex items-start sm:items-center gap-3">
        <MarioStarIcon className="w-6 h-6 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className={`${bodyTextClass} text-sm sm:text-base`}>
          Note: Wage orders are issued by Regional Tripartite Wages and Productivity Boards (RTWPBs) under R.A. No. 6727 (Wage Rationalization Act). Once issued, wage orders cannot be disturbed for twelve (12) months from effectivity, except by an act of Congress or supervening events.
        </p>
      </div>
    </div>
  );
};

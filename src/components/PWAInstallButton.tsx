import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, X, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../utils/usePWAInstall';
import { marioAudio } from '../utils/audio';

interface PWAInstallButtonProps {
  compact?: boolean;
  fullWidth?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  fullWidth = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Hide automatically when running in standalone installed PWA mode
  if (isInstalled) {
    return null;
  }

  const handleTrigger = async () => {
    marioAudio.playPowerUp();
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleTrigger}
        data-testid="pwa-install-btn"
        aria-label={isIOS ? 'Install App on iOS' : 'Install MarioLaw PWA App'}
        title="Install MarioLaw for offline study & standalone home-screen access"
        className={`${
          fullWidth
            ? 'w-full min-h-[42px] px-3 py-2 text-xs'
            : compact
            ? 'h-8 sm:h-7 px-2 sm:px-2.5 text-[10px]'
            : 'h-9 px-3 text-xs'
        } inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer leading-none whitespace-nowrap transition-colors shrink-0 print:hidden`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="font-mario text-[9px]">
          {isInstallable ? 'INSTALL' : isIOS ? 'IOS APP' : 'APP'}
        </span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none print:hidden">
          <div className="w-full max-w-md rounded-3xl bg-[#1e293b] text-white border-4 border-slate-950 shadow-[8px_8px_0_#000] overflow-hidden">
            <div className="bg-[#0f172a] p-4 border-b-2 border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-400 border-2 border-black flex items-center justify-center text-slate-950">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-300 font-mario block">
                    OFFLINE-READY PWA
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white font-display">
                    Install Super Mario Labor Adventure
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close Install Guide"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-emerald-100 font-semibold leading-relaxed">
                  Service Worker &amp; Offline Cache active! Once installed, all 5 Worlds, Holidays, Calculators, Flashcards, and Study Notes work offline.
                </p>
              </div>

              {isIOS ? (
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 space-y-2.5">
                  <h4 className="font-black text-amber-300 uppercase text-xs font-mario">
                    iPhone / iPad Safari Steps
                  </h4>
                  <ol className="space-y-2 text-slate-200 font-semibold">
                    <li className="flex items-center gap-2">
                      <Share className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>1. Tap the <strong>Share</strong> icon in your Safari toolbar.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <PlusSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 space-y-2.5">
                  <h4 className="font-black text-amber-300 uppercase text-xs font-mario">
                    Chrome / Edge / Android Steps
                  </h4>
                  <ol className="space-y-2 text-slate-200 font-semibold list-decimal pl-4">
                    <li>
                      Open this app in its full browser tab (if viewing inside an embedded preview frame).
                    </li>
                    <li>
                      Click the <strong>Install MarioLaw</strong> icon in your browser&apos;s address bar or browser menu (<strong>Install app / Add to Home screen</strong>).
                    </li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mario border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
              >
                GOT IT!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-black text-slate-950 border-2 border-black shadow-[0_3px_0_#000] print:hidden"
    >
      <WifiOff className="w-4 h-4 text-red-700 shrink-0" />
      <span>Offline Mode — Cached Law Modules Active</span>
    </div>
  );
};

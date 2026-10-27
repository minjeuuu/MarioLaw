import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sun,
  Moon,
  GraduationCap,
  Feather,
  Map,
  BookOpen,
  Calendar,
  Calculator,
  HelpCircle,
  Trophy,
  Clock,
  Gamepad2,
  Award,
  Volume2,
  Search,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  VolumeX,
  Volume1,
  Printer,
  Sparkles,
  MousePointerClick,
  Sliders,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioMushroomIcon,
  MarioStarIcon,
} from './MarioIcons';
import { MarioAvatar, StudyDifficulty } from '../types/laborLaw';
import { HERO_ROSTER } from '../data/heroesData';
import {
  ColorMode,
  WALKTHROUGH_CHAPTERS,
} from '../utils/profileAchievements';
import { MARIO_SOUNDSCAPES, MAIN_CREATOR_AUTHOR } from '../utils/engagementFeatures';
import { marioAudio } from '../utils/audio';

interface AppWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteWalkthrough: (navigateToTab?: string) => void;
  colorMode: ColorMode;
  onToggleColorMode: (mode: ColorMode) => void;
  studyDifficulty: StudyDifficulty;
  onSelectDifficulty: (diff: StudyDifficulty) => void;
  equippedAvatar: MarioAvatar;
  onSelectAvatar: (avatar: MarioAvatar) => void;
  alreadyGraduated: boolean;
}

interface ButtonDirectoryItem {
  id: string;
  name: string;
  part: string;
  category: string;
  whatItDoes: string;
  howToUse: string;
  proTip: string;
  iconName?: string;
}

const BUTTON_DIRECTORY: ButtonDirectoryItem[] = [
  // 1. Navigation & Header
  {
    id: 'btn-mario-logo',
    name: 'Mario Title & Logo',
    part: 'Top Navigation Bar (Left)',
    category: 'Header & Global Controls',
    whatItDoes: 'Instantly resets your active view back to the World Map overland progression hub.',
    howToUse: 'Click the iconic Mario logo or title at any time to return to the kingdom map.',
    proTip: 'Safe anchor to return home whenever you get deep into reading codal articles.',
  },
  {
    id: 'btn-coin-wallet',
    name: 'Coin Wallet Pill (x00 Coins)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Displays current study coin earnings; clicking directly opens Toad’s Grand Shop & Bazaar.',
    howToUse: 'Click the golden coin badge to inspect your wallet and shop for 34 heroes, Super Star 2x power-ups, Shortcut Maps, companions, and card frames.',
    proTip: 'Earn coins by completing topic readings, running 5-Min Quick Study decks, taking quizzes, or finishing Pomodoro focus sessions.',
  },
  {
    id: 'btn-pomodoro-pill',
    name: 'Pomodoro Focus Timer Pill',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Shows live mm:ss countdown for active focus sessions and opens the full Pomodoro Timer Modal.',
    howToUse: 'Click the clock pill to open the 25-minute timer, adjust intervals, silence sound alerts, or pin a floating overlay.',
    proTip: 'Features a 1-click Quick Reset button that returns you to the standard 25m focus state instantly.',
  },
  {
    id: 'btn-audio-soundscape',
    name: 'Ambient Soundscape Player (Music Note)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Toggles soothing Mario-themed background study music (Lofi beats, NES 8-bit, Underground cave, Peach Castle).',
    howToUse: 'Click the music icon to play/pause audio or choose between 4 custom study tempos.',
    proTip: 'Synthesized via Web Audio API, so it works completely offline with zero network bandwidth.',
  },
  {
    id: 'btn-study-notes',
    name: 'Legal Scratchpad / Study Notes (Sticky Note)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Slides open a personal legal note-taking drawer with Markdown support, auto-save, and pin-to-top.',
    howToUse: 'Click the sticky note button to jot down statutory cross-references or Bar exam mnemonics.',
    proTip: 'Automatically saves in your browser storage so your personal study annotations are never lost.',
  },
  {
    id: 'btn-color-mode',
    name: 'Day/Night Color Mode (Sun / Moon)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Flips interface between Daylight Mario Sky (high-contrast day reading) and Late-Night Subterranean dark mode.',
    howToUse: 'Click the sun/moon icon to switch reading contrast on the fly.',
    proTip: 'Remembers your preference across browser reloads.',
  },
  {
    id: 'btn-walkthrough-guide',
    name: 'Interactive Walkthrough Guide ("Guide / ?")',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Opens this comprehensive modal with both the 10-chapter guided tour and the complete button directory.',
    howToUse: 'Click anytime you want a refresher on any tab, tool, or calculation feature.',
    proTip: 'First-time completion awards a bonus +25 study coins!',
  },
  {
    id: 'btn-printable-guide',
    name: 'Print Study Guide (Printer Icon)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Opens the high-contrast, ink-saving printable compendium of Philippine Labor Standards.',
    howToUse: 'Click the printer icon to review the full codal syllabus and trigger your browser’s print dialog.',
    proTip: 'Includes statutory multiplier breakdown tables and regional minimum wage matrices formatted for 8.5x11 paper.',
  },
  {
    id: 'btn-user-profile',
    name: 'User Profile & Milestone Dossier (Avatar)',
    part: 'Top Navigation Bar (Right)',
    category: 'Header & Global Controls',
    whatItDoes: 'Opens your Bar Candidate profile, Recharts weekly focus bar chart, 24-character selector, and achievements.',
    howToUse: 'Click your active Mario avatar face to track cumulative study time, login streak, and study habits.',
    proTip: 'Features a live Recharts bar chart tracking your daily Pomodoro focus history over the past 7 days.',
  },
  {
    id: 'btn-back-to-top',
    name: 'Back to Top Floating Warp Pipe',
    part: 'Bottom-Right Floating',
    category: 'Header & Global Controls',
    whatItDoes: 'Smoothly scrolls your view back to the top navigation header.',
    howToUse: 'Click the green warp pipe whenever you reach the bottom of long statutory module texts.',
    proTip: 'Accompanied by the classic Mario pipe descending sound effect.',
  },

  // 2. World Map Navigation
  {
    id: 'btn-world-nodes',
    name: 'World Map Level Nodes (Worlds 1 to 6)',
    part: 'World Map Progression Canvas',
    category: 'World Map Progression',
    whatItDoes: 'Launches into all 6 Labor Code module worlds (Hours of Work, Holidays, Wages, Special Groups, Protective Laws, and World 6 Statutory Leaves).',
    howToUse: 'Click any unlocked level node to jump straight to that subject syllabus.',
    proTip: 'Equip Toad’s Bar Exam Shortcut Map from the Shop to highlight high-yield Bar exam doctrines across Worlds 1–6.',
  },
  {
    id: 'btn-fire-flower-streak',
    name: 'Consecutive Days Studied · Fire Flower Tracker',
    part: 'World Map Top Banner',
    category: 'World Map Progression',
    whatItDoes: 'Displays your consecutive daily study streak, awarding a glowing Fire Flower icon every 5-day milestone with a live milestone progress bar.',
    howToUse: 'Study daily (or use a Fire Flower Streak Booster in Toad’s Shop) to fill the milestone progress bar.',
    proTip: 'Click "5-Min Quick Study Deck" or "Global Coin Leaderboard" right next to the tracker to review weak topics or compare coin totals.',
  },
  {
    id: 'btn-bowser-castle',
    name: "Bowser's Castle Keep",
    part: 'World Map Progression Canvas',
    category: 'World Map Progression',
    whatItDoes: 'Launches the Bowser 3-Heart Boss Battle combat arena covering the entire 6-World statutory syllabus.',
    howToUse: 'Click the ominous red lava keep to test your knowledge against randomized Bar exam questions.',
    proTip: 'Activate a Super Star Power-up first to double your Boss victory coin bounty!',
  },
  {
    id: 'btn-toad-shop-pipe',
    name: "Toad's Item Shop Pipe",
    part: 'World Map Progression Canvas',
    category: 'World Map Progression',
    whatItDoes: 'Warp directly to Toad’s Grand Bazaar to browse 34 heroes, Super Star 2x buffs, Shortcut Maps, Companions, Card Frames, and Restore Audio Pack.',
    howToUse: 'Click the mushroom-emblazoned pipe on the world map.',
    proTip: 'Open 3-Tier Mystery Chests (15c / 60c / 150c) or restore missing audio packs in the Audio tab anytime!',
  },

  // 3. Modules & Codal Reader
  {
    id: 'btn-tts-speaker',
    name: 'TTS Audio Read Aloud (Speaker Icon)',
    part: 'Module Topic Card Header',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Reads the unabridged Labor Code statutory provisions aloud using browser speech synthesis.',
    howToUse: 'Click the speaker button to start audio playback; click again to pause.',
    proTip: 'Perfect for hands-free audio revision while commuting or resting your eyes.',
  },
  {
    id: 'btn-codal-toggle',
    name: 'Codal Verbatim vs Bar Review Toggle',
    part: 'Module Topic Card Top Controls',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Switches between full, unabridged statutory article text and high-yield condensed Bar review mnemonics.',
    howToUse: 'Toggle between "Verbatim Codal" for exact statutory wording and "Bar Review" for doctrinal summaries.',
    proTip: 'Always memorize the verbatim exceptions for Article 82 exclusions (government employees, managerial staff).',
  },
  {
    id: 'btn-complexity-switch',
    name: 'Beginner vs Advanced Complexity Switch',
    part: 'Module Topic Card Controls',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Toggles plain-English explanations and practical takeaways versus rigorous jurisprudential doctrines.',
    howToUse: 'Select "Beginner" if learning for the first time, or "Advanced" for deep Bar exam doctrinal rules.',
    proTip: 'Both modes maintain 100% zero omission of statutory legal rules.',
  },
  {
    id: 'btn-copy-codal',
    name: 'Copy Statutory Text Button',
    part: 'Module Topic Card Footer',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Copies the entire codal article, exceptions, and key doctrines to your system clipboard.',
    howToUse: 'Click the copy button and paste into your personal digital notebook or case brief.',
    proTip: 'Shows an instant visual checkmark toast confirming text was copied.',
  },
  {
    id: 'btn-complete-topic',
    name: 'Mark Topic Complete (Green Checkmark)',
    part: 'Module Topic Card Footer',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Marks the statutory topic as mastered, awards +10 coins, and advances your World Map completion progress.',
    howToUse: 'Click after finishing your study of the article.',
    proTip: 'Unlocks milestone achievements in your User Profile when you complete entire worlds.',
  },
  {
    id: 'btn-table-scroll',
    name: 'Horizontal Scrollable Comparative Matrices',
    part: 'Module Topic Comparative Tables',
    category: 'Modules & Codal Reader',
    whatItDoes: 'Enables horizontal scrolling for multi-column comparative tables without awkward vertical text wrapping.',
    howToUse: 'Swipe or drag horizontally to view all columns clearly with clean typography.',
    proTip: 'Fixed to prevent vertical character stacking even at extra-large font sizes.',
  },

  // 4. Regional Wage Matrix & Holidays Hub
  {
    id: 'btn-sector-tabs',
    name: 'Sector Tabs (Non-Agri vs Kasambahay)',
    part: 'Regional Wage Matrix Tab Header',
    category: 'Wages Matrix & Holidays',
    whatItDoes: 'Switches between commercial/industrial minimum wage rates and Batas Kasambahay domestic worker rates.',
    howToUse: 'Click "Commercial / Industrial" or "Domestic (Kasambahay)" tab.',
    proTip: 'Covers all 17 administrative regions from NCR to BARMM with effective wage order dates.',
  },
  {
    id: 'btn-wage-search',
    name: 'Region Search Input Field',
    part: 'Regional Wage Matrix Search Bar',
    category: 'Wages Matrix & Holidays',
    whatItDoes: 'Filters regional wage orders in real-time by region code (e.g. "NCR", "Region IV-A", "Region VII").',
    howToUse: 'Type your target region name or number to isolate specific minimum wage rates.',
    proTip: 'Instant real-time filtering helps you quickly calculate multi-region payroll rates.',
  },
  {
    id: 'btn-holiday-tabs',
    name: 'Holiday Category Tabs (Regular vs Special)',
    part: 'Holidays Hub Filter Bar',
    category: 'Wages Matrix & Holidays',
    whatItDoes: 'Separates 200% statutory regular holidays from 130% special non-working days.',
    howToUse: 'Click the category filter pills to learn legal distinctions and unworked pay rules.',
    proTip: 'Remember: Unworked regular holiday pay is 100%, while unworked special day is "No Work, No Pay".',
  },

  // 5. Statutory Wage Calculator
  {
    id: 'btn-calc-daily-input',
    name: 'Daily Rate ($/day) Input Box',
    part: 'Statutory Wage Calculator (Left Panel)',
    category: 'Statutory Calculator',
    whatItDoes: 'Accepts your base daily wage and automatically calculates the derived hourly rate (Daily / 8).',
    howToUse: 'Type your daily rate (e.g., 610 for NCR non-agriculture).',
    proTip: 'Can be linked with the regional wage matrix to test statutory compliance.',
  },
  {
    id: 'btn-calc-day-type',
    name: 'Workday Type Radio Selectors',
    part: 'Statutory Wage Calculator (Left Panel)',
    category: 'Statutory Calculator',
    whatItDoes: 'Sets statutory multiplier: Ordinary (100%), Special Day (130%), Regular Holiday (200%), Double Holiday (300%).',
    howToUse: 'Click the radio button matching the day worked.',
    proTip: 'Selecting "Rest Day" automatically stacks the statutory +30% rest day premium.',
  },
  {
    id: 'btn-calc-ot-stepper',
    name: 'Overtime Hours Stepper (+ / - Buttons)',
    part: 'Statutory Wage Calculator (Left Panel)',
    category: 'Statutory Calculator',
    whatItDoes: 'Increments or decrements hours worked beyond 8 hours, applying statutory overtime multipliers (125%, 130%, 169%, 260%).',
    howToUse: 'Click + or - to set exact overtime hours.',
    proTip: 'Overtime is computed on top of the day’s regular hourly rate, not base daily rate.',
  },
  {
    id: 'btn-calc-nsd-stepper',
    name: 'Night Shift Differential Stepper (+ / - Buttons)',
    part: 'Statutory Wage Calculator (Left Panel)',
    category: 'Statutory Calculator',
    whatItDoes: 'Calculates the +10% Night Shift Differential premium for work performed between 10:00 PM and 6:00 AM.',
    howToUse: 'Set hours worked during the nocturnal 10pm–6am window.',
    proTip: 'Stacks multiplicatively with overtime and holiday multipliers.',
  },
  {
    id: 'btn-calc-factor-select',
    name: 'Monthly Factor Selector (365, 313, 261, 394.4)',
    part: 'Statutory Wage Calculator (Monthly Estimator)',
    category: 'Statutory Calculator',
    whatItDoes: 'Selects the DOLE working day factor to convert daily wage to statutory monthly equivalent.',
    howToUse: 'Choose Factor 365 (everyday workers), 313 (rest days unpaid), 261 (5-day work week), or 394.4.',
    proTip: 'Crucial for computing correct 13th month pay and separation pay packages.',
  },
  {
    id: 'btn-calc-reset',
    name: 'Reset Calculator Button',
    part: 'Statutory Wage Calculator (Top Right)',
    category: 'Statutory Calculator',
    whatItDoes: 'Instantly resets all hours, premiums, and dropdowns back to a standard 8-hour ordinary workday.',
    howToUse: 'Click the reset button to start a fresh calculation scenario.',
    proTip: 'Restores the baseline daily wage without reloading the page.',
  },

  // 6. Mystery Flashcards & Spaced Repetition
  {
    id: 'btn-card-flip',
    name: 'Flashcard Flip Surface / Flip Button',
    part: 'Flashcard Study Arena',
    category: 'Flashcards & Spaced Repetition',
    whatItDoes: 'Flips card between statutory hypothetical question and codified doctrinal answer.',
    howToUse: 'Click the card body or the "Flip Card" button.',
    proTip: 'Use keyboard Spacebar to flip cards rapidly for speed reviews.',
  },
  {
    id: 'btn-card-thumbs-up',
    name: '"Got It" Thumbs Up (Green Up Button)',
    part: 'Flashcard Rating Controls',
    category: 'Flashcards & Spaced Repetition',
    whatItDoes: 'Records successful retention, awards coins, and schedules the card for later spaced repetition interval.',
    howToUse: 'Click when you recalled the statutory rule accurately.',
    proTip: 'Consistently getting cards right unlocks mastery star badges.',
  },
  {
    id: 'btn-card-thumbs-down',
    name: '"Need Review" Thumbs Down (Red Down Button)',
    part: 'Flashcard Rating Controls',
    category: 'Flashcards & Spaced Repetition',
    whatItDoes: 'Marks the doctrine for high-priority re-testing in the current deck cycle.',
    howToUse: 'Click if you missed an exception or statutory percentage.',
    proTip: 'Focus your final review hours on your "Need Review" cards.',
  },
  {
    id: 'btn-card-shuffle',
    name: 'Shuffle Deck Button',
    part: 'Flashcard Top Controls',
    category: 'Flashcards & Spaced Repetition',
    whatItDoes: 'Randomizes the card presentation order to prevent memorizing answers by positional habit.',
    howToUse: 'Click before starting a review session.',
    proTip: 'Simulates the unpredictable sequence of real Bar exam questions.',
  },

  // 7. Bar Quizzes & Bowser Combat
  {
    id: 'btn-quiz-mcq-options',
    name: 'MCQ Option Choice Buttons (A, B, C, D)',
    part: 'Bar Quiz Question Arena',
    category: 'Bar Quizzes & Boss Combat',
    whatItDoes: 'Submits your answer to scenario-based legal problems and displays instant statutory rationale.',
    howToUse: 'Click your chosen option button.',
    proTip: 'Detailed statutory rationale cites exact Article numbers and Supreme Court jurisprudence.',
  },
  {
    id: 'btn-lakitu-5050',
    name: 'Lakitu 50/50 Glasses Booster Button',
    part: 'Bar Quiz & Boss Battle Controls',
    category: 'Bar Quizzes & Boss Combat',
    whatItDoes: 'Eliminates 2 incorrect distractors on difficult questions.',
    howToUse: 'Click the Lakitu cloud button when unlocked from Toad’s Shop.',
    proTip: 'Saves critical hearts during Bowser Boss combat.',
  },
  {
    id: 'btn-boss-attack',
    name: 'Attack Bowser Fireball Button',
    part: 'Bowser Boss Battle Combat Screen',
    category: 'Bar Quizzes & Boss Combat',
    whatItDoes: 'Deals damage to Bowser’s health bar when answering correctly.',
    howToUse: 'Click following a correct legal answer to launch Mario’s fireball strike.',
    proTip: 'Defeating Bowser awards a massive +50 coin bounty and unlocks the Boss Slayer trophy!',
  },

  // 8. Pomodoro Focus Timer
  {
    id: 'btn-pomodoro-play-pause',
    name: 'Start / Pause Timer Button',
    part: 'Pomodoro Timer Interface',
    category: 'Pomodoro Focus Timer',
    whatItDoes: 'Starts or pauses the countdown focus timer.',
    howToUse: 'Click the big circular play/pause button.',
    proTip: 'Persists in background so you can read modules while your focus session runs.',
  },
  {
    id: 'btn-pomodoro-quick-reset',
    name: 'Quick Reset Button',
    part: 'Pomodoro Timer Modal & Overlay',
    category: 'Pomodoro Focus Timer',
    whatItDoes: 'Immediately stops any active session and resets the timer back to the 25-minute default state.',
    howToUse: 'Click the Quick Reset button whenever you want a fresh 25m focus round.',
    proTip: 'Works in both the main timer modal and the pinned bottom-screen overlay.',
  },
  {
    id: 'btn-pomodoro-sound-toggle',
    name: 'Completion Sound Alert Toggle Switch',
    part: 'Pomodoro Timer Modal & Overlay',
    category: 'Pomodoro Focus Timer',
    whatItDoes: 'Toggles audio alerts on/off for Mario-themed timer completion fanfares while keeping visual countdowns active.',
    howToUse: 'Click the speaker/mute icon in the timer controls to silence audio in quiet libraries.',
    proTip: 'When muted, visual confetti and notifications still celebrate your session completion.',
  },
  {
    id: 'btn-pomodoro-pin-overlay',
    name: 'Pin Overlay to Screen Button',
    part: 'Pomodoro Timer Modal',
    category: 'Pomodoro Focus Timer',
    whatItDoes: 'Minimizes the timer into a compact, floating bottom-right screen pill while you browse modules.',
    howToUse: 'Click the pin/minimize icon.',
    proTip: 'Features sound toggle, quick reset, and play/pause controls right inside the mini pill.',
  },
  {
    id: 'btn-pomodoro-presets',
    name: 'Interval Presets (25m Focus / 5m Break / 15m Long Break)',
    part: 'Pomodoro Timer Modal',
    category: 'Pomodoro Focus Timer',
    whatItDoes: 'One-click switching between standard Pomodoro study intervals.',
    howToUse: 'Click 25m Focus, 5m Short Break, or 15m Long Break.',
    proTip: 'Taking 5-minute rest breaks after each 25-minute cycle increases long-term codal retention.',
  },

  // 9. Toad's Hero Shop & Vault
  {
    id: 'btn-shop-category-tabs',
    name: 'Shop Category Tabs (Heroes, Themes, Boosters, Titles, Audio)',
    part: "Toad's Grand Bazaar Header",
    category: "Toad's Hero Shop & Vault",
    whatItDoes: 'Navigates between all available reward categories in the coin store.',
    howToUse: 'Click any category tab to view available items.',
    proTip: 'Check out the new Prestige Titles category to unlock honorary legal degrees.',
  },
  {
    id: 'btn-mystery-gacha-hit',
    name: 'Lucky ? Block Mystery Hit Button',
    part: "Toad's Shop (? Block Tab)",
    category: "Toad's Hero Shop & Vault",
    whatItDoes: 'Gambles 15 coins to jump-hit the ? Block for randomized payouts up to 50 coins!',
    howToUse: 'Click the giant bouncing ? Block button.',
    proTip: 'Features celebratory fanfare and confetti when you hit the 50-coin jackpot.',
  },
  {
    id: 'btn-print-diploma',
    name: 'Print Master Diploma Button',
    part: "Toad's Shop (Master Diploma Tab)",
    category: "Toad's Hero Shop & Vault",
    whatItDoes: 'Prints the high-resolution Commemorative Certificate of Labor Standards Mastery.',
    howToUse: 'Type your candidate name into the diploma field and click "Print Certificate".',
    proTip: 'Features the Mushroom Kingdom Gold Seal and signature of Chief Arbiter Toad!',
  },

  // 10. User Profile & Milestones
  {
    id: 'btn-profile-edit-name',
    name: 'Edit Candidate Name (Pencil Icon)',
    part: 'User Profile Modal Header',
    category: 'User Profile & Statistics',
    whatItDoes: 'Customizes your Bar candidate profile name.',
    howToUse: 'Click the pencil icon, type your name, and hit Save.',
    proTip: 'Synchronizes automatically with the printable score card and master diploma.',
  },
  {
    id: 'btn-profile-recharts',
    name: 'Recharts Weekly Pomodoro History Chart',
    part: 'User Profile Modal (Weekly History Section)',
    category: 'User Profile & Statistics',
    whatItDoes: 'Interactive bar chart showing your daily focus sessions over the past 7 days.',
    howToUse: 'Hover or tap on any bar to see session count, minutes focused, and study streaks.',
    proTip: 'Highlights today’s bar in radiant gold so you can monitor your daily consistency.',
  },
  {
    id: 'btn-export-score-card',
    name: 'Export Score Card Button',
    part: 'User Profile Modal Header',
    category: 'User Profile & Statistics',
    whatItDoes: 'Generates a clean summary card of your codal mastery, quiz scores, and achievements.',
    howToUse: 'Click to view, copy, or print your milestone dossier.',
    proTip: 'Great for sharing your review progress with law school study groups.',
  },
];

export const AppWalkthroughModal: React.FC<AppWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onCompleteWalkthrough,
  colorMode,
  onToggleColorMode,
  studyDifficulty,
  onSelectDifficulty,
  equippedAvatar,
  onSelectAvatar,
  alreadyGraduated,
}) => {
  const [activeMode, setActiveMode] = useState<'chapters' | 'directory'>('chapters');
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [selectedDirectoryCategory, setSelectedDirectoryCategory] = useState<string>('All');
  const [expandedButtonId, setExpandedButtonId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStepIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (activeMode === 'chapters' && e.key === 'ArrowRight') {
        setStepIdx((prev) => Math.min(WALKTHROUGH_CHAPTERS.length - 1, prev + 1));
      } else if (activeMode === 'chapters' && e.key === 'ArrowLeft') {
        setStepIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activeMode]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    BUTTON_DIRECTORY.forEach((b) => set.add(b.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredButtons = useMemo(() => {
    return BUTTON_DIRECTORY.filter((btn) => {
      const matchesCat =
        selectedDirectoryCategory === 'All' || btn.category === selectedDirectoryCategory;
      const q = directorySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        btn.name.toLowerCase().includes(q) ||
        btn.part.toLowerCase().includes(q) ||
        btn.whatItDoes.toLowerCase().includes(q) ||
        btn.proTip.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedDirectoryCategory, directorySearch]);

  if (!isOpen) return null;

  const chapter = WALKTHROUGH_CHAPTERS[stepIdx] || WALKTHROUGH_CHAPTERS[0];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === WALKTHROUGH_CHAPTERS.length - 1;
  const progressPct = Math.round(((stepIdx + 1) / WALKTHROUGH_CHAPTERS.length) * 100);

  const renderChapterIcon = (id: string, cls = 'w-5 h-5') => {
    switch (id) {
      case 'welcome_setup':
        return <Compass className={`${cls} text-amber-400`} />;
      case 'world_map_progression':
        return <Map className={`${cls} text-emerald-400`} />;
      case 'unabridged_modules':
        return <BookOpen className={`${cls} text-red-400`} />;
      case 'holidays_and_regions':
        return <Calendar className={`${cls} text-rose-400`} />;
      case 'statutory_calculator':
        return <Calculator className={`${cls} text-cyan-400`} />;
      case 'mystery_flashcards':
        return <HelpCircle className={`${cls} text-yellow-300`} />;
      case 'quizzes_and_boss':
        return <Trophy className={`${cls} text-amber-300`} />;
      case 'pomodoro_audio_notes':
        return <Clock className={`${cls} text-sky-400`} />;
      case 'vault_and_shop':
        return <Gamepad2 className={`${cls} text-emerald-300`} />;
      case 'profile_print_pwa':
      default:
        return <Award className={`${cls} text-amber-400`} />;
    }
  };

  const handleFinishTour = (targetTab?: string) => {
    marioAudio.playLevelUp();
    try {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.55 } });
    } catch {
      // ignore
    }
    onCompleteWalkthrough(targetTab);
  };

  return (
    <div
      role="dialog"
      aria-label="Complete Interactive App Guide Walkthrough"
      data-testid="app-walkthrough-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 select-none overflow-y-auto print:hidden"
    >
      <div className="bg-[#1e293b] text-white w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[94vh] rounded-none sm:rounded-3xl border-0 sm:border-4 border-slate-950 shadow-[10px_10px_0_#000] overflow-hidden my-auto flex flex-col safe-top-nav safe-bottom-dock">
        {/* Top Progress Header */}
        <div className="bg-[#0f172a] px-4 sm:px-6 py-3.5 border-b-2 border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000] shrink-0">
              <MarioMushroomIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-black uppercase text-amber-400 font-mario">
                <span>MARIO LABOR LAW ADVENTURE</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300">{MAIN_CREATOR_AUTHOR.shortBadge}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display truncate">
                {activeMode === 'chapters'
                  ? `STEP-BY-STEP TOUR · CHAPTER ${stepIdx + 1} OF ${WALKTHROUGH_CHAPTERS.length}`
                  : `BUTTON-BY-BUTTON MASTER ATLAS (${BUTTON_DIRECTORY.length} CONTROLS)`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mode Switcher Tabs */}
            <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('chapters');
                  marioAudio.playTabSwitch();
                }}
                className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeMode === 'chapters'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>10-Chapter Tour</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('directory');
                  marioAudio.playTabSwitch();
                }}
                className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeMode === 'directory'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
                <span>Button Atlas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onCompleteWalkthrough();
                marioAudio.playPipe();
              }}
              data-testid="walkthrough-skip-btn"
              className="hidden sm:inline-flex min-h-[44px] px-3 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-600 cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onCompleteWalkthrough();
                marioAudio.playPipe();
              }}
              aria-label="Close Walkthrough Guide"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Continuous Progress Bar in Chapter Mode */}
        {activeMode === 'chapters' && (
          <div className="w-full h-2 bg-slate-950 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        {/* MODE 1: 10-CHAPTER GUIDED TOUR */}
        {activeMode === 'chapters' && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Left Chapter Rail */}
            <aside className="lg:col-span-4 bg-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800 p-3 sm:p-4">
              <div className="hidden lg:block mb-2.5">
                <span className="text-[10px] font-black uppercase text-slate-400 font-mario">
                  10 GUIDE CHAPTERS
                </span>
              </div>
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                {WALKTHROUGH_CHAPTERS.map((ch, idx) => {
                  const isActive = idx === stepIdx;
                  const isVisited = idx < stepIdx;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setStepIdx(idx);
                        marioAudio.playJump();
                      }}
                      data-testid={`walkthrough-step-tab-${ch.stepNumber}`}
                      className={`px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 lg:w-full ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 border-black font-black shadow-[0_2px_0_#000]'
                          : isVisited
                          ? 'bg-slate-900 text-emerald-300 border-slate-800 hover:bg-slate-800 font-bold'
                          : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-800 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-mario tabular-nums shrink-0 ${
                            isActive ? 'text-slate-950' : 'text-amber-400'
                          }`}
                        >
                          {String(ch.stepNumber).padStart(2, '0')}
                        </span>
                        <span className="text-xs whitespace-nowrap lg:truncate">{ch.shortTitle}</span>
                      </div>
                      {isVisited && !isActive && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden lg:block" />
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Interactive Chapter Stage */}
            <div className="lg:col-span-8 p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Chapter Kicker + Headline */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    {renderChapterIcon(chapter.id, 'w-4 h-4')}
                    <span>{chapter.kicker}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                    {chapter.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {chapter.summary}
                  </p>
                </div>

                {/* 3 Structured Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {chapter.highlights.map((hl, idx) => (
                    <div
                      key={hl.label}
                      className="bg-slate-900 rounded-2xl p-3 border border-slate-700 space-y-1"
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="text-[10px] font-mono font-black text-amber-400 tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                          0{idx + 1}.
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-white font-display leading-snug">
                          {hl.label}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{hl.detail}</p>
                    </div>
                  ))}
                </div>

                {/* Step 1 Setup Playground */}
                {stepIdx === 0 && (
                  <div className="bg-slate-950/90 rounded-2xl p-4 border-2 border-amber-400/60 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
                        LIVE QUICK SETUP — PERSONALIZE YOUR EXPERIENCE NOW
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Theme Toggle */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-700 space-y-2">
                        <span className="text-xs font-black text-slate-200 block">
                          1. Reading Theme (Day vs Late-Night)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onToggleColorMode('light');
                              marioAudio.playCoin();
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-black inline-flex items-center justify-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                              colorMode === 'light'
                                ? 'bg-amber-400 text-slate-950 border-black'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Sun className="w-3.5 h-3.5" />
                            <span>Light Sky</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onToggleColorMode('dark');
                              marioAudio.playPowerUp();
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-black inline-flex items-center justify-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                              colorMode === 'dark'
                                ? 'bg-indigo-500 text-white border-black'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Moon className="w-3.5 h-3.5" />
                            <span>Dark Night</span>
                          </button>
                        </div>
                      </div>

                      {/* Difficulty Toggle */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-700 space-y-2">
                        <span className="text-xs font-black text-slate-200 block">
                          2. Quiz &amp; Flashcard Difficulty
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDifficulty('casual');
                              marioAudio.playPowerUp();
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-black inline-flex items-center justify-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                              studyDifficulty === 'casual'
                                ? 'bg-emerald-400 text-slate-950 border-black'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Feather className="w-3.5 h-3.5" />
                            <span>Casual</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDifficulty('exam_prep');
                              marioAudio.playFireball();
                            }}
                            className={`py-2 px-2.5 rounded-lg text-xs font-black inline-flex items-center justify-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                              studyDifficulty === 'exam_prep'
                                ? 'bg-red-600 text-white border-black'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Exam Prep</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Starter Hero Selector */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-black text-slate-200 block">
                        3. Pick Your Starting Hero (34 Characters Available)
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {HERO_ROSTER.slice(0, 8).map((hero) => (
                          <button
                            key={hero.id}
                            type="button"
                            onClick={() => {
                              onSelectAvatar(hero.id);
                              marioAudio.playCoin();
                            }}
                            className={`min-h-[48px] p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                              equippedAvatar === hero.id
                                ? 'bg-amber-400 text-slate-950 border-black font-black'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/60'
                            }`}
                          >
                            <MarioCharacterAvatar character={hero.id} className="w-6 h-6" />
                            <span className="text-[10px] font-bold truncate w-full text-center">
                              {hero.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Official Creator Attribution inside App Information / Walkthrough Modal */}
                    <div
                      data-testid="walkthrough-matthew-credit-card"
                      className="bg-slate-900/95 rounded-xl px-3.5 py-2.5 border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <MarioStarIcon className="w-4 h-4 shrink-0" />
                        <span className="font-black text-amber-300">
                          {MAIN_CREATOR_AUTHOR.shortBadge}
                        </span>
                        <span className="text-slate-400 hidden sm:inline">·</span>
                        <span className="text-slate-200 font-semibold">
                          Matthew Cesar Corpuz — Main Creator of this Memory Aid
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-300">
                        Worlds 1–6 Unabridged Edition
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 8 Audio Preview */}
                {stepIdx === 7 && (
                  <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
                        TRY SOUND ALERTS &amp; AMBIENT SOUNDSCAPES
                      </span>
                      <button
                        type="button"
                        onClick={() => marioAudio.playPomodoroFocusComplete()}
                        className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs border border-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Preview 25m Pomodoro Chime</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MARIO_SOUNDSCAPES.map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => marioAudio.setSoundscape(sc.id, true)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left cursor-pointer"
                        >
                          <span className="text-xs font-black text-amber-300 block">
                            ♫ {sc.shortName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {sc.bpmLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Study Tip Box */}
                <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <MarioStarIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-300 font-mario block">
                      PRO BAR REVIEW TIP
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                      {chapter.proTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: BUTTON-BY-BUTTON & PART-BY-PART MASTER DIRECTORY */}
        {activeMode === 'directory' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 min-h-0">
            {/* Search & Filter Header */}
            <div className="bg-slate-900 rounded-2xl p-4 border-2 border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search any button, part, tab, switch, or stepper..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border-2 border-slate-700 rounded-xl text-white text-xs sm:text-sm font-semibold placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="text-xs font-bold text-amber-300 px-2 py-1 bg-black/60 rounded-lg border border-amber-400/40 shrink-0 text-center">
                  Showing {filteredButtons.length} of {BUTTON_DIRECTORY.length} Controls
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedDirectoryCategory(cat);
                      marioAudio.playTabSwitch();
                    }}
                    className={`px-3 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer whitespace-nowrap ${
                      selectedDirectoryCategory === cat
                        ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              {filteredButtons.map((btn) => {
                const isExpanded = expandedButtonId === btn.id;

                return (
                  <div
                    key={btn.id}
                    className="bg-slate-900 rounded-2xl border-2 border-slate-700 hover:border-amber-400/80 transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedButtonId(isExpanded ? null : btn.id);
                        marioAudio.playCoin();
                      }}
                      className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-black text-amber-400 border border-slate-700 font-mario">
                            {btn.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate">
                            📍 {btn.part}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white font-display flex items-center gap-1.5">
                          <span>{btn.name}</span>
                        </h4>
                        <p className="text-xs text-slate-300 font-medium line-clamp-2">
                          {btn.whatItDoes}
                        </p>
                      </div>

                      <div className="p-1 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800 space-y-2 bg-slate-950/60 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                            HOW TO OPERATE
                          </span>
                          <p className="text-slate-200 font-semibold leading-relaxed">
                            {btn.howToUse}
                          </p>
                        </div>

                        <div className="space-y-0.5 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                          <span className="text-[10px] font-black uppercase text-emerald-300 font-mario block">
                            ★ BAR CANDIDATE PRO TIP
                          </span>
                          <p className="text-slate-300 leading-relaxed font-medium">
                            {btn.proTip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pinned Bottom Navigation Footer + Discreet Official Creator Credit */}
        <div className="bg-[#0f172a] px-4 sm:px-6 py-3 border-t-2 border-slate-700 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {activeMode === 'chapters' ? (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => {
                    setStepIdx((prev) => Math.max(0, prev - 1));
                    marioAudio.playJump();
                  }}
                  className="min-h-[44px] px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-xs border-2 border-slate-600 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span
                  data-testid="walkthrough-matthew-credit"
                  className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
                >
                  <span className="text-amber-300">{MAIN_CREATOR_AUTHOR.shortBadge}</span>
                  <span aria-hidden="true">·</span>
                  <span>Main Creator of this Memory Aid</span>
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {!isLast && (
                  <button
                    type="button"
                    onClick={() => {
                      onCompleteWalkthrough(chapter.targetTab);
                      marioAudio.playTabSwitch();
                    }}
                    className="hidden sm:inline-flex min-h-[44px] px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-600 items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>{chapter.ctaLabel}</span>
                  </button>
                )}

                {isLast ? (
                  <button
                    type="button"
                    data-testid="walkthrough-finish-btn"
                    onClick={() => handleFinishTour('map')}
                    className="min-h-[44px] px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <MarioStarIcon className="w-4 h-4" />
                    <span>
                      {alreadyGraduated
                        ? 'Finish Walkthrough'
                        : 'Finish Guide & Claim +25 Coins'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="walkthrough-next-btn"
                    onClick={() => {
                      setStepIdx((prev) => Math.min(WALKTHROUGH_CHAPTERS.length - 1, prev + 1));
                      marioAudio.playCoin();
                    }}
                    className="min-h-[44px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Next Chapter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-semibold">
                {MAIN_CREATOR_AUTHOR.shortBadge} · Inspect every button, tab, and calculation switch across all 6 Worlds.
              </span>
              <button
                type="button"
                onClick={() => {
                  onCompleteWalkthrough();
                  marioAudio.playPipe();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] cursor-pointer whitespace-nowrap"
              >
                Close Atlas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

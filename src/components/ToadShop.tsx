import React, { useState, useEffect } from 'react';
import {
  MarioTheme,
  MarioAvatar,
  ShopItem,
  SoundPackId,
  StudyCompanionId,
  CardFrameId,
} from '../types/laborLaw';
import { HERO_ROSTER } from '../data/heroesData';
import {
  MarioCoinIcon,
  MarioMushroomIcon,
  MarioCharacterAvatar,
  MarioStarIcon,
  Mario1UpIcon,
  MarioFireFlowerIcon,
  MarioPeachCrownIcon,
  MarioLakituCloudIcon,
  MarioIceFlowerIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import { loadPlayerProfileStats } from '../utils/profileAchievements';
import {
  getSuperStarBuffStatus,
  MAIN_CREATOR_AUTHOR,
} from '../utils/engagementFeatures';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Palette,
  User,
  Zap,
  X,
  Users,
  Volume2,
  Crown,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Printer,
  Check,
  Play,
  Pause,
  BookOpen,
  RotateCcw,
  Map as MapIcon,
  Trophy,
  Frame,
  Heart,
} from 'lucide-react';

interface ToadShopProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  activeTheme: MarioTheme;
  setActiveTheme: (theme: MarioTheme) => void;
  equippedAvatar: MarioAvatar;
  setEquippedAvatar: (avatar: MarioAvatar) => void;
  onClose?: () => void;
  isModal?: boolean;
  superStarEndsAt?: number;
  onActivateSuperStar?: (durationMinutes: number) => void;
  shortcutMapActive?: boolean;
  onToggleShortcutMap?: (active: boolean) => void;
  equippedCompanion?: StudyCompanionId;
  onEquipCompanion?: (id: StudyCompanionId) => void;
  equippedCardFrame?: CardFrameId;
  onEquipCardFrame?: (id: CardFrameId) => void;
  onBoostStreak?: (days: number) => void;
  onOpenLeaderboard?: () => void;
}

export const POWERUP_ITEMS: ShopItem[] = [
  {
    id: 'powerup_super_star',
    name: 'Super Star Power-Up (10 Mins)',
    category: 'powerup',
    price: 35,
    description:
      'Doubles ALL Gold Coin earnings (2x multiplier) across modules, flashcards, Quick Study, quizzes, Pomodoro, and arcade games for 10 minutes!',
    badge: '2x Coins · 10m',
    perkEffect: 'Instant 10-Minute 2x Coin Multiplier (Stackable)',
    isConsumable: true,
    durationMinutes: 10,
  },
  {
    id: 'map_shortcut_bar',
    name: "Toad's Bar Exam Shortcut Map",
    category: 'powerup',
    price: 45,
    description:
      'Illuminates high-yield Bar Exam doctrines and Warp Shortcuts across the Overworld Map and inside every Module Topic Card (Worlds 1–6).',
    badge: 'Shortcut Map',
    perkEffect: 'Highlights Key Topics & Bar Traps Everywhere',
  },
  {
    id: 'powerup_mega_star_30m',
    name: 'Grand Star Overdrive (30 Mins)',
    category: 'powerup',
    price: 85,
    description:
      'Extended invincibility rush! Doubles all coin rewards (2x) across every study activity and Boss Battle for a full 30-minute block.',
    badge: '2x Coins · 30m',
    perkEffect: '30-Minute 2x Coin Multiplier (Stackable)',
    isConsumable: true,
    durationMinutes: 30,
  },
  {
    id: 'powerup_fire_flower_streak',
    name: 'Fire Flower Streak Booster (+5 Days)',
    category: 'powerup',
    price: 60,
    description:
      'Instantly fuels your Consecutive Days Studied tracker by +5 days and blooms an immediate Fire Flower milestone badge on the Overworld Map!',
    badge: '+1 Fire Flower',
    perkEffect: '+5 Consecutive Study Days Instantly',
    isConsumable: true,
  },
];

export const COMPANION_ITEMS: ShopItem[] = [
  {
    id: 'comp_luma',
    name: 'Starlight Luma Scholar',
    category: 'companion',
    companionId: 'comp_luma',
    price: 55,
    description: 'Celestial Star Luma companion who cheers you on with high-yield Labor Standards reminders.',
    badge: 'Galaxy Buddy',
  },
  {
    id: 'comp_baby_yoshi',
    name: 'Golden Baby Yoshi',
    category: 'companion',
    companionId: 'comp_baby_yoshi',
    price: 65,
    description: 'Cheerful island companion who loves statutory leaves and Holiday Pay multipliers.',
    badge: 'Dino Buddy',
  },
  {
    id: 'comp_counsel_toad',
    name: 'Counsel Toad Esq.',
    category: 'companion',
    companionId: 'comp_counsel_toad',
    price: 75,
    description: 'Bar-certified Mushroom Kingdom paralegal carrying miniature Labor Code annotations.',
    badge: 'Legal Clerk',
  },
  {
    id: 'comp_polterpup',
    name: 'Polterpup Night-Shift Hound',
    category: 'companion',
    companionId: 'comp_polterpup',
    price: 80,
    description: 'Loyal glowing pup guarding your late-night 10 PM – 6 AM (+10% NSD) review sessions.',
    badge: 'Night Buddy',
  },
  {
    id: 'comp_lakitu',
    name: 'Lakitu Cloud Broadcast',
    category: 'companion',
    companionId: 'comp_lakitu',
    price: 90,
    description: 'Hovers beside your workspace spotting exam exceptions and prescriptive periods.',
    badge: 'Sky Scout',
  },
  {
    id: 'comp_chain_chomp',
    name: 'Royal Gold Chain Chomp',
    category: 'companion',
    companionId: 'comp_chain_chomp',
    price: 120,
    description: 'Fierce golden courtroom guardian that chomps through Labor-Only Contracting traps!',
    badge: 'Luxury Pet',
  },
];

export const CARD_FRAME_ITEMS: ShopItem[] = [
  {
    id: 'frame_default',
    name: 'Classic Ink Slate Frame',
    category: 'frame',
    frameId: 'frame_default',
    price: 0,
    description: 'Clean high-contrast Mushroom Kingdom ink border for distraction-free statutory reading.',
    badge: 'Standard',
  },
  {
    id: 'frame_royal_gold',
    name: 'Royal Gold Sovereign Frame',
    category: 'frame',
    frameId: 'frame_royal_gold',
    price: 50,
    description: 'Gilded championship trim around every Module Topic Card with warm golden accents.',
    badge: 'Gold Trim',
  },
  {
    id: 'frame_emerald_pipe',
    name: 'Emerald Warp Pipe Frame',
    category: 'frame',
    frameId: 'frame_emerald_pipe',
    price: 45,
    description: 'Crisp Warp Zone emerald border styling engineered for rapid visual scanning.',
    badge: 'Warp Trim',
  },
  {
    id: 'frame_retro_brick',
    name: '1985 Heritage Brick Frame',
    category: 'frame',
    frameId: 'frame_retro_brick',
    price: 55,
    description: 'Warm terracotta NES block trim celebrating classic World 1-1 platforming.',
    badge: 'Retro 85',
  },
  {
    id: 'frame_starlight_prism',
    name: 'Starlight Observatory Frame',
    category: 'frame',
    frameId: 'frame_starlight_prism',
    price: 70,
    description: 'Luminous indigo-cyan cosmic border inspired by Rosalina’s Comet Observatory.',
    badge: 'Starlight',
  },
  {
    id: 'frame_supreme_crimson',
    name: 'Supreme Court Crimson Frame',
    category: 'frame',
    frameId: 'frame_supreme_crimson',
    price: 95,
    description: 'Distinguished judicial crimson border reserved for dedicated Bar Exam contenders.',
    badge: 'Judicial',
  },
];

export const THEME_ITEMS: ShopItem[] = [
  {
    id: 'theme_pro_study_paper',
    name: 'Pro Study: Archival Paper',
    category: 'theme',
    themeId: 'pro_study_paper',
    price: 35,
    badge: 'Pro Study',
    description:
      'Minimalist warm archival cream paper, crisp charcoal ink, hairline borders, and 1.74x reading line-height for zero eye strain.',
    previewColor: '#f5f2eb',
  },
  {
    id: 'theme_pro_study_slate',
    name: 'Pro Study: Midnight Slate',
    category: 'theme',
    themeId: 'pro_study_slate',
    price: 40,
    badge: 'Pro Study',
    description:
      'High-contrast matte slate dark-study skin with soft ivory typography and anti-glare surfaces built for marathon night Bar review.',
    previewColor: '#131924',
  },
  {
    id: 'theme_pro_study_sage',
    name: 'Pro Study: Botanical Sage',
    category: 'theme',
    themeId: 'pro_study_sage',
    price: 45,
    badge: 'Pro Study',
    description:
      'Calm low-glare botanical sage reading environment with deep forest slate ink and relaxed legal editorial typography.',
    previewColor: '#eaf2ec',
  },
  {
    id: 'theme_overworld',
    name: 'Overworld Classic',
    category: 'theme',
    themeId: 'overworld',
    price: 0,
    badge: 'Arcade',
    description: 'Iconic Mario green pipes, bright sky clouds, and golden sunlight.',
    previewColor: '#0f172a',
  },
  {
    id: 'theme_underground',
    name: 'Underground Cavern',
    category: 'theme',
    themeId: 'underground',
    price: 20,
    description: 'Deep subterranean cobalt caves with glowing cyan mushroom crystals.',
    previewColor: '#070e1b',
  },
  {
    id: 'theme_castle',
    name: "Bowser's Castle",
    category: 'theme',
    themeId: 'castle',
    price: 35,
    description: 'Dark obsidian lava keep with bubbling volcanic magma orange accents.',
    previewColor: '#450a0a',
  },
  {
    id: 'theme_galaxy',
    name: 'Starry Galaxy',
    category: 'theme',
    themeId: 'galaxy',
    price: 45,
    description: 'Cosmic deep space navy with glimmering golden nebula dust.',
    previewColor: '#1e1b4b',
  },
  {
    id: 'theme_rainbow',
    name: 'Rainbow Road',
    category: 'theme',
    themeId: 'rainbow',
    price: 60,
    description: 'Vibrant prism road skyline with luminous arcade pastel energy.',
    previewColor: '#3b0764',
  },
  {
    id: 'theme_bowser_lava',
    name: 'Bowser Magma Keep',
    category: 'theme',
    themeId: 'bowser_lava',
    price: 75,
    description: 'Intense boiling molten rock, fiery obsidian fortresses and brimstone ash.',
    previewColor: '#5c0a0a',
  },
  {
    id: 'theme_retro_nes',
    name: 'NES 1985 Retro 8-Bit',
    category: 'theme',
    themeId: 'retro_nes',
    price: 50,
    description: 'Nostalgic CRT raster glow, vintage brown clay bricks, and retro pixel sky.',
    previewColor: '#1b1b1b',
  },
  {
    id: 'theme_neon_synth',
    name: 'Neon Synth Arcade',
    category: 'theme',
    themeId: 'neon_synth',
    price: 65,
    description: 'Electric cyber violet, glowing cyan laser wireframes, and hot magenta beams.',
    previewColor: '#2b0938',
  },
  {
    id: 'theme_desert_oasis',
    name: 'Koopa Desert Oasis',
    category: 'theme',
    themeId: 'desert_oasis',
    price: 40,
    description: 'Sun-drenched golden pyramid sands, gentle turquoise mirages, and sunset warmth.',
    previewColor: '#2a1a08',
  },
  {
    id: 'theme_aurora',
    name: 'Boreal Star Aurora',
    category: 'theme',
    themeId: 'aurora',
    price: 80,
    description: 'Magical emerald northern polar lights shimmering across deep alpine starlight.',
    previewColor: '#052328',
  },
];

export const AVATAR_ITEMS: ShopItem[] = HERO_ROSTER.map((hero) => ({
  id: `avatar_${hero.id}`,
  name: hero.name,
  category: 'avatar',
  avatarId: hero.id,
  price: hero.shopPrice,
  description: hero.description,
  faction: hero.faction,
}));

export const PERK_ITEMS: ShopItem[] = [
  {
    id: 'perk_life',
    name: '1-Up Life Ring',
    category: 'perk',
    price: 30,
    description: 'Grants 1 extra heart in the Bowser Boss Battle combat mode.',
    badge: 'Extra Life',
    perkEffect: '+1 Heart in Boss Fight',
  },
  {
    id: 'perk_star',
    name: 'Star Shield',
    category: 'perk',
    price: 35,
    description: 'Survives 1 round timeout in the Boss Battle without taking damage.',
    badge: 'Invincible',
    perkEffect: 'Timeout Protection',
  },
  {
    id: 'perk_double',
    name: 'Double Coin Mushroom',
    category: 'perk',
    price: 40,
    description: 'Permanent +1 bonus coin charm when practicing flashcards and quizzes.',
    badge: 'Coin Charm',
    perkEffect: '+1 Bonus Coin Charm',
  },
  {
    id: 'perk_lakitu_glasses',
    name: 'Lakitu 50/50 Glasses',
    category: 'perk',
    price: 45,
    description: 'Eliminates 2 incorrect answer choices during tough Bar Exam multiple-choice quizzes.',
    badge: '50/50 MCQ',
    perkEffect: 'Cross out 2 Wrong Answers',
  },
  {
    id: 'perk_streak_freeze',
    name: 'Ice Flower Streak Freeze',
    category: 'perk',
    price: 50,
    description: 'Shields your daily study streak from resetting if you miss a study day.',
    badge: 'Streak Shield',
    perkEffect: '1-Day Streak Protection',
  },
  {
    id: 'perk_golden_fireball',
    name: 'Golden Fireball 3x',
    category: 'perk',
    price: 55,
    description: 'Unleashes radiant golden flame that triples all Boss Battle coin rewards.',
    badge: '3x Reward',
    perkEffect: '3x Boss Battle Coins',
  },
  {
    id: 'perk_chrono_watch',
    name: 'Chrono Pocket Watch',
    category: 'perk',
    price: 60,
    description: 'Adds +15 seconds of bonus thinking time on all timed Boss Battle combat questions.',
    badge: '+15s Clock',
    perkEffect: '+15s Boss Timer',
  },
  {
    id: 'perk_espresso_mushroom',
    name: 'Espresso Power Mushroom',
    category: 'perk',
    price: 25,
    description: 'Instant turbo booster that plays a joyful Mario fanfare and grants +10 instant focus boost.',
    badge: 'Focus Boost',
    perkEffect: 'Instant Fanfare & Alertness',
  },
  {
    id: 'perk_kart_gold_boost',
    name: 'Kart Golden Star Overdrive',
    category: 'perk',
    price: 35,
    description: 'Upgrades Labor Kart with enhanced drift mini-turbo sparks and permanent acceleration boost!',
    badge: 'Kart Turbo',
    perkEffect: 'Drift Boost Mini-Turbo Overdrive',
  },
  {
    id: 'perk_infinite_jump',
    name: 'Cape Feather Jump Enhancer',
    category: 'perk',
    price: 40,
    description: 'Super-charges your 2D platformer jump height with variable float aerodynamics!',
    badge: 'Cape Feather',
    perkEffect: 'Enhanced 2D Platformer Float',
  },
  {
    id: 'perk_triple_star_coin',
    name: 'Golden Star Coin Multiplier',
    category: 'perk',
    price: 45,
    description: 'Doubles all bonus coins awarded from World Level-Ups and Arcade Mini-Games!',
    badge: '2x Level-Up',
    perkEffect: '2x Bonus Coins across Games',
  },
  {
    id: 'perk_bar_defense_shield',
    name: 'Bar Exam Second-Chance Shield',
    category: 'perk',
    price: 50,
    description: 'Provides a second chance shield when attempting tough Labor Standards bar scenarios!',
    badge: 'Exam Shield',
    perkEffect: 'Protects Quiz Score on Missed Questions',
  },
];

export const PRESTIGE_ITEMS: ShopItem[] = [
  {
    id: 'title_supreme_arbiter',
    name: 'Supreme Labor Arbiter',
    category: 'title',
    price: 100,
    description: 'Elite honorary title displayed across your User Profile & Score Card.',
    badge: 'NLRC Sovereign',
  },
  {
    id: 'title_kasambahay_champion',
    name: 'Kasambahay Champion',
    category: 'title',
    price: 75,
    description: 'Commemorates mastery of R.A. 10361 Domestic Workers statutory rights.',
    badge: 'R.A. 10361 Guardian',
  },
  {
    id: 'title_leave_specialist',
    name: 'World 6 Statutory Leave Specialist',
    category: 'title',
    price: 110,
    description: 'Honors mastery of SIL, 105-Day Maternity, Paternity, Solo Parent, Gynecological & VAWC Leaves.',
    badge: 'World 6 Master',
  },
  {
    id: 'title_codal_sovereign',
    name: 'Invincible Codal Sovereign',
    category: 'title',
    price: 150,
    description: 'Badge of honor for mastering every single unabridged article in the Labor Code.',
    badge: '100% Codal',
  },
  {
    id: 'title_undersecretary',
    name: 'Undersecretary of Labor Standards',
    category: 'title',
    price: 200,
    description: 'High-ranking executive title certifying supreme knowledge of DOLE issuances.',
    badge: 'DOLE Bureau',
  },
  {
    id: 'title_dean_jurisprudence',
    name: 'Dean of Philippine Jurisprudence',
    category: 'title',
    price: 300,
    description: 'The pinnacle of achievement in Philippine Labor Standards and Social Legislation.',
    badge: 'Juris Doctor',
  },
  {
    id: 'title_mushroom_chief_justice',
    name: 'Grand Chief Justice of the Star Realm',
    category: 'title',
    price: 500,
    description: 'Ultimate coin-vault prestige honor reserved for top earners on the Global Coin Leaderboard.',
    badge: 'Supreme Seal',
  },
];

export const SOUNDPACK_ITEMS: ShopItem[] = [
  {
    id: 'sound_default',
    name: 'Mushroom Kingdom Classic',
    category: 'soundpack',
    soundPackId: 'sound_default',
    price: 0,
    description: 'Iconic Mario chiptune tones with balanced square waves, crisp coin pings, and playful arpeggios.',
    badge: 'Classic 8-Bit',
  },
  {
    id: 'sound_nes_8bit',
    name: 'NES 8-Bit Chiptune Pack',
    category: 'soundpack',
    soundPackId: 'sound_nes_8bit',
    price: 30,
    description: 'Crisp square-wave and triangle-wave sound effects inspired by the 1985 NES original.',
    badge: 'NES 1985',
  },
  {
    id: 'sound_snes_16bit',
    name: 'SNES 16-Bit Super Chime',
    category: 'soundpack',
    soundPackId: 'sound_snes_16bit',
    price: 45,
    description: 'Rich stereo brass, crystal bells, dual-voice warmth, and orchestra hits from the 1990 Super Mario World era.',
    badge: '16-Bit Super',
  },
  {
    id: 'sound_zen_lofi',
    name: 'Zen Lofi Study Chimes',
    category: 'soundpack',
    soundPackId: 'sound_zen_lofi',
    price: 50,
    description: 'Gentle pure-sine kalimba tones and warm mellow resonance for soothing deep-focus Bar review sessions.',
    badge: 'Zen Study',
  },
  {
    id: 'sound_galaxy_synth',
    name: 'Cosmic Galaxy Synth Pack',
    category: 'soundpack',
    soundPackId: 'sound_galaxy_synth',
    price: 60,
    description: 'Ethereal star arpeggios, shimmering space harmonics, and celestial chime cascades.',
    badge: 'Galaxy 2007',
  },
  {
    id: 'sound_bowser_metal',
    name: 'Bowser Lava Rock Overdrive',
    category: 'soundpack',
    soundPackId: 'sound_bowser_metal',
    price: 65,
    description: 'Boiling sawtooth distortion, crunchy sub-bass power, and intense courtroom boss energy.',
    badge: 'Magma Rock',
  },
];

export const CERTIFICATE_ITEM: ShopItem = {
  id: 'cert_mastery',
  name: 'Official Certificate of Labor Standards Mastery',
  category: 'certificate',
  price: 50,
  description: 'Unlocks a high-resolution, printable diploma certifying your mastery of Philippine Labor Standards with the Mushroom Kingdom Gold Seal!',
  badge: 'Printable Diploma',
};

export const ToadShop: React.FC<ToadShopProps> = ({
  coins,
  setCoins,
  activeTheme,
  setActiveTheme,
  equippedAvatar,
  setEquippedAvatar,
  onClose,
  isModal = false,
  superStarEndsAt = 0,
  onActivateSuperStar,
  shortcutMapActive = false,
  onToggleShortcutMap,
  equippedCompanion = 'comp_none',
  onEquipCompanion,
  equippedCardFrame = 'frame_default',
  onEquipCardFrame,
  onBoostStreak,
  onOpenLeaderboard,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    | 'powerups'
    | 'avatars'
    | 'companions'
    | 'themes'
    | 'perks'
    | 'prestige'
    | 'soundpacks'
    | 'mystery'
    | 'certificate'
  >('powerups');
  const [selectedFaction, setSelectedFaction] = useState<string>('All');
  const [mysteryResult, setMysteryResult] = useState<string | null>(null);
  const [isRollingMystery, setIsRollingMystery] = useState<boolean>(false);
  const [powerupNotice, setPowerupNotice] = useState<string | null>(null);
  const [, setNowTick] = useState<number>(() => Date.now());

  const [certRecipientName, setCertRecipientName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stats = loadPlayerProfileStats(window.localStorage);
      if (stats.playerName && stats.playerName !== 'Law Adventurer') {
        return stats.playerName;
      }
    }
    return 'Mario Bar Candidate';
  });

  const [equippedTitle, setEquippedTitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mario_equipped_title') || '';
    }
    return '';
  });

  const [localCompanion, setLocalCompanion] = useState<StudyCompanionId>(() => {
    if (equippedCompanion && equippedCompanion !== 'comp_none') return equippedCompanion;
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('mario_study_companion_v1') as StudyCompanionId) || 'comp_none';
    }
    return 'comp_none';
  });

  const [localCardFrame, setLocalCardFrame] = useState<CardFrameId>(() => {
    if (equippedCardFrame && equippedCardFrame !== 'frame_default') return equippedCardFrame;
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('mario_card_frame_v1') as CardFrameId) || 'frame_default';
    }
    return 'frame_default';
  });

  const [localSuperStarEndsAt, setLocalSuperStarEndsAt] = useState<number>(() => {
    if (superStarEndsAt > 0) return superStarEndsAt;
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('mario_super_star_expiry_ms_v1') || '0') || 0;
    }
    return 0;
  });

  const [localShortcutMap, setLocalShortcutMap] = useState<boolean>(() => {
    if (shortcutMapActive) return true;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mario_shortcut_map_active_v1') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (superStarEndsAt > 0) setLocalSuperStarEndsAt(superStarEndsAt);
  }, [superStarEndsAt]);

  useEffect(() => {
    setLocalShortcutMap(shortcutMapActive);
  }, [shortcutMapActive]);

  useEffect(() => {
    const effectiveEnd = Math.max(superStarEndsAt, localSuperStarEndsAt);
    if (effectiveEnd <= Date.now()) return;
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [superStarEndsAt, localSuperStarEndsAt]);

  const effectiveStarStatus = getSuperStarBuffStatus(
    Math.max(superStarEndsAt, localSuperStarEndsAt)
  );
  const effectiveShortcutActive = shortcutMapActive || localShortcutMap;
  const activeCompanion = onEquipCompanion ? equippedCompanion : localCompanion;
  const activeFrame = onEquipCardFrame ? equippedCardFrame : localCardFrame;

  const [themePackFilter, setThemePackFilter] = useState<'all' | 'pro_study' | 'arcade'>('all');
  const [equippedSoundPack, setEquippedSoundPack] = useState<SoundPackId>(() => {
    return marioAudio.settings.soundPack || 'sound_default';
  });
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(() => {
    return marioAudio.isMusicPlaying();
  });

  useEffect(() => {
    return marioAudio.subscribe((s) => {
      if (s.soundPack) {
        setEquippedSoundPack(s.soundPack);
      }
      setIsBgmPlaying(Boolean(s.enabled && s.musicEnabled && marioAudio.isMusicPlaying()));
    });
  }, []);

  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() => {
    const defaults = [
      'theme_overworld',
      'avatar_mario',
      'avatar_luigi',
      'avatar_peach',
      'sound_default',
      'frame_default',
    ];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_unlocked_items');
        if (saved) {
          const parsed = JSON.parse(saved) as string[];
          return Array.from(new Set([...defaults, ...parsed]));
        }
        return defaults;
      } catch {
        return defaults;
      }
    }
    return defaults;
  });

  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleRestorePurchases = () => {
    const report = marioAudio.restoreAudioPacks();
    const merged = Array.from(new Set([...unlockedItemIds, ...report.restoredPacks]));
    setUnlockedItemIds(merged);
    try {
      localStorage.setItem('mario_unlocked_items', JSON.stringify(merged));
    } catch {
      // ignore
    }
    setEquippedSoundPack(report.activePack);
    setRestoreMessage(
      `Restored ${report.restoredPacks.length} Audio Packs & verified Modules 1–6 soundscapes (${
        report.newlyRecoveredCount > 0
          ? `${report.newlyRecoveredCount} missing pack(s) recovered`
          : 'all packs synced'
      })!`
    );
    setTimeout(() => setRestoreMessage(null), 4500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 72,
        origin: { y: 0.62 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  };

  const handleBuyPowerUpOrMap = (item: ShopItem) => {
    if (coins < item.price) {
      marioAudio.playStomp();
      return;
    }

    setCoins((prev) => prev - item.price);
    triggerConfetti();

    if (item.id === 'powerup_super_star' || item.id === 'powerup_mega_star_30m') {
      const mins = item.durationMinutes || 10;
      marioAudio.playStarTheme();
      if (onActivateSuperStar) {
        onActivateSuperStar(mins);
      } else {
        const nextEnd = Math.max(Date.now(), localSuperStarEndsAt) + mins * 60 * 1000;
        setLocalSuperStarEndsAt(nextEnd);
        try {
          localStorage.setItem('mario_super_star_expiry_ms_v1', String(nextEnd));
        } catch {
          // ignore
        }
      }
      setPowerupNotice(`Super Star Active! All coin rewards are DOUBLED (2x) for +${mins} minutes!`);
      setTimeout(() => setPowerupNotice(null), 4000);
      return;
    }

    if (item.id === 'powerup_fire_flower_streak') {
      marioAudio.playPowerUp();
      if (onBoostStreak) {
        onBoostStreak(5);
      } else if (typeof window !== 'undefined') {
        const cur = parseInt(localStorage.getItem('mario_daily_streak') || '1', 10) || 1;
        localStorage.setItem('mario_daily_streak', String(cur + 5));
      }
      setPowerupNotice('Fire Flower Bloomed! +5 Consecutive Study Days added to your Map Tracker!');
      setTimeout(() => setPowerupNotice(null), 4000);
      return;
    }

    if (item.id === 'map_shortcut_bar') {
      marioAudio.playLevelUp();
      const updated = Array.from(new Set([...unlockedItemIds, item.id]));
      setUnlockedItemIds(updated);
      try {
        localStorage.setItem('mario_unlocked_items', JSON.stringify(updated));
        localStorage.setItem('mario_shortcut_map_active_v1', 'true');
      } catch {
        // ignore
      }
      setLocalShortcutMap(true);
      onToggleShortcutMap?.(true);
      setPowerupNotice("Toad's Shortcut Map Unlocked & Active! High-yield Bar topics are now highlighted!");
      setTimeout(() => setPowerupNotice(null), 4000);
    }
  };

  const handleToggleShortcutMapState = () => {
    const next = !effectiveShortcutActive;
    marioAudio.playPipe();
    setLocalShortcutMap(next);
    try {
      localStorage.setItem('mario_shortcut_map_active_v1', String(next));
    } catch {
      // ignore
    }
    onToggleShortcutMap?.(next);
  };

  const handleEquipCompanionChoice = (compId: StudyCompanionId) => {
    marioAudio.playJump();
    setLocalCompanion(compId);
    try {
      localStorage.setItem('mario_study_companion_v1', compId);
    } catch {
      // ignore
    }
    onEquipCompanion?.(compId);
  };

  const handleEquipFrameChoice = (frameId: CardFrameId) => {
    marioAudio.playPipe();
    setLocalCardFrame(frameId);
    try {
      localStorage.setItem('mario_card_frame_v1', frameId);
    } catch {
      // ignore
    }
    onEquipCardFrame?.(frameId);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (coins < item.price) {
      marioAudio.playStomp();
      return;
    }

    const nextCoins = coins - item.price;
    setCoins(nextCoins);
    marioAudio.playPowerUp();
    triggerConfetti();

    const updated = Array.from(new Set([...unlockedItemIds, item.id]));
    setUnlockedItemIds(updated);

    try {
      localStorage.setItem('mario_unlocked_items', JSON.stringify(updated));
    } catch {
      // fallback
    }

    if (item.category === 'theme' && item.themeId) {
      handleEquipTheme(item.themeId);
    } else if (item.category === 'avatar' && item.avatarId) {
      handleEquipAvatar(item.avatarId);
    } else if (item.category === 'soundpack' && item.soundPackId) {
      marioAudio.recordAudioPackPurchase(item.soundPackId);
      handleEquipSoundPack(item.soundPackId);
    } else if (item.category === 'companion' && item.companionId) {
      handleEquipCompanionChoice(item.companionId);
    } else if (item.category === 'frame' && item.frameId) {
      handleEquipFrameChoice(item.frameId);
    } else if (item.category === 'title') {
      handleEquipTitle(item.name);
    }
  };

  const handleEquipTheme = (themeId: MarioTheme) => {
    setActiveTheme(themeId);
    marioAudio.playPipe();
    try {
      localStorage.setItem('mario_active_theme', themeId);
    } catch {
      // fallback
    }
  };

  const handleEquipAvatar = (avatarId: MarioAvatar) => {
    setEquippedAvatar(avatarId);
    marioAudio.playJump();
    try {
      localStorage.setItem('mario_equipped_avatar', avatarId);
    } catch {
      // fallback
    }
  };

  const handleEquipSoundPack = (packId: SoundPackId) => {
    setEquippedSoundPack(packId);
    marioAudio.setSoundPack(packId, true);
  };

  const handleEquipTitle = (title: string) => {
    setEquippedTitle(title);
    marioAudio.playLevelUp();
    try {
      localStorage.setItem('mario_equipped_title', title);
    } catch {
      // fallback
    }
  };

  const handleRollMysteryBox = (tier: 'classic' | 'golden' | 'royal' = 'classic') => {
    const cost = tier === 'royal' ? 150 : tier === 'golden' ? 60 : 15;
    if (coins < cost || isRollingMystery) {
      marioAudio.playStomp();
      return;
    }

    setCoins((prev) => prev - cost);
    setIsRollingMystery(true);
    setMysteryResult(null);
    marioAudio.playCoin();

    setTimeout(() => {
      const rand = Math.random();
      let payoutCoins = 25;
      let msg = '';

      if (tier === 'royal') {
        if (rand < 0.22) {
          payoutCoins = 420;
          msg = 'ROYAL VAULT JACKPOT! You struck 420 Gold Coins + Super Star fanfare!';
          marioAudio.playStarTheme();
        } else if (rand < 0.58) {
          payoutCoins = 240;
          msg = 'SUPREME WIN! 240 Gold Coins burst from Bowser’s Treasury (+90 net)!';
          marioAudio.playPowerUp();
        } else if (rand < 0.85) {
          payoutCoins = 180;
          msg = 'TREASURY HIT! You recovered 180 Gold Coins (+30 profit)!';
          marioAudio.playCoin();
        } else {
          payoutCoins = 110;
          msg = '110 Gold Coins returned + 3-Minute Super Star 2x Coin Bonus activated!';
          marioAudio.playPowerUp();
          onActivateSuperStar?.(3);
        }
      } else if (tier === 'golden') {
        if (rand < 0.2) {
          payoutCoins = 175;
          msg = 'GOLDEN BLOCK JACKPOT! 175 Gold Coins erupted from the Super Block!';
          marioAudio.playStarTheme();
        } else if (rand < 0.55) {
          payoutCoins = 95;
          msg = 'SUPER LUCKY! 95 Gold Coins (+35 profit) popped out!';
          marioAudio.playPowerUp();
        } else if (rand < 0.82) {
          payoutCoins = 75;
          msg = 'WINNER! 75 Gold Coins (+15 profit)!';
          marioAudio.playCoin();
        } else {
          payoutCoins = 45;
          msg = '45 Coins returned + 2-Minute Super Star 2x Coin Rush!';
          marioAudio.playCoin();
          onActivateSuperStar?.(2);
        }
      } else {
        if (rand < 0.15) {
          payoutCoins = 50;
          msg = 'JACKPOT! You struck a golden vein and won 50 Coins!';
          marioAudio.playStarTheme();
        } else if (rand < 0.4) {
          payoutCoins = 35;
          msg = 'SUPER LUCKY! 35 Golden Coins popped out of the ? Block!';
          marioAudio.playPowerUp();
        } else if (rand < 0.8) {
          payoutCoins = 25;
          msg = 'WINNER! You hit 25 Coins! (+10 profit)';
          marioAudio.playCoin();
        } else {
          payoutCoins = 10;
          msg = 'Good attempt! 10 Coins returned + 1-Up Mushroom blessing!';
          marioAudio.playCoin();
        }
      }

      setCoins((prev) => prev + payoutCoins);
      setMysteryResult(msg);
      setIsRollingMystery(false);
      triggerConfetti();
    }, 650);
  };

  const factions = [
    'All',
    'Mushroom Heroes',
    'Royal Court',
    'Kong & Dino Crew',
    'Rivals & Villains',
    'Special Legends',
  ];

  const displayedAvatars =
    selectedFaction === 'All'
      ? AVATAR_ITEMS
      : AVATAR_ITEMS.filter((item) => item.faction === selectedFaction);

  const isCertUnlocked = unlockedItemIds.includes(CERTIFICATE_ITEM.id);
  const isShortcutMapUnlocked = unlockedItemIds.includes('map_shortcut_bar');

  return (
    <div className={`space-y-6 ${isModal ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-700 text-slate-950 rounded-3xl p-4 sm:p-7 mario-card border-4 border-slate-950 shadow-[6px_6px_0_#000] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 bg-white rounded-2xl border-3 border-black flex items-center justify-center shadow-[0_3px_0_#000] shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-amber-300 font-black rounded-lg text-[10px] uppercase font-mario leading-none">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>TOAD&apos;S SHOP &amp; GRAND COIN BAZAAR</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white font-display tracking-tight mt-1">
                POWER-UPS, SHORTCUT MAPS, 34 HEROES &amp; VAULT GEAR
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-100 max-w-2xl">
                Spend your study coins on 10-Minute Super Star 2x Coin Power-Ups, High-Yield Shortcut Maps, Desk Companions, Card Frames, 34 Mario Skins, Audio Packs &amp; Mystery Chests!
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {effectiveStarStatus.isActive && (
                  <span
                    data-testid="shop-super-star-active-badge"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-300 text-slate-950 border-2 border-black text-xs font-black font-mario tabular-nums shadow-[0_2px_0_#000]"
                  >
                    <MarioStarIcon className="w-4 h-4 shrink-0" />
                    <span>2X COINS ACTIVE · {effectiveStarStatus.formattedRemaining}</span>
                  </span>
                )}
                {effectiveShortcutActive && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-400 text-slate-950 border-2 border-black text-xs font-black font-mario shadow-[0_2px_0_#000]">
                    <MapIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>SHORTCUT MAP ON</span>
                  </span>
                )}
                {equippedTitle && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-amber-400 text-amber-300 text-xs font-black font-mario">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span>{equippedTitle}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end shrink-0">
            <div className="flex items-center gap-3 bg-black/85 border-3 border-amber-400 rounded-2xl px-4 py-2.5 shadow-[0_3px_0_#000]">
              <MarioCoinIcon className="w-7 h-7 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 block font-mario leading-none">
                  COIN WALLET
                </span>
                <span className="text-lg sm:text-xl font-black text-white font-mario mt-1 block leading-none tabular-nums">
                  x{coins.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleRestorePurchases}
                data-testid="shop-header-restore-audio-btn"
                className="min-h-[44px] px-3.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 whitespace-nowrap"
                title="Recover missing or previously purchased Audio Packs and verify Modules 1–6 soundscapes"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Restore Audio Pack</span>
              </button>

              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={() => {
                    marioAudio.playCoin();
                    onOpenLeaderboard();
                  }}
                  data-testid="shop-open-leaderboard-btn"
                  className="min-h-[44px] px-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 whitespace-nowrap"
                >
                  <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Leaderboard</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            aria-label="Close Toad's Shop"
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-xl bg-black/70 hover:bg-black text-white inline-flex items-center justify-center border-2 border-white/50 cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {(powerupNotice || restoreMessage) && (
        <div
          role="status"
          data-testid="shop-status-banner"
          className="bg-emerald-400 text-slate-950 p-3.5 rounded-2xl border-3 border-black font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-[0_3px_0_#000]"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3] shrink-0" />
            <span>{powerupNotice || restoreMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setPowerupNotice(null);
              setRestoreMessage(null);
            }}
            aria-label="Dismiss notification"
            className="min-w-[36px] min-h-[36px] rounded-lg bg-black/10 hover:bg-black/20 inline-flex items-center justify-center cursor-pointer font-mario"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap bg-[#1e293b] p-2 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0_#000]">
        {[
          { id: 'powerups' as const, label: `Power-Ups & Maps (${POWERUP_ITEMS.length})`, icon: Sparkles },
          { id: 'avatars' as const, label: `Heroes (${AVATAR_ITEMS.length})`, icon: User },
          {
            id: 'companions' as const,
            label: `Companions & Frames (${COMPANION_ITEMS.length + CARD_FRAME_ITEMS.length})`,
            icon: Frame,
          },
          { id: 'themes' as const, label: `UI Themes (${THEME_ITEMS.length})`, icon: Palette },
          { id: 'perks' as const, label: `Study Boosters (${PERK_ITEMS.length})`, icon: Zap },
          { id: 'soundpacks' as const, label: `Audio Packs (${SOUNDPACK_ITEMS.length})`, icon: Volume2 },
          { id: 'prestige' as const, label: `Prestige (${PRESTIGE_ITEMS.length})`, icon: Crown },
          { id: 'mystery' as const, label: '3-Tier Chests', icon: HelpCircle },
          { id: 'certificate' as const, label: 'Master Diploma', icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCategory(tab.id);
                marioAudio.playTabSwitch();
              }}
              data-testid={`shop-tab-${tab.id}`}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Power-Ups & Shortcut Maps View */}
      {activeCategory === 'powerups' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                <MarioStarIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-black text-base sm:text-lg uppercase font-display text-amber-300">
                  SUPER STAR POWER-UPS &amp; BAR SHORTCUT MAPS
                </h2>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">
                  Activate timed 2x Coin multipliers, illuminate high-yield Bar Exam topics across Worlds 1–6, or fuel your Fire Flower study streak!
                </p>
              </div>
            </div>
            {effectiveStarStatus.isActive && (
              <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 border-2 border-black font-black text-xs font-mario tabular-nums shrink-0">
                SUPER STAR: {effectiveStarStatus.formattedRemaining} LEFT
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {POWERUP_ITEMS.map((item) => {
              const isShortcutCard = item.id === 'map_shortcut_bar';
              const isStarCard = item.id === 'powerup_super_star' || item.id === 'powerup_mega_star_30m';
              return (
                <div
                  key={item.id}
                  data-testid={`shop-item-${item.id}`}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-5 flex flex-col justify-between h-full ${
                    (isShortcutCard && effectiveShortcutActive) || (isStarCard && effectiveStarStatus.isActive)
                      ? 'ring-4 ring-amber-400 bg-amber-50/40'
                      : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 border border-black font-mario">
                        {item.badge}
                      </span>
                      {isShortcutCard && isShortcutMapUnlocked && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-950 border border-emerald-600 font-mario">
                          {effectiveShortcutActive ? 'MAP ACTIVE' : 'OWNED'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 bg-amber-100 rounded-2xl border-3 border-black flex items-center justify-center shrink-0 shadow-[0_3px_0_#000]">
                        {isShortcutCard ? (
                          <MapIcon className="w-8 h-8 text-emerald-700" />
                        ) : item.id === 'powerup_fire_flower_streak' ? (
                          <MarioFireFlowerIcon className="w-9 h-9" />
                        ) : (
                          <MarioStarIcon className="w-9 h-9" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-950 text-base sm:text-lg font-display leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {item.perkEffect && (
                      <div className="text-xs font-black text-emerald-800 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-300">
                        Effect: {item.perkEffect}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950 tabular-nums">
                      <MarioCoinIcon className="w-5 h-5 shrink-0" />
                      <span>{item.price} Coins</span>
                    </div>

                    {isShortcutCard && isShortcutMapUnlocked ? (
                      <button
                        type="button"
                        onClick={handleToggleShortcutMapState}
                        data-testid="toggle-shortcut-map-btn"
                        className={`min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                          effectiveShortcutActive
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_2px_0_#000]'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000]'
                        }`}
                      >
                        {effectiveShortcutActive ? 'Highlights ON (Toggle Off)' : 'Enable Shortcut Highlights'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuyPowerUpOrMap(item)}
                        disabled={coins < item.price}
                        data-testid={`buy-${item.id}`}
                        className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                      >
                        {item.isConsumable
                          ? isStarCard && effectiveStarStatus.isActive
                            ? `Extend +${item.durationMinutes}m`
                            : 'Activate Power-Up'
                          : 'Unlock Shortcut Map'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desk Companions & Card Frames View */}
      {activeCategory === 'companions' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-display flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>COLLECTIBLE STUDY DESK COMPANIONS</span>
              </h2>
              {activeCompanion !== 'comp_none' && (
                <button
                  type="button"
                  onClick={() => handleEquipCompanionChoice('comp_none')}
                  className="min-h-[44px] px-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs border border-slate-400 cursor-pointer"
                >
                  Rest Active Companion
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {COMPANION_ITEMS.map((item) => {
                const isUnlocked = unlockedItemIds.includes(item.id);
                const isEquipped = activeCompanion === item.companionId;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between h-full ${
                      isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mario">
                          {item.badge}
                        </span>
                        {isEquipped && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 border border-emerald-600 font-mario">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-950 text-base font-display">{item.name}</h3>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="pt-3 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-950 tabular-nums">
                        <MarioCoinIcon className="w-4 h-4 shrink-0" />
                        <span>{item.price} Coins</span>
                      </span>
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => item.companionId && handleEquipCompanionChoice(item.companionId)}
                          disabled={isEquipped}
                          className={`min-h-[44px] px-4 rounded-xl font-black text-xs border-2 border-black cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-500 text-slate-950 cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000]'
                          }`}
                        >
                          {isEquipped ? 'Summoned' : 'Summon Buddy'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyItem(item)}
                          disabled={coins < item.price}
                          className="min-h-[44px] px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
                        >
                          Adopt Buddy
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-display flex items-center gap-2">
              <Frame className="w-5 h-5 text-amber-500" />
              <span>AESTHETIC MODULE TOPIC CARD FRAMES</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {CARD_FRAME_ITEMS.map((item) => {
                const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
                const isEquipped = activeFrame === item.frameId;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between h-full ${
                      isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-950 text-amber-300 font-mario">
                          {item.badge}
                        </span>
                        {isEquipped && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 border border-emerald-600 font-mario">
                            EQUIPPED
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-950 text-base font-display">{item.name}</h3>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="pt-3 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-950 tabular-nums">
                        <MarioCoinIcon className="w-4 h-4 shrink-0" />
                        <span>{item.price === 0 ? 'Free' : `${item.price} Coins`}</span>
                      </span>
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => item.frameId && handleEquipFrameChoice(item.frameId)}
                          disabled={isEquipped}
                          className={`min-h-[44px] px-4 rounded-xl font-black text-xs border-2 border-black cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-500 text-slate-950 cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000]'
                          }`}
                        >
                          {isEquipped ? 'Equipped' : 'Equip Frame'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyItem(item)}
                          disabled={coins < item.price}
                          className="min-h-[44px] px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
                        >
                          Unlock Frame
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Avatars Roster View */}
      {activeCategory === 'avatars' && (
        <div className="space-y-4">
          {/* Faction Filter Bar */}
          <div className="bg-white rounded-2xl border-3 border-slate-950 p-3 shadow-[4px_4px_0_#000] flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase font-mario text-slate-700 px-2">
              <Users className="w-4 h-4 text-red-600 shrink-0" />
              <span>FACTION:</span>
            </span>
            {factions.map((fac) => (
              <button
                key={fac}
                onClick={() => {
                  setSelectedFaction(fac);
                  marioAudio.playTabSwitch();
                }}
                className={`min-h-[44px] inline-flex items-center justify-center px-3.5 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedFaction === fac
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fac}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {displayedAvatars.map((item) => {
              const heroMeta = HERO_ROSTER.find((h) => h.id === item.avatarId);
              const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
              const isEquipped = equippedAvatar === item.avatarId;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-black truncate">
                        {heroMeta?.title || item.faction}
                      </span>
                      {isEquipped && (
                        <span className="text-[9px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-600 font-mario shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="w-16 h-16 bg-amber-100 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      {item.avatarId && (
                        <MarioCharacterAvatar character={item.avatarId} className="w-11 h-11" />
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-black text-slate-950 text-base sm:text-lg font-display leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-950 whitespace-nowrap">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price === 0 ? 'Free' : `${item.price}c`}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isUnlocked && coins >= item.price && (
                        <button
                          onClick={() => handleBuyItem(item)}
                          className="min-h-[44px] inline-flex items-center justify-center px-3 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        onClick={() => item.avatarId && handleEquipAvatar(item.avatarId)}
                        disabled={isEquipped}
                        className={`min-h-[44px] inline-flex items-center justify-center px-3.5 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                          isEquipped
                            ? 'bg-emerald-500 text-slate-950 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Select Hero'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Themes Grid (Includes Pro Study Theme Pack) */}
      {activeCategory === 'themes' && (
        <div className="space-y-4">
          {/* Pro Study Theme Pack Banner & Filter */}
          <div
            data-testid="pro-study-theme-banner"
            className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-black uppercase text-amber-300 font-mario">
                    PRO STUDY THEME PACK
                  </span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-emerald-300 font-bold">
                    Minimalist High-Contrast Skins &amp; Zero-Glare Typography
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300 leading-relaxed max-w-2xl">
                  Designed for marathon Bar Exam reading: replaces pixel background patterns and heavy arcade shadows with clean anti-glare surfaces, crisp hairline borders, and 1.74x relaxed editorial line spacing.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-700 self-start lg:self-center shrink-0">
              {[
                { id: 'all' as const, label: 'All Skins (13)' },
                { id: 'pro_study' as const, label: 'Pro Study Pack (3)' },
                { id: 'arcade' as const, label: 'Mario Arcade (10)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    marioAudio.playClick();
                    setThemePackFilter(tab.id);
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    themePackFilter === tab.id
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {THEME_ITEMS.filter((item) => {
              const isProStudy = item.themeId?.startsWith('pro_study_');
              if (themePackFilter === 'pro_study') return isProStudy;
              if (themePackFilter === 'arcade') return !isProStudy;
              return true;
            }).map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
              const isEquipped = activeTheme === item.themeId;
              const isProStudy = Boolean(item.themeId?.startsWith('pro_study_'));
              const isLightPreview =
                item.themeId === 'pro_study_paper' || item.themeId === 'pro_study_sage';

              return (
                <div
                  key={item.id}
                  data-testid={`shop-theme-${item.themeId}`}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/40' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className="w-full h-24 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center relative overflow-hidden px-3 text-center"
                      style={{ backgroundColor: item.previewColor }}
                    >
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-black ${
                          isLightPreview
                            ? 'bg-white/95 border-slate-300 text-slate-900 shadow-2xs'
                            : 'bg-black/75 border-white/25 text-white'
                        } ${isProStudy ? 'font-sans tracking-tight' : 'font-mario text-[10px]'}`}
                      >
                        {isProStudy ? (
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span>{item.name}</span>
                      </div>
                      {isProStudy && (
                        <span
                          className={`mt-1.5 text-[11px] font-medium ${
                            isLightPreview ? 'text-slate-700' : 'text-slate-300'
                          }`}
                        >
                          Aa Bb · Art. 95 Labor Code · Eye-Care Contrast
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          {isProStudy && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                              Pro Study · Zero Eye Strain
                            </span>
                          )}
                          <h3 className="font-black text-slate-950 text-base sm:text-lg font-display truncate">
                            {item.name}
                          </h3>
                        </div>
                        {isEquipped && (
                          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400 font-mario shrink-0">
                            EQUIPPED
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950 tabular-nums">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price === 0 ? 'Free' : `${item.price} Coins`}</span>
                    </div>

                    {isUnlocked ? (
                      <button
                        type="button"
                        data-testid={`equip-theme-${item.themeId}`}
                        onClick={() => item.themeId && handleEquipTheme(item.themeId)}
                        disabled={isEquipped}
                        className={`min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                          isEquipped
                            ? 'bg-emerald-500 text-slate-950 opacity-90 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                        }`}
                      >
                        {isEquipped ? 'Active Skin' : 'Equip Skin'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        data-testid={`buy-theme-${item.themeId}`}
                        onClick={() => handleBuyItem(item)}
                        disabled={coins < item.price}
                        className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                      >
                        Unlock Skin
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Perks / Boosters Grid */}
      {activeCategory === 'perks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {PERK_ITEMS.map((item) => {
            const isUnlocked = unlockedItemIds.includes(item.id);

            const renderPerkIcon = (id: string) => {
              switch (id) {
                case 'perk_life':
                  return <Mario1UpIcon className="w-9 h-9" />;
                case 'perk_star':
                  return <MarioStarIcon className="w-9 h-9" />;
                case 'perk_double':
                  return <MarioMushroomIcon className="w-9 h-9" />;
                case 'perk_lakitu_glasses':
                  return <MarioLakituCloudIcon className="w-9 h-9" />;
                case 'perk_streak_freeze':
                  return <MarioIceFlowerIcon className="w-9 h-9" />;
                case 'perk_golden_fireball':
                  return <MarioFireFlowerIcon className="w-9 h-9" />;
                case 'perk_chrono_watch':
                  return <MarioPeachCrownIcon className="w-9 h-9" />;
                case 'perk_espresso_mushroom':
                default:
                  return <MarioMushroomIcon className="w-9 h-9" />;
              }
            };

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                    {renderPerkIcon(item.id)}
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                      {item.badge}
                    </span>
                    <h3 className="font-black text-slate-950 text-base font-display">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    {item.perkEffect && (
                      <div className="mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg p-1 border border-emerald-200">
                        {item.perkEffect}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                    <MarioCoinIcon className="w-4 h-4 shrink-0" />
                    <span>{item.price} Coins</span>
                  </div>

                  {isUnlocked ? (
                    <span className="min-h-[44px] inline-flex items-center justify-center px-3 rounded-xl font-black text-xs bg-emerald-100 text-emerald-950 border-2 border-emerald-500">
                      Active Perk
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={coins < item.price}
                      className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                    >
                      Acquire Perk
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prestige Titles Grid */}
      {activeCategory === 'prestige' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
            <Crown className="w-8 h-8 text-slate-950 shrink-0" />
            <div>
              <h3 className="font-black text-base uppercase font-display">
                PRESTIGE TITLES &amp; LEGAL HONORS
              </h3>
              <p className="text-xs font-bold text-slate-900">
                Unlock and equip honorary titles certifying your expertise in Philippine Labor Jurisprudence. These badges are featured in your User Profile and Export Score Card!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {PRESTIGE_ITEMS.map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id);
              const isEquipped = equippedTitle === item.name;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-black">
                        {item.badge}
                      </span>
                      {isEquipped && (
                        <span className="text-[9px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-600 font-mario shrink-0">
                          EQUIPPED
                        </span>
                      )}
                    </div>

                    <div className="w-14 h-14 bg-amber-100 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      <Crown className="w-8 h-8 text-amber-700" />
                    </div>

                    <div className="text-center">
                      <h3 className="font-black text-slate-950 text-base font-display">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price} Coins</span>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleEquipTitle(item.name)}
                        disabled={isEquipped}
                        className={`min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-500 text-slate-950 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                        }`}
                      >
                        {isEquipped ? 'Active' : 'Equip Title'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={coins < item.price}
                        className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                      >
                        Claim Title
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sound Packs (Full Continuous BGM + App-Wide SFX Synthesis) */}
      {activeCategory === 'soundpacks' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                <Volume2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-base uppercase font-display text-amber-300">
                    FULL CONTINUOUS BGM &amp; SFX AUDIO PACKS
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-mario">
                    {isBgmPlaying ? 'BGM STREAMING LIVE' : 'FULL TRACK SYNTH'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                  Equipping or pressing Play Full BGM activates continuous multi-voice background music loops across Worlds 1–6 AND reshapes every coin, jump, warp pipe, and power-up sound effect across the app!
                </p>
              </div>
            </div>

            {/* Right actions: Play/Pause Active Pack + Restore button */}
            <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end shrink-0">
              <button
                type="button"
                data-testid="toggle-active-bgm-btn"
                onClick={() => {
                  const playing = marioAudio.toggleSoundPackFullTrack(equippedSoundPack);
                  setIsBgmPlaying(playing);
                }}
                className={`min-h-[44px] px-3.5 rounded-xl font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 whitespace-nowrap ${
                  isBgmPlaying
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    : 'bg-sky-400 hover:bg-sky-300 text-slate-950'
                }`}
              >
                {isBgmPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current shrink-0" />
                    <span>Pause Live BGM</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>Play Active BGM</span>
                  </>
                )}
              </button>

              <button
                type="button"
                data-testid="restore-audio-pack-btn"
                onClick={handleRestorePurchases}
                className="min-h-[44px] px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 whitespace-nowrap"
                title="Restore missing or previously purchased audio content and verify Modules 1-6 audio"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Restore Audio Pack</span>
              </button>

              <div className="min-h-[44px] bg-slate-950 px-3 py-1.5 rounded-xl border-2 border-amber-400 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
                  ACTIVE:
                </span>
                <span className="text-xs font-black text-white whitespace-nowrap">
                  {SOUNDPACK_ITEMS.find((s) => s.soundPackId === equippedSoundPack)?.name || 'Classic 8-Bit'}
                </span>
              </div>
            </div>
          </div>

          {restoreMessage && (
            <div className="bg-emerald-500 text-slate-950 p-3.5 rounded-xl border-2 border-black font-black text-xs flex items-center justify-between shadow-[0_3px_0_#000]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span>{restoreMessage}</span>
              </span>
              <button
                type="button"
                aria-label="Dismiss restore message"
                onClick={() => setRestoreMessage(null)}
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center cursor-pointer font-mario"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {SOUNDPACK_ITEMS.map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
              const isEquipped = equippedSoundPack === item.soundPackId;
              const isThisPackStreaming = isEquipped && isBgmPlaying;

              return (
                <div
                  key={item.id}
                  data-testid={`shop-soundpack-${item.soundPackId}`}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-indigo-900 text-amber-300 border border-black font-mario">
                        {item.badge}
                      </span>
                      {isEquipped && (
                        <span className="text-[9px] font-black uppercase text-emerald-950 bg-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-600 font-mario flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          {isThisPackStreaming ? 'BGM LIVE' : 'EQUIPPED'}
                        </span>
                      )}
                    </div>

                    <div className="w-16 h-16 bg-indigo-100/70 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      <Volume2 className="w-9 h-9 text-indigo-700" />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="font-black text-slate-950 text-base sm:text-lg font-display">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[11px] font-bold text-indigo-700 pt-0.5">
                        Includes: Full Continuous BGM Loop + Custom App SFX
                      </p>
                    </div>

                    {/* Persistent Full BGM Loop + Sample SFX Controls */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {item.soundPackId && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.soundPackId) return;
                            if (isUnlocked) {
                              setEquippedSoundPack(item.soundPackId);
                            }
                            const nowPlaying = marioAudio.toggleSoundPackFullTrack(item.soundPackId);
                            setIsBgmPlaying(nowPlaying);
                          }}
                          data-testid={`play-bgm-soundpack-${item.soundPackId}`}
                          className={`w-full min-h-[44px] py-2 px-3 rounded-xl border-2 border-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all whitespace-nowrap ${
                            isThisPackStreaming ||
                            (marioAudio.settings.soundPack === item.soundPackId && isBgmPlaying)
                              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_2px_0_#000]'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_2px_0_#000]'
                          }`}
                        >
                          {isThisPackStreaming ||
                          (marioAudio.settings.soundPack === item.soundPackId && isBgmPlaying) ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Pause Persistent BGM Loop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>
                                {isUnlocked ? 'Play Full Persistent BGM Loop' : 'Play Full BGM Track'}
                              </span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => item.soundPackId && marioAudio.previewSoundPack(item.soundPackId)}
                        aria-label={`Test interactive SFX chime for ${item.name}`}
                        data-testid={`preview-soundpack-${item.soundPackId}`}
                        className="w-full min-h-[40px] py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-400 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all whitespace-nowrap"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span>Test Interactive SFX</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950 tabular-nums">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price === 0 ? 'Free' : `${item.price} Coins`}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.soundPackId) return;
                            handleEquipSoundPack(item.soundPackId);
                            setIsBgmPlaying(marioAudio.isMusicPlaying());
                          }}
                          disabled={isEquipped && isThisPackStreaming}
                          data-testid={`equip-soundpack-${item.soundPackId}`}
                          className={`min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                            isEquipped && isThisPackStreaming
                              ? 'bg-emerald-500 text-slate-950 cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                          }`}
                        >
                          {isEquipped && isThisPackStreaming ? 'Streaming' : isEquipped ? 'Start Pack BGM' : 'Equip & Play Pack'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyItem(item)}
                          disabled={coins < item.price}
                          data-testid={`buy-soundpack-${item.soundPackId}`}
                          className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                        >
                          Unlock Full Pack
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Tier Mystery Chests & Question Blocks */}
      {activeCategory === 'mystery' && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border-4 border-slate-950 shadow-[6px_6px_0_#000] space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-mario inline-block">
              TOAD&apos;S TREASURY CHESTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              3-TIER MYSTERY BLOCK VAULT
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">
              Spend your earned Bar Review coins on Classic, Golden, or Royal Bowser Treasury Chests for massive coin jackpots and bonus Super Star 2x Coin Rush bursts!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {[
              {
                tier: 'classic' as const,
                title: 'Classic ? Block',
                cost: 15,
                maxWin: '50 Coins',
                desc: 'Classic Mushroom Kingdom lucky block. Win up to 50 Gold Coins!',
                accent: 'bg-amber-400 text-slate-950',
                symbol: '?',
              },
              {
                tier: 'golden' as const,
                title: 'Golden Super Block',
                cost: 60,
                maxWin: '175 Coins + 2x Buff',
                desc: 'High-yield Golden Block! Up to 175 Gold Coins or a 2-Minute Super Star 2x Rush.',
                accent: 'bg-yellow-300 text-slate-950',
                symbol: '★?',
              },
              {
                tier: 'royal' as const,
                title: 'Royal Treasury Chest',
                cost: 150,
                maxWin: '420 Coin Jackpot!',
                desc: 'Supreme high-roller chest! Up to 420 Gold Coins or a 3-Minute Super Star Overdrive.',
                accent: 'bg-gradient-to-br from-rose-500 to-amber-400 text-slate-950',
                symbol: '👑',
              },
            ].map((chest) => (
              <div
                key={chest.tier}
                className="bg-slate-950/90 border-3 border-slate-700 rounded-2xl p-5 flex flex-col justify-between text-center space-y-4"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-amber-300 font-mario block">
                    MAX WIN: {chest.maxWin}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRollMysteryBox(chest.tier)}
                    disabled={coins < chest.cost || isRollingMystery}
                    className={`w-24 h-24 mx-auto rounded-3xl ${chest.accent} border-4 border-black flex items-center justify-center shadow-[0_6px_0_#000] active:translate-y-1 disabled:opacity-40 cursor-pointer transition-transform ${
                      isRollingMystery ? 'animate-bounce' : 'hover:scale-105'
                    }`}
                  >
                    <span className="text-3xl font-black font-mario select-none">{chest.symbol}</span>
                  </button>
                  <h3 className="text-lg font-black text-white font-display">{chest.title}</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{chest.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRollMysteryBox(chest.tier)}
                  disabled={coins < chest.cost || isRollingMystery}
                  className="min-h-[44px] w-full rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs border-2 border-black shadow-[0_3px_0_#000] inline-flex items-center justify-center gap-1.5 cursor-pointer tabular-nums"
                >
                  <MarioCoinIcon className="w-4 h-4 shrink-0" />
                  <span>Open for {chest.cost} Coins</span>
                </button>
              </div>
            ))}
          </div>

          {mysteryResult && (
            <div className="p-4 bg-amber-400/20 border-2 border-amber-400 rounded-2xl text-amber-200 text-sm font-black text-center">
              {mysteryResult}
            </div>
          )}
        </div>
      )}

      {/* Official Master Diploma / Certificate */}
      {activeCategory === 'certificate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-4 border-slate-950 p-4 sm:p-6 shadow-[6px_6px_0_#000] text-slate-950 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000] shrink-0">
                  <FileCheck2 className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-display">
                    OFFICIAL CERTIFICATE OF LABOR MASTERY
                  </h2>
                  <p className="text-xs font-bold text-slate-600">
                    High-Resolution Commemorative Diploma covering Worlds 1–6 · Curated by Matthew (Main Creator)
                  </p>
                </div>
              </div>

              {!isCertUnlocked ? (
                <button
                  onClick={() => handleBuyItem(CERTIFICATE_ITEM)}
                  disabled={coins < CERTIFICATE_ITEM.price}
                  className="min-h-[44px] px-5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <MarioCoinIcon className="w-4 h-4" />
                  <span>Unlock for 50 Coins</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="min-h-[44px] inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-black text-xs rounded-xl">
                    ✓ Certificate Unlocked
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="min-h-[44px] px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs border-2 border-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Certificate</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recipient Customization */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
              <label htmlFor="cert-name" className="text-xs font-black uppercase text-slate-700">
                Recipient Name on Diploma:
              </label>
              <input
                id="cert-name"
                type="text"
                value={certRecipientName}
                onChange={(e) => setCertRecipientName(e.target.value)}
                maxLength={40}
                className="min-h-[44px] px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm text-slate-900 flex-1 min-w-[200px]"
                placeholder="e.g., Juan Dela Cruz, Bar Candidate"
              />
            </div>

            {/* Live Interactive Diploma Canvas / Card */}
            <div className="p-6 sm:p-10 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-8 border-amber-500 rounded-3xl shadow-inner relative overflow-hidden text-center space-y-4">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600" />

              <div className="flex items-center justify-center gap-2">
                <MarioStarIcon className="w-6 h-6" />
                <span className="text-xs font-black tracking-widest uppercase text-amber-800 font-mario">
                  MUSHROOM KINGDOM · HIGH ACADEMY OF SOCIAL LEGISLATION
                </span>
                <MarioStarIcon className="w-6 h-6" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
                CERTIFICATE OF LABOR MASTERY
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 italic">
                This certifies that the esteemed Bar Review Candidate
              </p>

              <div className="text-xl sm:text-3xl font-black text-red-600 font-display underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8 py-2">
                {certRecipientName || 'Mario Bar Candidate'}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xl mx-auto leading-relaxed">
                has with distinction completed all 6 Worlds of the Philippine Labor Standards Memory Aid (Articles 82–155, Book III Labor Code, R.A. 11360 Service Charges, D.O. 174 Contracting, R.A. 10361 Batas Kasambahay, Protective Laws, and Statutory Leaves including R.A. 11210, R.A. 8187, R.A. 8972/11861, R.A. 9710 &amp; R.A. 9262).
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="text-center">
                  <div className="w-36 border-b-2 border-black mx-auto mb-1 font-bold text-xs">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 font-mario">
                    DATE OF CONFERMENT
                  </span>
                </div>

                <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-black flex flex-col items-center justify-center shadow-[0_4px_0_#000] rotate-12">
                  <MarioStarIcon className="w-8 h-8" />
                  <span className="text-[8px] font-black uppercase text-slate-950 font-mario">
                    GOLD SEAL
                  </span>
                </div>

                <div className="text-center">
                  <div className="w-48 border-b-2 border-black mx-auto mb-1 font-black text-xs">
                    Matthew · Main Creator &amp; Curator
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 font-mario">
                    MAIN CREATOR &amp; CURATOR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export type WorldId =
  | 'world1'
  | 'world2'
  | 'world3'
  | 'world4'
  | 'world5'
  | 'world6'
  | 'holidays'
  | 'warp_calc'
  | 'flashcards'
  | 'wage_matrix'
  | 'shop'
  | 'vault';

export type MarioTheme =
  | 'overworld'
  | 'underground'
  | 'castle'
  | 'galaxy'
  | 'rainbow'
  | 'bowser_lava'
  | 'retro_nes'
  | 'neon_synth'
  | 'desert_oasis'
  | 'aurora'
  | 'pro_study_paper'
  | 'pro_study_slate'
  | 'pro_study_sage';

export type MarioAvatar =
  | 'mario'
  | 'luigi'
  | 'peach'
  | 'daisy'
  | 'rosalina'
  | 'pauline'
  | 'toad'
  | 'toadette'
  | 'capttoad'
  | 'yoshi'
  | 'birdo'
  | 'donkeykong'
  | 'diddykong'
  | 'wario'
  | 'waluigi'
  | 'bowser'
  | 'bowserjr'
  | 'koopatroopa'
  | 'shyguy'
  | 'boo'
  | 'kamek'
  | 'drybones'
  | 'metalmario'
  | 'goldmario'
  | 'firemario'
  | 'iceluigi'
  | 'tanookimario'
  | 'catpeach'
  | 'cosmicrosalina'
  | 'drybowser'
  | 'goldenyoshi'
  | 'lawyertoad'
  | 'shadowmario'
  | 'drpeach';

export type ComplexityMode = 'beginner' | 'advanced';

export type StudyDifficulty = 'casual' | 'exam_prep';

export type ShopCategory =
  | 'powerup'
  | 'theme'
  | 'avatar'
  | 'companion'
  | 'frame'
  | 'perk'
  | 'soundpack'
  | 'title'
  | 'certificate';

export type SoundPackId =
  | 'sound_default'
  | 'sound_nes_8bit'
  | 'sound_snes_16bit'
  | 'sound_zen_lofi'
  | 'sound_galaxy_synth'
  | 'sound_bowser_metal';

export type StudyCompanionId =
  | 'comp_none'
  | 'comp_luma'
  | 'comp_baby_yoshi'
  | 'comp_polterpup'
  | 'comp_counsel_toad'
  | 'comp_chain_chomp'
  | 'comp_lakitu';

export type CardFrameId =
  | 'frame_default'
  | 'frame_royal_gold'
  | 'frame_starlight_prism'
  | 'frame_retro_brick'
  | 'frame_emerald_pipe'
  | 'frame_supreme_crimson';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  previewColor?: string;
  avatarId?: MarioAvatar;
  themeId?: MarioTheme;
  soundPackId?: SoundPackId;
  companionId?: StudyCompanionId;
  frameId?: CardFrameId;
  faction?: string;
  badge?: string;
  perkEffect?: string;
  isConsumable?: boolean;
  durationMinutes?: number;
}

export interface LawTopic {
  id: string;
  worldId: WorldId;
  title: string;
  badge: string; // e.g., "Art. 82", "R.A. 11360", "D.O. 174"
  iconName: string; // Mario item representation
  summary: string;
  beginnerSummary?: string; // Plain-English simplified summary for Beginner mode
  practicalTakeaway?: string; // Real-world practical application for employees/employers
  keyDoctrines: string[];
  rules: {
    heading: string;
    description?: string;
    items?: string[];
    subSections?: {
      title: string;
      items: string[];
    }[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  exceptions?: {
    generalRule: string;
    exceptions: string[];
    exceptionToException?: string[];
  }[];
  barTips?: string[];
  keyTips?: string[];
}

export interface Flashcard {
  id: string;
  world: string;
  worldNum: number;
  question: string;
  answer: string;
  keyTakeaway: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RegionalWageEntry {
  region: string;
  effectivity: string;
  nonAgri: string;
  agri: string;
}

export interface KasambahayWageEntry {
  region: string;
  effectivity: string;
  minimumWage: string;
}

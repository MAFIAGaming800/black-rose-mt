export type CelebrationStage =
  | 'WELCOME'
  | 'GATE_ANIMATION'
  | 'COUNTDOWN'
  | 'MEDIA_COUNTDOWN_VIDEO'
  | 'BLACK_SCREEN_AUDIO'
  | 'CAKE_CEREMONY'
  | 'FRIEND_INTRODUCTIONS'
  | 'BIRTHDAY_REVEAL'
  | 'ENVELOPE_GRID'
  | 'SPECIAL_GIFT'
  | 'DODGING_PAGE'
  | 'GAMES'
  | 'SKY_FULL_OF_DUAS'
  | 'SHONA_BHAI_LETTER'
  | 'DUAS_SECTION'
  | 'EMOTIONAL_CLOSING'
  | 'FINAL_FINALE';

export interface ServerTimeData {
  serverTime: number;
  iso: string;
  timezone: string;
  target: number;
  remainingMs: number;
  isUnlocked: boolean;
}

export interface UnlockVerificationData {
  unlocked: boolean;
  isPreview?: boolean;
  remainingMs: number;
  serverTime: number;
  target: number;
}

export interface FriendMessage {
  id: string;
  name: string;
  subtitle: string;
  duaRomanUrdu: string;
  englishWish: string;
  accent: string;
}

export interface DuaItem {
  id: string;
  categoryRomanUrdu: string;
  categoryEnglish: string;
  duaRomanUrdu: string;
  meaning: string;
  icon: string;
}

export interface UploadedAssets {
  logo: string | null;
  portrait: string | null;
  video: string | null;
}

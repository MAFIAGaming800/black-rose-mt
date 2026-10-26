/**
 * Central Asset Manifest — BLACK ROSE MT Birthday Website
 * 
 * Maps logical identifiers to imported project assets or clearly identifiable placeholders.
 * Beginners can easily update this file when new assets (videos, photos, logos) are imported.
 */

export interface AssetDescriptor {
  id: string;
  label: string;
  scene: string;
  path: string | null;
  type: 'video' | 'image' | 'audio';
  isImported: boolean;
  requiredFormat: string;
  description: string;
}

export const ASSET_MANIFEST: Record<string, AssetDescriptor> = {
  // 1. Opening Sequence Countdown Video
  countdownVideo: {
    id: 'countdownVideo',
    label: 'Countdown MP4 Video',
    scene: 'Stage 1: Media Countdown Video',
    path: '/assets/aistudio/videoplayback__2__8dd731cb.mp4',
    type: 'video',
    isImported: true,
    requiredFormat: 'MP4 (videoplayback (2).mp4)',
    description: 'Original full-screen countdown video that ends at GO before 5s silence.',
  },

  // 2. Official Brand Logo
  brandLogo: {
    id: 'brandLogo',
    label: 'BLACK ROSE MT Official Brand Logo',
    scene: 'All Scenes / Brand Headers & Final Reveal',
    path: '/src/assets/images/assets/logo.png',
    type: 'image',
    isImported: true,
    requiredFormat: 'PNG / SVG',
    description: 'The exact original BLACK ROSE MT logo asset supplied by the user.',
  },

  // 3. Birthday Girl Photo
  birthdayGirlPhoto: {
    id: 'birthdayGirlPhoto',
    label: 'Birthday Girl Photo',
    scene: 'Identity Introductions & Birthday Reveal',
    path: null, // Placeholder awaiting user asset import
    type: 'image',
    isImported: false,
    requiredFormat: 'JPG / PNG (Portrait recommended)',
    description: 'Supplied photo of the birthday girl to be showcased with her royal identity.',
  },

  // 4. Cake Scene Visual Reference
  cakeReferenceImage: {
    id: 'cakeReferenceImage',
    label: 'Original Cake Scene Reference',
    scene: 'Cake Entrance & Ceremony',
    path: null, // Placeholder awaiting user asset import
    type: 'image',
    isImported: false,
    requiredFormat: 'JPG / PNG',
    description: 'Authoritative visual reference of the two 3D-style characters pushing trolley with Barbie cake.',
  },

  // 5. Squad Friend Logos
  friendLogoPrimexAhmed: {
    id: 'friendLogoPrimexAhmed',
    label: 'PrimexAhmed Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for PrimexAhmed (Gaming Partner & Loyal Brother).',
  },
  friendLogoPrimexHaxx: {
    id: 'friendLogoPrimexHaxx',
    label: 'PrimexHaxx Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for PrimexHaxx (Strategist & True Companion).',
  },
  friendLogoNexoGaming: {
    id: 'friendLogoNexoGaming',
    label: 'Nexo Gaming Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for Nexo gaming (Squad Energizer & High-Spirit Friend).',
  },
  friendLogoAbhixPlayz: {
    id: 'friendLogoAbhixPlayz',
    label: 'AbhixPlayz Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for AbhixPlayz (Creative Gamer & Respected Friend).',
  },
  friendLogoMSR: {
    id: 'friendLogoMSR',
    label: 'MSR Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for MSR (Pillar of Respect & Brotherhood).',
  },
  friendLogoVishal: {
    id: 'friendLogoVishal',
    label: 'Vishal Logo',
    scene: 'Friend Introductions & Envelopes',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'PNG / JPG',
    description: 'Supplied logo/avatar for Vishal (Warm Heart & Constant Well-Wisher).',
  },

  // 6. Jump-Scare Video
  jumpScareVideo: {
    id: 'jumpScareVideo',
    label: 'Masti Jump-Scare Video',
    scene: 'Ek Choti Si Masti (Dodging Button)',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Playful jump-scare video triggered after catching the dodging button.',
  },

  // 7. Friend Letter Videos (Optional individual letter videos)
  friendLetterVideo_primexahmed: {
    id: 'friendLetterVideo_primexahmed',
    label: 'PrimexAhmed Letter Video',
    scene: 'Envelope Grid: PrimexAhmed Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying PrimexAhmed letter.',
  },
  friendLetterVideo_primexhaxx: {
    id: 'friendLetterVideo_primexhaxx',
    label: 'PrimexHaxx Letter Video',
    scene: 'Envelope Grid: PrimexHaxx Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying PrimexHaxx letter.',
  },
  friendLetterVideo_nexo_gaming: {
    id: 'friendLetterVideo_nexo_gaming',
    label: 'Nexo gaming Letter Video',
    scene: 'Envelope Grid: Nexo gaming Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying Nexo gaming letter.',
  },
  friendLetterVideo_abhixplayz: {
    id: 'friendLetterVideo_abhixplayz',
    label: 'AbhixPlayz Letter Video',
    scene: 'Envelope Grid: AbhixPlayz Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying AbhixPlayz letter.',
  },
  friendLetterVideo_msr: {
    id: 'friendLetterVideo_msr',
    label: 'MSR Letter Video',
    scene: 'Envelope Grid: MSR Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying MSR letter.',
  },
  friendLetterVideo_vishal: {
    id: 'friendLetterVideo_vishal',
    label: 'Vishal Letter Video',
    scene: 'Envelope Grid: Vishal Letter',
    path: null,
    type: 'video',
    isImported: false,
    requiredFormat: 'MP4',
    description: 'Optional video message accompanying Vishal letter.',
  },

  // 8. Original Stationery References
  stationeryRef1: {
    id: 'stationeryRef1',
    label: 'Section 5 Stationery Reference (Sky Full of Duas)',
    scene: 'A Sky Full of Duas 🌙',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'JPG / PNG',
    description: 'Envelope, ribbon, wax seal, cream paper, and delicate floral details.',
  },
  stationeryRef2: {
    id: 'stationeryRef2',
    label: 'Section 6 Stationery Reference (Shona Bhai Letter)',
    scene: 'From Shona Bhai, With Duas 💌',
    path: null,
    type: 'image',
    isImported: false,
    requiredFormat: 'JPG / PNG',
    description: 'Pink paper, roses, and warm candlelight stationery card (strictly NO video).',
  },
};

/**
 * Retrieve path for a logical asset with fallback support
 */
export function getAssetPath(assetId: string, fallbackPath: string | null = null): string | null {
  const asset = ASSET_MANIFEST[assetId];
  if (asset && asset.isImported && asset.path) {
    return asset.path;
  }
  return fallbackPath;
}

/**
 * Helper to check if an asset is imported
 */
export function isAssetImported(assetId: string): boolean {
  return Boolean(ASSET_MANIFEST[assetId]?.isImported);
}

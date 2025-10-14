export type SocialPlatform = 
  | "twitter" 
  | "instagram" 
  | "linkedin" 
  | "facebook" 
  | "tiktok" 
  | "threads"
  | "bluesky";

export interface PlatformConfig {
  name: string;
  displayName: string;
  maxCharacters: number;
  placeholder: string;
  bioLabel: string;
  icon?: string;
  supportsTags: boolean;
  supportsEmojis: boolean;
  commonFeatures: string[];
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  twitter: {
    name: "twitter",
    displayName: "Twitter/X",
    maxCharacters: 160,
    placeholder: "e.g. Tech entrepreneur, coffee lover, dog parent",
    bioLabel: "Twitter bio",
    supportsTags: true,
    supportsEmojis: true,
    commonFeatures: ["hashtags", "mentions", "links"]
  },
  instagram: {
    name: "instagram",
    displayName: "Instagram",
    maxCharacters: 150,
    placeholder: "e.g. Food blogger, sunset chaser, NYC 📍",
    bioLabel: "Instagram bio",
    supportsTags: true,
    supportsEmojis: true,
    commonFeatures: ["emojis", "line breaks", "links"]
  },
  linkedin: {
    name: "linkedin",
    displayName: "LinkedIn",
    maxCharacters: 220,
    placeholder: "e.g. Senior Software Engineer at Google, AI enthusiast",
    bioLabel: "LinkedIn headline/bio",
    supportsTags: false,
    supportsEmojis: false,
    commonFeatures: ["professional tone", "achievements", "skills"]
  },
  facebook: {
    name: "facebook",
    displayName: "Facebook",
    maxCharacters: 101,
    placeholder: "e.g. Proud parent, marathon runner, book club organizer",
    bioLabel: "Facebook bio",
    supportsTags: false,
    supportsEmojis: true,
    commonFeatures: ["personal interests", "location", "relationships"]
  },
  tiktok: {
    name: "tiktok",
    displayName: "TikTok",
    maxCharacters: 80,
    placeholder: "e.g. Dance creator, comedy skits, trending sounds",
    bioLabel: "TikTok bio",
    supportsTags: true,
    supportsEmojis: true,
    commonFeatures: ["trending topics", "hashtags", "short phrases"]
  },
  threads: {
    name: "threads",
    displayName: "Threads",
    maxCharacters: 150,
    placeholder: "e.g. Sharing thoughts on tech, books, and life",
    bioLabel: "Threads bio",
    supportsTags: true,
    supportsEmojis: true,
    commonFeatures: ["conversational tone", "topics of interest"]
  },
  bluesky: {
    name: "bluesky",
    displayName: "Bluesky",
    maxCharacters: 256,
    placeholder: "e.g. Decentralized social advocate, open source contributor",
    bioLabel: "Bluesky bio",
    supportsTags: true,
    supportsEmojis: true,
    commonFeatures: ["handles", "custom feeds", "moderation"]
  }
};

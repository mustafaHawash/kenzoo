export type AssetPath = `/${string}`;

export type ThemeAssetId = "shared" | "eid-el-adha" | "eid-al-adha";

export type BackgroundScene =
    | "home"
    | "setup"
    | "gameplay"
    | "play"
    | "loading"
    | "treasure"
    | "ceremony";

export type StickerMood = "celebration" | "fail" | "thinking";

export type SoundCue =
    | "click"
    | "sessionStart"
    | "correctAnswer"
    | "wrongAnswer"
    | "pathComplete"
    | "treasureOpenStart"
    | "treasureRevealCommon"
    | "treasureRevealRare"
    | "treasureRevealLegendary";

export type SoundtrackLayer =
    | "core"
    | "gameplay"
    | "ceremony";

export type ThemeAssetPack = {
    backgrounds: Partial<Record<BackgroundScene, AssetPath>>;
    sounds: Partial<Record<SoundCue, AssetPath>>;
    stickers: Partial<Record<StickerMood, readonly AssetPath[]>>;
    icons: Record<string, AssetPath>;
    particles: Record<string, AssetPath>;
};

import type { AssetPath, BackgroundScene } from "./types";

export const sharedBackgroundAssets = {
    mainGameplay: "/images/backgrounds/backgroundsmain-gameplay.webp",
    mainGameplayAlt: "/images/backgrounds/backgroundsmain-gameplay2.webp",
    loading: "/images/backgrounds/backgrounds-loading.webp",
    sessionSummary: "/images/backgrounds/backgrounds-session-summary.webp",
    treasureOpen: "/images/backgrounds/open treasure.webp",
    quizStation: "/images/backgrounds/stations-quiz-station.webp",
    memoryStation: "/images/backgrounds/stations-memory.webp",
    memoryStationAlt: "/images/backgrounds/stations-memory2.webp",
    islamicStation: "/images/backgrounds/stationsislamic.webp",
} as const satisfies Record<string, AssetPath>;

export const eidAlAdhaBackgroundAssets = {
    eidTheme: "/images/backgrounds/eid-el-adha/eid-theme.webp",
    eidAlAdhaTheme: "/images/backgrounds/eid-el-adha/eid-aladha-theme.webp",
} as const satisfies Record<string, AssetPath>;

export const backgroundAssets = {
    shared: sharedBackgroundAssets,
    "eid-el-adha": eidAlAdhaBackgroundAssets,
    "eid-al-adha": eidAlAdhaBackgroundAssets,
} as const;

export const defaultBackgroundsByScene = {
    home: sharedBackgroundAssets.mainGameplay,
    setup: eidAlAdhaBackgroundAssets.eidTheme,
    gameplay: sharedBackgroundAssets.mainGameplayAlt,
    play: sharedBackgroundAssets.quizStation,
    loading: sharedBackgroundAssets.loading,
    treasure: sharedBackgroundAssets.treasureOpen,
    ceremony: sharedBackgroundAssets.sessionSummary,
} as const satisfies Record<BackgroundScene, AssetPath>;

import type { AssetPath, SoundCue, SoundtrackLayer } from "./types";

export const soundAssets = {
    click: "/sounds/sfx/click.mp3",
    sessionStart: "/sounds/sfx/session-start.mp3",
    correctAnswer: "/sounds/sfx/correct-answer.mp3",
    wrongAnswer: "/sounds/sfx/wrong-answer.mp3",
    pathComplete: "/sounds/sfx/pathCompelete.mp3",
    treasureOpenStart: "/sounds/sfx/chimes-whoosh-OpenTreaasureStart.mp3",
    treasureRevealCommon: "/sounds/sfx/Gentle chime-CommonTreasureReveal.mp3",
    treasureRevealRare: "/sounds/sfx/Sparkle + tone - RareTreasureReveal.mp3",
    treasureRevealLegendary: "/sounds/sfx/Magic-Reveal-LegendaryTreasureReveal.mp3",
} as const satisfies Record<SoundCue, AssetPath>;

/* ─── Soundtrack layers — looping background music ─── */
export const soundtrackAssets = {
    core: "/sounds/core-background-music/Main-Soundtrack.mp3",
    gameplay: "/sounds/theme-music/eid-el-adha/Eid-Gameplay-SoundTrack.mp3",
    ceremony: "/sounds/theme-music/eid-el-adha/eid-ending-ceremony.mp3",
} as const satisfies Record<SoundtrackLayer, AssetPath>;

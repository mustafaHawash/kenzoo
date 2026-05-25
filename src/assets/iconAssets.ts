import type { AssetPath } from "./types";

export const iconAssets = {
    logoMark: "/Logo-PNG.webp",
    logoFull: "/logo full.webp",
    lantern: "/images/icons/lantern-icon.webp",
    bigMoon: "/images/icons/big-moon-icon.webp",
    smallMoon: "/images/icons/small-moon-icon.webp",
    mainKey: "/images/icons/main-key-icon.webp",
    secondaryKey: "/images/icons/secoundary-key-icon.webp",
    treasure: "/images/icons/treasure-icon.webp",
    treasureSymbol: "/images/icons/treasure-symbol.webp",
    starsSticker: "/images/icons/stars-sticker.webp",
    tulipSticker: "/images/icons/tulip-sticker.webp",
    shySticker: "/images/icons/shy-sticker.webp",
} as const satisfies Record<string, AssetPath>;

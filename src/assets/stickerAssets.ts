import type { AssetPath, StickerMood } from "./types";

export const stickerAssets = {
    celebration: [
        "/images/stickers/celebration/are-u-serious-sticker.webp",
        "/images/stickers/celebration/being-cool-sticker.webp",
        "/images/stickers/celebration/cute-look-sticker.webp",
        "/images/stickers/celebration/done-hitting-sticker.webp",
        "/images/stickers/celebration/finding-a-treasure-kenzo-and-sheep.webp",
        "/images/stickers/celebration/kenzo-handing-tresure-to-sheep.webp",
        "/images/stickers/celebration/looking-for-treasure-kenzo-and-sheep.webp",
        "/images/stickers/celebration/love-you-1-sticker.webp",
        "/images/stickers/celebration/shy-tom-sticker.webp",
        "/images/stickers/celebration/so-happy-sticker.webp",
        "/images/stickers/celebration/tricky-sticker-1.webp",
        "/images/stickers/celebration/wining-game-kenzo-and-sheep.webp",
        "/images/stickers/celebration/wining-game-2-kenzo-and-sheep.webp",
        "/images/stickers/celebration/wining-game-3-kenzo-and-sheep.webp",
        "/images/stickers/celebration/you-are-the-boss-sticker.webp",
    ],
    fail: [
        "/images/stickers/fail/failing-to-answer-kenzo-and-sheep.webp",
        "/images/stickers/fail/focus-my-dear-sticker.webp",
        "/images/stickers/fail/hit-him-with-pellow-sticker.webp",
        "/images/stickers/fail/no-comment-sticker.webp",
        "/images/stickers/fail/sad-tell-everything-sticker.webp",
        "/images/stickers/fail/sad-tom-sticker.webp",
        "/images/stickers/fail/shocked-sheep-sticker.webp",
        "/images/stickers/fail/tricky-sticker-2.webp",
        "/images/stickers/fail/we-are-done-sticker.webp",
        "/images/stickers/fail/who-want-punish-sticker.webp",
        "/images/stickers/fail/you-are-punished-sticker.webp",
        "/images/stickers/fail/you-want-got-hit-sticker.webp",
    ],
    thinking: [
        "/images/stickers/thinking-loading/confused-but-ok-sticker.webp",
        "/images/stickers/thinking-loading/iam-good-sticker.webp",
        "/images/stickers/thinking-loading/laughing-kenzo-and-sheep.webp",
        "/images/stickers/thinking-loading/like-i-care-sticker.webp",
        "/images/stickers/thinking-loading/loading-4-kenzo-and-sheep.webp",
        "/images/stickers/thinking-loading/playing-kenzo-and-sheep.webp",
        "/images/stickers/thinking-loading/running-fun-kenzo-and-sheep.webp",
        "/images/stickers/thinking-loading/shocked-sticker.webp",
        "/images/stickers/thinking-loading/shy-tom-full-sticker.webp",
        "/images/stickers/thinking-loading/thinking-sticker.webp",
        "/images/stickers/thinking-loading/think-and-drink-sticker.webp",
        "/images/stickers/thinking-loading/threatening-sticker.webp",
        "/images/stickers/thinking-loading/tricky-sticker-2.webp",
        "/images/stickers/thinking-loading/wait-what-sticker.webp",
        "/images/stickers/thinking-loading/wondring-kenzo-and-sheep.webp",
    ],
    treasureBack: ["/images/stickers/Kenzoo-card-back-before-treasure-reveal.webp"],
} as const satisfies Record<StickerMood | "treasureBack", readonly AssetPath[]>;

function pickRandom(pool: readonly AssetPath[]): AssetPath {
    return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomCelebrationSticker(): AssetPath {
    return pickRandom(stickerAssets.celebration);
}

export function getRandomFailSticker(): AssetPath {
    return pickRandom(stickerAssets.fail);
}

export function getRandomThinkingSticker(): AssetPath {
    return pickRandom(stickerAssets.thinking);
}

import { defaultBackgroundsByScene, eidAlAdhaBackgroundAssets } from "./backgroundAssets";
import { iconAssets } from "./iconAssets";
import { particleAssets } from "./particleAssets";
import { soundAssets } from "./soundAssets";
import { stickerAssets } from "./stickerAssets";
import type { BackgroundScene, ThemeAssetId, ThemeAssetPack } from "./types";

const sharedAssets = {
    backgrounds: defaultBackgroundsByScene,
    sounds: soundAssets,
    stickers: stickerAssets,
    icons: iconAssets,
    particles: particleAssets,
} as const satisfies ThemeAssetPack;

const eidAlAdhaAssets = {
    backgrounds: {
        ...defaultBackgroundsByScene,
        home: defaultBackgroundsByScene.home,
        setup: eidAlAdhaBackgroundAssets.eidTheme,
        gameplay: eidAlAdhaBackgroundAssets.eidAlAdhaTheme,
    },
    sounds: soundAssets,
    stickers: stickerAssets,
    icons: iconAssets,
    particles: particleAssets,
} as const satisfies ThemeAssetPack;

export const themeAssets = {
    shared: sharedAssets,
    "eid-el-adha": eidAlAdhaAssets,
    "eid-al-adha": eidAlAdhaAssets,
} as const satisfies Record<ThemeAssetId, ThemeAssetPack>;

export function getThemeAssets(themeId: ThemeAssetId = "eid-el-adha"): ThemeAssetPack {
    return themeAssets[themeId] ?? themeAssets.shared;
}

export function getThemeBackground(
    scene: BackgroundScene,
    themeId: ThemeAssetId = "eid-el-adha",
) {
    return getThemeAssets(themeId).backgrounds[scene] ?? themeAssets.shared.backgrounds[scene];
}

export type { BackgroundScene, ThemeAssetId, ThemeAssetPack } from "./types";

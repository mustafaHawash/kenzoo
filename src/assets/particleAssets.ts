import type { AssetPath } from "./types";

export const particleAssets = {
    sparklesOverlay: "/images/overlays/overlay-sparkles.webp",
    decorStarsSparkles: "/images/overlays/decor-stars-sparkles.webp",
    paperTexture: "/images/textures/texture-paper.webp",
} as const satisfies Record<string, AssetPath>;

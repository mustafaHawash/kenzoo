
/**
 * avatar-registry.ts
 *
 * Data-driven avatar registry for Kenzoo session setup.
 *
 * Supports future:
 *   - Seasonal avatar packs (Ramadan, Eid, Hijra)
 *   - Icon pack extensions
 *   - AI-generated avatars
 *   - Themed asset collections
 *
 * Architecture:
 *   - Each avatar pack has an id, label, and emoji list
 *   - The "default" pack is always available
 *   - Seasonal packs can be enabled/disabled based on theme or date
 *   - The registry is a pure data structure — no UI, no state
 */

export type AvatarPack = {
    /** Unique pack identifier */
    id: string;
    /** Display label (Arabic) */
    label: string;
    /** Emoji avatars in this pack */
    avatars: string[];
    /** Whether this pack is currently active */
    active: boolean;
    /** Optional theme that enables this pack */
    themeId?: string;
};

/* ─── Avatar Packs ─── */

const defaultPack: AvatarPack = {
    id: "lantern",
    label: "فوانيس",
    avatars: ["🌙", "🕯️", "🔮", "📖", "✨", "🗝️", "🌿", "⭐"],
    active: true,
};

const eidPack: AvatarPack = {
    id: "eid",
    label: "العيد",
    avatars: ["🐑", "🕌", "🎉", "🧧", "🫶", "🌺", "📿", "🪔"],
    active: true,
    themeId: "eid-el-adha",
};

const hijraPack: AvatarPack = {
    id: "hijra",
    label: "الهجرة",
    avatars: ["🐪", "🌅", "🏜️", "💫", "🗺️", "⛺", "🧭", "🌙"],
    active: false,
    themeId: "hijra",
};

/* ─── Registry ─── */

const allPacks: AvatarPack[] = [defaultPack, eidPack, hijraPack];

/**
 * Returns all active avatar packs.
 * Future: filter by date, theme, user preferences.
 */
export function getActivePacks(): AvatarPack[] {
    return allPacks.filter((pack) => pack.active);
}

/**
 * Returns all available avatars from active packs.
 * Deduplicates across packs.
 */
export function getAllAvatars(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const pack of getActivePacks()) {
        for (const avatar of pack.avatars) {
            if (!seen.has(avatar)) {
                seen.add(avatar);
                result.push(avatar);
            }
        }
    }

    return result;
}

/**
 * Returns avatars for a specific theme pack, falling back to default.
 */
export function getAvatarsForTheme(themeId?: string): string[] {
    if (!themeId) return getAllAvatars();

    const themePack = allPacks.find(
        (pack) => pack.themeId === themeId && pack.active,
    );
    if (!themePack) return getAllAvatars();

    // Merge theme pack with default, theme pack first
    const seen = new Set<string>();
    const result: string[] = [];

    for (const avatar of themePack.avatars) {
        if (!seen.has(avatar)) {
            seen.add(avatar);
            result.push(avatar);
        }
    }
    for (const avatar of defaultPack.avatars) {
        if (!seen.has(avatar)) {
            seen.add(avatar);
            result.push(avatar);
        }
    }

    return result;
}

/**
 * Picks the next default avatar for a new player.
 * Cycles through available avatars based on player index.
 */
export function getDefaultAvatarForIndex(index: number): string {
    const avatars = getAllAvatars();
    return avatars[index % avatars.length];
}

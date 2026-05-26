/**
 * Eid Al-Adha player titles.
 *
 * Titles are the social currency of Kenzoo.
 * They show off personality, not skill — everyone can earn them.
 * Egyptian common life flavor: warm, funny, and relatable.
 */
export const eidTitles = [
    /* ═══ Wisdom & Knowledge ═══ */
    "🧠 فيلسوف زمانك",
    "📚 المستكشف الرايق",
    "🎓 دارس برة وجوة",
    "💡 الفنان ",
    "🔍 المحقق الذكي",
    "🦉 بومة الحكمة",
    "🎯 القناص ",

    /* ═══ Heart & Kindness ═══ */
    "❤️ القلب الطيب",
    "🤝 محبوب العيلة",
    "🫂 سند الكل",
    "🌸 عطر البيت",
    "🫶 الحضن الدافئ",
    "🕊️ حمامة السلام",

    /* ═══ Fun & Personality ═══ */
    "✨ أخف دم يعم",
    "🎉 العيد شخصياً",
    "😄 بسمة البيت",
    "🤭 كوميديان العيلة",
    "🎤 العندليب",

    /* ═══ Treasure & Luck ═══ */
    "👑 كينج الكنوز",
    "🌟 نجم العيد",
    "💎 لؤلؤة النيل",
    "🏆 بطل الكنز",
    "🗝️ فاتح الأبواب",
    "🧲 مغناطيس الحظ",
    "🍀 حظ العمر",

    /* ═══ Egyptian Life ═══ */
    "🫖 فنّان الشاي",
    "🥜 ملك الفول",
    "🧆 شيف الكشري",
    "🍞 عيش وحياة",
    "☕ سلطان القهوة",
    "🏠  العمدة",
    "🚶 راجل الشارع",
    "🌅 شيخ البلد",

    /* ═══ Eid Spirit ═══ */
    "🌙 هلال العيد",
    "🕌 مؤذن الفجر",
    "🐑 كبش العيد",
    
    ];

/**
 * Pick a random title from the Eid titles pool.
 * Used when a treasure with type "title" is opened.
 */
export function pickRandomTitle(exclude: string[] = []): string {
    const available = eidTitles.filter((t) => !exclude.includes(t));
    const pool = available.length > 0 ? available : eidTitles;
    return pool[Math.floor(Math.random() * pool.length)];
}

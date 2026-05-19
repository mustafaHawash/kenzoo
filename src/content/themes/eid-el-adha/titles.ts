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
    "🎓 عالم العيد",
    "💡 فكّار بالشمع",
    "🔍 المحقق الذكي",
    "📖 قارئ الفنجان",
    "🦉 بومة الحكمة",
    "🎯 صايب السهم",

    /* ═══ Heart & Kindness ═══ */
    "❤️ القلب الطيب",
    "🤝 ودود العيلة",
    "🫂 سند الغريب",
    "🌸 عطر البيت",
    "🫶 حضن دافئ",
    "🕊️ حمامة سلام",
    "🌻 شمس الحنان",
    "💧 قطرة خير",

    /* ═══ Fun & Personality ═══ */
    "✨ أخف دم يعم",
    "🎉 فرحانة العيد",
    "😄 بسمة البيت",
    "🤭 طرطش العيلة",
    "💃 دانس العيد",
    "🎸 مزيكا الكشك",
    "🎤 مطرب الحارة",
    "🎪 بهلوان الكرنفال",

    /* ═══ Treasure & Luck ═══ */
    "👑 كينج الكنوز",
    "🌟 نجم العيد",
    "💎 لؤلؤة النيل",
    "🏆 بطل الكنز",
    "🗝️ فاتح الأبواب",
    "🧲 مغناطيس الحظ",
    "🍀 حظ العمر",
    "🎰 جاكبوت العيد",

    /* ═══ Egyptian Life ═══ */
    "🫖 فنّان الشاي",
    "🥜 ملك الفول",
    "🧆 شيف الكشري",
    "🍞 عيش وحياة",
    "☕ سلطان القهوة",
    "🏠 عمدة الحارة",
    "🚶 راجل الشارع",
    "🌅 فجر جديد",

    /* ═══ Eid Spirit ═══ */
    "🌙 هلال العيد",
    "🕌 مؤذن الفجر",
    "🐑 كبش العيد",
    "🎊 فرحة العيد",
    "🎁 هدية السماء",
    "🤲 دعوة أمي",
    "📿 سبّاح المسجد",
    "🌅 فجر العيد",
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

/**
 * Kenzoo — Eid Treasures Pack v6
 * Emotional collectibles with proper reward types
 */

import { Treasure } from "@/types/treasure";
import { pickRandomTitle } from "./titles";

export const eidTreasures: Treasure[] = [
    /* ═════════════════ COMMON ═════════════════ */

    {
        id: "eid-common-01",

        emoji: "🌙",

        title:
            "نور الليلة",

        flavor:
            "“ولعلّ القادم أجمل مما ظننت” ✨",

        description:
            "واضح إن الحظ ابتسم لك النهاردة 😄",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "emotional",
            message: "القمر بيضوي لما حد بيفتكر اللي بيحبه 🌙",
        },
    },

    {
        id: "eid-common-02",

        emoji: "☕",

        title:
            "قعدة رايقة",

        flavor:
            "“خفّف على قلبك… الدنيا مش مستاهلة” 🤍",

        description:
            "الكنز ده شكله جاي بعد يوم طويل ☕",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "cozy",
            message: "كوباية شاي بتسخّن القلب قبل الجسم ☕",
        },
    },

    {
        id: "eid-common-03",

        emoji: "😄",

        title:
            "ضحكة نجاة",

        flavor:
            "عارف لو تضحك… تكمل أي حاجة 😄",

        description:
            "واضح إن الجلسة داخلة مود ضحك ✨",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "funny",
            message: "ضحكة واحدة ممكن تغيّر يومك كلّه 😄",
        },
    },

    {
        id: "eid-common-004",

        emoji: "🕌",

        title:
            "دعوة طيبة",

        flavor:
            "“رب الخير لا يأتي إلا بخير” 🌙",

        description:
            "واضح إن الكنز ده فيه بركة 🤍",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "spiritual",
            message: "دعوة من القلب بتوصل أسرع من أي رسالة 🤲",
        },
    },

    {
        id: "eid-common-05",

        emoji: "🎯",

        title:
            "ضربة حظ",

        flavor:
            "واضح إن النجوم داخلة معاك الجلسة دي 👀",

        description:
            "الكنز ده داخل بثقة شوية 😄",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "lucky",
            message: "الحدفة وقعت على بابك النهاردة 🍀",
        },
    },

    {
        id: "eid-common-06",

        emoji: "📿",

        title:
            "سكينة صغيرة",

        flavor:
            "“وفي القلب متّسع لكل فرج قريب” ✨",

        description:
            "الكنز ده رايق بشكل مريب 🌙",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "peaceful",
        },
    },

    {
        id: "eid-common-07",

        emoji: "🧠",

        title:
            "لمعة ذكاء",

        flavor:
            "واضح إن مخك صاحي النهاردة 😄",

        description:
            "واضح إنك مركز مع الرحلة 👀",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "smart",
        },
    },

    {
        id: "eid-common-08",

        emoji: "🍃",

        title:
            "نسمة راحة",

        flavor:
            "“اهدأ… كل شيء سيأتي في وقته” 🤍",

        description:
            "الكنز ده واخد الأمور ببساطة ✨",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "comfort",
        },
    },

    /* ═════════════════ RARE ═════════════════ */

    {
        id: "eid-rare-001",

        emoji: "👑",

        title:
            "تاج الحظ",

        flavor:
            "واضح إن الكنوز بتحبك النهاردة 😄",

        description:
            "الجلسة بدأت تتعامل معاك باحترام 👀",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "rare-moment",
        },
    },

    {
        id: "eid-rare-002",

        emoji: "🗝️",

        title:
            "المفتاح الذهبي",

        flavor:
            "“ومن سار على الدرب… وصل” ✨",

        description:
            "في باب للحظ اتفتح فجأة 🌙",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "mystic",
        },
    },

    {
        id: "eid-rare-003",

        emoji: "🌌",

        title:
            "السر الكبير",

        flavor:
            "يمكن الكنز الحقيقي إنك مكملت لحد هنا 👀",

        description:
            "واضح إن الرحلة بدأت تكشف أسرارها 😄",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "mysterious",
        },
    },

    {
        id: "eid-rare-004",

        emoji: "😄",

        title:
            "ابن الحظ",

        flavor:
            "لو المصري عرف يدخل مود الحظ… محدش يوقفه 😄",

        description:
            "واضح إن الليلة دي جاية معاك ✨",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "lucky",
        },
    },

    {
        id: "eid-rare-005",

        emoji: "📜",

        title:
            "رسالة مطمّنة",

        flavor:
            "“ما دام قلبك بخير… فكل شيء يهون” 🤍",

        description:
            "الكنز ده شكله فاهم الدنيا 🌙",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "emotional",
        },
    },

    {
        id: "eid-rare-006",

        emoji: "⭐",

        title:
            "النجم الهادي",

        flavor:
            "واضح إن الرحلة ماشية معاك بسلاسة ✨",

        description:
            "الهدوء ده مش طبيعي شوية 😄",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "cozy",
        },
    },

    /* ═════════════════ LEGENDARY ═════════════════ */

    {
        id: "eid-legendary-001",

        emoji: "🏆",

        title:
            "كنز الليلة",

        flavor:
            "“بعض الليالي… تُحكى ولا تُنسى” 🌙",

        description:
            "واضح إن الليلة قررت تدلعك 😄",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "legendary",
        },
    },

    {
        id: "eid-legendary-002",

        emoji: "👑",

        title:
            "أسطورة الرحلة",

        flavor:
            "واضح إن اللعبة معجبة بيك رسمي 😄",

        description:
            "في ناس بتلعب… وفي ناس بتعمل هيبة 👀",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "epic",
        },
    },

    {
        id: "eid-legendary-003",

        emoji: "🕋",

        title:
            "بركة الطريق",

        flavor:
            "“وفي كل خطوة خير لا نراه” ✨",

        description:
            "الكنز ده داخل بهدوء الكبار 🤍",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "spiritual",
        },
    },

    {
        id: "eid-legendary-004",

        emoji: "🎊",

        title:
            "فرحة العيد",

        flavor:
            "واضح إن الفرحة اختارتك الليلة 😄",

        description:
            "الكنز ده داخل يوزع طاقة حلوة 🌙",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "celebration",
        },
    },

    {
        id: "eid-legendary-005",

        emoji: "🌠",

        title:
            "الليلة المحظوظة",

        flavor:
            "“لا تدري أي باب للخير فُتح لك الآن” 👀",

        description:
            "واضح إن السماء باعتة لك إشارات ✨",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "destiny",
        },
    },
        {
        id: "eid-common-001",

        emoji: "🌙",

        title:
            "نور الليلة",

        flavor:
            "الهدوء ده شكله بداية خير ✨",

        description:
            "الحمد لله… لسه في حاجات حلوة جاية 🤍",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "wisdom",

            message:
                "ربنا يرزقك راحة بال من حيث لا تحتسب 🌙",
        },
    },

    {
        id: "eid-common-002",

        emoji: "☕",

        title:
            "قعدة رايقة",

        flavor:
            "“خفّف على قلبك… الدنيا مش مستاهلة” 🤍",

        description:
            "الكنز ده شكله جاي بعد يوم طويل ☕",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "cozy",

            message:
                "إن شاء الله الأيام الجاية أهدى وألطف ✨",
        },
    },

    {
        id: "eid-common-003",

        emoji: "😄",

        title:
            "ضحكة من القلب",

        flavor:
            "الضحك في اللمة رزق والله 😄",

        description:
            "واضح إن الجلسة بدأت تحلو 👀",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "funny",

            message:
                "لو المصري ضحك… يعرف يكمل أي حاجة 😂",
        },
    },

    {
        id: "eid-common-004",

        emoji: "📿",

        title:
            "بركة صغيرة",

        flavor:
            "ذكر بسيط يهوّن الدنيا 🌙",

        description:
            "ربنا يملأ قلبك طمأنينة بإذن الله 🤍",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "spiritual",

            message:
                "سبحان الله… الخير ساعات ييجي بهدوء ✨",
        },
    },

    {
        id: "eid-common-005",

        emoji: "🍃",

        title:
            "نسمة راحة",

        flavor:
            "واضح إن الدنيا قررت تهدى شوية 😌",

        description:
            "الكنز ده واخد الأمور ببساطة ☕",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "peaceful",

            message:
                "إن شاء الله اللي جاي أريح لقلبك 🌙",
        },
    },

    {
        id: "eid-common-006",

        emoji: "🕌",

        title:
            "دعوة طيبة",

        flavor:
            "“ورب الخير لا يأتي إلا بخير” ✨",

        description:
            "واضح إن في دعوة حلوة في الطريق 🤍",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "wisdom",

            message:
                "ربنا يفتح لك أبواب الخير والسكينة 🌙",
        },
    },

    {
        id: "eid-common-007",

        emoji: "🧠",

        title:
            "لمعة ذكاء",

        flavor:
            "واضح إن مخك صاحي النهاردة 👀",

        description:
            "في حد هنا مركز زيادة شوية 😄",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "smart",

            message:
                "الحكمة رزق… وربنا يزيدك فهم ✨",
        },
    },

    {
        id: "eid-common-008",

        emoji: "🎊",

        title:
            "فرحة خفيفة",

        flavor:
            "ريحة العيد دخلت الجلسة 😄",

        description:
            "واضح إن الجو بدأ يبقى ألطف 🌙",

        starsRequired: 3,

        rarity: "common",

        reward: {
            type: "celebration",

            message:
                "العيد من غير ضحك… مش عيد 😄",
        },
    },

    /* ═════════════════ RARE ═════════════════ */

    {
        id: "eid-rare-001",

        emoji: "🗝️",

        title:
            "مفتاح الخير",

        flavor:
            "في باب حلو بيتفتح فجأة أحيانًا 👀",

        description:
            "واضح إن الخير قريب بإذن الله ✨",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "mysterious",

            message:
                "إن شاء الله القادم أهدى وأجمل 🤍",
        },
    },

    {
        id: "eid-rare-002",

        emoji: "🌌",

        title:
            "السر الكبير",

        flavor:
            "بعض الليالي… تتحفظ في الذاكرة 🌙",

        description:
            "واضح إن الرحلة بدأت تكشف أسرارها 👀",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "secret",

            message:
                "يمكن الكنز الحقيقي كان اللمة نفسها ✨",
        },
    },

    {
        id: "eid-rare-003",

        emoji: "👑",

        title:
            "هيبة الليلة",

        flavor:
            "واضح إن الكنوز معجبة بيك النهاردة 😄",

        description:
            "في ناس بتلعب… وناس تعمل حضور 👀",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "title",
            message: pickRandomTitle(),
        },
    },

    {
        id: "eid-rare-004",

        emoji: "🌙",

        title:
            "نور هادي",

        flavor:
            "“ومن سار على الدرب… وصل” ✨",

        description:
            "الحمد لله على الهدوء بعد الزحمة 🤍",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "emotional",

            message:
                "ربنا يريح قلبك ويكتب لك الخير 🌙",
        },
    },

    {
        id: "eid-rare-005",

        emoji: "😄",

        title:
            "ابن الحظ",

        flavor:
            "واضح إن الحظ عرف عنوانك خلاص 😂",

        description:
            "الليلة داخلة معاك رسمي ✨",

        starsRequired: 5,

        rarity: "rare",

        reward: {
            type: "funny",

            message:
                "مرة تكسب… ومرة تكسب أكتر 😄",
        },
    },

    /* ═════════════════ LEGENDARY ═════════════════ */

    {
        id: "eid-legendary-001",

        emoji: "🏆",

        title:
            "كنز الليلة",

        flavor:
            "“بعض الليالي… تُحكى ولا تُنسى” 🌙",

        description:
            "واضح إن الليلة دي معمولة ليك 👀",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "epic",

            message:
                "ربنا يجعل أيامك كلها فرحة وراحة 🤍",
        },
    },

    {
        id: "eid-legendary-002",

        emoji: "👑",

        title:
            "تاج الرحلة",

        flavor:
            "واضح إن اللعبة قررت تدلعك 😄",

        description:
            "في ناس وجودها يفرق فعلًا ✨",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "title",
            message: pickRandomTitle(),
        },
    },

    {
        id: "eid-legendary-003",

        emoji: "🌠",

        title:
            "الليلة المحظوظة",

        flavor:
            "واضح إن السماء باعتة إشارات حلوة 👀",

        description:
            "إن شاء الله اللي جاي أحسن مما تتمنى 🌙",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "lucky",

            message:
                "رزقك هيجيلك في وقته بإذن الله ✨",
        },
    },

    {
        id: "eid-legendary-004",

        emoji: "🕋",

        title:
            "بركة الطريق",

        flavor:
            "وفي كل خطوة… خير لا نراه 🤍",

        description:
            "الكنز ده داخل بهدوء الكبار 🌙",

        starsRequired: 7,

        rarity: "legendary",

        reward: {
            type: "title",

            message:
                pickRandomTitle(),
        },
    },


];
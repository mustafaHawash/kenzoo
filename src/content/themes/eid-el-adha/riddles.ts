import { Station } from "@/types/station";
import { eidMissions } from "./missions";

export const eidRiddleStations: Station[] = [
    
    {
        id: "riddle-001",

        type: "riddle",

        category: "fun",

        title:
            " أسنان كتير",

        description:
            "فزورة خفيفة كده 😄",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "إيه اللي له أسنان لكنه لا يعض؟",

        answer:
            "المشط",

        hint:
            "🪥",

        explanation:
            "المشط له أسنان لكنه لا يعض 😄",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-002",

        type: "riddle",

        category: "nature",

        title:
            "من غير رجلين",

        description:
            "كلنا بنشوفه 👀",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "إيه اللي بيقع ومبيتكسرش؟",

        answer:
            "المطر",

        hint:
            "🌧️ ",

        explanation:
            "المطر ينزل باستمرار من غير تعب 🌧️",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-003",

        type: "riddle",

        category: "fun",

        title:
            "سفينة الصحراء",

        description:
            "حيوان مشهور جدًا 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "مين الحيوان اللي بيتسمّى سفينة الصحراء؟",

        answer:
            "الجمل",

        hint:
            "🐪 ",

        explanation:
            "الجمل يتحمل السفر الطويل في الصحراء 🐪",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-004",

        type: "riddle",

        category: "islamic",

        title:
            "🕋 شهر الخير",

        description:
            "سؤال قريب من أجواء العيد 🌙",

        theme: "eid-al-adha",

        mood: "peaceful",

        difficulty: 2,

        targetAgeGroup: "kid",

        question:
            "إيه الشهر اللي فيه صيام وقرآن وتراويح؟",

        answer:
            "رمضان",

        hint:
            "🌙✨",

        explanation:
            "رمضان شهر الخير والبركة 🤍",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-005",

        type: "riddle",

        category: "fun",

        title:
            "بيكبر كل ما ينقص",

        description:
            "فزورة مشهورة جدًا 😄",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 2,

        targetAgeGroup: "adult",

        question:
            "إيه اللي كل ما ناخد منه يكبر؟",

        answer:
            "الحفرة",

        hint:
            "👀",

        explanation:
            "كل الناس ممكن تاخد من الحفرة لكنها تفضل موجودة 😄",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-006",

        type: "riddle",

        category: "wisdom",

        title:
            "🤍 كل ما يزيد",

        description:
            "فكّر فيها بهدوء ✨",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 2,

        targetAgeGroup: "adult",

        question:
            "إيه الشيء اللي كل ما تعطي منه يكبر؟",

        answer:
            "الخير",

        hint:
            "🌙",

        explanation:
            "الخير يزيد وينتشر بين الناس 🤍",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-007",

        type: "riddle",

        category: "mystery",

        title:
            "👀 موجود لكنه لا يُمسك",

        description:
            "فزورة فيها شوية تركيز 😄",

        theme: "eid-al-adha",

        mood: "mystic",

        difficulty: 3,

        targetAgeGroup: "adult",

        question:
            "شيء تراه دائمًا لكن لا تستطيع لمسه… ما هو؟",

        answer:
            "الظل",

        hint:
            "☀️",

        explanation:
            "الظل موجود حولنا لكنه لا يُمسك 👀",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-008",

        type: "riddle",

        category: "islamic",

        title:
            "🕌 كلمة تطمّن",

        description:
            "كل المسلمين يحبوها 🤍",

        theme: "eid-al-adha",

        mood: "peaceful",

        difficulty: 3,

        targetAgeGroup: "adult",

        question:
            "ما الكلمة التي يقولها المسلم فتريح قلبه؟",

        answer:
            "الحمد لله",

        hint:
            "✨",

        explanation:
            "الحمد لله من أكثر الكلمات التي تطمئن القلب 🌙",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-009",

        type: "riddle",

        category: "science",

        title:
            "🌍 الكوكب الأزرق",

        description:
            "كلنا عايشين عليه 😄",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 2,

        targetAgeGroup: "kid",

        question:
            "ما اسم الكوكب الذي نعيش عليه؟",

        answer:
            "الأرض",

        hint:
            "🌎",

        explanation:
            "الأرض هي بيت البشر وكل الكائنات 🌍",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-010",

        type: "riddle",

        category: "islamic",

        title:
            "🐑 خليل الله",

        description:
            "سؤال من روح العيد 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 4,

        targetAgeGroup: "adult",

        question:
            "من النبي الذي يُسمّى خليل الله؟",

        answer:
            "سيدنا إبراهيم",

        hint:
            "🕋",

        explanation:
            "سيدنا إبراهيم عليه السلام هو خليل الله 🤍",

        reward: {
            stars: 4,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-011",

        type: "riddle",

        category: "geography",

        title:
            "🏞️ أطول نهر",

        description:
            "سؤال قريب مننا 😄",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 3,

        targetAgeGroup: "adult",

        question:
            "ما اسم النهر الذي يمر في مصر؟",

        answer:
            "النيل",

        hint:
            "🇪🇬",

        explanation:
            "نهر النيل من أشهر وأطول أنهار العالم 🌊",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

];

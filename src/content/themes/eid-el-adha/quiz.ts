import { Station } from "@/types/station";
import { eidMissions } from "./missions";

export const eidQuizStations: Station[] = [
    {
        id: "quiz-001",

        type: "quiz",

        category: "islamic",

        title: "🌙 حكمة الأضحية",

        description: "محطة تفكير بسيطة حول معنى الأضحية",

        theme: "eid-al-adha",

        mood: "reflective",

        difficulty: 2,

        targetAgeGroup: "adult",

        question: "ما الفكرة الأقرب لمعنى الأضحية؟",

        choices: ["الطاعة", "القوة", "الشهرة", "السفر"],

        answer: "الطاعة",

        hint: "فكر في قصة سيدنا إبراهيم عليه السلام",

        explanation: "الأضحية مرتبطة بالطاعة والثقة بالله.",

        reward: {
            stars: 1,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-002",

        type: "quiz",

        category: "history",

        title: "🕋 رحلة هاجر",

        description: "محطة عن أم سيدنا إسماعيل",

        theme: "eid-al-adha",

        mood: "reflective",

        difficulty: 3,

        targetAgeGroup: "adult",

        question: "ما الصفة الأبرز في قصة السيدة هاجر؟",

        choices: ["الصبر", "الشجاعة", "الاعتماد على الله", "كل ما سبق"],

        answer: "كل ما سبق",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-003",

        type: "quiz",

        category: "language",

        title: "📚 لغة ومعنى",

        description: "سؤال لغوي بسيط",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 2,

        targetAgeGroup: "teen",

        question: 'ما معنى كلمة "سكينة" الأقرب؟',

        choices: ["الهدوء", "السرعة", "القوة", "الحزن"],

        answer: "الهدوء",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-004",

        type: "quiz",

        category: "social",

        title: "❤️ روح العيد",

        description: "محطة اجتماعية دافئة",

        theme: "eid-al-adha",

        mood: "social",

        difficulty: 1,

        targetAgeGroup: "adult",

        question: "ما أكثر شيء يعطيك شعور العيد؟",

        choices: ["لمة العائلة", "التكبيرات", "الزيارات", "الطعام"],

        answer: "لمة العائلة",

        reward: {
            stars: 1,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-005",

        type: "quiz",

        category: "history",

        title: "🕋 مناسك الحج",

        description: "محطة فضول ومعرفة",

        theme: "eid-al-adha",

        mood: "mystery",

        difficulty: 3,

        targetAgeGroup: "adult",

        question: "ما أول مناسك الحج الكبرى يوم النحر؟",

        choices: ["رمي جمرة العقبة", "السعي", "طواف الوداع", "الحلق"],

        answer: "رمي جمرة العقبة",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },
];

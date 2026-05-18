import { Station } from "@/types/station";
import { eidMissions } from "./missions";

export const eidRiddleStations: Station[] = [
    {
        id: "riddle-001",

        type: "riddle",

        category: "wisdom",

        title: "🧠 لغز العيد",

        description: "محطة فضول ذكية",

        theme: "eid-al-adha",

        mood: "mystery",

        difficulty: 2,

        targetAgeGroup: "adult",

        question: "شيء نسمعه في العيد ولا نراه؟",

        answer: "التكبيرات",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-002",

        type: "riddle",

        category: "social",

        title: "✨ لغز اللمة",

        description: "لغز اجتماعي بسيط",

        theme: "eid-al-adha",

        mood: "social",

        difficulty: 1,

        targetAgeGroup: "teen",

        question: "كلما زاد عدد الناس حوله أصبح أجمل، ما هو؟",

        answer: "العيد",

        reward: {
            stars: 1,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },
];

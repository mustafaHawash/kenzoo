import type {
    SessionLengthDefinition,
    SetupPlayer,
    SetupStepDefinition,
    ThemeDefinition,
} from "./setup-types";

export const setupSteps: SetupStepDefinition[] = [
    {
        id: "players",
        eyebrow: "الدعوة",
        title: "مين هيشارك الليلة؟",
        subtitle: "ضيوف الحكاية، واحد واحد بهدوء.",
    },
    {
        id: "length",
        eyebrow: "إيقاع الجلسة",
        title: "قد إيه تحبوا تسهروا؟",
        subtitle: "اختاروا الوقت اللي يناسب قعدتكم الليلة.",
    },
    {
        id: "theme",
        eyebrow: "باب الحكاية",
        title: "الليلة شكلها هتميل لإيه؟",
        subtitle: "كل طريق بيفتح سكة لكنوز ومشاعر مختلفة.",
    },
    {
        id: "begin",
        eyebrow: "لحظة البداية",
        title: "الورق جاهز يتفتح",
        subtitle: "لمّة دافية، فوانيس منورة، وسر مستني يظهر.",
    },
];

export const avatarOptions = ["🌙", "🕯️", "🔮", "📖", "✨", "🗝️", "🌿", "⭐"];

export const sessionLengthOptions: SessionLengthDefinition[] = [
    {
        id: "short",
        label: "قصيرة 🌙",
        rounds: 3,
        mood: "هادية وخفيفة",
        description: "لمّة صغيرة تفتح باب الحكاية من غير استعجال.",
    },
    {
        id: "normal",
        label: "ليلة عادية ✨",
        rounds: 4,
        mood: "متوازنة ودافئة",
        description: "الإيقاع الأساسي لكنزو: مساحة كفاية للضحك والاكتشاف.",
    },
    {
        id: "long",
        label: "سهرة طويلة 🔥",
        rounds: 5,
        mood: "أعمق وأغنى",
        description: "لما القعدة مستريحة والليل لسه في أوله.",
    },
];

export const themeOptions: ThemeDefinition[] = [
    {
        id: "eid-el-adha",
        title: "عيد الأضحى",
        subtitle: "حكايات دافئة، أسرار العيد، وكنوز وسط اللمة.",
        atmosphere: "فوانيس ذهبية، صفحات هادية، وبهجة ناعمة.",
        status: "available",
        accent: "from-secondary/22 to-primary/12",
    },
    {
        id: "hijra",
        title: "الهجرة",
        subtitle: "ليلة جديدة لسه بتتكتب في كتاب كنزو.",
        atmosphere: "طريق طويل، نجوم قريبة، ووعد بحكايات جاية.",
        status: "coming-soon",
        accent: "from-primary/18 to-secondary/10",
    },
];

export const generationPhrases = [
    "الكنوز لسه بتستخبى...",
    "بنقلب صفحات الليلة...",
    "الفوانيس بتصحى واحدة واحدة...",
    "واضح إن الليلة مخبية حاجة غريبة...",
    "بنرتب الأسرار بهدوء...",
];

export function createInitialPlayers(): SetupPlayer[] {
    return [
        {
            id: "player-1",
            name: "",
            avatar: "🌙",
            ageGroup: "adult",
        },
        {
            id: "player-2",
            name: "",
            avatar: "🕯️",
            ageGroup: "adult",
        },
    ];
}


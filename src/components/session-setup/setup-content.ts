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
        title: "مين داخل الليلة؟",
        subtitle: "ضيفوا صحاب الحكاية بهدوء، واحد واحد.",
    },
    {
        id: "length",
        eyebrow: "إيقاع الليلة",
        title: "هنسهر قد إيه؟",
        subtitle: "اختاروا نفس اللي يناسب القعدة.",
    },
    {
        id: "theme",
        eyebrow: "باب الحكاية",
        title: "الليلة هتدور حوالين إيه؟",
        subtitle: "كل ثيمة تفتح جو مختلف وكنوز مختلفة.",
    },
    {
        id: "begin",
        eyebrow: "قبل البداية",
        title: "كل حاجة تقريبًا جاهزة",
        subtitle: "لمّة صغيرة، كتاب مفتوح، وسر مستني يظهر.",
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


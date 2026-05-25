import type {
    SessionLengthDefinition,
    SetupPlayer,
    SetupStepDefinition,
    ThemeDefinition,
} from "./setup-types";
import {
    validatePlayersStep,
    validateSessionLengthStep,
    validateThemeStep,
    validateBeginStep,
} from "./setup-validation";
import { getAllAvatars } from "./avatar-registry";
import { PlayersStep } from "./players-step";
import { SessionLengthStep } from "./session-length-step";
import { ThemeStep } from "./theme-step";
import { BeginSessionStep } from "./begin-session-step";

/**
 * Data-driven setup step definitions.
 *
 * The flow is driven entirely by `order`.
 * No hardcoded stepOrder arrays exist outside this file.
 * Validation hooks determine orchestration readiness per step.
 */
export const setupSteps: SetupStepDefinition[] = [
    {
        id: "players",
        order: 0,
        eyebrow: "جهز قلبك .. صحي عقلك",
        title: "مين طالع معانا؟",
        subtitle: "",
        component: PlayersStep,
        validate: validatePlayersStep,
    },
    {
        id: "length",
        order: 1,
        eyebrow: "إيقاع الجلسة",
        title: "قد إيه تحبوا تقعدوا؟",
        subtitle: "اختاروا الوقت اللي يناسب قعدتكم.",
        component: SessionLengthStep,
        validate: validateSessionLengthStep,
    },
    {
        id: "theme",
        order: 2,
        eyebrow: "جو الليلة",
        title: "تحبوا الليلة تكون إزاي؟",
        subtitle: "كل جو بيفتح باب لحكاية مختلفة.",
        component: ThemeStep,
        validate: validateThemeStep,
    },
    {
        id: "begin",
        order: 3,
        eyebrow: "لحظة البداية",
        title: "كل حاجة جاهزة",
        subtitle: "لمّة دافية وحكاية مستنية تبدأ.",
        component: BeginSessionStep,
        validate: validateBeginStep,
    },
];

/** Steps sorted by order — the single source of truth for flow sequence */
export const sortedSteps = [...setupSteps].sort((a, b) => a.order - b.order);

/** Available avatars — sourced from the avatar registry */
export const avatarOptions = getAllAvatars();

export const sessionLengthOptions: SessionLengthDefinition[] = [
    {
        id: "short",
        label: "قصيرة 🌙",
        rounds: 3,
        mood: "هادية وخفيفة",
        description: "لمّة صغيرة وسريعة، بس فيها كل الدفا.",
    },
    {
        id: "normal",
        label: "ليلة عادية ✨",
        rounds: 4,
        mood: "متوازنة ودافئة",
        description: "الإيقاع الأساسي: مساحة كفاية للضحك والاكتشاف.",
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
    "بنرتب كل حاجة بهدوء...",
    "الحكاية بتاخد شكلها...",
];

/**
 * Creates the initial empty gathering state.
 *
 * Players begin with an empty list — no pre-filled forms,
 * no instant validation anxiety. The first interaction is
 * an invitation, not a form to fill.
 *
 * The "add player" action is the first gesture.
 */
export function createInitialPlayers(): SetupPlayer[] {
    return [];
}


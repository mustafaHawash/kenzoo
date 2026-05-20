// src/app/gameplay/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { Headline, Body, Label, Muted } from "@/components/ui/typography";
import type { JourneyPath, PlayerJourneyState, PathStationSlot } from "@/types/path";
import { getCompletedPathCount } from "@/types/path";
import type { Station } from "@/types/station";
import type { SessionMood } from "@/types/theme";

/* ─── Animation variants ─── */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

const floatVariants: Variants = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

const pathCardHover = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" as const } },
};

/* ─── Mock journey data (replace with session context) ─── */
/* ─── Mock station factory ─── */
const MOCK_MOOD: SessionMood = "cozy";

function mockStation(overrides: Partial<Station> & { id: string; type: Station["type"]; question: string; answer: string; stars: number }): Station {
    return {
        category: "islamic",
        title: overrides.question,
        description: overrides.question,
        theme: "eid-al-adha",
        mood: MOCK_MOOD,
        difficulty: 1,
        targetAgeGroup: "adult",
        hint: undefined,
        explanation: undefined,
        choices: overrides.type === "quiz" ? ["أ", "ب", "ج", "د"] : undefined,
        tinyMissionPool: [],
        reward: { stars: overrides.stars, canUnlockTreasure: true },
        status: "active",
        ...overrides,
    };
}

function mockSlot(id: string, type: Station["type"], question: string, answer: string, stars: number): PathStationSlot {
    return { station: mockStation({ id, type, question, answer, stars }), completed: false };
}

const MOCK_JOURNEY: PlayerJourneyState = {
    playerId: "player-1",
    allPathsCompleted: false,
    paths: [
        {
            id: "path-moon",
            emoji: "🌙",
            title: "حكايات القمر",
            subtitle: "أسرار الليل الهادئ",
            difficultyTier: 1,
            treasureProbabilityMultiplier: 0.8,
            stations: [
                mockSlot("s1", "quiz", "س1", "a", 2),
                mockSlot("s2", "riddle", "س2", "b", 3),
                mockSlot("s3", "quiz", "س3", "c", 4),
                mockSlot("s4", "riddle", "س4", "d", 5),
            ],
            currentStationIndex: 0,
            completed: false,
        },
        {
            id: "path-locked",
            emoji: "🔮",
            title: "الغرفة المقفولة",
            subtitle: "غموض بلا نهاية",
            difficultyTier: 2,
            treasureProbabilityMultiplier: 1.0,
            stations: [
                mockSlot("s5", "quiz", "س5", "a", 3),
                mockSlot("s6", "riddle", "س6", "b", 4),
                mockSlot("s7", "quiz", "س7", "c", 5),
                mockSlot("s8", "riddle", "س8", "d", 6),
            ],
            currentStationIndex: 0,
            completed: false,
        },
        {
            id: "path-secrets",
            emoji: "🕯️",
            title: "أسرار الليلة",
            subtitle: "خيوط الضوء الخافت",
            difficultyTier: 3,
            treasureProbabilityMultiplier: 1.2,
            stations: [
                mockSlot("s9", "quiz", "س9", "a", 4),
                mockSlot("s10", "riddle", "س10", "b", 5),
                mockSlot("s11", "quiz", "س11", "c", 6),
                mockSlot("s12", "riddle", "س12", "d", 7),
            ],
            currentStationIndex: 0,
            completed: false,
        },
        {
            id: "path-unknown",
            emoji: "👁️",
            title: "باب المجهول",
            subtitle: "ما وراء الظلام",
            difficultyTier: 4,
            treasureProbabilityMultiplier: 1.5,
            stations: [
                mockSlot("s13", "quiz", "س13", "a", 5),
                mockSlot("s14", "riddle", "س14", "b", 6),
                mockSlot("s15", "quiz", "س15", "c", 7),
                mockSlot("s16", "riddle", "س16", "d", 8),
            ],
            currentStationIndex: 0,
            completed: false,
        },
    ],
};

/* ─── Path Card Component ─── */
function PathCard({
    path,
    onSelect,
}: {
    path: JourneyPath;
    onSelect: (pathId: string) => void;
}) {
    const progressPercent =
        path.stations.length > 0
            ? Math.round((path.currentStationIndex / path.stations.length) * 100)
            : 0;

    const completedStations = path.stations.filter((s) => s.completed).length;

    return (
        <motion.button
            variants={pathCardHover}
            initial="rest"
            whileHover={!path.completed ? "hover" : undefined}
            whileTap={!path.completed ? { scale: 0.98 } : undefined}
            onClick={() => !path.completed && onSelect(path.id)}
            disabled={path.completed}
            className={`
                relative flex flex-col gap-3 rounded-2xl border p-4 text-right
                backdrop-blur-sm transition-colors
                ${path.completed
                    ? "border-primary/20 bg-primary/5 opacity-60 cursor-default"
                    : "border-secondary/15 bg-card/70 hover:border-secondary/30 hover:bg-card/90 cursor-pointer"
                }
            `}
        >
            {/* Path header */}
            <div className="flex items-center gap-3">
                <motion.span
                    variants={floatVariants}
                    animate="animate"
                    className="text-2xl"
                >
                    {path.emoji}
                </motion.span>
                <div className="flex flex-col gap-0.5">
                    <Label className="text-foreground text-sm font-semibold">
                        {path.title}
                    </Label>
                    <Muted className="text-[11px]">
                        {path.subtitle}
                    </Muted>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <Muted className="text-[10px]">
                        {path.completed
                            ? "مكتمل ✅"
                            : `${completedStations}/${path.stations.length} محطات`
                        }
                    </Muted>
                    {!path.completed && path.currentStationIndex > 0 && (
                        <Muted className="text-[10px] text-secondary/60">
                            متابعة من المحطة {path.currentStationIndex + 1}
                        </Muted>
                    )}
                </div>

                {/* Progress track */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.3 }}
                        className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-secondary via-amber-400 to-secondary/80"
                    />
                </div>
            </div>
        </motion.button>
    );
}

/* ═══════════════════════════════════════════════════════════
    GAMEPLAY SCREEN — Path Selection Board

    This is the Player Journey Board.
    The player sees their 4 paths and selects one to enter.
    Navigation to /play?pathId=xxx starts the path session.
    ═══════════════════════════════════════════════════════════ */
export default function GameplayScreen() {
    const router = useRouter();

    // TODO: Replace with session context
    const journey = MOCK_JOURNEY;
    const playerName = "مصطفى";
    const playerStars = 27;
    const playerTreasures = 2;

    const completedPaths = getCompletedPathCount(journey);

    const handlePathSelect = (pathId: string) => {
        router.push(`/play?pathId=${pathId}`);
    };

    return (
        <ScreenContainer className="gap-0">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
            >
                {/* ═══════════════════════════════════════════
                    ✨ IMMERSIVE HEADER
                    ═══════════════════════════════════════════ */}
                <motion.header
                    variants={itemVariants}
                    className="relative flex flex-col items-center text-center gap-3 pt-2 pb-2"
                >
                    {/* Floating decorative elements */}
                    <div className="pointer-events-none absolute -top-1 right-6 text-2xl opacity-20 select-none">
                        <motion.span variants={floatVariants} animate="animate">✦</motion.span>
                    </div>
                    <div className="pointer-events-none absolute top-8 left-8 text-lg opacity-15 select-none">
                        <motion.span
                            variants={floatVariants}
                            animate="animate"
                            transition={{ delay: 1.5 }}
                        >
                            ✧
                        </motion.span>
                    </div>

                    {/* Brand Logo */}
                    <motion.div
                        variants={floatVariants}
                        animate="animate"
                        className="relative h-20 w-20 select-none sm:h-24 sm:w-24"
                    >
                        <Image
                            src="/Logo-PNG.webp"
                            alt="Kenzoo Logo"
                            fill
                            priority
                            className="object-contain drop-shadow-[0_6px_20px_rgba(216,179,106,0.25)]"
                        />
                    </motion.div>

                    {/* Player greeting */}
                    <Headline className="text-foreground text-2xl font-bold leading-tight">
                        دورك يا{" "}
                        <span className="bg-linear-to-l from-amber-500 via-secondary to-amber-600 bg-clip-text text-transparent">
                            {playerName}
                        </span>
                    </Headline>

                    <Body className="text-muted-foreground text-sm leading-relaxed max-w-70">
                        اختار المسار اللي يعجبك واكتشف الكنز 🗝️
                    </Body>
                </motion.header>

                {/* ═══════════════════════════════════════════
                    📊 PLAYER STATS
                    ═══════════════════════════════════════════ */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-secondary/8 px-3 py-1">
                            <span className="text-xs">⭐</span>
                            <Label className="text-secondary text-xs">{playerStars}</Label>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1">
                            <span className="text-xs">🗝️</span>
                            <Label className="text-primary text-xs">{playerTreasures}</Label>
                        </div>
                    </div>
                    <Muted className="text-xs">
                        {completedPaths}/4 مسارات
                    </Muted>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🗺️ PATH CARDS
                    ═══════════════════════════════════════════ */}
                <div className="flex flex-col gap-3">
                    {journey.paths.map((path) => (
                        <motion.div key={path.id} variants={itemVariants}>
                            <PathCard path={path} onSelect={handlePathSelect} />
                        </motion.div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════
                    🏮 FOOTER
                    ═══════════════════════════════════════════ */}
                <motion.footer
                    variants={itemVariants}
                    className="flex flex-col items-center gap-3 pt-4 pb-6"
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-px flex-1 bg-linear-to-l from-transparent via-secondary/20 to-transparent" />
                        <span className="text-secondary/30 text-xs">✦</span>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-secondary/20 to-transparent" />
                    </div>

                    <Muted className="text-xs text-center leading-relaxed">
                        🌙 كنزوو — اختار مسارك وابدأ المغامرة
                    </Muted>
                </motion.footer>
            </motion.div>
        </ScreenContainer>
    );
}

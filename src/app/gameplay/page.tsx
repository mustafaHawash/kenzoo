// src/app/gameplay/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { Headline, Body, Label, Muted } from "@/components/ui/typography";
import type { JourneyPath } from "@/types/path";
import { getCompletedPathCount } from "@/types/path";
import { useGameSessionStore } from "@/store/game-session-store";
import { getCurrentPlayer } from "@/lib/session-runtime/selectors/get-current-player";
import { getCurrentJourney } from "@/lib/session-runtime/selectors/get-current-journey";
import { iconAssets } from "@/assets";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { useSoundtrack } from "@/hooks/useSoundtrack";

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

/* ─── Path icon mapping — uses our icon assets instead of emoji ─── */
const PATH_ICONS: Record<string, string> = {
    "path-moon": iconAssets.bigMoon,
    "path-lantern": iconAssets.lantern,
    "path-key": iconAssets.mainKey,
    "path-treasure": iconAssets.treasureSymbol,
    "path-tulip": iconAssets.tulipSticker,
    "path-star": iconAssets.starsSticker,
    "path-shy": iconAssets.shySticker,
    "path-moon-small": iconAssets.smallMoon,
    "path-sec-key": iconAssets.secondaryKey,
    "path-treasure-chest": iconAssets.treasure,
};

function getPathIcon(pathId: string, emoji: string): string {
    return PATH_ICONS[pathId] ?? emoji;
}

/* ─── Card back image (Kenzo card) ─── */
const CARD_BACK_SRC = "/images/stickers/Kenzoo-card-back-before-treasure-reveal.webp";

/* ─── Path Card Component — Kenzo Card Design ─── */
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
    const isOpened = path.currentStationIndex > 0 || path.completed;
    const pathIcon = getPathIcon(path.id, path.emoji);

    return (
        <motion.button
            variants={pathCardHover}
            initial="rest"
            whileHover={!path.completed ? "hover" : undefined}
            whileTap={!path.completed ? { scale: 0.97 } : undefined}
            onClick={() => !path.completed && onSelect(path.id)}
            disabled={path.completed}
            className={`
                relative aspect-[5/7] w-full overflow-hidden rounded-2xl
                border-2 transition-all duration-300
                ${path.completed
                    ? "border-primary/25 cursor-default opacity-60"
                    : "border-secondary/20 cursor-pointer hover:border-secondary/40 hover:shadow-glow"
                }
            `}
        >
            {!isOpened ? (
                /* ═══════════════════════════════════════════
                   🃏 CARD BACK — Mysterious Kenzo Card
                   Not yet opened: show the card back image
                   ═══════════════════════════════════════════ */
                <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                        src={CARD_BACK_SRC}
                        alt={path.title}
                        fill
                        className="object-cover rounded-2xl"
                        priority
                    />
                    {/* Shimmer overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 via-transparent to-black/5" />
                </div>
            ) : (
                /* ═══════════════════════════════════════════
                   🃏 CARD FACE — Opened Path
                   Show path details like the face of a card
                   ═══════════════════════════════════════════ */
                <div className={`
                    relative flex h-full w-full flex-col items-center p-2.5
                    ${path.completed
                        ? "bg-gradient-to-b from-primary/12 via-card/90 to-primary/6"
                        : "bg-gradient-to-b from-secondary/10 via-card/95 to-secondary/5"
                    }
                `}>
                    {/* Ambient glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(246,208,140,0.15),transparent_60%)]" />

                    {/* ── Icon area — large, centered, prominent ── */}
                    <motion.div
                        variants={floatVariants}
                        animate="animate"
                        className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center"
                    >
                        <Image
                            src={pathIcon}
                            alt=""
                            width={96}
                            height={96}
                            className="h-24 w-24 object-contain drop-shadow-[0_4px_16px_rgba(216,179,106,0.4)]"
                        />
                    </motion.div>

                    {/* ── Title & subtitle — centered ── */}
                    <div className="relative z-10 mt-1.5 flex flex-col items-center gap-0.5 text-center">
                        <Label className="text-foreground text-sm font-bold leading-tight">
                            {path.title}
                        </Label>
                        <Muted className="text-[11px] leading-snug">
                            {path.subtitle}
                        </Muted>
                    </div>

                    {/* ── Spacer to push progress to bottom ── */}
                    <div className="flex-1" />

                    {/* ── Progress section — bottom of card ── */}
                    <div className="relative z-10 mt-2 flex w-full flex-col gap-1.5">
                        {/* Station dots */}
                        <div className="flex items-center justify-center gap-1">
                            {path.stations.map((s, i) => (
                                <div
                                    key={i}
                                    className={`
                                        h-1.5 rounded-full transition-all duration-300
                                        ${s.completed
                                            ? "w-3 bg-secondary/80"
                                            : i === path.currentStationIndex
                                                ? "w-2.5 bg-secondary/40 ring-1 ring-secondary/30"
                                                : "w-1.5 bg-surface-soft/80"
                                        }
                                    `}
                                />
                            ))}
                        </div>

                        {/* Progress label */}
                        <div className="flex items-center justify-between">
                            <Muted className="text-[9px]">
                                {path.completed
                                    ? "مكتمل ✓"
                                    : `${completedStations}/${path.stations.length} محطات`
                                }
                            </Muted>
                            {!path.completed && path.currentStationIndex > 0 && (
                                <Muted className="text-[9px] text-secondary/70">
                                    متابعة
                                </Muted>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-soft/70">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.3 }}
                                className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-secondary via-amber-400 to-secondary/80"
                            />
                        </div>
                    </div>
                </div>
            )}
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
    const soundtrack = useSoundtrack();

    // REAL session only — read from Zustand store
    const persistentState = useGameSessionStore((s) => s.persistentState);
    // Primitive selectors – keep hook order stable.
    const currentPlayerIndex = useGameSessionStore((s) => s.persistentState?.currentPlayerIndex ?? 0);
    const hasHydrated = useGameSessionStore((s) => s.hasHydrated);

    // Derived selectors – memoized to avoid recomputation on each render.
    const currentPlayer = useMemo(() => {
        if (!persistentState) return null;
        return getCurrentPlayer(persistentState);
    }, [persistentState]);

    const journey = useMemo(() => {
        if (!persistentState) return null;
        return getCurrentJourney(persistentState, currentPlayerIndex);
    }, [persistentState, currentPlayerIndex]);

    // Redirect to setup if no session — MUST be in useEffect, not during render
    useEffect(() => {
        if (!persistentState || persistentState.players.length === 0) {
            router.replace("/session/setup");
        }
    }, [persistentState, router]);

    /* ─── Soundtrack — play gameplay music on path selection screen ─── */
    useEffect(() => {
        if (persistentState && persistentState.players.length > 0) {
            soundtrack.play("gameplay", 0.15);
        }
        // Don't stop on unmount — play page will continue the same layer.
    }, [persistentState, soundtrack]);

    // No session — show loading while redirect happens
    if (!persistentState || persistentState.players.length === 0) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MoodSticker mood="thinking" size={160} delay={0.1} />
                    <div className="flex flex-col items-center gap-1">
                        <Label className="text-foreground text-sm font-semibold">جاري التحميل</Label>
                        <Muted className="text-xs">استنى شوية...</Muted>
                    </div>
                </motion.div>
            </ScreenContainer>
        );
    }

    // Guard against missing hydration – the store indicates readiness via hasHydrated.
    if (!hasHydrated || !currentPlayer || !journey) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MoodSticker mood="thinking" size={160} delay={0.1} />
                    <div className="flex flex-col items-center gap-1">
                        <Label className="text-foreground text-sm font-semibold">جاري تحضير الجلسة</Label>
                        <Muted className="text-xs">الليلة هتبدأ حالاً...</Muted>
                    </div>
                </motion.div>
            </ScreenContainer>
        );
    }

    // Safety: invalid player index — redirect to setup
    if (!currentPlayer || !journey) {
        return (
            <ScreenContainer className="justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Headline className="text-secondary text-xl">حصلت مشكلة</Headline>
                    <Muted className="text-sm">مفيش لاعب نشط، حاول تاني</Muted>
                    <button
                        onClick={() => router.replace("/session/setup")}
                        className="rounded-full border border-secondary/20 bg-card/60 px-6 py-2.5 text-sm text-secondary/80 backdrop-blur-sm transition-all hover:bg-card/80 active:scale-95"
                    >
                        جلسة جديدة
                    </button>
                </div>
            </ScreenContainer>
        );
    }

    const playerName = currentPlayer.name;
    const playerStars = currentPlayer.stars;
    const playerTreasures = currentPlayer.treasures;

    const completedPaths = getCompletedPathCount(journey);

    const handlePathSelect = (pathId: string) => {
        // OWNERSHIP: gameplay/page owns path selection.
        // Commit the selected path to Zustand BEFORE navigating.
        // This guarantees the handoff is deterministic and stable.
        // play/page will find activePath already set — no race condition.
        const { selectPath, persistentState } = useGameSessionStore.getState();
        if (persistentState) {
            // Always select the path when a session exists, regardless of stale runtime state.
            selectPath(pathId);
        }
        router.push(`/play?pathId=${pathId}`);
    };

    return (
        <ScreenContainer className="gap-0">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-2.5"
            >
                {/* ═══════════════════════════════════════════
                    ✨ IMMERSIVE HEADER
                    ═══════════════════════════════════════════ */}
                <motion.header
                    variants={itemVariants}
                    className="relative flex flex-col items-center text-center gap-1 pt-0 pb-0"
                >
                    {/* Floating decorative elements */}
                    <div className="pointer-events-none absolute -top-1 right-6 text-2xl opacity-20 select-none">
                        <motion.span variants={floatVariants} animate="animate">✦</motion.span>
                    </div>
                    <div className="pointer-events-none absolute top-6 left-8 text-lg opacity-15 select-none">
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
                        className="relative h-12 w-12 select-none"
                    >
                        <Image
                            src={iconAssets.logoMark}
                            alt="Kenzoo Logo"
                            fill
                            priority
                            className="object-contain drop-shadow-[0_4px_16px_rgba(216,179,106,0.25)]"
                        />
                    </motion.div>

                    {/* Player greeting */}
                    <Headline className="text-foreground text-xl font-bold leading-tight">
                        {currentPlayer.avatar} دورك يا{" "}
                        <span className="bg-linear-to-l from-amber-500 via-secondary to-amber-600 bg-clip-text text-transparent">
                            {playerName}
                        </span>
                    </Headline>

                    <Body className="text-muted-foreground text-xs leading-relaxed max-w-70">
                        اختار الكارت اللي يعجبك واكتشف الكنز
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
                        <div className="flex items-center gap-2 rounded-full border border-secondary/15 bg-secondary/8 px-4 py-2">
                            <Image src={iconAssets.starsSticker} alt="" width={28} height={28} className="object-contain" />
                            <Label className="text-secondary text-sm font-semibold">{playerStars}</Label>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2">
                            <Image src={iconAssets.treasure} alt="" width={28} height={28} className="object-contain" />
                            <Label className="text-primary text-sm font-semibold">{playerTreasures}</Label>
                        </div>
                    </div>
                    <Muted className="text-xs">
                        {completedPaths}/4 كروت
                    </Muted>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🃏 PATH CARDS — Kenzo Card Hand
                    ═══════════════════════════════════════════ */}
                <div className="grid grid-cols-2 gap-2.5 px-0.5">
                    {journey.paths.map((path, idx) => (
                        <motion.div
                            key={path.id}
                            variants={itemVariants}
                            className="flex justify-center"
                        >
                            <PathCard path={path} onSelect={handlePathSelect} />
                        </motion.div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════
                    🏮 FOOTER
                    ═══════════════════════════════════════════ */}
                <motion.footer
                    variants={itemVariants}
                    className="flex flex-col items-center gap-1 pt-1 pb-1"
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-px flex-1 bg-linear-to-l from-transparent via-secondary/20 to-transparent" />
                        <span className="text-secondary/30 text-xs">✦</span>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-secondary/20 to-transparent" />
                    </div>

                    <Muted className="text-[10px] text-center leading-relaxed">
                        كنزوو — اختار كارتك وابدأ المغامرة
                    </Muted>
                </motion.footer>
            </motion.div>
        </ScreenContainer>
    );
}

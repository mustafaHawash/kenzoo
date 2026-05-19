"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { CozyCard } from "@/components/ui/cozy-card";

import { Headline, Body, Label, Muted } from "@/components/ui/typography";

import type { Station, StationDifficulty, StationType } from "@/types/station";

import type { SessionMood } from "@/types/theme";

interface StationCardProps {
    station: Station;
    onClick: (id: string) => void;
    className?: string;
}

/**
 * Visual styling based on gameplay state.
 */
const statusStyles = {
    locked: "pointer-events-none opacity-50 grayscale-[0.35] saturate-[0.6]",

    active: "ring-1 ring-secondary/30 shadow-glow",

    completed: "opacity-90 saturate-[1.1] ring-1 ring-secondary/15",
};

/**
 * Cozy visual identity for each station type.
 * Temporary until custom illustrations/icons exist.
 */
const typeMeta: Record<
    StationType,
    {
        emoji: string;
        label: string;
    }
> = {
    quiz: {
        emoji: "🤔",
        label: "سيــن وجيــم",
    },

    riddle: {
        emoji: "🗝️",
        label: "فـزورة .. حــزورة",
    },

    guess: {
        emoji: "💭",
        label: "يا ترى هتفتكر؟",
    },

    memory: {
        emoji: "📖",
        label: "ذكـرى حلـوة",
    },

    puzzle: {
        emoji: "🧩",
        label: "لغـز خفيـف",
    },

    treasure: {
        emoji: "🎁",
        label: "كنز غامض",
    },

    mystery: {
        emoji: "🔮",
        label: "اكتشف الغامض",
    },

    story: {
        emoji: "🕯️",
        label: "حكاية وروايـة",
    },
};

/**
 * Human-friendly difficulty labels.
 * Matches Kenzoo emotional identity.
 */
const difficultyLabels: Record<StationDifficulty, string> = {
    1: "🌿 سهل",
    2: "🔥 مش سهل",
    3: "🧠 مش سهل خالص",
    4: "👑 مش سهل  خالص خالص",
};

/**
 * Soft emotional mood labels.
 */
const moodLabels: Record<SessionMood, string> = {
    cozy: "🌙 خفيفة",

    playful: "🎉 مرحة",

    mystery: "🕯️ غامضة",

    social: "❤️ اجتماعية",

    reflective: "✨ مُثمرة",
};

export function StationCard({ station, onClick, className }: StationCardProps) {
    const meta = typeMeta[station.type];

    return (
        <motion.button
            whileHover={{
                y: -4,
                scale: 1.02,
            }}
            whileTap={{
                scale: 0.97,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 22,
            }}
            onClick={() => onClick(station.id)}
            disabled={station.status === "locked"}
            className={cn(
                "w-full rounded-xl text-right outline-none",
                "touch-manipulation",
                "focus-visible:ring-2 focus-visible:ring-secondary/40",
                statusStyles[station.status ?? "active"],
                className,
            )}
        >
            <CozyCard
                className={cn(
                    "relative overflow-hidden rounded-[32px]",
                    "p-6 sm:p-7",
                )}
            >
                {/* Ambient warm glow - top */}
                <div
                    className='
            pointer-events-none absolute inset-0
            bg-[radial-gradient(ellipse_at_top_center,rgba(246,208,140,0.14),transparent_55%)]
          '
                />

                {/* Playful corner sparkle */}
                <div
                    className='
            pointer-events-none absolute -top-2 -left-2
            h-24 w-24
            rounded-full
            bg-[radial-gradient(circle,rgba(255,231,181,0.12),transparent_70%)]
          '
                />

                {/* Warm bottom glow */}
                <div
                    className='
            pointer-events-none absolute inset-x-0 bottom-0
            h-1/3
            bg-[radial-gradient(ellipse_at_bottom_center,rgba(230,201,140,0.08),transparent_70%)]
          '
                />

                <div className='relative z-10 flex flex-col gap-6'>
                    {/* Top content */}
                    <div className='flex items-start gap-4'>
                        {/* Emoji badge */}
                        <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 4,
                                ease: "easeInOut" as const,
                            }}
                            className='
                    flex shrink-0
                    items-center justify-center
                    h-14 w-14
                    rounded-2xl
                    border border-secondary/20
                    bg-linear-to-br from-secondary/15 to-accent/10
                    text-2xl
                    shadow-[0_6px_24px_rgba(216,179,106,0.15)]
                  '
                        >
                            {meta.emoji}
                        </motion.div>

                        {/* Text content */}
                        <div className='flex flex-1 flex-col gap-2.5'>
                            {/* Type label */}
                            <Label
                                className='
                rounded-full
                border border-primary/15
                    bg-primary/6
                text-primary
                    inline-flex items-center
                    self-start
                    px-3 py-1
                    gap-1.5
                    text-xs
                    tracking-wide
                  '
                            >
                                {meta.label}
                            </Label>

                            {/* Main title */}
                            <Headline
                                className='
                  text-[26px] sm:text-[28px]
                  leading-tight
                  text-foreground
                '
                            >
                                {station.title}
                            </Headline>

                            {/* Main gameplay question */}
                            <Body
                                className='
                  text-right
                  leading-loose
                  text-foreground-soft
                '
                            >
                                {station.description}
                            </Body>
                        </div>
                    </div>

                    {/* Warm divider with sparkle */}
                    <div className='flex items-center gap-3'>
                        <div
                            className='
                  h-px flex-1
                  bg-linear-to-l
                  from-transparent
                  via-secondary/25
                  to-transparent
                '
                        />
                        <span className='text-xs text-secondary/40'>✦</span>
                        <div
                            className='
                  h-px flex-1
                  bg-linear-to-r
                  from-transparent
                  via-secondary/25
                  to-transparent
                '
                        />
                    </div>

                    {/* Metadata row */}
                    <div
                        className='
              flex flex-wrap items-center
              justify-between gap-2.5
            '
                    >
                        {/* Mood pill */}
                        <Muted
                            className='
                rounded-full
                border border-secondary/10
                bg-secondary/6
                px-3.5 py-1.5
                text-xs'
                        >
                            {moodLabels[station.mood]}
                        </Muted>

                        {/* Difficulty pill */}
                        <Muted
                            className='
                rounded-full
                border border-primary/10
                bg-primary/6
                px-3.5 py-1.5
                text-xs
              '
                        >
                            {difficultyLabels[station.difficulty]}
                        </Muted>
                    </div>

                    {/* Reward hint */}
                    <div
                        className='
              flex items-center justify-between
              rounded-2xl
              border border-secondary/10
              bg-secondary/5
              px-4 py-3
            '
                    >
                        <Muted>
                            {station.reward.canUnlockTreasure
                                ? "🗝️  شكلها فيها كنز"
                                : "✨ النجوم حلوة"}
                        </Muted>

                        <Label className='text-secondary'>
                            +{station.reward.stars} ⭐
                        </Label>
                    </div>
                </div>
            </CozyCard>
        </motion.button>
    );
}

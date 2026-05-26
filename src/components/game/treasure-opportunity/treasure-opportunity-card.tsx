"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted, Body } from "@/components/ui/typography";

import type { GameplayTreasureView } from "@/types/treasure";

import {
    treasureCardEntrance,
    chestFloat,
    sparkle,
    rewardReveal,
    glowRing,
} from "./motion";

/* ─── Mystery messages shown BEFORE opening (all rarities identical) ─── */
const MYSTERY_MESSAGES = [
    "✨ فيه كنز غريب ظهر...",
    "🗝️ حاسس إن فيه سر مستخبي...",
    "🌙 واضح إن الليلة لسه مخبية حاجات...",
    "✨ في الهوا حاجة غريبة...",
    "🗝️ كنز ظهر فجأة...",
];

function pickMysteryMessage(): string {
    return MYSTERY_MESSAGES[Math.floor(Math.random() * MYSTERY_MESSAGES.length)];
}

/* ─── Props ─── */
interface TreasureOpportunityCardProps {
    treasure: GameplayTreasureView | null;
    /** The randomly picked title for "title" reward type (set when treasure is opened) */
    awardedTitle?: string | null;
    onOpenTreasure: () => void;
    onDismiss: () => void;
}

/* ─── Internal phases ─── */
type TreasurePhase = "opportunity" | "revealing" | "revealed";

/**
 * TreasureOpportunityCard — hidden mystery treasure UX.
 *
 * MYSTERY RULES:
 *   - Phase 1 (opportunity): ALL treasures look identical.
 *     No rarity hints. No star cost. No color differences.
 *     Only a mysterious atmospheric message and a single CTA.
 *   - Phase 2 (revealing): neutral shimmer and suspense dots.
 *     No rarity-specific wording or colors.
 *   - Phase 3 (revealed): rarity is now revealed with full cinematic emotion.
 *     The player experiences the discovery moment here.
 *
 * Parent orchestrator owns: star spending, reward selection, show/hide.
 * This component owns: the three-phase visual flow, local animation state.
 *
 * Motion: calm, magical, cinematic. No aggressive popups. No flash.
 */
export function TreasureOpportunityCard({
    treasure,
    awardedTitle,
    onOpenTreasure,
    onDismiss,
}: TreasureOpportunityCardProps) {
    const [phase, setPhase] = useState<TreasurePhase>("opportunity");
    const [mysteryMessage, setMysteryMessage] = useState<string>(() => pickMysteryMessage());

    // Track the previous treasure id to detect a new treasure instance
    const prevTreasureIdRef = useRef<string | undefined>(treasure?.id);
    // Keep a ref to the reveal timeout so we can cancel it if needed
    const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // When the treasure prop changes to a new instance, reset phase and pick a new message
    useEffect(() => {
        if (prevTreasureIdRef.current !== treasure?.id) {
            prevTreasureIdRef.current = treasure?.id;
            setPhase("opportunity");
            setMysteryMessage(pickMysteryMessage());
        }
    }, [treasure?.id]);

    // Clear any pending reveal timeout on unmount
    useEffect(() => {
        return () => {
            if (revealTimeoutRef.current !== null) {
                clearTimeout(revealTimeoutRef.current);
            }
        };
    }, []);

    const handleOpen = () => {
        if (!treasure) return; // guard: should never be null when visible, but be safe

        // Clear any pre-existing timeout before starting a new one
        if (revealTimeoutRef.current !== null) {
            clearTimeout(revealTimeoutRef.current);
        }

        setPhase("revealing");
        onOpenTreasure();

        revealTimeoutRef.current = setTimeout(() => {
            revealTimeoutRef.current = null;
            setPhase("revealed");
        }, 1100);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phase}
                variants={treasureCardEntrance}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <CozyCard className="relative overflow-hidden rounded-[24px] p-5 sm:p-6">
                    {/* ═══ Ambient atmosphere ═══
                        Phase 1 & 2: neutral warm glow — no rarity hints
                        Phase 3: rarity-specific glow revealed after opening */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: phase === "revealed" && treasure
                                ? `radial-gradient(circle at center, rgba(246,208,140,0.15), transparent 60%)`
                                : "radial-gradient(circle at center, rgba(246,208,140,0.13), transparent 60%)",
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-4">

                        {/* ═══ Phase 1: OPPORTUNITY ═══
                            All treasures look completely identical here.
                            No rarity indicators. No cost. Pure mystery. */}
                        {phase === "opportunity" && (
                            <div className="flex flex-col items-center gap-5 w-full">
                                {/* Uniform soft glow — same for all rarities */}
                                <motion.div
                                    variants={glowRing}
                                    animate="animate"
                                    className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(246,208,140,0.18),transparent_70%)]"
                                />

                                {/* Uniform mystery chest — same for all rarities */}
                                <motion.div
                                    variants={chestFloat}
                                    animate="animate"
                                    className="text-5xl relative"
                                >
                                    🎁
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <motion.span
                                            key={i}
                                            variants={sparkle(i)}
                                            animate="animate"
                                            className="absolute text-xs"
                                            style={{ top: `${-8 + i * 10}px`, left: `${-14 + i * 9}px` }}
                                        >
                                            ✨
                                        </motion.span>
                                    ))}
                                </motion.div>

                                {/* Mystery headline — same wording for ALL rarities */}
                                <Headline className="text-secondary text-xl text-center">
                                    كنز مجهول...
                                </Headline>

                                {/* Randomly chosen mystery message — stable per treasure instance */}
                                <Muted className="text-sm text-center max-w-70">
                                    {mysteryMessage}
                                </Muted>

                                <div className="flex flex-col gap-3 w-full mt-2">
                                    <LanternButton onClick={handleOpen} className="w-full">
                                        افتح دلوقتي
                                    </LanternButton>
                                    <button
                                        onClick={onDismiss}
                                        className="
                                            w-full rounded-xl border border-border/30 bg-transparent
                                            px-5 py-3 text-muted-foreground text-sm
                                            transition-all duration-200
                                            hover:bg-surface-soft/60 hover:border-border/50
                                            active:scale-[0.98] outline-none
                                            focus-visible:ring-2 focus-visible:ring-secondary/30
                                        "
                                    >
                                        مش دلوقتي ✨
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ═══ Phase 2: REVEALING ═══
                            Neutral suspense — no rarity wording or colors yet */}
                        {phase === "revealing" && (
                            <div className="flex flex-col items-center gap-5 py-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-2.5 w-44 rounded-full bg-linear-to-l from-secondary/10 via-secondary/25 to-secondary/10 bg-size-[200%_100%]"
                                    style={{ animation: "shimmer 1.6s linear infinite" }}
                                />
                                <Muted className="text-sm animate-pulse">
                                    🗝️ الكنز بيتفتح...
                                </Muted>
                                <div className="flex gap-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -5, 0], opacity: [0.4, 0.9, 0.4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" as const }}
                                            className="h-1.5 w-1.5 rounded-full bg-secondary/40"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══ Phase 3: REVEALED ═══
                            Discovery moment. Full cinematic emotion. */}
                        {phase === "revealed" && treasure && (
                            <motion.div
                                variants={rewardReveal}
                                initial="initial"
                                animate="animate"
                                className="flex flex-col items-center gap-5 w-full"
                            >
                                {/* Emoji — unified size and motion */}
                                <motion.span
                                    className="text-5xl"
                                >
                                    {treasure.emoji}
                                </motion.span>

                                {/* No explicit rarity badges. Rarity is felt, not read. */}

                                <Headline className="text-secondary text-xl text-center">
                                    {treasure.title}
                                </Headline>
                                <Muted className="text-xs text-center italic text-muted-foreground/60">{treasure.flavor}</Muted>
                                <div className="rounded-2xl border border-secondary/12 bg-secondary/6 px-5 py-4 text-center w-full">
                                    <Body className="text-foreground text-sm leading-relaxed">{treasure.description}</Body>
                                </div>

                                {/* Reward type indicator — covers all TreasureRewardType values */}
                                {treasure.reward.type === "stars" && (
                                    <Muted className="text-xs text-center">⭐ +{treasure.reward.starsAmount ?? 0} نجوم</Muted>
                                )}
                                {treasure.reward.type === "double-stars" && (
                                    <Muted className="text-xs text-center">⭐⭐ النجوم مضاعفة!</Muted>
                                )}
                                {treasure.reward.type === "bonus-turn" && (
                                    <Muted className="text-xs text-center">🎯 دور إضافي!</Muted>
                                )}
                                {treasure.reward.type === "title" && awardedTitle && (
                                    <Muted className="text-xs text-center">👑 لقب جديد: {awardedTitle}</Muted>
                                )}
                                {treasure.reward.type === "real-gift" && (
                                    <Muted className="text-xs text-center">🎁 هدية حقيقية!</Muted>
                                )}
                                {treasure.reward.type === "wisdom" && treasure.reward.message && (
                                    <Muted className="text-xs text-center italic">💡 {treasure.reward.message}</Muted>
                                )}
                                {treasure.reward.type === "secret" && treasure.reward.message && (
                                    <Muted className="text-xs text-center">🔮 {treasure.reward.message}</Muted>
                                )}
                                {treasure.reward.type === "atmosphere" && treasure.reward.message && (
                                    <Muted className="text-xs text-center">✨ {treasure.reward.message}</Muted>
                                )}
                                {treasure.reward.type === "bonus-life" && (
                                    <Muted className="text-xs text-center">❤️ فرصة إضافية!</Muted>
                                )}
                                {treasure.reward.type === "double-life" && (
                                    <Muted className="text-xs text-center">❤️❤️ فرصتين إضافيتين!</Muted>
                                )}
                                {treasure.reward.type === "retry" && (
                                    <Muted className="text-xs text-center">🔄 إعادة المحاولة!</Muted>
                                )}
                                {treasure.reward.type === "shield" && (
                                    <Muted className="text-xs text-center">🛡️ درع حماية!</Muted>
                                )}
                                {treasure.reward.type === "easy-next" && (
                                    <Muted className="text-xs text-center">🌱 السؤال الجاي أسهل!</Muted>
                                )}
                                {treasure.reward.type === "extra-star" && (
                                    <Muted className="text-xs text-center">⭐ نجمة خفية!</Muted>
                                )}
                                {treasure.reward.type === "skip-fail" && (
                                    <Muted className="text-xs text-center">⏭️ تخطي الخطأ!</Muted>
                                )}
                                {treasure.reward.type === "funny" && (
                                    <Muted className="text-xs text-center">😄 مفاجأة مضحكة!</Muted>
                                )}
                                {treasure.reward.type === "cozy" && (
                                    <Muted className="text-xs text-center">☕ دفء وراحة!</Muted>
                                )}
                                {treasure.reward.type === "lucky" && (
                                    <Muted className="text-xs text-center">🍀 حظ سعيد!</Muted>
                                )}
                                {treasure.reward.type === "spiritual" && (
                                    <Muted className="text-xs text-center">📿 بركة وروحانية!</Muted>
                                )}
                                {treasure.reward.type === "emotional" && (
                                    <Muted className="text-xs text-center">🤍 لحظة مؤثرة!</Muted>
                                )}
                                {treasure.reward.type === "physical" && (
                                    <Muted className="text-xs text-center">💪 نشاط وحركة!</Muted>
                                )}
                                {treasure.reward.type === "comfort" && (
                                    <Muted className="text-xs text-center">🍃 راحة وسكينة!</Muted>
                                )}
                                {treasure.reward.type === "rare-moment" && (
                                    <Muted className="text-xs text-center">👑 لحظة نادرة!</Muted>
                                )}
                                {treasure.reward.type === "mystic" && (
                                    <Muted className="text-xs text-center">🗝️ سر غامض!</Muted>
                                )}
                                {treasure.reward.type === "magical" && (
                                    <Muted className="text-xs text-center">🪄 سحر حقيقي!</Muted>
                                )}
                                {treasure.reward.type === "epic" && (
                                    <Muted className="text-xs text-center">🏆 لحظة أسطورية!</Muted>
                                )}
                                {treasure.reward.type === "legendary" && (
                                    <Muted className="text-xs text-center">✦ كنز أسطوري!</Muted>
                                )}
                                {treasure.reward.type === "hidden" && (
                                    <Muted className="text-xs text-center">🌑 سر مخفي!</Muted>
                                )}
                                {treasure.reward.type === "peaceful" && (
                                    <Muted className="text-xs text-center">🕊️ سلام وأمان!</Muted>
                                )}
                                {treasure.reward.type === "smart" && (
                                    <Muted className="text-xs text-center">🧠 لمعة ذكاء!</Muted>
                                )}
                                {treasure.reward.type === "mysterious" && (
                                    <Muted className="text-xs text-center">🌌 غموض مريب!</Muted>
                                )}
                                {treasure.reward.type === "celebration" && (
                                    <Muted className="text-xs text-center">🎊 احتفال!</Muted>
                                )}
                                {treasure.reward.type === "destiny" && (
                                    <Muted className="text-xs text-center">🌠 قدر مكتوب!</Muted>
                                )}

                                <LanternButton onClick={onDismiss} className="w-full">يلا نكمل 🚀</LanternButton>
                            </motion.div>
                        )}
                    </div>
                </CozyCard>
            </motion.div>
        </AnimatePresence>
    );
}
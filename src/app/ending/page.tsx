
"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { Muted } from "@/components/ui/typography";
import { CeremonyScreen } from "@/components/ceremony/ceremony-screen";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { useGameSessionStore } from "@/store/game-session-store";
import { iconAssets } from "@/assets";
import { AmbientBackground } from "@/components/atmosphere/ambient-background";
import { useSoundtrack } from "@/hooks/useSoundtrack";

/**
 * Ending Ceremony Page — cinematic session conclusion.
 *
 * Reads ceremony state from the store and renders
 * the multi-phase ceremony screen.
 * Includes soundtrack integration and themed background.
 */
function EndingCeremonyContent() {
    const router = useRouter();
    const soundtrack = useSoundtrack();

    // Store reads
    const ceremony = useGameSessionStore((s) => s.ceremony);
    const persistentState = useGameSessionStore((s) => s.persistentState);
    const hasHydrated = useGameSessionStore((s) => s.hasHydrated);
    const advanceCeremony = useGameSessionStore((s) => s.advanceCeremony);
    const clearSession = useGameSessionStore((s) => s.clearSession);

    const players = useMemo(
        () => persistentState?.players ?? [],
        [persistentState],
    );

    // Redirect if no ceremony
    useEffect(() => {
        if (!hasHydrated) return;
        if (!ceremony || !persistentState) {
            router.replace("/session/setup");
        }
    }, [ceremony, persistentState, hasHydrated, router]);

    /* ─── Ceremony soundtrack — play ceremony music ─── */
    useEffect(() => {
        if (ceremony) {
            soundtrack.play("ceremony", 0.2);
        }
        // Don't stop on unmount during ceremony — only stop when
        // the user explicitly starts a new session (handleNewSession).
    }, [ceremony, soundtrack]);

    /** Start a new session — clear runtime, stop music, go to setup */
    const handleNewSession = () => {
        soundtrack.stop();
        clearSession();
        router.replace("/session/setup");
    };

    if (!ceremony || !persistentState) {
        return (
            <ScreenContainer className="justify-center">
                <div className="flex flex-col items-center gap-4">
                    <MoodSticker mood="thinking" size={120} />
                    <Muted className="text-xs">جاري التحميل...</Muted>
                </div>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer className="justify-center gap-0">
            {/* Ceremony atmosphere */}
            <AmbientBackground />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-1 min-h-0 flex-col items-center justify-center"
            >
                <CeremonyScreen
                    ceremony={ceremony}
                    players={players}
                    onAdvance={advanceCeremony}
                    onNewSession={handleNewSession}
                />
            </motion.div>
        </ScreenContainer>
    );
}

export default function EndingPage() {
    return (
        <Suspense
            fallback={
                <ScreenContainer className="justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-12 w-12 select-none">
                            <Image
                                src={iconAssets.logoMark}
                                alt="Kenzoo"
                                fill
                                className="object-contain opacity-50"
                            />
                        </div>
                        <Muted className="text-xs">جاري التحميل...</Muted>
                    </div>
                </ScreenContainer>
            }
        >
            <EndingCeremonyContent />
        </Suspense>
    );
}

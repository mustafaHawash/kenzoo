"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { OpeningSceneAtmosphere } from "@/components/atmosphere/opening-scene-atmosphere";
import { Button } from "@/components/ui/button";
import { LanternButton } from "@/components/ui/lantern-button";
import { Body, Display, Label } from "@/components/ui/typography";
import { createInitialPlayers, sortedSteps } from "./setup-content";
import { SessionStepTransition } from "./session-step-transition";
import { SetupGenerationTransition } from "./setup-generation-transition";
import { buildSessionConfig } from "./build-session-config";
import { startSessionGeneration } from "./generation-orchestration";
import type { SessionSetupState, GenerationTransitionStatus } from "./setup-types";
import { cn } from "@/lib/utils";
import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";

/* ─── Initial state ─── */
const initialSetupState: SessionSetupState = {
    players: createInitialPlayers(),
    sessionLengthId: "normal",
    themeId: "eid-el-adha",
};

/* ═══════════════════════════════════════════════════════════
   SESSION SETUP SHELL — Data-Driven Orchestrator
   ═══════════════════════════════════════════════════════════

   This shell:
     - Collects raw setup state
     - Drives flow from sortedSteps (data-driven, not hardcoded)
     - Owns ALL navigation (next, back, continue, begin)
     - Delegates payload preparation to build-session-config.ts
     - Delegates generation to generation-orchestration.ts
     - Uses step.validate() for orchestration readiness

   This shell does NOT:
     - Normalize payloads
     - Know timer mechanics
     - Contain generation logic
     - Allow step components to own navigation

   Layout philosophy:
     - Viewport-stable: min-h-dvh, overflow-hidden
     - Flex-based: header / content / footer
     - Contained scrolling only inside step content
     - Mobile-native: no page-level scrolling
   ═══════════════════════════════════════════════════════════ */
export function SessionSetupShell() {
    const router = useRouter();
    const [setup, setSetup] = useState<SessionSetupState>(initialSetupState);
    const [stepIndex, setStepIndex] = useState(0);
    const [generationStatus, setGenerationStatus] = useState<GenerationTransitionStatus>("idle");
    const generationCleanupRef = useRef<(() => void) | null>(null);
    const generatedStateRef = useRef<SessionState | null>(null);

    /* ─── Data-driven step resolution ─── */
    const activeStepDef = sortedSteps[stepIndex];
    const activeStepId = activeStepDef.id;
    const canGoBack = generationStatus === "idle";
    const validation = activeStepDef.validate(setup);
    const canGoNext = validation.isValid;
    const isLastStep = stepIndex >= sortedSteps.length - 1;

    /* ─── Navigation ─── */
    const goNext = () => {
        if (!canGoNext) return;
        setStepIndex((current) => Math.min(current + 1, sortedSteps.length - 1));
    };

    const goBack = () => {
        if (stepIndex === 0) {
            // On first step, back navigates to home page
            router.push("/");
        } else {
            setStepIndex((current) => Math.max(current - 1, 0));
        }
    };

    /* ─── Generation orchestration ─── */
    const beginGeneration = useCallback(() => {
        const payload = buildSessionConfig(setup);

        const cleanup = startSessionGeneration(payload, {
            onPreparing: () => setGenerationStatus("preparing"),
            onReady: (state: PersistentSessionState) => {
                generatedStateRef.current = state;
                setGenerationStatus("ready");
            },
        });

        generationCleanupRef.current = cleanup;
    }, [setup]);

    const completeGeneration = useCallback(() => {
        // Navigate to gameplay page — session state will be available
        // via session context (future: Zustand store or URL-based handoff)
        router.push("/gameplay");
    }, [router]);

    // Cleanup generation on unmount
    useEffect(() => {
        return () => {
            generationCleanupRef.current?.();
        };
    }, []);

    /* ─── Unified setup change handler ─── */
    const handleSetupChange = useCallback(
        <K extends keyof SessionSetupState>(key: K, value: SessionSetupState[K]) => {
            setSetup((current) => ({ ...current, [key]: value }));
        },
        [],
    );

    /* ─── Data-driven step rendering ─── */
    const StepComponent = activeStepDef.component;

    /* ─── Step-specific continue labels — warm, not mechanical ─── */
    const continueLabels: Record<typeof activeStepId, string> = {
        players: "كملوا الإيقاع ✨",
        length: "اختاروا الجو ✨",
        theme: "جهزوا الليلة ✨",
        begin: "ابدأ الليلة ✨",
    };

    return (
        <main className="relative h-dvh overflow-hidden bg-background text-foreground">
            <OpeningSceneAtmosphere />

            <section className="relative z-10 mx-auto flex h-dvh w-full max-w-xl flex-col px-5 pt-[env(safe-area-inset-top)]">

                {/* ─── Header: back + progress ─── */}
                <header className="flex shrink-0 items-center justify-between gap-3 pt-6 pb-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        disabled={!canGoBack}
                        className="text-muted-foreground"
                    >
                        رجوع
                    </Button>

                    <div className="flex items-center gap-1.5" aria-label="تقدم التجهيز">
                        {sortedSteps.map((step, index) => (
                            <span
                                key={step.id}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    index === stepIndex
                                        ? "w-7 bg-secondary/80"
                                        : index < stepIndex
                                            ? "w-3 bg-secondary/36"
                                            : "w-3 bg-border/42",
                                )}
                            />
                        ))}
                    </div>
                </header>

                {/* ─── Step header: animated eyebrow + title + subtitle ─── */}
                <motion.div
                    key={`${activeStepId}-header`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className="shrink-0 pb-4 pt-2 text-center"
                >
                    <Label className="text-secondary">{activeStepDef.eyebrow}</Label>
                    <Display className="text-[2rem] leading-tight text-primary sm:text-[2.6rem]">
                        {activeStepDef.title}
                    </Display>
                    <Body className="mx-auto max-w-sm text-balance text-sm leading-6 text-muted-foreground sm:text-base">
                        {activeStepDef.subtitle}
                    </Body>
                </motion.div>

                {/* ─── Step content: contained scrolling area ─── */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-4 scrollbar-none">
                    <SessionStepTransition stepKey={activeStepId}>
                        <StepComponent
                            setup={setup}
                            onSetupChange={handleSetupChange}
                            onBegin={beginGeneration}
                        />
                    </SessionStepTransition>
                </div>

                {/* ─── Footer: grounded cinematic action area ─── */}
                <footer className="shrink-0 border-t border-secondary/8 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
                    {/* Validation hint — calm, not alarming */}
                    <AnimatePresence mode="wait">
                        {!canGoNext && validation.reason && (
                            <motion.p
                                key={validation.reason}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="mb-2.5 text-center text-xs leading-5 text-muted-foreground/60"
                            >
                                {validation.reason}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Continue / Begin — single unified action */}
                    <LanternButton
                        type="button"
                        onClick={isLastStep ? beginGeneration : goNext}
                        disabled={!canGoNext}
                        className="w-full bg-secondary text-secondary-foreground disabled:opacity-40"
                    >
                        {continueLabels[activeStepId]}
                    </LanternButton>
                </footer>
            </section>

            <SetupGenerationTransition
                status={generationStatus}
                onReady={completeGeneration}
            />
        </main>
    );
}


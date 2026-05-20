"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { OpeningSceneAtmosphere } from "@/components/atmosphere/opening-scene-atmosphere";
import { Button } from "@/components/ui/button";
import { Body, Display, Label, Muted } from "@/components/ui/typography";
import { BeginSessionStep } from "./begin-session-step";
import { createInitialPlayers, setupSteps } from "./setup-content";
import { PlayersStep } from "./players-step";
import { SessionLengthStep } from "./session-length-step";
import { SessionStepTransition } from "./session-step-transition";
import { SetupGenerationTransition } from "./setup-generation-transition";
import { ThemeStep } from "./theme-step";
import type { SessionSetupState, SetupStep } from "./setup-types";
import { cn } from "@/lib/utils";

const initialSetupState: SessionSetupState = {
    players: createInitialPlayers(),
    sessionLengthId: "normal",
    themeId: "eid-el-adha",
};

const stepOrder: SetupStep[] = ["players", "length", "theme", "begin"];

export function SessionSetupShell() {
    const router = useRouter();
    const [setup, setSetup] = useState<SessionSetupState>(initialSetupState);
    const [stepIndex, setStepIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const activeStep = stepOrder[stepIndex];
    const stepDefinition = setupSteps.find((step) => step.id === activeStep) ?? setupSteps[0];
    const canGoBack = stepIndex > 0 && !isGenerating;

    const namedPlayerCount = useMemo(
        () => setup.players.filter((player) => player.name.trim().length > 0).length,
        [setup.players],
    );

    const goNext = () => {
        setStepIndex((current) => Math.min(current + 1, stepOrder.length - 1));
    };

    const goBack = () => {
        setStepIndex((current) => Math.max(current - 1, 0));
    };

    const beginGeneration = () => {
        setIsGenerating(true);
    };

    const completeGeneration = useCallback(() => {
        router.push("/play");
    }, [router]);

    return (
        <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
            <OpeningSceneAtmosphere />

            <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6">
                <header className="flex items-center justify-between gap-3">
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
                        {stepOrder.map((step, index) => (
                            <span
                                key={step}
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

                <div className="flex flex-1 flex-col justify-center gap-7 py-7">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, ease: "easeOut" }}
                        className="flex flex-col gap-3 text-center"
                    >
                        <Label className="text-secondary">{stepDefinition.eyebrow}</Label>
                        <Display className="text-[2.35rem] leading-tight text-primary sm:text-[3.2rem]">
                            {stepDefinition.title}
                        </Display>
                        <Body className="mx-auto max-w-sm text-balance text-sm leading-7 text-muted-foreground sm:text-base">
                            {stepDefinition.subtitle}
                        </Body>
                    </motion.div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            goNext();
                        }}
                    >
                        <SessionStepTransition stepKey={activeStep}>
                            {activeStep === "players" && (
                                <PlayersStep
                                    players={setup.players}
                                    onPlayersChange={(players) =>
                                        setSetup((current) => ({ ...current, players }))
                                    }
                                />
                            )}

                            {activeStep === "length" && (
                                <SessionLengthStep
                                    selectedLengthId={setup.sessionLengthId}
                                    onSelectLength={(sessionLengthId) =>
                                        setSetup((current) => ({ ...current, sessionLengthId }))
                                    }
                                />
                            )}

                            {activeStep === "theme" && (
                                <ThemeStep
                                    selectedThemeId={setup.themeId}
                                    onSelectTheme={(themeId) =>
                                        setSetup((current) => ({ ...current, themeId }))
                                    }
                                />
                            )}

                            {activeStep === "begin" && (
                                <BeginSessionStep setup={setup} onBegin={beginGeneration} />
                            )}
                        </SessionStepTransition>
                    </form>

                    <AnimatePresence>
                        {activeStep === "players" && namedPlayerCount === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Muted className="text-center text-xs leading-6">
                                    ممكن تسيبوا الأسماء فاضية دلوقتي، بس الاسم بيخلي النداء أدفى.
                                </Muted>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <SetupGenerationTransition
                active={isGenerating}
                onComplete={completeGeneration}
            />
        </main>
    );
}


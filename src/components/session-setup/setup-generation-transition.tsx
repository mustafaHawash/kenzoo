"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { generationPhrases } from "./setup-content";
import { Body, Label } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import type { GenerationTransitionStatus } from "./setup-types";

export function SetupGenerationTransition({
    status,
    onReady,
}: {
    status: GenerationTransitionStatus;
    onReady: () => void;
}) {
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        if (status === "idle" || status === "ready") {
            return;
        }

        const phraseTimer = window.setInterval(() => {
            setPhraseIndex((current) => (current + 1) % generationPhrases.length);
        }, 1300);

        return () => {
            window.clearInterval(phraseTimer);
        };
    }, [status]);

    useEffect(() => {
        if (status === "ready") {
            const timer = window.setTimeout(onReady, 800); // Short delay to show ready state if needed, or straight transition
            return () => window.clearTimeout(timer);
        }
    }, [status, onReady]);

    if (status === "idle") {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/72 px-6 backdrop-blur-xl"
        >
            <div className="flex max-w-sm flex-col items-center gap-5 text-center">
                {/* Thinking sticker — alive, emotional, subtle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <MoodSticker mood="thinking" size={88} delay={0.2} />
                </motion.div>

                <div className="flex flex-col gap-2">
                    <Label className="text-secondary text-sm">
                        {status === "preparing" ? "الليلة بتتجهز..." : "كل حاجة جاهزة ✨"}
                    </Label>
                    <Body className="min-h-12 text-balance text-base leading-7 text-foreground transition-opacity duration-500">
                        {status === "preparing" ? generationPhrases[phraseIndex] : "يلا نبدأ الحكاية..."}
                    </Body>
                </div>

                <div className="flex items-center gap-2">
                    {generationPhrases.slice(0, 3).map((phrase, index) => (
                        <motion.span
                            key={phrase}
                            animate={{ opacity: phraseIndex % 3 === index ? 1 : 0.32 }}
                            className="size-1.5 rounded-full bg-secondary"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}


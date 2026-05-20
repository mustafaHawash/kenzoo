"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { generationPhrases } from "./setup-content";
import { Body, Label, Muted } from "@/components/ui/typography";

export function SetupGenerationTransition({
    active,
    onComplete,
}: {
    active: boolean;
    onComplete: () => void;
}) {
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        if (!active) {
            return;
        }

        const phraseTimer = window.setInterval(() => {
            setPhraseIndex((current) => (current + 1) % generationPhrases.length);
        }, 1300);

        const completionTimer = window.setTimeout(onComplete, 4300);

        return () => {
            window.clearInterval(phraseTimer);
            window.clearTimeout(completionTimer);
        };
    }, [active, onComplete]);

    if (!active) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/72 px-6 backdrop-blur-xl"
        >
            <div className="flex max-w-sm flex-col items-center gap-6 text-center">
                <motion.div
                    animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
                    transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
                    className="relative flex size-24 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10"
                >
                    <div className="absolute inset-4 rounded-full bg-secondary/25 blur-2xl" />
                    <span className="relative text-4xl">✨</span>
                </motion.div>

                <div className="flex flex-col gap-3">
                    <Label className="text-secondary">الليلة بتتجهز...</Label>
                    <Body className="min-h-14 text-balance text-lg leading-8 text-foreground">
                        {generationPhrases[phraseIndex]}
                    </Body>
                    <Muted className="text-xs leading-6">
                        هنا بعدين هنستقبل توليد الجلسة، المحتوى، الثيمات، وأي انتظار ديناميكي من غير ما الإحساس يكسر.
                    </Muted>
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


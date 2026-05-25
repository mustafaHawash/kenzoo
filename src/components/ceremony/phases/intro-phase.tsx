
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Headline, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { iconAssets } from "@/assets";

import { phaseEnter, gentleFloat } from "../ceremony-motion";

interface IntroPhaseProps {
    onContinue: () => void;
}

/**
 * Ceremony Intro — "الليلة قربت تخلص..."
 *
 * Atmospheric opening that signals the session is ending.
 * Warm, mysterious, contemplative.
 * Thinking sticker sets the reflective mood.
 */
export function IntroPhase({ onContinue }: IntroPhaseProps) {
    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-6 py-6"
        >
            {/* Floating logo mark */}
            <motion.div
                variants={gentleFloat}
                animate="animate"
                className="relative h-16 w-16 select-none"
            >
                <Image
                    src={iconAssets.logoMark}
                    alt="Kenzoo"
                    fill
                    className="object-contain drop-shadow-[0_4px_16px_rgba(216,179,106,0.3)]"
                />
            </motion.div>

            {/* Thinking sticker — reflective mood */}
            <MoodSticker mood="thinking" size={80} delay={0.3} />

            {/* Atmospheric headline */}
            <Headline className="text-secondary text-xl text-center leading-relaxed">
                الليلة قربت تخلص...
            </Headline>

            <Muted className="text-sm text-center leading-relaxed">
                كل كنز اكتشفناه وكل سؤال جاوبناه... كان له معنى
            </Muted>

            {/* Continue CTA */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                onClick={onContinue}
                className="
                    mt-4 rounded-full
                    border border-secondary/20
                    bg-secondary/8
                    px-6 py-2
                    text-secondary text-sm font-semibold
                    hover:bg-secondary/15 hover:border-secondary/30
                    active:scale-95
                    transition-all duration-200
                    backdrop-blur-sm
                "
            >
                يلا نعرف النتيجة ✨
            </motion.button>
        </motion.div>
    );
}

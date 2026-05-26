
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Headline, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { iconAssets } from "@/assets";

import { phaseEnter, gentleFloat } from "../ceremony-motion";

interface ClosingPhaseProps {
    onNewSession: () => void;
}

const CLOSING_MESSAGES = [
    "الكنوز الحقيقية كانت اللمة الجميلة ❤️",
    "بعض الكنوز تُنسى... لكن الليلة لا تُنسى. ✨",
    "كل سؤال جاوبناه كان طريقنا لبعض. شكراً لكم 🙏",
    "النجوم تتجمع... واللمة أجمل. شكراً لكم 🌟",
    "الكنز الحقيقي؟ الضحك والذكريات اللي صنعناها. 💛",
    "الكنز دايماً في الرحلة والصحبة مش بس في النهاية. شكراً لكم 🌈",
];

/** Pick a message based on current time for variety */
function pickClosingMessage(): string {
    return CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)];
}

/**
 * Closing Phase — emotional ending screen.
 *
 * The final moment of the ceremony.
 * Particles, themed background, celebration stickers,
 * soft soundtrack ambiance, and a "new session" CTA.
 */
export function ClosingPhase({ onNewSession }: ClosingPhaseProps) {
    const message = pickClosingMessage();

    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex flex-col items-center gap-3.5 py-4"
        >
            {/* Floating logo */}
            <motion.div
                variants={gentleFloat}
                animate="animate"
                className="relative h-26 w-26 select-none"
            >
                <Image
                    src={iconAssets.logoMark}
                    alt="Kenzoo"
                    fill
                    className="object-contain drop-shadow-[0_4px_16px_rgba(216,179,106,0.3)]"
                />
            </motion.div>

            {/* Celebration sticker */}
            <MoodSticker mood="celebration" size={250} delay={0.3} />

            {/* Emotional message */}
            <Headline className="text-secondary text-lg text-center leading-relaxed px-4">
                {message}
            </Headline>

            {/* Decorative stars */}
            <div className="flex items-center gap-2 opacity-40">
                <Image src={iconAssets.bigMoon} alt="" width={16} height={16} className="object-contain" />
                <Image src={iconAssets.starsSticker} alt="" width={14} height={14} className="object-contain" />
                <Image src={iconAssets.smallMoon} alt="" width={12} height={12} className="object-contain" />
                <Image src={iconAssets.starsSticker} alt="" width={14} height={14} className="object-contain" />
                <Image src={iconAssets.bigMoon} alt="" width={16} height={16} className="object-contain" />
            </div>

            <Muted className="text-xs text-center">
                شكراً إنكم لعبتوا مع بعض 💛
            </Muted>

            {/* New Session CTA */}
            <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                onClick={onNewSession}
                className="
                    mt-4 rounded-full
                    border border-secondary/25
                    bg-secondary/10
                    px-8 py-2.5
                    text-secondary text-sm font-bold
                    hover:bg-secondary/18 hover:border-secondary/35
                    active:scale-95
                    transition-all duration-200
                    backdrop-blur-sm
                    shadow-[0_4px_16px_rgba(216,179,106,0.10)]
                "
            >
                جلسة جديدة ✨
            </motion.button>
        </motion.div>
    );
}

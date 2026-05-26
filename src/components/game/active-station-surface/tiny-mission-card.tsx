
"use client";

import { motion } from "framer-motion";

import { Body, Label } from "@/components/ui/typography";

import type { TinyMission } from "@/types/station";

import { slideUp } from "./motion";

interface TinyMissionCardProps {
    mission: TinyMission;
}

/**
 * Tiny mission card — shown on wrong answers.
 *
 * A warm, playful alternative to punishment.
 * Per AGENTS.md: "Failure should feel funny, social, charming."
 *
 * Now more prominent and visually clear so players actually
 * notice and engage with the mission before continuing.
 */
export function TinyMissionCard({ mission }: TinyMissionCardProps) {
    return (
        <motion.div
            {...slideUp(0.25)}
            className="
                relative overflow-hidden
                rounded-2xl
                border border-secondary/20
                bg-gradient-to-b from-secondary/10 to-secondary/5
                px-4 py-3.5
                shadow-[0_0_20px_rgba(216,179,106,0.08)]
            "
        >
            {/* Decorative accent line */}
            <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-l from-secondary/40 via-secondary/20 to-transparent" />

            <div className="flex items-start gap-3">
                {/* Mission icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                    <span className="text-lg">🎯</span>
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-secondary text-sm font-bold leading-snug">
                        مهمة صغيرة!
                    </Label>
                    <Body className="text-foreground/80 text-[13px] leading-relaxed">
                        {mission.text}
                    </Body>
                </div>
            </div>
        </motion.div>
    );
}


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
 * Pure visual component.
 */
export function TinyMissionCard({ mission }: TinyMissionCardProps) {
    return (
        <motion.div
            {...slideUp(0.25)}
            className="
                rounded-2xl
                border border-primary/10
                bg-primary/6
                px-5 py-4
            "
        >
            <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🎯</span>
                <div className="flex flex-col gap-1">
                    <Label className="text-primary text-xs">
                        مهمة صغيرة!
                    </Label>
                    <Body className="text-foreground/80 text-sm leading-relaxed">
                        {mission.text}
                    </Body>
                </div>
            </div>
        </motion.div>
    );
}

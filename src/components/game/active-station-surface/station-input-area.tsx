
"use client";

import { motion } from "framer-motion";

import { LanternButton } from "@/components/ui/lantern-button";
import { Label, Muted } from "@/components/ui/typography";

import type { Station } from "@/types/station";

import { fadeIn } from "./motion";
import { stationRenderers } from "../station-renderers";

interface StationInputAreaProps {
    station: Station;
    selectedChoice: string | null;
    onChoiceSelect: (choice: string) => void;
    riddleInput: string;
    onRiddleInput: (value: string) => void;
    canSubmit: boolean;
    onSubmit: () => void;
}

/**
 * StationInputArea — renderer selector + shared chrome.
 *
 * This component is now a thin orchestrator:
 *   1. Selects the correct renderer from the registry based on station.type
 *   2. Wraps it in shared UI (reward hint bar + submit button)
 *   3. Passes props through to the renderer
 *
 * No gameplay type branching lives here anymore.
 * Each station type has its own isolated renderer file.
 *
 * To add a new gameplay type:
 *   - Create a new renderer in station-renderers/
 *   - Add it to the registry in station-renderers/index.ts
 *   - This component automatically picks it up
 */
export function StationInputArea({
    station,
    selectedChoice,
    onChoiceSelect,
    riddleInput,
    onRiddleInput,
    canSubmit,
    onSubmit,
}: StationInputAreaProps) {
    const Renderer = stationRenderers[station.type];

    return (
        <motion.div
            {...fadeIn}
            className="flex flex-col gap-2.5"
        >
            {/* ── Type-specific gameplay renderer ── */}
            <Renderer
                station={station}
                selectedChoice={selectedChoice}
                onSelect={onChoiceSelect}
                textInput={riddleInput}
                onTextInput={onRiddleInput}
                canSubmit={canSubmit}
                onSubmit={onSubmit}
            />

            {/* ── Reward hint bar (shared across all types) ── */}
            <div
                className="
                    flex items-center justify-between
                    rounded-xl
                    border border-secondary/12
                    bg-secondary/6
                    px-3.5 py-2
                    backdrop-blur-sm
                "
            >
                <div className="flex items-center gap-1.5">
                    <span className="text-xs">{station.reward.canUnlockTreasure ? "🎁" : "⭐"}</span>
                    <Muted className="text-[11px]">
                        {station.reward.canUnlockTreasure
                            ? "كنز محتمل!"
                            : "نجم وبيجمع اخواته"}
                    </Muted>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs">✦</span>
                    <Label className="text-secondary text-[11px] font-semibold">
                        +{station.reward.stars}
                    </Label>
                </div>
            </div>

            {/* ── Confirm CTA (shared across all types) ── */}
            <LanternButton
                disabled={!canSubmit}
                onClick={onSubmit}
                className="w-full disabled:opacity-40 disabled:saturate-50"
            >
                ✨ تأكيد الاختيار
            </LanternButton>
        </motion.div>
    );
}

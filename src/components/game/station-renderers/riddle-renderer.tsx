
"use client";

import { Muted } from "@/components/ui/typography";

import type { StationRendererProps } from "./renderer-types";

/**
 * Riddle renderer — text input gameplay.
 *
 * Renders an open text input for riddle/word answers.
 * Used for: riddle, puzzle (all text-input types for now).
 *
 * Cozy, warm, inviting input field with RTL support.
 */
export function RiddleRenderer({
    textInput,
    onTextInput,
}: StationRendererProps) {
    return (
        <div className="flex flex-col gap-3">
            <div
                className="
                    relative
                    rounded-2xl
                    border border-border/40
                    bg-surface-soft/60
                    overflow-hidden
                    transition-all duration-200
                    focus-within:border-secondary/40
                    focus-within:shadow-[0_4px_16px_rgba(216,179,106,0.06)]
                "
            >
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => onTextInput(e.target.value)}
                    placeholder="اكتب إجابتك هنا..."
                    dir="rtl"
                    className="
                        w-full bg-transparent
                        px-5 py-4
                        text-foreground text-[15px]
                        placeholder:text-muted-foreground/40
                        outline-none
                    "
                />
            </div>
            <Muted className="text-xs text-center">
                ✍️ اكتب إجابتك وركز فالسؤال!
            </Muted>
        </div>
    );
}

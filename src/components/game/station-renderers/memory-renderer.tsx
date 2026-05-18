
"use client";

import { motion } from "framer-motion";

import { Muted } from "@/components/ui/typography";

import type { StationRendererProps } from "./renderer-types";

/**
 * Memory renderer — placeholder for future memory gameplay.
 *
 * Will evolve into:
 *   - card flip reveals
 *   - memory matching
 *   - nostalgic recall moments
 *
 * For now: warm placeholder with text input fallback.
 */
export function MemoryRenderer({
    textInput,
    onTextInput,
}: StationRendererProps) {
    return (
        <div className="flex flex-col gap-3">
            <div
                className="
                    relative
                    rounded-2xl
                    border border-primary/15
                    bg-primary/5
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
                    placeholder="اتذكر واكتب..."
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <Muted className="text-xs">
                    📖 ذكرى حلوة ليك — اكتب اللي فاكره
                </Muted>
            </motion.div>
        </div>
    );
}

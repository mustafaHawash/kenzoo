
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
        <div className="flex flex-col gap-2.5">
            <div
                className="
                    relative
                    rounded-xl
                    border border-primary/15
                    bg-primary/5
                    overflow-hidden
                    transition-all duration-200
                    focus-within:border-secondary/40
                    focus-within:shadow-[0_4px_16px_rgba(216,179,106,0.08)]
                    focus-within:bg-primary/8
                "
            >
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                    📖
                </div>
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => onTextInput(e.target.value)}
                    placeholder="اتذكر واكتب..."
                    dir="rtl"
                    className="
                        w-full bg-transparent
                        px-4 py-3 pr-9
                        text-foreground text-[13px]
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
                <Muted className="text-[10px]">
                    📖 ذكرى حلوة ليك — اكتب اللي فاكره
                </Muted>
            </motion.div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanternGlow({ className }: { className?: string }) {
    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ 
                opacity: [0.8, 1, 0.8], 
                scale: [0.98, 1.02, 0.98] 
            }}
            transition={{ 
                duration: 7, 
                ease: "easeInOut", 
                repeat: Infinity,
            }}
            className={cn(
                "absolute left-1/2 top-[47%] h-72 w-72 -translate-x-1/2 -translate-y-1/2",
                "rounded-full bg-secondary/24 blur-3xl",
                "sm:h-96 sm:w-96",
                className,
            )}
        />
    );
}

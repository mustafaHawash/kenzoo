"use client";

import { motion } from "framer-motion";

export function AmbientGradient() {
    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
            }}
            className="absolute inset-0"
        >
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(216,179,106,0.20),transparent_32%),linear-gradient(180deg,rgba(31,27,24,0.14),transparent_35%,rgba(124,97,114,0.16))]" />
            <div className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-secondary/12 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-background via-background/72 to-transparent" />
        </motion.div>
    );
}

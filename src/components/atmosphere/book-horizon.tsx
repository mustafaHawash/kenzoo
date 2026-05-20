"use client";

import { motion } from "framer-motion";

export function BookHorizon() {
    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 0.78, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 flex justify-center"
        >
            <motion.div 
                className="relative h-32 w-[min(92vw,34rem)] overflow-hidden"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
            >
                <div className="absolute bottom-0 right-1/2 h-24 w-1/2 origin-bottom-left -skew-y-6 rounded-tl-[3rem] border-t border-secondary/16 bg-linear-to-bl from-surface-elevated/40 to-primary/12" />
                <div className="absolute bottom-0 left-1/2 h-24 w-1/2 origin-bottom-right skew-y-6 rounded-tr-[3rem] border-t border-secondary/16 bg-linear-to-br from-surface-elevated/40 to-primary/12" />
                <div className="absolute bottom-3 left-1/2 h-20 w-px -translate-x-1/2 bg-secondary/18" />
            </motion.div>
        </motion.div>
    );
}

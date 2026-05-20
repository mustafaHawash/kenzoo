"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { PropsWithChildren } from "react";

const stepVariants: Variants = {
    enter: { opacity: 0, y: 18, scale: 0.985 },
    center: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.42, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        transition: { duration: 0.24, ease: "easeOut" },
    },
};

export function SessionStepTransition({
    stepKey,
    children,
}: PropsWithChildren<{ stepKey: string }>) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={stepKey}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}


"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const particlePositions = [
    "right-[15%] top-[20%]",
    "right-[25%] top-[42%]",
    "left-[18%] top-[28%]",
    "left-[30%] bottom-[22%]",
];

const particleVariants: Variants = {
    hidden: { opacity: 0, y: 6, scale: 0.9 },
    visible: (index: number) => ({
        opacity: [0.18, 0.45, 0.18],
        y: [0, -8, 0],
        scale: [0.95, 1.05, 0.95],
        transition: {
            delay: index * 0.3,
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
        },
    }),
};

export function FloatingParticles() {
    return (
        <div aria-hidden className="absolute inset-0">
            {particlePositions.map((position, index) => (
                <motion.span
                    key={position}
                    custom={index}
                    variants={particleVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        "absolute block size-1.5 rounded-full bg-secondary/70 shadow-[0_0_18px_rgba(216,179,106,0.65)]",
                        "sm:size-2",
                        position,
                    )}
                />
            ))}
        </div>
    );
}

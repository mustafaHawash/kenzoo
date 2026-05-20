"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const particlePositions = [
    "right-[12%] top-[18%]",
    "right-[22%] top-[38%]",
    "right-[16%] bottom-[24%]",
    "left-[14%] top-[24%]",
    "left-[24%] top-[48%]",
    "left-[18%] bottom-[20%]",
    "right-[42%] top-[14%]",
    "left-[42%] bottom-[16%]",
];

const particleVariants: Variants = {
    hidden: { opacity: 0, y: 6, scale: 0.9 },
    visible: (index: number) => ({
        opacity: [0.22, 0.55, 0.22],
        y: [0, -10, 0],
        scale: [0.95, 1.08, 0.95],
        transition: {
            delay: index * 0.18,
            duration: 5.5 + index * 0.25,
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

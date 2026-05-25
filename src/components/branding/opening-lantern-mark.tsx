"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { iconAssets } from "@/assets";

const revealVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const floatVariants: Variants = {
    float: {
        y: [0, -7, 0],
        scale: [1, 1.02, 1],
        transition: {
            duration: 4.8,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

export function OpeningLanternMark() {
    return (
        <motion.div
            variants={revealVariants}
            className="relative flex h-50 w-50 items-center justify-center "
        >
            <motion.div
                variants={floatVariants}
                animate="float"
                className="relative h-100 w-100"
            >
                <Image
                    src={iconAssets.logoMark}
                    alt="Kenzoo Logo"
                    fill
                    priority
                    className="object-contain drop-shadow-[0_8px_32px_rgba(216,179,106,0.3)]"
                />
            </motion.div>
        </motion.div>
    );
}

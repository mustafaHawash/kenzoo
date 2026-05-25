"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { OpeningSceneAtmosphere } from "@/components/atmosphere/opening-scene-atmosphere";
import { OpeningLanternMark } from "@/components/branding/opening-lantern-mark";
import { LanternButton } from "@/components/ui/lantern-button";
import { KScreen } from "@/components/ui/kenzoo/k-screen";
import { Body, Muted } from "@/components/ui/typography";
import { useSoundtrack } from "@/hooks/useSoundtrack";

const sceneVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.14,
            delayChildren: 0.18,
        },
    },
};

const revealVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};
export default function HomePage() {
    const soundtrack = useSoundtrack();

    /* ─── Core soundtrack — warm ambient on home page ─── */
    useEffect(() => {
        soundtrack.play("core", 0.15);
        // Don't stop on unmount — next page will switch the layer.
        // This prevents a silence gap during navigation.
    }, [soundtrack]);

    return (
        <KScreen scene="home" contentClassName="max-w-xl items-center justify-center px-6 py-10 text-center">
            <OpeningSceneAtmosphere />

            <motion.section
                variants={sceneVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 py-10 text-center"
            >
                <div className="flex min-h-[72dvh] w-full flex-col items-center justify-center gap-7">
                    <OpeningLanternMark />

                    <motion.div
                        variants={revealVariants}
                        className="flex flex-col items-center gap-4"
                    >
                        <Body className="max-w-[18rem] text-balance text-foreground/82 sm:max-w-sm sm:text-body-lg">
                         الليلة هادية... والكتاب مستني صاحب الحكاية يفتح
                         <span className="font-bold text-primary" > كـنزو</span>.
                        </Body>
                    </motion.div>

                    <motion.div
                        variants={revealVariants}
                        className="flex w-full flex-col items-center gap-3"
                    >
                        <LanternButton asChild className="min-w-56 border border-secondary/30 bg-secondary/15 px-10 py-3 text-base text-secondary shadow-[0_0_34px_rgba(216,179,106,0.15)] backdrop-blur-md transition-all duration-300 hover:bg-secondary/25 hover:shadow-[0_0_42px_rgba(216,179,106,0.25)]">
                            <Link href="/session/setup">جهز الرحلة</Link>
                        </LanternButton>

                        <button
                            type="button"
                            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground/70 transition-colors duration-300 hover:text-foreground/90 focus-visible:outline-none"
                        >
                            العب ازاي؟
                            <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-foreground/30 transition-all duration-300 group-hover:w-3/4" />
                        </button>
                    </motion.div>

                    <motion.div variants={revealVariants}>
                        <Muted className="max-w-[16rem] text-xs leading-6 text-muted-foreground/72">
                            جلسة صغيرة، اختيارات غامضة، وذكريات جميلة بينكم.
                        </Muted>
                    </motion.div>
                </div>
            </motion.section>
        </KScreen>
    );
}

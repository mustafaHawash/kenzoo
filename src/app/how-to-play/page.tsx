"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

import { KScreen } from "@/components/ui/kenzoo/k-screen";
import { Headline, Body, Muted, Label } from "@/components/ui/typography";
import { LanternButton } from "@/components/ui/lantern-button";
import { iconAssets } from "@/assets";

/* ─── Animation variants ─── */
const sceneVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
        },
    },
};

const revealVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

/* ─── Step data ─── */
const steps = [
    {
        icon: iconAssets.lantern,
        title: "جهزوا الرحلة",
        description: "اختاروا عدد اللاعبين واسماءكم، وخلّوا كنزو يجهز لكم رحلة غامضة فريدة.",
    },
    {
        icon: iconAssets.bigMoon,
        title: "اختاروا كارت",
        description: "كل دور، كارتات جديدة تظهر — اختاروا الكارت اللي يناديكم.",
    },
    {
        icon: iconAssets.mainKey,
        title: "جاوبوا واكتشفوا",
        description: "كل كارت فيه محطات — فزورات، تحديات، وأسرار. جاوبوا واجمعوا النجوم.",
    },
    {
        icon: iconAssets.treasure,
        title: "افتحوا الكنوز",
        description: "الكنوز بتظهر فجأة — افتحوها واكتشفوا جواها ايه من مفاجآت وألقاب.",
    },
    {
        icon: iconAssets.starsSticker,
        title: "احتفلوا مع بعض",
        description: "في نهاية الرحلة، حفل صغير يكشف مين جاب اكتر كنوز ومين أخد أغرب لقب.",
    },
] as const;

export default function HowToPlayPage() {
    return (
        <KScreen scene="home" contentClassName="max-w-xl items-center justify-center px-6 py-10 text-center">
            <motion.section
                variants={sceneVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-6 py-10 text-center"
            >
                {/* ── Header ── */}
                <motion.div variants={revealVariants} className="flex flex-col items-center gap-3">
                    <Image
                        src={iconAssets.lantern}
                        alt=""
                        width={64}
                        height={64}
                        className="object-contain drop-shadow-[0_4px_20px_rgba(216,179,106,0.4)]"
                    />
                    <Headline className="text-secondary text-2xl font-bold">العب ازاي؟</Headline>
                    <Muted className="max-w-xs text-muted-foreground/80">
                        كنزو لعبة اجتماعية بسيطة — جلوس واحد، ذكريات كتير
                    </Muted>
                </motion.div>

                {/* ── Steps ── */}
                <div className="flex w-full flex-col gap-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            variants={revealVariants}
                            className="flex items-start gap-4 rounded-2xl border border-secondary/12 bg-card/50 px-5 py-4 text-right backdrop-blur-sm"
                        >
                            {/* Step number + icon */}
                            <div className="flex shrink-0 flex-col items-center gap-1">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                                    <Image
                                        src={step.icon}
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="object-contain drop-shadow-[0_2px_8px_rgba(216,179,106,0.3)]"
                                    />
                                </div>
                                <Label className="text-[10px] text-secondary/50 tabular-nums">
                                    {i + 1}
                                </Label>
                            </div>

                            {/* Text */}
                            <div className="flex flex-col gap-1 pt-1">
                                <Label className="text-foreground text-sm font-bold">
                                    {step.title}
                                </Label>
                                <Body className="text-muted-foreground/80 text-sm leading-relaxed">
                                    {step.description}
                                </Body>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Tip ── */}
                <motion.div
                    variants={revealVariants}
                    className="w-full rounded-2xl border border-primary/12 bg-primary/5 px-5 py-4 text-center"
                >
                    <Label className="text-primary text-sm font-semibold">💡 نصيحة</Label>
                    <Muted className="mt-1 text-sm text-muted-foreground/80">
                        مفيش إجابة غلط — الهدف إنكم تقضوا وقت حلو وتتعرفوا على بعض أكتر.
                    </Muted>
                </motion.div>

                {/* ── CTA ── */}
                <motion.div
                    variants={revealVariants}
                    className="flex w-full flex-col items-center gap-3"
                >
                    <LanternButton asChild className="min-w-52">
                        <Link href="/session/setup">يلا نبدأ ✨</Link>
                    </LanternButton>

                    <Link
                        href="/"
                        className="group relative px-4 py-2 text-sm font-medium text-muted-foreground/70 transition-colors duration-300 hover:text-foreground/90"
                    >
                        ارجع للرئيسية
                        <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-foreground/30 transition-all duration-300 group-hover:w-3/4" />
                    </Link>
                </motion.div>
            </motion.section>
        </KScreen>
    );
}

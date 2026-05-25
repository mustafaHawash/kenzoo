"use client";

import type { SessionLengthDefinition } from "./setup-types";
import { Label, Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { iconAssets } from "@/assets";

const LENGTH_ICONS: Record<string, string> = {
    short: iconAssets.smallMoon,
    normal: iconAssets.starsSticker,
    long: iconAssets.bigMoon,
};

export function SessionLengthCard({
    length,
    selected,
    onSelect,
}: {
    length: SessionLengthDefinition;
    selected: boolean;
    onSelect: () => void;
}) {
    const icon = LENGTH_ICONS[length.id] ?? iconAssets.lantern;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "group relative overflow-hidden rounded-xl border p-3.5 text-right backdrop-blur-md",
                "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                "min-h-[4.5rem]",
                selected
                    ? "border-secondary/48 bg-secondary/16 shadow-[0_0_34px_rgba(216,179,106,0.16)]"
                    : "border-secondary/14 bg-surface-elevated/28 hover:border-secondary/30 hover:bg-surface-elevated/42 active:scale-[0.98]",
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,179,106,0.14),transparent_34%)] opacity-80" />
            <div className="relative flex items-center gap-3.5">
                {/* Themed icon */}
                <div className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
                    selected
                        ? "bg-secondary/16 border border-secondary/25"
                        : "bg-surface-soft/60 border border-secondary/10"
                )}>
                    <Image
                        src={icon}
                        alt=""
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                </div>

                <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <Label className="text-base text-foreground font-semibold">{length.label}</Label>
                        <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all",
                            selected
                                ? "bg-secondary/16 text-secondary border border-secondary/20"
                                : "bg-background/24 text-muted-foreground border border-secondary/10"
                        )}>
                            {length.rounds} محطات
                        </span>
                    </div>
                    <Muted className="text-[11px] leading-snug">{length.mood}</Muted>
                </div>
            </div>
        </button>
    );
}


"use client";

import type { ThemeDefinition } from "./setup-types";
import { Body, Label, Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function ThemeCard({
    theme,
    selected,
    onSelect,
}: {
    theme: ThemeDefinition;
    selected: boolean;
    onSelect: () => void;
}) {
    const isComingSoon = theme.status === "coming-soon";

    return (
        <button
            type="button"
            onClick={isComingSoon ? undefined : onSelect}
            aria-disabled={isComingSoon}
            className={cn(
                "group relative overflow-hidden rounded-[30px] border p-5 text-right backdrop-blur-md",
                "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                selected
                    ? "border-secondary/50 bg-secondary/16 shadow-[0_0_36px_rgba(216,179,106,0.18)]"
                    : "border-secondary/14 bg-surface-elevated/28",
                isComingSoon
                    ? "cursor-default opacity-78"
                    : "hover:border-secondary/30 hover:bg-surface-elevated/42",
            )}
        >
            <div className={cn("absolute inset-0 bg-linear-to-br", theme.accent)} />
            <div className="absolute -left-10 -top-10 size-32 rounded-full bg-secondary/12 blur-3xl" />

            <div className="relative flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Label className="text-xl text-foreground">{theme.title}</Label>
                        <Body className="mt-2 text-sm leading-7 text-muted-foreground">
                            {theme.subtitle}
                        </Body>
                    </div>

                    {isComingSoon && (
                        <span className="shrink-0 rounded-full border border-secondary/18 bg-background/22 px-3 py-1 text-xs text-muted-foreground">
                            قريبًا
                        </span>
                    )}
                </div>

                <Muted className="text-xs leading-6">{theme.atmosphere}</Muted>
            </div>
        </button>
    );
}


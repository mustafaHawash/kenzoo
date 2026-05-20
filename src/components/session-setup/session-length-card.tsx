"use client";

import type { SessionLengthDefinition } from "./setup-types";
import { Body, Label, Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function SessionLengthCard({
    length,
    selected,
    onSelect,
}: {
    length: SessionLengthDefinition;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "group relative overflow-hidden rounded-[28px] border p-5 text-right backdrop-blur-md",
                "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                selected
                    ? "border-secondary/48 bg-secondary/16 shadow-[0_0_34px_rgba(216,179,106,0.16)]"
                    : "border-secondary/14 bg-surface-elevated/28 hover:border-secondary/30 hover:bg-surface-elevated/42",
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,179,106,0.14),transparent_34%)] opacity-80" />
            <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <Label className="text-lg text-foreground">{length.label}</Label>
                        <Muted className="text-xs">{length.mood}</Muted>
                    </div>
                    <span className="rounded-full border border-secondary/18 bg-background/24 px-3 py-1 text-xs text-muted-foreground">
                        {length.rounds} جولات
                    </span>
                </div>
                <Body className="text-sm leading-7 text-muted-foreground">
                    {length.description}
                </Body>
            </div>
        </button>
    );
}


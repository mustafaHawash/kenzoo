"use client";

import type { SetupPlayer, SetupPlayerAgeGroup } from "./setup-types";
import { getAllAvatars } from "./avatar-registry";
import { cn } from "@/lib/utils";

export function PlayerCard({
    player,
    index,
    canRemove,
    isEditing,
    onToggleEdit,
    onUpdate,
    onRemove,
    validationError,
}: {
    player: SetupPlayer;
    index: number;
    canRemove: boolean;
    isEditing: boolean;
    onToggleEdit: () => void;
    onUpdate: (player: SetupPlayer) => void;
    onRemove: () => void;
    validationError?: string;
}) {
    const updateAgeGroup = (ageGroup: SetupPlayerAgeGroup) => {
        onUpdate({ ...player, ageGroup });
    };

    const trimmedName = player.name.trim();
    const displayName = trimmedName || `ضيف ${index + 1}`;

    /* ─── Collapsed: warm social chip — tap to edit ─── */
    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={onToggleEdit}
                className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-right",
                    "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                    "border-secondary/12 bg-surface-elevated/20 hover:border-secondary/24 hover:bg-surface-elevated/36",
                )}
            >
                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/8 text-lg">
                    {player.avatar}
                </div>
                <div className="flex flex-1 flex-col gap-0 overflow-hidden">
                    <span className={cn(
                        "truncate text-sm font-medium",
                        trimmedName ? "text-foreground/90" : "text-muted-foreground/60",
                    )}>
                        {displayName}
                    </span>
                </div>
                <span className="text-[11px] text-muted-foreground/50">
                    {player.ageGroup === "kid" ? "👶 طفل" : "🧑 كبير"}
                </span>
            </button>
        );
    }

    /* ─── Expanded: light social editing surface ─── */
    return (
        <article className={cn(
            "relative overflow-hidden rounded-2xl border p-3.5",
            "transition-all duration-(--duration-normal) ease-(--ease-soft)",
            validationError
                ? "border-destructive/24 bg-surface-elevated/28"
                : "border-secondary/16 bg-surface-elevated/28",
        )}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(216,179,106,0.08),transparent_36%)]" />

            <div className="relative flex flex-col gap-2.5">
                {/* Name input row: avatar + input + remove */}
                <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">
                        {player.avatar}
                    </div>

                    <input
                        value={player.name}
                        onChange={(event) => onUpdate({ ...player, name: event.target.value })}
                        placeholder="الاسم"
                        className={cn(
                            "h-10 flex-1 rounded-xl border bg-background/30 px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50",
                            validationError
                                ? "border-destructive/28 focus:border-destructive/48 focus:ring-1 focus:ring-destructive/10"
                                : "border-secondary/10 focus:border-secondary/32 focus:ring-1 focus:ring-secondary/10",
                        )}
                    />

                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                            إزالة
                        </button>
                    )}
                </div>

                {/* Validation hint — only when editing */}
                {validationError && (
                    <p className="pr-12 text-[11px] leading-4 text-destructive/70">
                        {validationError}
                    </p>
                )}

                {/* Compact row: avatar picker + age toggle */}
                <div className="flex items-center gap-2">
                    {/* Mini avatar picker — sourced from registry */}
                    <div className="flex gap-1.5">
                        {getAllAvatars().slice(0, 4).map((avatar) => (
                            <button
                                key={avatar}
                                type="button"
                                onClick={() => onUpdate({ ...player, avatar })}
                                className={cn(
                                    "flex size-8 items-center justify-center rounded-lg text-base transition-all active:scale-90",
                                    player.avatar === avatar
                                        ? "bg-secondary/16 ring-1 ring-secondary/30"
                                        : "text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground",
                                )}
                            >
                                {avatar}
                            </button>
                        ))}
                    </div>

                    {/* Age group pills — thumb-friendly with icons */}
                    <div className="mr-auto flex gap-1.5">
                        {[
                            { id: "adult" as const, label: "كبير", icon: "🧑" },
                            { id: "kid" as const, label: "طفل", icon: "👶" },
                        ].map((option) => {
                            const isSelected = player.ageGroup === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => updateAgeGroup(option.id)}
                                    className={cn(
                                        "flex items-center gap-1 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-all duration-(--duration-normal) ease-(--ease-soft) active:scale-95",
                                        isSelected
                                            ? "bg-secondary/16 text-foreground border border-secondary/20"
                                            : "text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground border border-transparent",
                                    )}
                                >
                                    <span className="text-sm">{option.icon}</span>
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </article>
    );
}


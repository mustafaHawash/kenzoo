"use client";

import { PlayerAvatarPicker } from "./player-avatar-picker";
import type { SetupPlayer, SetupPlayerAgeGroup } from "./setup-types";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function PlayerCard({
    player,
    index,
    canRemove,
    onUpdate,
    onRemove,
}: {
    player: SetupPlayer;
    index: number;
    canRemove: boolean;
    onUpdate: (player: SetupPlayer) => void;
    onRemove: () => void;
}) {
    const updateAgeGroup = (ageGroup: SetupPlayerAgeGroup) => {
        onUpdate({ ...player, ageGroup });
    };

    return (
        <article className="relative overflow-hidden rounded-[28px] border border-secondary/14 bg-surface-elevated/34 p-4 shadow-[0_18px_70px_rgba(31,27,24,0.10)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(216,179,106,0.14),transparent_36%)]" />

            <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/12 text-xl">
                            {player.avatar}
                        </div>
                        <div>
                            <Label className="text-primary">ضيف الليلة {index + 1}</Label>
                            <p className="text-xs leading-5 text-muted-foreground">
                                اسم صغير يكفي لفتح الباب.
                            </p>
                        </div>
                    </div>

                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                            إزالة
                        </button>
                    )}
                </div>

                <input
                    value={player.name}
                    onChange={(event) => onUpdate({ ...player, name: event.target.value })}
                    placeholder="اسم اللاعب"
                    className="h-12 rounded-2xl border border-secondary/14 bg-background/36 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-secondary/40 focus:ring-2 focus:ring-secondary/12"
                />

                <PlayerAvatarPicker
                    value={player.avatar}
                    onChange={(avatar) => onUpdate({ ...player, avatar })}
                />

                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-secondary/10 bg-background/24 p-1">
                    {[
                        { id: "adult" as const, label: "كبير" },
                        { id: "kid" as const, label: "طفل" },
                    ].map((option) => {
                        const isSelected = player.ageGroup === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => updateAgeGroup(option.id)}
                                className={cn(
                                    "h-10 rounded-xl text-sm font-medium transition-all duration-(--duration-normal) ease-(--ease-soft)",
                                    isSelected
                                        ? "bg-secondary/20 text-foreground shadow-[0_0_18px_rgba(216,179,106,0.10)]"
                                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                                )}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </article>
    );
}


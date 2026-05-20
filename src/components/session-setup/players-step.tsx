"use client";

import { useState } from "react";
import { PlayerCard } from "./player-card";
import type { SetupPlayer, StepComponentProps } from "./setup-types";
import { getDefaultAvatarForIndex } from "./avatar-registry";
import { validatePlayer, findDuplicateName } from "./setup-validation";
import { canAddMorePlayers, SESSION_LIMITS } from "./session-limits";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function PlayersStep({ setup, onSetupChange }: StepComponentProps) {
    const players = setup.players;
    const onPlayersChange = (players: SetupPlayer[]) => onSetupChange("players", players);

    /* ─── Track which player card is expanded ─── */
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

    /* ─── Per-player validation (inline hints only) ─── */
    const getValidationError = (player: SetupPlayer): string | undefined => {
        const result = validatePlayer(player);
        if (!result.isValid) return result.reason;

        const dupResult = findDuplicateName(players);
        if (!dupResult.isValid) {
            const trimmedName = player.name.trim().toLowerCase();
            if (trimmedName) return dupResult.reason;
        }

        return undefined;
    };

    /* ─── Add player ─── */
    const addPlayer = () => {
        if (!canAddMorePlayers(players.length)) return;

        const newId = `player-${Date.now()}`;
        const nextIndex = players.length;

        onPlayersChange([
            ...players,
            {
                id: newId,
                name: "",
                avatar: getDefaultAvatarForIndex(nextIndex),
                ageGroup: "adult",
            },
        ]);

        // Auto-expand the new player
        setEditingPlayerId(newId);
    };

    /* ─── Remove player ─── */
    const removePlayer = (playerId: string) => {
        onPlayersChange(players.filter((p) => p.id !== playerId));
        if (editingPlayerId === playerId) {
            setEditingPlayerId(null);
        }
    };

    const isAtMax = !canAddMorePlayers(players.length);

    /* ─── Empty gathering state: warm invitation ─── */
    if (players.length === 0) {
        return (
            <div className="flex flex-col items-center gap-5 py-4">
                <div className="flex size-16 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 text-2xl">
                    🕯️
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Muted className="text-sm leading-6">
                        مين أول واحد هيشارك الليلة؟
                    </Muted>
                    <Muted className="text-xs leading-5 text-muted-foreground/60">
                        كل اسم بيفتح باب لحكاية
                    </Muted>
                </div>
                <Button
                    type="button"
                    onClick={addPlayer}
                    className={cn(
                        "h-12 rounded-2xl border border-dashed border-secondary/28 bg-surface-elevated/22 px-6",
                        "text-sm font-medium text-foreground/80 backdrop-blur-sm",
                        "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                        "hover:border-secondary/40 hover:bg-secondary/10 hover:text-foreground",
                    )}
                >
                    + ضيف أول لاعب
                </Button>
            </div>
        );
    }

    /* ─── Players list with internal scrolling ─── */
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
            {/* Scrollable player cards — contained region */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain scrollbar-none">
                {players.map((player, index) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        canRemove={players.length > 1}
                        isEditing={editingPlayerId === player.id}
                        onToggleEdit={() =>
                            setEditingPlayerId(editingPlayerId === player.id ? null : player.id)
                        }
                        onUpdate={(updatedPlayer) =>
                            onPlayersChange(
                                players.map((current) =>
                                    current.id === player.id ? updatedPlayer : current,
                                ),
                            )
                        }
                        onRemove={() => removePlayer(player.id)}
                        validationError={editingPlayerId === player.id ? getValidationError(player) : undefined}
                    />
                ))}
            </div>

            {/* Add player / capacity indicator — always visible */}
            <div className="shrink-0">
                {!isAtMax ? (
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 border border-dashed border-secondary/22 bg-surface-elevated/18 text-sm text-muted-foreground hover:bg-secondary/8 hover:text-foreground"
                        onClick={addPlayer}
                    >
                        + ضيف حد للّيلة
                    </Button>
                ) : (
                    <p className="py-1 text-center text-xs text-muted-foreground/50">
                        اللمة كاملة — {SESSION_LIMITS.maxPlayers} لاعبين 🌙
                    </p>
                )}
            </div>
        </div>
    );
}


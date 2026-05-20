"use client";

import { PlayerCard } from "./player-card";
import type { SetupPlayer } from "./setup-types";
import { LanternButton } from "@/components/ui/lantern-button";
import { Button } from "@/components/ui/button";

export function PlayersStep({
    players,
    onPlayersChange,
}: {
    players: SetupPlayer[];
    onPlayersChange: (players: SetupPlayer[]) => void;
}) {
    const addPlayer = () => {
        const nextIndex = players.length + 1;

        onPlayersChange([
            ...players,
            {
                id: `player-${Date.now()}`,
                name: "",
                avatar: ["🌙", "🕯️", "🔮", "📖"][nextIndex % 4],
                ageGroup: "adult",
            },
        ]);
    };

    return (
        <div className="flex flex-col gap-4">
            {players.map((player, index) => (
                <PlayerCard
                    key={player.id}
                    player={player}
                    index={index}
                    canRemove={players.length > 1}
                    onUpdate={(updatedPlayer) =>
                        onPlayersChange(
                            players.map((current) =>
                                current.id === player.id ? updatedPlayer : current,
                            ),
                        )
                    }
                    onRemove={() =>
                        onPlayersChange(players.filter((current) => current.id !== player.id))
                    }
                />
            ))}

            <Button
                type="button"
                variant="ghost"
                className="h-12 border border-dashed border-secondary/22 bg-surface-elevated/18 text-muted-foreground hover:bg-secondary/8 hover:text-foreground"
                onClick={addPlayer}
            >
                ضيف حد للّيلة
            </Button>

            <LanternButton
                type="submit"
                className="mt-1 bg-secondary text-secondary-foreground"
            >
                كملوا الإيقاع ✨
            </LanternButton>
        </div>
    );
}


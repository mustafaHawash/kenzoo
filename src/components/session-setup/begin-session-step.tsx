"use client";

import { sessionLengthOptions, themeOptions } from "./setup-content";
import type { StepComponentProps } from "./setup-types";
import { Body, Label, Muted } from "@/components/ui/typography";

export function BeginSessionStep({ setup }: StepComponentProps) {
    const selectedLength = sessionLengthOptions.find(
        (length) => length.id === setup.sessionLengthId,
    );
    const selectedTheme = themeOptions.find((theme) => theme.id === setup.themeId);
    const namedPlayers = setup.players.map((player) => player.name.trim()).filter(Boolean);

    return (
        <div className="relative overflow-hidden rounded-[22px] border border-secondary/12 bg-surface-elevated/32 p-4 text-center shadow-[0_8px_30px_rgba(31,27,24,0.08)] backdrop-blur-md">
            <div className="relative flex flex-col items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full border border-secondary/24 bg-secondary/12 text-2xl">
                    🕯️
                </div>

                <div className="flex flex-col gap-2.5">
                    <Label className="text-secondary">{selectedTheme?.title}</Label>
                    <Body className="text-balance text-lg leading-8 text-foreground">
                        {namedPlayers.length > 0
                            ? `${namedPlayers.join("، ")}... الليلة بتفتح أبوابها.`
                            : "الكل جاهز، والورق مستني يتفتح."}
                    </Body>
                    <Muted className="text-sm leading-6">
                        {selectedLength?.label}، {selectedLength?.rounds} جولات، وسر صغير مستني في آخر الطريق.
                    </Muted>
                </div>
            </div>
        </div>
    );
}


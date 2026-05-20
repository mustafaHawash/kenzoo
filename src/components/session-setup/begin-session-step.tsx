"use client";

import { sessionLengthOptions, themeOptions } from "./setup-content";
import type { SessionSetupState } from "./setup-types";
import { LanternButton } from "@/components/ui/lantern-button";
import { Body, Label, Muted } from "@/components/ui/typography";

export function BeginSessionStep({
    setup,
    onBegin,
}: {
    setup: SessionSetupState;
    onBegin: () => void;
}) {
    const selectedLength = sessionLengthOptions.find(
        (length) => length.id === setup.sessionLengthId,
    );
    const selectedTheme = themeOptions.find((theme) => theme.id === setup.themeId);
    const namedPlayers = setup.players.map((player) => player.name.trim()).filter(Boolean);

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-secondary/16 bg-surface-elevated/32 p-5 text-center shadow-[0_22px_80px_rgba(31,27,24,0.12)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,179,106,0.18),transparent_40%)]" />

            <div className="relative flex flex-col items-center gap-6">
                <div className="flex size-20 items-center justify-center rounded-full border border-secondary/24 bg-secondary/12 text-3xl">
                    🕯️
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-secondary">{selectedTheme?.title}</Label>
                    <Body className="text-balance text-xl leading-9 text-foreground">
                        {namedPlayers.length > 0
                            ? `${namedPlayers.join("، ")}... الليلة بتفتح أبوابها.`
                            : "الكل جاهز، والورق مستني يتفتح."}
                    </Body>
                    <Muted className="text-sm leading-7">
                        {selectedLength?.label}، {selectedLength?.rounds} جولات، وسر صغير مستني في آخر الطريق.
                    </Muted>
                </div>

                <LanternButton
                    type="button"
                    onClick={onBegin}
                    className="min-w-52 bg-secondary text-secondary-foreground"
                >
                    ابدأ الليلة ✨
                </LanternButton>
            </div>
        </div>
    );
}


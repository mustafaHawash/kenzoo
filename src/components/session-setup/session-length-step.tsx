"use client";

import { sessionLengthOptions } from "./setup-content";
import { SessionLengthCard } from "./session-length-card";
import type { SessionLengthDefinition } from "./setup-types";
import { LanternButton } from "@/components/ui/lantern-button";

export function SessionLengthStep({
    selectedLengthId,
    onSelectLength,
}: {
    selectedLengthId: SessionLengthDefinition["id"];
    onSelectLength: (id: SessionLengthDefinition["id"]) => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            {sessionLengthOptions.map((length) => (
                <SessionLengthCard
                    key={length.id}
                    length={length}
                    selected={selectedLengthId === length.id}
                    onSelect={() => onSelectLength(length.id)}
                />
            ))}

            <LanternButton type="submit" className="mt-1 bg-secondary text-secondary-foreground">
                افتحوا باب الحكاية
            </LanternButton>
        </div>
    );
}


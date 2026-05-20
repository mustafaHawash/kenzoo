"use client";

import { sessionLengthOptions } from "./setup-content";
import { SessionLengthCard } from "./session-length-card";
import type { SessionLengthDefinition, StepComponentProps } from "./setup-types";

export function SessionLengthStep({ setup, onSetupChange }: StepComponentProps) {
    const selectedLengthId = setup.sessionLengthId;
    const onSelectLength = (id: SessionLengthDefinition["id"]) => onSetupChange("sessionLengthId", id);
    return (
        <div className="flex flex-col gap-3">
            {sessionLengthOptions.map((length) => (
                <SessionLengthCard
                    key={length.id}
                    length={length}
                    selected={selectedLengthId === length.id}
                    onSelect={() => onSelectLength(length.id)}
                />
            ))}
        </div>
    );
}


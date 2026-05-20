"use client";

import { themeOptions } from "./setup-content";
import { ThemeCard } from "./theme-card";
import type { ThemeDefinition, StepComponentProps } from "./setup-types";

export function ThemeStep({ setup, onSetupChange }: StepComponentProps) {
    const selectedThemeId = setup.themeId;
    const onSelectTheme = (id: ThemeDefinition["id"]) => onSetupChange("themeId", id);
    return (
        <div className="flex flex-col gap-3">
            {themeOptions.map((theme) => (
                <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedThemeId === theme.id}
                    onSelect={() => onSelectTheme(theme.id)}
                />
            ))}
        </div>
    );
}


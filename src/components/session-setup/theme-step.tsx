"use client";

import { themeOptions } from "./setup-content";
import { ThemeCard } from "./theme-card";
import type { ThemeDefinition } from "./setup-types";
import { LanternButton } from "@/components/ui/lantern-button";

export function ThemeStep({
    selectedThemeId,
    onSelectTheme,
}: {
    selectedThemeId: ThemeDefinition["id"];
    onSelectTheme: (id: ThemeDefinition["id"]) => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            {themeOptions.map((theme) => (
                <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedThemeId === theme.id}
                    onSelect={() => onSelectTheme(theme.id)}
                />
            ))}

            <LanternButton type="submit" className="mt-1 bg-secondary text-secondary-foreground">
                جهزوا الليلة
            </LanternButton>
        </div>
    );
}


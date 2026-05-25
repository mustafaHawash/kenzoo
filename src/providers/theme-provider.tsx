"use client";

import * as React from "react";

/**
 * ThemeProvider — lightweight replacement for next-themes.
 *
 * next-themes injects a <script> tag which React 19 rejects:
 * "Scripts inside React components are never executed when rendering on the client."
 *
 * Since Kenzoo uses its own theme system (ThemeAssetPack) and only needs
 * the "light" class on <html>, we apply it directly without any script injection.
 */

function applyTheme() {
    if (typeof document !== "undefined") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    React.useEffect(() => {
        applyTheme();
    }, []);

    return <>{children}</>;
}

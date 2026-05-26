"use client";

import dynamic from "next/dynamic";

/**
 * DeferredMuteButton — Client Component wrapper for GlobalMuteButton.
 *
 * layout.tsx is a Server Component and cannot use dynamic() with ssr: false.
 * This wrapper isolates the dynamic import into a Client Component boundary.
 */
const GlobalMuteButton = dynamic(
    () => import("@/components/ui/global-mute-button").then((m) => m.GlobalMuteButton),
    { ssr: false },
);

export function DeferredMuteButton() {
    return <GlobalMuteButton />;
}

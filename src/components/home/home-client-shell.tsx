"use client";

import dynamic from "next/dynamic";

/**
 * HomeClientShell — Client Component wrapper for deferred home page systems.
 *
 * page.tsx is a Server Component and cannot use dynamic() with ssr: false.
 * This wrapper isolates all dynamic imports into a Client Component boundary.
 */

const HomeAtmosphere = dynamic(
    () => import("@/components/atmosphere/home-atmosphere").then((m) => m.HomeAtmosphere),
    { ssr: false },
);

const HomeSoundtrack = dynamic(
    () => import("@/components/atmosphere/home-soundtrack").then((m) => m.HomeSoundtrack),
    { ssr: false },
);

const KScreen = dynamic(
    () => import("@/components/ui/kenzoo/k-screen").then((m) => m.KScreen),
    { ssr: false },
);

export { HomeAtmosphere, HomeSoundtrack, KScreen };

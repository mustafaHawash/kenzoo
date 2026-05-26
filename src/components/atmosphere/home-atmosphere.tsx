"use client";

import { useEffect, useState } from "react";
import { AmbientGradient } from "./ambient-gradient";
import { LanternGlow } from "./lantern-glow";
import { FloatingParticles } from "./floating-particles";
import { BookHorizon } from "./book-horizon";

/**
 * HomeAtmosphere — deferred atmosphere for the home page.
 *
 * Loaded via dynamic() with ssr: false so it never blocks LCP.
 * Uses CSS animations only (no framer-motion infinite loops).
 */
export function HomeAtmosphere() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Delay appearance slightly so content paints first
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <AmbientGradient />
            <LanternGlow />
            <FloatingParticles />
            <BookHorizon />
        </div>
    );
}

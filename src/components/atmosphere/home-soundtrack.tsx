"use client";

import { useEffect, useRef } from "react";
import { useSoundtrack } from "@/hooks/useSoundtrack";

/**
 * HomeSoundtrack — deferred soundtrack activation.
 *
 * Loaded via dynamic() with ssr: false.
 * Only starts playing after first user interaction (click/tap),
 * NOT on page load. This prevents:
 * - 433KB MP3 download blocking initial load
 * - Autoplay policy violations on mobile
 * - Unnecessary network usage on slow connections
 */
export function HomeSoundtrack() {
    const soundtrack = useSoundtrack();
    const activatedRef = useRef(false);

    useEffect(() => {
        const activateOnInteraction = () => {
            if (activatedRef.current) return;
            activatedRef.current = true;
            soundtrack.play("core", 0.15);
            // Clean up listeners after first activation
            window.removeEventListener("click", activateOnInteraction);
            window.removeEventListener("touchstart", activateOnInteraction);
        };

        window.addEventListener("click", activateOnInteraction, { passive: true });
        window.addEventListener("touchstart", activateOnInteraction, { passive: true });

        return () => {
            window.removeEventListener("click", activateOnInteraction);
            window.removeEventListener("touchstart", activateOnInteraction);
        };
    }, [soundtrack]);

    return null;
}

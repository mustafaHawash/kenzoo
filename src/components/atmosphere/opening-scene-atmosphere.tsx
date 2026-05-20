"use client";

import { AmbientGradient } from "./ambient-gradient";
import { LanternGlow } from "./lantern-glow";
import { FloatingParticles } from "./floating-particles";
import { BookHorizon } from "./book-horizon";

export function OpeningSceneAtmosphere() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <AmbientGradient />
            <LanternGlow />
            <FloatingParticles />
            <BookHorizon />
        </div>
    );
}

export { FloatingParticles, LanternGlow };

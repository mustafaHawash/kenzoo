"use client";

import { cn } from "@/lib/utils";

/* Reduced to 3 particles — sufficient atmosphere, less GPU cost */
const particlePositions = [
    { pos: "right-[15%] top-[20%]", delay: "0s" },
    { pos: "left-[18%] top-[28%]", delay: "2s" },
    { pos: "left-[30%] bottom-[22%]", delay: "4s" },
];

/**
 * FloatingParticles — CSS-only particle animation.
 *
 * Replaced framer-motion infinite loops with CSS keyframes.
 * Same visual effect, zero JS runtime cost.
 */
export function FloatingParticles() {
    return (
        <div aria-hidden className="absolute inset-0">
            {particlePositions.map((particle, index) => (
                <span
                    key={index}
                    className={cn(
                        "absolute block size-1.5 rounded-full bg-secondary/70 shadow-[0_0_18px_rgba(216,179,106,0.65)]",
                        "sm:size-2",
                        "animate-[particleFloat_6s_ease-in-out_infinite]",
                        particle.pos,
                    )}
                    style={{ animationDelay: particle.delay }}
                />
            ))}
        </div>
    );
}

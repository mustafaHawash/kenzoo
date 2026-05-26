
"use client";

import Image from "next/image";
import { stickerAssets } from "@/assets";

/**
 * KenzooMascot — Kenzoo sitting naturally on the home page.
 *
 * Shows the character in his iconic "think and drink" pose,
 * placed in the bottom-left corner like he's relaxing nearby.
 *
 * Design principles:
 *   - Visible enough to feel his presence (he IS the story)
 *   - Not competing with the main content
 *   - Warm, organic, like a friend sitting next to you
 *   - CSS-only animation for zero JS runtime cost
 */
export function KenzooMascot() {
    const src = stickerAssets.mascot[0]; // think-and-drink — Kenzoo's signature

    return (
        <div
            aria-hidden
            className="
                pointer-events-none
                absolute bottom-8 left-5
                z-20
                animate-[kenzooMascotReveal_1s_ease-out_2s_both]
            "
        >
            <div className="animate-[lanternFloat_7s_ease-in-out_infinite]">
                <Image
                    src={src}
                    alt=""
                    width={110}
                    height={110}
                    sizes="110px"
                    className="
                        object-contain
                        opacity-[0.35]
                        drop-shadow-[0_4px_16px_rgba(216,179,106,0.15)]
                        dark:opacity-[0.25]
                        select-none
                    "
                    draggable={false}
                />
            </div>
        </div>
    );
}

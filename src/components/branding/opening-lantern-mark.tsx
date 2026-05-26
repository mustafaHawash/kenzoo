import Image from "next/image";
import { iconAssets } from "@/assets";

/**
 * OpeningLanternMark — Server Component with CSS-only animation.
 *
 * Replaced framer-motion with CSS keyframes.
 * No "use client" needed — this is now a Server Component.
 * The floating effect uses CSS animation (zero JS runtime cost).
 */
export function OpeningLanternMark() {
    return (
        <div className="relative flex h-48 w-48 items-center justify-center">
            <div className="relative h-48 w-48 animate-[lanternFloat_4.8s_ease-in-out_infinite]">
                <Image
                    src={iconAssets.logoMark}
                    alt="Kenzoo Logo"
                    width={200}
                    height={200}
                    priority
                    sizes="192px"
                    className="object-contain drop-shadow-[0_8px_32px_rgba(216,179,106,0.3)]"
                />
            </div>
        </div>
    );
}

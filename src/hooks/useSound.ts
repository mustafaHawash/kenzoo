
"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * useSound — lightweight audio playback hook with soundtrack ducking.
 *
 * Creates an Audio instance lazily on first play.
 * Caches the Audio object for subsequent plays.
 * Cleans up on unmount.
 *
 * DUCKING: When SFX plays, the soundtrack volume is temporarily
 * reduced so the SFX is clearly audible. After the SFX finishes,
 * the soundtrack fades back to its original volume.
 *
 * @param src - Path to the audio file (relative to /public)
 * @param options - Optional volume (0–1)
 */
export function useSound(
    src: string,
    options?: { volume?: number },
) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const volume = options?.volume ?? 0.6;

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const play = useCallback(() => {
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio(src);
            }
            audioRef.current.volume = volume;
            // Reset to start if already playing
            audioRef.current.currentTime = 0;

            // ─── Duck the soundtrack while SFX plays ───
            // Dispatch a custom event that useSoundtrack listens to.
            // This temporarily lowers the soundtrack volume so the SFX
            // is clearly audible without competing with background music.
            window.dispatchEvent(new CustomEvent("kenzoo:sfx-start"));

            audioRef.current.play().catch(() => {
                // Autoplay blocked — silently ignore.
                window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
            });

            // When SFX ends, restore soundtrack volume
            const restoreOnEnd = () => {
                window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
                audioRef.current?.removeEventListener("ended", restoreOnEnd);
            };
            audioRef.current.addEventListener("ended", restoreOnEnd);

            // Safety: restore after 3 seconds max (in case ended doesn't fire)
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
            }, 3000);
        } catch {
            // Audio not supported — silently ignore
            window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
        }
    }, [src, volume]);

    return { play };
}

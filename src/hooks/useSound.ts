
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
            const audio = audioRef.current;
            audio.volume = volume;
            // Reset to start if already playing
            audio.currentTime = 0;

            // Track whether we already dispatched sfx-end to avoid double restore
            let hasDispatchedEnd = false;

            const dispatchSfxEnd = () => {
                if (hasDispatchedEnd) return;
                hasDispatchedEnd = true;
                window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
            };

            // ─── Duck the soundtrack while SFX plays ───
            window.dispatchEvent(new CustomEvent("kenzoo:sfx-start"));

            audio.play().catch(() => {
                // Autoplay blocked — silently ignore.
                dispatchSfxEnd();
            });

            // When SFX ends, restore soundtrack volume
            const restoreOnEnd = () => {
                dispatchSfxEnd();
                audio.removeEventListener("ended", restoreOnEnd);
            };
            audio.addEventListener("ended", restoreOnEnd);

            // Safety: restore after 4 seconds max (in case ended doesn't fire)
            // This covers long SFX files and edge cases where the ended event
            // is never dispatched (e.g., audio element removed from DOM).
            setTimeout(dispatchSfxEnd, 4000);
        } catch {
            // Audio not supported — silently ignore
            window.dispatchEvent(new CustomEvent("kenzoo:sfx-end"));
        }
    }, [src, volume]);

    return { play };
}

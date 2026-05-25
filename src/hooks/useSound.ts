
"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * useSound — lightweight audio playback hook.
 *
 * Creates an Audio instance lazily on first play.
 * Caches the Audio object for subsequent plays.
 * Cleans up on unmount.
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
            audioRef.current.play().catch(() => {
                // Autoplay blocked — silently ignore.
                // User interaction is required for first play in most browsers.
            });
        } catch {
            // Audio not supported — silently ignore
        }
    }, [src, volume]);

    return { play };
}

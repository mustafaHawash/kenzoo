
"use client";

import { useCallback, useRef, useEffect } from "react";
import { soundtrackAssets } from "@/assets/soundAssets";
import type { SoundtrackLayer } from "@/assets/types";

/**
 * useSoundtrack — centralized soundtrack manager.
 *
 * Manages 3 looping audio layers:
 *   - core: global background music (always available)
 *   - gameplay: theme-specific loop during active play
 *   - ceremony: plays ONLY during the ending ceremony
 *
 * Features:
 *   - Smooth fade transitions between layers
 *   - No overlapping tracks (only one layer active at a time)
 *   - Mobile-safe (respects autoplay policies)
 *   - Centralized control via play/stop/switchLayer
 *   - SFX ducking: temporarily lowers volume when SFX plays
 *   - Global mute: respects data-muted attribute and custom events
 */

/* ─── Fade timing constants ─── */
const FADE_DURATION_MS = 1200;       // Crossfade between layers — smooth & cinematic
const FADE_INTERVAL_MS = 40;        // Smoother steps (30 steps vs 16)
const DUCK_FADE_OUT_MS = 300;        // Quick duck when SFX starts
const DUCK_FADE_IN_MS = 900;         // Gentle restore after SFX ends
const DUCK_RESTORE_DELAY_MS = 150;   // Small pause before restoring — lets SFX breathe

type AudioState = {
    audio: HTMLAudioElement;
    isPlaying: boolean;
};

/**
 * Singleton audio state — shared across all hook instances.
 * This prevents multiple hook instances from creating separate Audio elements.
 */
const globalLayers: Record<SoundtrackLayer, AudioState | null> = {
    core: null,
    gameplay: null,
    ceremony: null,
};
let globalActiveLayer: SoundtrackLayer | null = null;
let globalIntendedVolume = 0;

/** Get or create an Audio element for a layer */
function getOrCreateLayer(layer: SoundtrackLayer): HTMLAudioElement {
    const existing = globalLayers[layer];
    if (existing) return existing.audio;

    const src = soundtrackAssets[layer];
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "none";

    globalLayers[layer] = { audio, isPlaying: false };
    return audio;
}

/**
 * Fade audio to target volume with configurable duration.
 * Uses an easing curve (ease-out) for more natural-sounding fades.
 */
function fadeTo(
    audio: HTMLAudioElement,
    targetVolume: number,
    durationMs: number = FADE_DURATION_MS,
): Promise<void> {
    return new Promise((resolve) => {
        const startVolume = audio.volume;
        const volumeDelta = targetVolume - startVolume;

        // Already at target — skip
        if (Math.abs(volumeDelta) < 0.005) {
            audio.volume = targetVolume;
            resolve();
            return;
        }

        const steps = Math.max(1, Math.round(durationMs / FADE_INTERVAL_MS));
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                audio.volume = targetVolume;
                clearInterval(interval);
                resolve();
                return;
            }
            // Ease-out curve: fast start, gentle finish
            const progress = currentStep / steps;
            const eased = 1 - Math.pow(1 - progress, 2);
            audio.volume = Math.max(0, Math.min(1, startVolume + volumeDelta * eased));
        }, FADE_INTERVAL_MS);
    });
}

/** Check if global mute is active */
function isGloballyMuted(): boolean {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-muted") === "true";
}

// ─── Set up global event listeners once ───
if (typeof window !== "undefined") {
    // Mute toggle
    window.addEventListener("kenzoo:mute-toggle", ((e: Event) => {
        const { muted } = (e as CustomEvent).detail;
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            fadeTo(state.audio, muted ? 0 : globalIntendedVolume);
        }
    }) as EventListener);

    // SFX ducking — quick fade out, gentle delayed fade in
    window.addEventListener("kenzoo:sfx-start", () => {
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            fadeTo(state.audio, globalIntendedVolume * 0.15, DUCK_FADE_OUT_MS);
        }
    });

    window.addEventListener("kenzoo:sfx-end", () => {
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            // Small delay before restoring — lets the SFX tail breathe
            setTimeout(() => {
                // Re-check: don't restore if another SFX started in the meantime
                if (!globalActiveLayer) return;
                const currentState = globalLayers[globalActiveLayer];
                if (currentState?.isPlaying) {
                    fadeTo(currentState.audio, globalIntendedVolume, DUCK_FADE_IN_MS);
                }
            }, DUCK_RESTORE_DELAY_MS);
        }
    });
}

export function useSoundtrack() {
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    /** Play a specific layer with fade-in */
    const play = useCallback(async (layer: SoundtrackLayer, volume: number = 0.3) => {
        // If globally muted, don't play
        if (isGloballyMuted()) return;

        // Remember intended volume for ducking restore
        globalIntendedVolume = volume;

        // If same layer is already playing, just adjust volume
        if (globalActiveLayer === layer) {
            const state = globalLayers[layer];
            if (state?.isPlaying) {
                await fadeTo(state.audio, volume);
                return;
            }
        }

        // Fade out current layer first
        if (globalActiveLayer) {
            const current = globalLayers[globalActiveLayer];
            if (current?.isPlaying) {
                await fadeTo(current.audio, 0);
                current.audio.pause();
                current.isPlaying = false;
            }
        }

        // Start new layer
        const audio = getOrCreateLayer(layer);
        audio.volume = 0;

        try {
            await audio.play();
            const state = globalLayers[layer];
            if (state) state.isPlaying = true;
            globalActiveLayer = layer;
            await fadeTo(audio, volume);
        } catch {
            // Autoplay blocked — will play on next user interaction
        }
    }, []);

    /** Stop the current layer with fade-out */
    const stop = useCallback(async () => {
        if (!globalActiveLayer) return;

        const current = globalLayers[globalActiveLayer];
        if (current?.isPlaying) {
            await fadeTo(current.audio, 0);
            current.audio.pause();
            current.isPlaying = false;
        }
        globalActiveLayer = null;
    }, []);

    /** Switch to a different layer with crossfade */
    const switchLayer = useCallback(async (layer: SoundtrackLayer, volume: number = 0.3) => {
        await play(layer, volume);
    }, [play]);

    /** Set volume of the active layer */
    const setVolume = useCallback(async (volume: number) => {
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            globalIntendedVolume = volume;
            await fadeTo(state.audio, volume);
        }
    }, []);

    return { play, stop, switchLayer, setVolume };
}

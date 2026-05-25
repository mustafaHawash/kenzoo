
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

const FADE_DURATION_MS = 800;
const FADE_INTERVAL_MS = 50;

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
    audio.preload = "auto";

    globalLayers[layer] = { audio, isPlaying: false };
    return audio;
}

/** Fade audio to target volume */
function fadeTo(audio: HTMLAudioElement, targetVolume: number): Promise<void> {
    return new Promise((resolve) => {
        const startVolume = audio.volume;
        const volumeDelta = targetVolume - startVolume;
        const steps = FADE_DURATION_MS / FADE_INTERVAL_MS;
        const volumeStep = volumeDelta / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                audio.volume = targetVolume;
                clearInterval(interval);
                resolve();
                return;
            }
            audio.volume = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));
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

    // SFX ducking
    window.addEventListener("kenzoo:sfx-start", () => {
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            fadeTo(state.audio, globalIntendedVolume * 0.1);
        }
    });

    window.addEventListener("kenzoo:sfx-end", () => {
        if (!globalActiveLayer) return;
        const state = globalLayers[globalActiveLayer];
        if (state?.isPlaying) {
            fadeTo(state.audio, globalIntendedVolume);
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

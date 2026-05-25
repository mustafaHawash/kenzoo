
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
 */

const FADE_DURATION_MS = 800;
const FADE_INTERVAL_MS = 50;

type AudioState = {
    audio: HTMLAudioElement;
    isPlaying: boolean;
};

export function useSoundtrack() {
    const layersRef = useRef<Record<SoundtrackLayer, AudioState | null>>({
        core: null,
        gameplay: null,
        ceremony: null,
    });
    const activeLayerRef = useRef<SoundtrackLayer | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            // Cleanup all audio on unmount
            for (const key of Object.keys(layersRef.current) as SoundtrackLayer[]) {
                const state = layersRef.current[key];
                if (state) {
                    state.audio.pause();
                    state.audio.src = "";
                    layersRef.current[key] = null;
                }
            }
        };
    }, []);

    /** Get or create an Audio element for a layer */
    const getOrCreateLayer = useCallback((layer: SoundtrackLayer): HTMLAudioElement => {
        const existing = layersRef.current[layer];
        if (existing) return existing.audio;

        const src = soundtrackAssets[layer];
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0;
        audio.preload = "auto";

        layersRef.current[layer] = { audio, isPlaying: false };
        return audio;
    }, []);

    /** Fade audio to target volume over FADE_DURATION_MS */
    const fadeTo = useCallback((audio: HTMLAudioElement, targetVolume: number): Promise<void> => {
        return new Promise((resolve) => {
            const startVolume = audio.volume;
            const volumeDelta = targetVolume - startVolume;
            const steps = FADE_DURATION_MS / FADE_INTERVAL_MS;
            const volumeStep = volumeDelta / steps;
            let currentStep = 0;

            const interval = setInterval(() => {
                currentStep++;
                if (!isMountedRef.current || currentStep >= steps) {
                    audio.volume = targetVolume;
                    clearInterval(interval);
                    resolve();
                    return;
                }
                audio.volume = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));
            }, FADE_INTERVAL_MS);
        });
    }, []);

    /** Play a specific layer with fade-in */
    const play = useCallback(async (layer: SoundtrackLayer, volume: number = 0.3) => {
        // If same layer is already playing, just adjust volume
        if (activeLayerRef.current === layer) {
            const state = layersRef.current[layer];
            if (state?.isPlaying) {
                await fadeTo(state.audio, volume);
                return;
            }
        }

        // Fade out current layer first
        if (activeLayerRef.current) {
            const current = layersRef.current[activeLayerRef.current];
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
            const state = layersRef.current[layer];
            if (state) state.isPlaying = true;
            activeLayerRef.current = layer;
            await fadeTo(audio, volume);
        } catch {
            // Autoplay blocked — will play on next user interaction
        }
    }, [getOrCreateLayer, fadeTo]);

    /** Stop the current layer with fade-out */
    const stop = useCallback(async () => {
        if (!activeLayerRef.current) return;

        const current = layersRef.current[activeLayerRef.current];
        if (current?.isPlaying) {
            await fadeTo(current.audio, 0);
            current.audio.pause();
            current.isPlaying = false;
        }
        activeLayerRef.current = null;
    }, [fadeTo]);

    /** Switch to a different layer with crossfade */
    const switchLayer = useCallback(async (layer: SoundtrackLayer, volume: number = 0.3) => {
        await play(layer, volume);
    }, [play]);

    /** Set volume of the active layer */
    const setVolume = useCallback(async (volume: number) => {
        if (!activeLayerRef.current) return;
        const state = layersRef.current[activeLayerRef.current];
        if (state?.isPlaying) {
            await fadeTo(state.audio, volume);
        }
    }, [fadeTo]);

    return { play, stop, switchLayer, setVolume };
}

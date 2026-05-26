/**
 * Audio Manager — Centralized Audio Resource Management
 *
 * Manages all audio instances to prevent memory leaks.
 * Provides:
 * - Lazy loading of audio assets
 * - Automatic cleanup on page visibility change
 * - Mobile-safe audio activation
 * - Memory leak prevention
 *
 * Architecture:
 * - Singleton pattern — one manager per app lifecycle
 * - AudioContext created only on first user interaction
 * - All audio instances tracked and cleaned up
 * - Respects page visibility (pauses when tab is hidden)
 */

type AudioEntry = {
    audio: HTMLAudioElement;
    layer: string;
    isPlaying: boolean;
};

class AudioManager {
    private entries: Map<string, AudioEntry> = new Map();
    private audioContext: AudioContext | null = null;
    private contextResumed = false;

    /* ─── AudioContext — created lazily on first interaction ─── */
    getAudioContext(): AudioContext | null {
        if (typeof window === "undefined") return null;
        if (!this.audioContext) {
            try {
                this.audioContext = new AudioContext();
            } catch {
                return null;
            }
        }
        return this.audioContext;
    }

    /* ─── Resume AudioContext on first user interaction (mobile requirement) ─── */
    async resumeOnInteraction(): Promise<void> {
        if (this.contextResumed) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        if (ctx.state === "suspended") {
            await ctx.resume();
        }
        this.contextResumed = true;
    }

    /* ─── Register an audio instance ─── */
    register(layer: string, audio: HTMLAudioElement): void {
        // Clean up existing entry for this layer
        const existing = this.entries.get(layer);
        if (existing) {
            existing.audio.pause();
            existing.audio.src = "";
        }

        this.entries.set(layer, { audio, layer, isPlaying: false });
    }

    /* ─── Unregister and clean up an audio instance ─── */
    unregister(layer: string): void {
        const entry = this.entries.get(layer);
        if (entry) {
            entry.audio.pause();
            entry.audio.src = "";
            this.entries.delete(layer);
        }
    }

    /* ─── Pause all audio (e.g., when tab is hidden) ─── */
    pauseAll(): void {
        for (const entry of this.entries.values()) {
            if (entry.isPlaying) {
                entry.audio.pause();
                entry.isPlaying = false;
            }
        }
    }

    /* ─── Clean up all audio instances (prevent memory leaks) ─── */
    cleanup(): void {
        for (const entry of this.entries.values()) {
            entry.audio.pause();
            entry.audio.removeAttribute("src");
            entry.audio.load();
        }
        this.entries.clear();

        if (this.audioContext) {
            this.audioContext.close().catch(() => {});
            this.audioContext = null;
            this.contextResumed = false;
        }
    }

    /* ─── Get an entry ─── */
    get(layer: string): AudioEntry | undefined {
        return this.entries.get(layer);
    }

    /* ─── Update playing state ─── */
    setPlaying(layer: string, isPlaying: boolean): void {
        const entry = this.entries.get(layer);
        if (entry) {
            entry.isPlaying = isPlaying;
        }
    }
}

/* ─── Singleton instance ─── */
let instance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
    if (!instance) {
        instance = new AudioManager();

        // Pause all audio when tab is hidden (saves battery & CPU)
        if (typeof document !== "undefined") {
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    instance!.pauseAll();
                }
            });
        }

        // Cleanup on page unload
        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () => {
                instance!.cleanup();
            });
        }
    }
    return instance;
}

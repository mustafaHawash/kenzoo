
import type { StationType } from "@/types/station";

/**
 * Display metadata for each station type.
 * Shared across gameplay components.
 *
 * Egyptian Arabic labels — warm, conversational tone.
 */
export const stationTypeMeta: Record<StationType, { emoji: string; label: string }> = {
    quiz: { emoji: "🤔", label: "سيــن وجيــم" },
    riddle: { emoji: "🗝️", label: "فـزورة .. حــزورة" },
    guess: { emoji: "💭", label: "يا ترى هتفتكر؟" },
    memory: { emoji: "📖", label: "ذكـرى حلـوة" },
    puzzle: { emoji: "🧩", label: "لغـز خفيـف" },
    treasure: { emoji: "🎁", label: "كــنز" },
    mystery: { emoji: "🔮", label: "اكتشف الغامض" },
    story: { emoji: "🕯️", label: "حكاية وروايـة" },
};

"use client";

/**
 * Error Boundary — Hydration & Runtime Failure Recovery
 *
 * Catches:
 * - Hydration mismatches
 * - Chunk load failures
 * - Runtime errors
 *
 * Provides retry UI instead of blank screen.
 */

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main
            dir="rtl"
            className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="text-4xl">🏮</div>
                <h1 className="text-xl font-bold text-foreground">
                    حاجة حصلت غريبة...
                </h1>
                <p className="max-w-xs text-balance text-sm leading-7 text-muted-foreground">
                    ممكن نحاول تاني؟ لو المشكلة فضلت، جوز تقفل التطبيق و تفتحه من جديد.
                </p>
                <button
                    onClick={reset}
                    className="rounded-2xl border border-secondary/30 bg-secondary/15 px-8 py-3 text-base font-medium text-secondary transition-all hover:bg-secondary/25"
                >
                    حاول تاني
                </button>
            </div>
        </main>
    );
}

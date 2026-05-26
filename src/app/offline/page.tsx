"use client";

/**
 * Offline Fallback Page — PWA Preparation
 *
 * Shown when the user is offline and tries to navigate
 * to a route that isn't cached. Provides a warm, Kenzoo-branded
 * experience even without connectivity.
 */
export default function OfflinePage() {
    return (
        <main
            dir="rtl"
            className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="text-5xl">🏮</div>
                <h1 className="text-2xl font-bold text-foreground">
                    مفيش اتصال
                </h1>
                <p className="max-w-xs text-balance text-sm leading-7 text-muted-foreground">
                    الليلة هادية... بس محتاجين نتصل بالنت عشان نكمل الرحلة.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-2xl border border-secondary/30 bg-secondary/15 px-8 py-3 text-base font-medium text-secondary transition-all hover:bg-secondary/25"
                >
                    حاول تاني
                </button>
            </div>
        </main>
    );
}

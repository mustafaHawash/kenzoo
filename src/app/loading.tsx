/**
 * App-level Loading State — Loading Failure Recovery
 *
 * Shown during route transitions. If loading takes longer than 6s,
 * a retry option appears. This prevents permanent loading states
 * on slow connections or when JS chunks fail to load.
 */
"use client";

import { useEffect, useState } from "react";

const RETRY_TIMEOUT_MS = 6000;

export default function AppLoading() {
    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowRetry(true), RETRY_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main
            dir="rtl"
            className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary/70" />
                {showRetry && (
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        بيأخذ وقت... اضغط هنا عشان تحاول تاني
                    </button>
                )}
            </div>
        </main>
    );
}

/**
 * LoadingFallback — lightweight placeholder for dynamic imports.
 *
 * Used as the `loading` component in next/dynamic() calls.
 * Zero dependencies, no framer-motion, no images.
 * Just a subtle pulse to indicate content is loading.
 */
export function LoadingFallback({ className }: { className?: string }) {
    return (
        <div
            className={className}
            aria-hidden="true"
        >
            <div className="animate-pulse rounded-xl bg-foreground/5" />
        </div>
    );
}

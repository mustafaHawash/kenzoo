



export function BookHorizon() {
    return (
        <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 flex justify-center animate-[bookReveal_1s_ease-out_0.35s_both]"
        >
            <div 
                className="relative h-32 w-[min(92vw,34rem)] overflow-hidden animate-[bookFloat_8s_ease-in-out_infinite]"
            >
                <div className="absolute bottom-0 right-1/2 h-24 w-1/2 origin-bottom-left -skew-y-6 rounded-tl-[3rem] border-t border-secondary/16 bg-linear-to-bl from-surface-elevated/40 to-primary/12" />
                <div className="absolute bottom-0 left-1/2 h-24 w-1/2 origin-bottom-right skew-y-6 rounded-tr-[3rem] border-t border-secondary/16 bg-linear-to-br from-surface-elevated/40 to-primary/12" />
                <div className="absolute bottom-3 left-1/2 h-20 w-px -translate-x-1/2 bg-secondary/18" />
            </div>
        </div>
    );
}

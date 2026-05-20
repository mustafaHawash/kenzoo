"use client";

import { avatarOptions } from "./setup-content";
import { cn } from "@/lib/utils";

export function PlayerAvatarPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (avatar: string) => void;
}) {
    return (
        <div className="grid grid-cols-4 gap-2" aria-label="اختيار الرمز">
            {avatarOptions.map((avatar) => {
                const isSelected = avatar === value;

                return (
                    <button
                        key={avatar}
                        type="button"
                        onClick={() => onChange(avatar)}
                        className={cn(
                            "flex aspect-square items-center justify-center rounded-2xl border text-xl",
                            "transition-all duration-(--duration-normal) ease-(--ease-soft)",
                            isSelected
                                ? "border-secondary/55 bg-secondary/18 shadow-[0_0_20px_rgba(216,179,106,0.16)]"
                                : "border-secondary/12 bg-surface-elevated/28 hover:border-secondary/28 hover:bg-surface-elevated/42",
                        )}
                    >
                        {avatar}
                    </button>
                );
            })}
        </div>
    );
}


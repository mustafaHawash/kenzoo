import * as React from "react";

import { cn } from "@/lib/utils";

function Display({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "text-display-lg",

                className,
            )}
            {...props}
        />
    );
}

function Headline({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-headline-md",

                className,
            )}
            {...props}
        />
    );
}

function Body({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "text-body-md",

                className,
            )}
            {...props}
        />
    );
}

function Muted({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "text-body-md",
                "text-muted-foreground",

                className,
            )}
            {...props}
        />
    );
}

function Label({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "text-label-md",

                className,
            )}
            {...props}
        />
    );
}

export { Display, Headline, Body, Muted, Label };

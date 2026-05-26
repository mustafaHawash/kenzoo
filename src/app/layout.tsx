import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { IBM_Plex_Sans_Arabic, Alexandria, Literata } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { DeferredMuteButton } from "@/components/ui/deferred-mute-button";

const alexandria = Alexandria({
    subsets: ["arabic"],
    variable: "--font-alexandria",
});

const literata = Literata({
    subsets: ["latin"],
    variable: "--font-literata",
});

const plex = IBM_Plex_Sans_Arabic({
    weight: ["400", "500", "600"],
    subsets: ["arabic"],
    variable: "--font-plex",
});

export const metadata: Metadata = {
    title: "Kenzoo",
    description:
        "A cozy magical social game for shared moments, playful discovery, and warm mystery.",
    manifest: "/manifest.json",
    themeColor: "#d8b36a",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='ar'
            dir='rtl'
            suppressHydrationWarning
            className={cn(
                "dark",
                "h-full",
                "overflow-x-hidden",
                "antialiased",
                alexandria.variable,
                literata.variable,
                plex.variable,
                "font-sans",
            )}
        >
            <body className={cn("h-full overflow-x-hidden flex flex-col bg-background text-foreground")}>
                <ThemeProvider>
                    {children}
                    <DeferredMuteButton />
                </ThemeProvider>
            </body>
        </html>
    );
}

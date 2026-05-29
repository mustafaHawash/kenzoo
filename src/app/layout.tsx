import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { IBM_Plex_Sans_Arabic, Alexandria, Literata } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { DeferredMuteButton } from "@/components/ui/deferred-mute-button";
import { Analytics } from '@vercel/analytics/next';


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
    /* ─── Title & Description — Arabic SEO ─── */
    title: {
        default: "كـنزو | تجمع الكبار والصغار",
        template: "%s | كـنزو",
    },
    description:
        "لعبة اجتماعية هادئة وممتعة للأصدقاء والعيلة الكبار والصغار معاً — اختيارات غامضة، ذكريات جميلة، ولحظات مشتركة هتخليكم أقرب.",

    /* ─── PWA ─── */
    manifest: "/manifest.json",

    /* ─── Favicon ─── */
    icons: {
        icon: [
            { url: "/FavIcon.ico", sizes: "any" },
            { url: "/Logo-PNG.webp", type: "image/webp", sizes: "512x512" },
        ],
        apple: "/Logo-PNG.webp",
    },

    /* ─── Open Graph — Social Sharing ─── */
    openGraph: {
        type: "website",
        locale: "ar_EG",
        siteName: "كـنزو",
        title: "كـنزو | تجمع الكبار والصغار",
        description:
            "لعبة اجتماعية هادئة وممتعة للأصدقاء والعيلة الكبار والصغار معاً — اختيارات غامضة، ذكريات جميلة، ولحظات مشتركة هتخليكم أقرب.",
        images: [
            {
                url: "/Logo-PNG.webp",
                width: 512,
                height: 512,
                alt: "كـنزو | تجمع الكبار والصغار",
            },
        ],
    },

    /* ─── Twitter Card ─── */
    twitter: {
        card: "summary",
        title: "كـنزو | تجمع الكبار والصغار",
        description:
            "لعبة اجتماعية هادئة وممتعة للأصدقاء والعيلة الكبار والصغار معاً — اختيارات غامضة، ذكريات جميلة، ولحظات مشتركة هتخليكم أقرب.",
        images: ["/Logo-PNG.webp"],
    },

    /* ─── Additional SEO ─── */
    keywords: [
        "كنزو",
        "لعبة اجتماعية",
        "لعبة أصدقاء",
        "لعبة عيلة",
        "لحظات دافئة",
        "ألعاب جماعية",
        "ألعاب حفلات",
        "kenzoo",
        "social game",
        "party game",
    ],
    authors: [{ name: "Kenzoo" }],
    creator: "Kenzoo",
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#d8b36a",
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
                <Analytics />

            </body>
        </html>
    );
}

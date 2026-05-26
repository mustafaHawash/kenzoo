import Link from "next/link";

import { OpeningLanternMark } from "@/components/branding/opening-lantern-mark";
import { LanternButton } from "@/components/ui/lantern-button";
import { Body, Muted } from "@/components/ui/typography";
import { HomeAtmosphere, HomeSoundtrack, KScreen } from "@/components/home/home-client-shell";

export default function HomePage() {
    return (
        <KScreen scene="home" contentClassName="max-w-xl items-center justify-center px-6 py-10 text-center">
            {/* Atmosphere - deferred, non-blocking */}
            <HomeAtmosphere />

            {/* Main content - server-rendered, no motion */}
            <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex min-h-[72dvh] w-full flex-col items-center justify-center gap-7">
                    <OpeningLanternMark />

                    <div className="flex flex-col items-center gap-4">
                        <Body className="max-w-[18rem] text-balance text-foreground/82 sm:max-w-sm sm:text-body-lg">
                         الليلة هادية... والكتاب مستني صاحب الحكاية يفتح
                         <span className="font-bold text-primary"> كـنزو</span>.
                        </Body>
                    </div>

                    <div className="flex w-full flex-col items-center gap-3">
                        <LanternButton asChild className="min-w-56 border border-secondary/30 bg-secondary/15 px-10 py-3 text-base text-secondary shadow-[0_0_34px_rgba(216,179,106,0.15)] backdrop-blur-md transition-all duration-300 hover:bg-secondary/25 hover:shadow-[0_0_42px_rgba(216,179,106,0.25)]">
                            <Link href="/session/setup">جهز الرحلة</Link>
                        </LanternButton>

                        <Link
                            href="/how-to-play"
                            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground/70 transition-colors duration-300 hover:text-foreground/90 focus-visible:outline-none"
                        >
                            العب ازاي؟
                            <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-foreground/30 transition-all duration-300 group-hover:w-3/4" />
                        </Link>
                    </div>

                    <div>
                        <Muted className="max-w-[16rem] text-xs leading-6 text-muted-foreground/72">
                            جلسة صغيرة، اختيارات غامضة، وذكريات جميلة بينكم.
                        </Muted>
                    </div>
                </div>
            </section>

            {/* Soundtrack - deferred until interaction */}
            <HomeSoundtrack />
        </KScreen>
    );
}

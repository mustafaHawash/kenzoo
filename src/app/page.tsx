import { AmbientBackground } from "@/components/atmosphere/ambient-background";
import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { ScreenContainer } from "@/components/ui/layout/screen-container";

export default function HomePage() {
    return (
        <main className='relative min-h-dvh overflow-hidden bg-background'>
            <AmbientBackground />
            <ScreenContainer>
                <CozyCard>
                    <h1 className='text-headline-md'>يا ألف أهلا وسهلاً</h1>

                    <p className='mt-2 text-body-md text-muted-foreground'>
                        جاهز تتبسط!
                    </p>
                    <LanternButton>ابدأ</LanternButton>
                </CozyCard>
            </ScreenContainer>
        </main>
    );
}

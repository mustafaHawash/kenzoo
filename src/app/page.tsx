"use client";
import { AmbientBackground } from "@/components/atmosphere/ambient-background";
import { StationCard } from "@/components/game/StationCard";
import {
    CozyCard,
    CozyCardContent,
    CozyCardFooter,
    CozyCardHeader,
} from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { Headline, Muted } from "@/components/ui/typography";

export default function HomePage() {
    return (
        <main className='relative min-h-dvh overflow-hidden bg-background'>
            <ScreenContainer>
                <CozyCard>
                    <CozyCardHeader>
                        <Headline>أهلا بك في كنزو</Headline>
                        <Muted>رحلة ممتعة ومثمرة</Muted>
                    </CozyCardHeader>
                    <CozyCardContent>
                    </CozyCardContent>
                </CozyCard>
            </ScreenContainer>
        </main>
    );
}

"use client";
import {
    CozyCard,
    CozyCardContent,
    CozyCardHeader,
} from "@/components/ui/cozy-card";
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

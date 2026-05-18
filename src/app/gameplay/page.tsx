// src/app/gameplay/page.tsx
"use client";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { StationCard } from "@/components/game/StationCard";
import { Headline, Body, Display } from "@/components/ui/typography";
import { eidQuizStations } from "@/content/themes/eid-el-adha/quiz";
import { eidRiddleStations } from "@/content/themes/eid-el-adha/riddles";
import type { Station } from "@/types/station";

const STATIONS: Station[] = [...eidQuizStations, ...eidRiddleStations];

export default function GameplayScreen() {
    const handleStationSelect = (id: string) => {
        console.log("Selected:", id);
    };

    return (
        <ScreenContainer className='gap-6'>
            {/* Header Section: Mimicking the "Circle of Friends" vibe */}
            <header className='flex flex-col items-center text-center gap-2 mb-4'>
                <Headline className='text-foreground text-2xl font-bold'>
                    دورك يا <span className='text-amber-500'>{"اسم اللاعب"}</span>
                </Headline>
            </header>

            {/* Stations List */}
            <div className='flex flex-col gap-4'>
                {STATIONS.map((station) => (
                    <StationCard
                        key={station.id}
                        station={station}
                        onClick={handleStationSelect}
                    />
                ))}
            </div>
        </ScreenContainer>
    );
}

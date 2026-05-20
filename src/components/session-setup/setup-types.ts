export type SetupStep = "players" | "length" | "theme" | "begin";

export type SetupPlayerAgeGroup = "adult" | "kid";

export type GenerationTransitionStatus = "idle" | "preparing" | "ready";

export type SetupPlayer = {
    id: string;
    name: string;
    avatar: string;
    ageGroup: SetupPlayerAgeGroup;
};

export type SessionLengthDefinition = {
    id: "short" | "normal" | "long";
    label: string;
    rounds: number;
    mood: string;
    description: string;
};

export type ThemeDefinition = {
    id: "eid-el-adha" | "hijra";
    title: string;
    subtitle: string;
    atmosphere: string;
    status: "available" | "coming-soon";
    accent: string;
};

export type SessionSetupState = {
    players: SetupPlayer[];
    sessionLengthId: SessionLengthDefinition["id"];
    themeId: ThemeDefinition["id"];
};

export type GenerationTransitionState = {
    status: GenerationTransitionStatus;
    phraseIndex: number;
};

export type SetupStepDefinition = {
    id: SetupStep;
    eyebrow: string;
    title: string;
    subtitle: string;
};


import type { ValidationResult } from "./setup-validation";
import type { ComponentType } from "react";

export type SetupStep = "players" | "length" | "theme" | "begin";

export type SetupPlayerAgeGroup = "adult" | "kid";

export type GenerationTransitionStatus = "idle" | "preparing" | "ready";

/** Generation lifecycle phases — future: streaming, retry, validation */
export type GenerationPhase = "idle" | "configuring" | "generating" | "validating" | "ready" | "error";

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

/**
 * Props that every step component receives.
 * Each step owns its own slice of state and reports changes upward.
 */
export type StepComponentProps = {
    setup: SessionSetupState;
    onSetupChange: <K extends keyof SessionSetupState>(
        key: K,
        value: SessionSetupState[K],
    ) => void;
    onBegin?: () => void;
};

/**
 * Data-driven step definition.
 *
 * Each step self-describes its:
 *   - position in the flow (order)
 *   - atmospheric content (eyebrow, title, subtitle)
 *   - orchestration readiness (validate, canContinue)
 *   - rendering (component)
 *   - transition capability (nextStep)
 *
 * Future expansion:
 *   - conditional steps via `enabled` predicate (seasonal, special events)
 *   - AI-assisted setup steps
 *   - dynamic theme flows
 *   - skip conditions for onboarding shortcuts
 */
export type SetupStepDefinition = {
    /** Unique step identifier */
    id: SetupStep;
    /** Sort order — the flow is driven by this, not a hardcoded array */
    order: number;
    /** Atmospheric eyebrow text */
    eyebrow: string;
    /** Step headline */
    title: string;
    /** Step description */
    subtitle: string;
    /** React component that renders this step */
    component: ComponentType<StepComponentProps>;
    /** Validates whether this step is complete and the user can proceed */
    validate: (state: SessionSetupState) => ValidationResult;
    /**
     * Determines if the continue action should be available.
     * Different from validate — a step can be "valid" but not yet "continuable"
     * (e.g., waiting for async check, AI readiness, multiplayer sync).
     * Defaults to validate().isValid if not provided.
     */
    canContinue?: (state: SessionSetupState) => boolean;
    /**
     * Override the next step. Returns a step ID or undefined for default (next in order).
     * Enables conditional flows: skip steps, branch based on state, etc.
     */
    nextStep?: (state: SessionSetupState) => SetupStep | undefined;
    /**
     * Whether this step should appear in the current flow.
     * Enables seasonal onboarding, event-gated steps, etc.
     * Defaults to true (always enabled).
     */
    enabled?: (state: SessionSetupState) => boolean;
};

/** The normalized payload sent to the session generation system */
export type SessionConfigPayload = {
    players: Omit<SetupPlayer, "id">[];
    rounds: number;
    themeId: ThemeDefinition["id"];
    // Future expansion: language, difficulty weights, etc.
};



import React from "react";
import type { Station, StationType } from "@/types/station";

/**
 * Common props every station renderer receives.
 *
 * Each renderer is a pure visual component — it receives
 * interaction state + callbacks and renders its gameplay UI.
 *
 * Renderers do NOT contain gameplay logic.
 * The orchestrator owns answer evaluation, phase transitions, etc.
 */
export interface StationRendererProps {
    /** The station data to render */
    station: Station;

    /** Currently selected choice (for choice-based types) */
    selectedChoice: string | null;

    /** Callback when user selects a choice */
    onSelect: (choice: string) => void;

    /** Current text input value (for text-based types) */
    textInput: string;

    /** Callback when user types in text input */
    onTextInput: (value: string) => void;

    /** Whether the submit button should be enabled */
    canSubmit: boolean;

    /** Callback when user confirms their answer */
    onSubmit: () => void;
}

/**
 * A station renderer is a function component that receives
 * StationRendererProps and renders its gameplay interaction UI.
 */
export type StationRenderer = (props: StationRendererProps) => React.JSX.Element | null;

/**
 * Registry mapping station types to their renderer components.
 * Used by StationInputArea to select the right renderer.
 */
export type StationRendererRegistry = Record<StationType, StationRenderer>;

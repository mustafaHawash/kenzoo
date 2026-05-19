/**
 * Treasure Opportunity — barrel export.
 *
 * This module provides the TreasureOpportunityCard component
 * and re-exports the treasure reward types for convenience.
 */

export { TreasureOpportunityCard } from "./treasure-opportunity-card";

export type { Treasure, TreasureRarity, TreasureRewardType, TreasureRewardDetail } from "@/types/treasure";
export { STARS_REQUIRED_BY_RARITY, pickTreasureByRarity } from "@/types/treasure";

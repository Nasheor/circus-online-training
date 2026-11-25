import { resolveAssumptions } from './assumptions';
import type { AssumptionOverrides } from './assumptions';
import { compute } from './compute';
import { DEFAULT_COUNTRY } from './countries';
import type { CountryId } from './countries';
import { HOUSE_TYPES } from './types';
import type { Assumptions, ProfileInputs, ProfileResults } from './types';

export interface ProfileState {
  inputs: ProfileInputs;
  assumptionOverrides: AssumptionOverrides;
  country?: CountryId;
}

/** Most panels the community's roofs can take: homes of each type × the roof limit for that type. */
export function maxSolarPanels(inputs: ProfileInputs, assumptions: Assumptions): number {
  return HOUSE_TYPES.reduce((total, type) => {
    const homes = inputs.houses[type];
    return total + (homes.gas + homes.hybrid + homes.electric) * assumptions.maxPanelsPerHome[type];
  }, 0);
}

export interface ProfileOutcome {
  assumptions: Assumptions;
  results: ProfileResults;
  /** Roof limit for the panels input. */
  panelLimit: number;
  /** Panels used in the calculation: the entered number, capped at the roof limit. */
  panelsUsed: number;
  /** True when the entered number was above the roof limit and was capped. */
  panelsCapped: boolean;
}

/**
 * The Energy Profile as the app shows it: the country's reference values with
 * the community's own changes, the panels input capped at what the roofs can
 * take, then the workbook model (`compute`, unchanged).
 */
export function computeProfile(state: ProfileState): ProfileOutcome {
  const assumptions = resolveAssumptions(state.assumptionOverrides, state.country ?? DEFAULT_COUNTRY);
  const panelLimit = maxSolarPanels(state.inputs, assumptions);
  const panelsUsed = Math.min(state.inputs.solarPanels, panelLimit);
  const inputs = panelsUsed === state.inputs.solarPanels ? state.inputs : { ...state.inputs, solarPanels: panelsUsed };
  return {
    assumptions,
    results: compute(inputs, assumptions),
    panelLimit,
    panelsUsed,
    panelsCapped: panelsUsed < state.inputs.solarPanels,
  };
}

import type { Assumptions, ProfileInputs } from './types';
import { HEATING_TYPES, HOUSE_TYPES } from './types';

export const ASSUMPTION_SET_ID = 'nl-reference-1.03';

/**
 * Reference values from the Excel workbook "Energy profile tool 1A, version 1.03"
 * (sheets Data - Consumption, Data - Production, Data - Seasonality).
 * They are Dutch reference values; nothing here is country-specific beyond that.
 */
export const NL_REFERENCE: Assumptions = {
  houses: {
    corner: { electricityKwh: 2810, gasM3: 1150 },
    between: { electricityKwh: 2670, gasM3: 980 },
    semiDetached: { electricityKwh: 3160, gasM3: 1350 },
    detached: { electricityKwh: 3990, gasM3: 1770 },
    apartment: { electricityKwh: 1950, gasM3: 710 },
  },
  gasKwhPerM3: 9.77,
  boilerEfficiency: 0.9,
  hybridHeatShare: 0.7,
  electricHeatShare: 1,
  hybridCop: 5,
  electricCop: 5,
  kmPerCar: 12675.77183969024,
  evKwhPerKm: 0.175,
  panelWp: 400,
  kwhPerWp: 0.88,
  windFullLoadHours: 1750,
  seasonality: {
    electricity: [0.11, 0.1, 0.09, 0.08, 0.06, 0.06, 0.06, 0.06, 0.08, 0.09, 0.1, 0.11],
    heating: [0.15, 0.14, 0.12, 0.08, 0.04, 0.04, 0.02, 0.02, 0.04, 0.08, 0.12, 0.15],
    solar: [0.03, 0.05, 0.08, 0.12, 0.13, 0.13, 0.13, 0.11, 0.1, 0.07, 0.03, 0.02],
    wind: [0.13, 0.1, 0.1, 0.07, 0.06, 0.05, 0.05, 0.05, 0.07, 0.1, 0.1, 0.12],
    car: Array.from({ length: 12 }, () => 1 / 12),
  },
};

/** Sparse overrides keyed by a dotted path, e.g. `houses.corner.gasM3` or `seasonality.solar.3`. */
export type AssumptionOverrides = Record<string, number>;

export function resolveAssumptions(overrides: AssumptionOverrides = {}): Assumptions {
  const resolved = structuredClone(NL_REFERENCE);
  for (const [path, value] of Object.entries(overrides)) {
    if (!Number.isFinite(value)) continue;
    const keys = path.split('.');
    let target: any = resolved;
    for (const key of keys.slice(0, -1)) {
      target = target?.[key];
      if (target === undefined || target === null) break;
    }
    const last = keys[keys.length - 1];
    if (target && typeof target[last] === 'number') target[last] = value;
  }
  return resolved;
}

export function readAssumption(assumptions: Assumptions, path: string): number {
  return path.split('.').reduce<any>((value, key) => value?.[key], assumptions) as number;
}

export function emptyInputs(): ProfileInputs {
  const houses = Object.fromEntries(
    HOUSE_TYPES.map((house) => [house, Object.fromEntries(HEATING_TYPES.map((heating) => [heating, 0]))]),
  ) as ProfileInputs['houses'];
  return {
    houses,
    carsPerHousehold: 0,
    evShare: 0,
    solarPanels: 0,
    // The two example turbine models named in the workbook.
    wind: [
      { name: 'WES-50', count: 0, kw: 0 },
      { name: 'EAZ', count: 0, kw: 0 },
    ],
    targets: { reduceElectricity: 0, reduceHeating: 0, evShareTarget: null },
  };
}

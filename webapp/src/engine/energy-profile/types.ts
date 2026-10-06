export const HOUSE_TYPES = ['corner', 'between', 'semiDetached', 'detached', 'apartment'] as const;
export type HouseType = (typeof HOUSE_TYPES)[number];

export const HEATING_TYPES = ['gas', 'hybrid', 'electric'] as const;
export type HeatingType = (typeof HEATING_TYPES)[number];

export const SEASONAL_SERIES = ['electricity', 'heating', 'solar', 'wind', 'car'] as const;
export type SeasonalSeries = (typeof SEASONAL_SERIES)[number];

/** Twelve values, January first. */
export type Monthly = number[];

export interface WindRow {
  name: string;
  count: number;
  kw: number;
}

export interface ProfileInputs {
  /** Number of homes per house type and heating system. */
  houses: Record<HouseType, Record<HeatingType, number>>;
  carsPerHousehold: number;
  /** Share of cars that are fully electric today, 0..1. */
  evShare: number;
  solarPanels: number;
  wind: WindRow[];
  targets: {
    /** Reduction applied to household electricity, 0..1. */
    reduceElectricity: number;
    /** Reduction applied to heat-pump electricity, 0..1. */
    reduceHeating: number;
    /** Target share of fully electric cars, 0..1. `null` keeps today's share. */
    evShareTarget: number | null;
  };
}

export interface Assumptions {
  houses: Record<HouseType, { electricityKwh: number; gasM3: number }>;
  gasKwhPerM3: number;
  boilerEfficiency: number;
  hybridHeatShare: number;
  electricHeatShare: number;
  hybridCop: number;
  electricCop: number;
  kmPerCar: number;
  evKwhPerKm: number;
  panelWp: number;
  kwhPerWp: number;
  windFullLoadHours: number;
  seasonality: Record<SeasonalSeries, Monthly>;
}

export interface SeasonMatch {
  /** Month the match is based on (0 = January). */
  monthIndex: number;
  /** Usage after targets in that month, MWh. */
  usage: number;
  /** Existing production in that month, MWh. */
  production: number;
  /** usage - production, MWh. Positive means a shortfall. */
  shortfall: number;
  /** Yield of one panel in the month used for the division, MWh. */
  perPanelMwh: number;
  /** Month whose per-panel yield was used; differs from monthIndex only when replicating the workbook. */
  yieldMonthIndex: number;
  needed: boolean;
  /** Additional panels needed to close the shortfall. */
  panels: number;
}

export interface ProfileResults {
  households: number;
  cars: number;
  evCars: { current: number; target: number };
  /** All monthly series in MWh. */
  monthly: {
    electricity: Monthly;
    heating: Monthly;
    mobility: Monthly;
    usage: Monthly;
    electricityTarget: Monthly;
    heatingTarget: Monthly;
    mobilityTarget: Monthly;
    usageTarget: Monthly;
    wind: Monthly;
    solar: Monthly;
    production: Monthly;
    summerAddedSolar: Monthly;
    productionSummerMatch: Monthly;
    winterAddedSolar: Monthly;
    productionWinterMatch: Monthly;
  };
  /** All annual figures in MWh per year. */
  annual: {
    electricity: number;
    heating: number;
    mobility: number;
    usage: number;
    electricityTarget: number;
    heatingTarget: number;
    mobilityTarget: number;
    /** "Total usage residential" after targets. */
    residentialTarget: number;
    usageTarget: number;
    wind: number;
    solar: number;
    production: number;
    solarSummerMatch: number;
    productionSummerMatch: number;
    solarWinterMatch: number;
    productionWinterMatch: number;
  };
  summerMatch: SeasonMatch;
  winterMatch: SeasonMatch;
  /** Yearly production divided by yearly usage after targets; null when there is no usage. */
  coverage: number | null;
}

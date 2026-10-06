import { NL_REFERENCE } from './assumptions';
import type { DeviationId } from './deviations';
import { HOUSE_TYPES } from './types';
import type { Assumptions, Monthly, ProfileInputs, ProfileResults, SeasonMatch } from './types';

export interface ComputeOptions {
  /**
   * Deviations to switch off, reproducing the Excel workbook's behaviour for
   * them. Used by the tests; the app always runs with none replicated.
   */
  replicate?: ReadonlySet<DeviationId>;
}

/** Excel ROUND(x, 0): half away from zero, on the 15 significant digits Excel keeps. */
export function excelRound(value: number): number {
  const magnitude = Number(Math.abs(value).toPrecision(15));
  return Math.sign(value) * Math.floor(magnitude + 0.5);
}

const MONTH_INDEXES = Array.from({ length: 12 }, (_, month) => month);
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const perMonth = (fn: (month: number) => number): Monthly => MONTH_INDEXES.map(fn);
const add = (a: Monthly, b: Monthly): Monthly => a.map((value, month) => value + b[month]);

/**
 * The CIRCUS energy profile model (Tool 1A): yearly and monthly electricity
 * use of a community against its local solar and wind production.
 * Cell references in comments point at the workbook's Calculations sheet.
 */
export function compute(
  inputs: ProfileInputs,
  assumptions: Assumptions = NL_REFERENCE,
  options: ComputeOptions = {},
): ProfileResults {
  const replicate = (id: DeviationId) => options.replicate?.has(id) === true;
  const season = assumptions.seasonality;
  const { reduceElectricity, reduceHeating } = inputs.targets;

  // Household electricity, the same for every heating system (rows 3-18).
  const electricityKwhByType = HOUSE_TYPES.map((type) => {
    const homes = inputs.houses[type];
    const usage = assumptions.houses[type].electricityKwh;
    return homes.gas * usage + homes.hybrid * usage + homes.electric * usage;
  });
  const electricity = perMonth(
    (month) => sum(electricityKwhByType.map((kwh) => kwh * season.electricity[month])) / 1000,
  );
  const electricityAnnual = sum(electricityKwhByType) / 1000;
  const electricityTarget = electricity.map((value) => value * (1 - reduceElectricity));
  const electricityTargetAnnual = electricityAnnual * (1 - reduceElectricity);

  // Electricity used by heat pumps; gas boilers add none (rows 22-37).
  const heatingKwhByType = HOUSE_TYPES.map((type) => {
    const homes = inputs.houses[type];
    const usefulHeat = assumptions.houses[type].gasM3 * assumptions.gasKwhPerM3 * assumptions.boilerEfficiency;
    const hybrid = (usefulHeat * assumptions.hybridHeatShare) / assumptions.hybridCop;
    const electric = (usefulHeat * assumptions.electricHeatShare) / assumptions.electricCop;
    return homes.hybrid * hybrid + homes.electric * electric;
  });
  const heating = perMonth((month) => sum(heatingKwhByType.map((kwh) => kwh * season.heating[month])) / 1000);
  const heatingAnnual = sum(heatingKwhByType) / 1000;
  const heatingTarget = heating.map((value) => value * (1 - reduceHeating));
  const heatingTargetAnnual = heatingAnnual * (1 - reduceHeating);

  // Electric cars (rows 107-115).
  const households = sum(
    HOUSE_TYPES.map((type) => inputs.houses[type].electric + inputs.houses[type].gas + inputs.houses[type].hybrid),
  );
  const cars = households * inputs.carsPerHousehold;
  const mobilityFor = (share: number) => {
    const evCars = excelRound(cars * share);
    const km = excelRound(evCars * assumptions.kmPerCar);
    return {
      evCars,
      monthly: perMonth((month) => (km * season.car[month] * assumptions.evKwhPerKm) / 1000),
      annual: (km * assumptions.evKwhPerKm) / 1000,
    };
  };
  const mobilityNow = mobilityFor(inputs.evShare);
  const targetShare = inputs.targets.evShareTarget ?? (replicate('ev-target-unset') ? 0 : inputs.evShare);
  const mobilityGoal = mobilityFor(targetShare);

  const usage = perMonth((month) => electricity[month] + heating[month] + mobilityNow.monthly[month]);
  const usageTarget = perMonth(
    (month) => electricityTarget[month] + heatingTarget[month] + mobilityGoal.monthly[month],
  );

  // Local production (rows 41-53).
  const windMwhByRow = inputs.wind.map((row) => row.count * ((row.kw / 1000) * assumptions.windFullLoadHours));
  const wind = perMonth((month) => sum(windMwhByRow.map((mwh) => mwh * season.wind[month])));
  const windAnnual = sum(windMwhByRow);
  const panelKwh = assumptions.panelWp * assumptions.kwhPerWp;
  const solarAnnual = (inputs.solarPanels * panelKwh) / 1000;
  const solar = perMonth((month) => solarAnnual * season.solar[month]);
  const production = add(wind, solar);
  const perPanelKwh = perMonth((month) => panelKwh * season.solar[month]);

  const matchFor = (monthIndex: number, yieldMonthIndex: number): SeasonMatch => {
    const shortfall = usageTarget[monthIndex] - production[monthIndex];
    const perPanelMwh = perPanelKwh[yieldMonthIndex] / 1000;
    const needed = shortfall > 0;
    const panels = needed && perPanelMwh > 0 ? excelRound(shortfall / perPanelMwh) : 0;
    return {
      monthIndex,
      yieldMonthIndex,
      usage: usageTarget[monthIndex],
      production: production[monthIndex],
      shortfall,
      perPanelMwh,
      needed,
      panels,
    };
  };
  const addedSolar = (panels: number): Monthly => {
    const annual = (panels * panelKwh) / 1000;
    return perMonth((month) => annual * season.solar[month]);
  };

  // Summer: cover the month with the lowest usage (rows 58-78).
  const lowestMonth = usageTarget.indexOf(Math.min(...usageTarget));
  const summerMatch = matchFor(lowestMonth, lowestMonth);
  const summerAddedSolar = addedSolar(summerMatch.panels);

  // Winter: cover the month with the highest usage (rows 82-103).
  const highest = Math.max(...usageTarget);
  const firstHighestMonth = usageTarget.indexOf(highest);
  let winterMatch: SeasonMatch;
  if (replicate('winter-month-mismatch')) {
    // Workbook: on a tie it reads the shortfall of the first tied month but
    // divides by the yield of the month with the lowest solar output.
    const tied = usageTarget.filter((value) => value === highest).length > 1;
    const yieldMonth = tied ? perPanelKwh.indexOf(Math.min(...perPanelKwh)) : firstHighestMonth;
    winterMatch = matchFor(firstHighestMonth, yieldMonth);
  } else {
    // Among months tied for the highest usage, take the one where a panel
    // yields least, and use that month for both the shortfall and the yield.
    const tolerance = Math.abs(highest) * 1e-12;
    const hardestMonth = MONTH_INDEXES.filter((month) => highest - usageTarget[month] <= tolerance).reduce(
      (hardest, month) => (perPanelKwh[month] < perPanelKwh[hardest] ? month : hardest),
    );
    winterMatch = matchFor(hardestMonth, hardestMonth);
  }
  const winterAddedSolar = addedSolar(winterMatch.panels);

  const solarWithSummer = add(solar, summerAddedSolar);
  const solarWithWinter = add(solar, winterAddedSolar);
  const productionSummerMatch = add(production, summerAddedSolar);
  const productionWinterMatch = replicate('winter-chart-double-count')
    ? add(production, solarWithWinter)
    : add(production, winterAddedSolar);

  const residentialTarget = replicate('residential-total-heating')
    ? electricityTargetAnnual
    : electricityTargetAnnual + heatingTargetAnnual;
  const usageTargetAnnual = residentialTarget + mobilityGoal.annual;
  const productionAnnual = windAnnual + solarAnnual;

  return {
    households,
    cars,
    evCars: { current: mobilityNow.evCars, target: mobilityGoal.evCars },
    monthly: {
      electricity,
      heating,
      mobility: mobilityNow.monthly,
      usage,
      electricityTarget,
      heatingTarget,
      mobilityTarget: mobilityGoal.monthly,
      usageTarget,
      wind,
      solar,
      production,
      summerAddedSolar,
      productionSummerMatch,
      winterAddedSolar,
      productionWinterMatch,
    },
    annual: {
      electricity: electricityAnnual,
      heating: heatingAnnual,
      mobility: mobilityNow.annual,
      usage: electricityAnnual + heatingAnnual + mobilityNow.annual,
      electricityTarget: electricityTargetAnnual,
      heatingTarget: heatingTargetAnnual,
      mobilityTarget: mobilityGoal.annual,
      residentialTarget,
      usageTarget: usageTargetAnnual,
      wind: windAnnual,
      solar: solarAnnual,
      production: productionAnnual,
      solarSummerMatch: sum(solarWithSummer),
      productionSummerMatch: sum(solarWithSummer) + windAnnual,
      solarWinterMatch: sum(solarWithWinter),
      productionWinterMatch: sum(solarWithWinter) + windAnnual,
    },
    summerMatch,
    winterMatch,
    coverage: usageTargetAnnual > 0 ? productionAnnual / usageTargetAnnual : null,
  };
}

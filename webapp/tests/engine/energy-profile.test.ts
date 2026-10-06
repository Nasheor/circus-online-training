import { describe, expect, it } from 'vitest';
import golden from '../fixtures/energy-profile/golden.json';
import { emptyInputs, resolveAssumptions } from '~/engine/energy-profile/assumptions';
import { compute, excelRound } from '~/engine/energy-profile/compute';
import { ALL_DEVIATIONS, DEVIATIONS } from '~/engine/energy-profile/deviations';
import type { DeviationId } from '~/engine/energy-profile/deviations';
import type { ProfileInputs, ProfileResults } from '~/engine/energy-profile/types';

/** Result path -> workbook cell or range, as dumped by scripts/fixtures/generate_fixtures.py. */
const CELL_MAP: Record<string, string> = {
  households: 'Calculations!B107',
  cars: 'Calculations!B108',
  'evCars.current': 'Calculations!B109',
  'evCars.target': 'Calculations!B113',
  'annual.electricity': 'Calculations!B17',
  'annual.electricityTarget': 'Calculations!B18',
  'annual.heating': 'Calculations!B36',
  'annual.heatingTarget': 'Calculations!B37',
  'annual.mobility': 'Calculations!B111',
  'annual.mobilityTarget': 'Calculations!B115',
  'annual.wind': 'Calculations!B48',
  'annual.solar': 'Calculations!B53',
  'annual.residentialTarget': 'Input - Output!B32',
  'annual.usageTarget': 'Input - Output!B34',
  'annual.solarSummerMatch': 'Input - Output!B39',
  'annual.productionSummerMatch': 'Input - Output!B41',
  'annual.solarWinterMatch': 'Input - Output!B46',
  'annual.productionWinterMatch': 'Input - Output!B48',
  'monthly.electricity': 'Calculations!C17:N17',
  'monthly.electricityTarget': 'Calculations!C18:N18',
  'monthly.heating': 'Calculations!C36:N36',
  'monthly.heatingTarget': 'Calculations!C37:N37',
  'monthly.mobility': 'Calculations!C111:N111',
  'monthly.mobilityTarget': 'Calculations!C115:N115',
  'monthly.wind': 'Calculations!C48:N48',
  'monthly.solar': 'Calculations!C53:N53',
  'monthly.usage': 'Graphs current!B5:M5',
  'monthly.usageTarget': 'Graphs scenario!B5:M5',
  'monthly.production': 'Graphs current!B9:M9',
  'monthly.summerAddedSolar': 'Calculations!C78:N78',
  'monthly.productionSummerMatch': 'Graphs current!B13:M13',
  'monthly.winterAddedSolar': 'Calculations!C103:N103',
  'monthly.productionWinterMatch': 'Graphs scenario!B17:M17',
  'summerMatch.usage': 'Calculations!B71',
  'summerMatch.shortfall': 'Calculations!B72',
  'summerMatch.perPanelMwh': 'Calculations!B75',
  'summerMatch.panels': 'Calculations!B76',
  'winterMatch.usage': 'Calculations!B95',
  'winterMatch.shortfall': 'Calculations!B98',
  'winterMatch.perPanelMwh': 'Calculations!B100',
  'winterMatch.panels': 'Calculations!B101',
};

// Month names exactly as the workbook spells them.
const WORKBOOK_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'Augustus', 'September', 'Oktober', 'November', 'December',
];

interface GoldenScenario {
  id: string;
  inputs: ProfileInputs;
  overrides: Record<string, number>;
  cells: Record<string, number | string | number[]>;
}
const scenarios = golden.scenarios as unknown as GoldenScenario[];

const read = (results: ProfileResults, path: string) =>
  path.split('.').reduce<any>((value, key) => value[key], results) as number | number[];

const close = (actual: number, expected: number) =>
  Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(actual), Math.abs(expected));

function mismatches(results: ProfileResults, scenario: GoldenScenario, paths: string[]): string[] {
  const failures: string[] = [];
  for (const path of paths) {
    const actual = [read(results, path)].flat();
    const expected = [scenario.cells[CELL_MAP[path]]].flat() as number[];
    actual.forEach((value, index) => {
      if (!close(value, expected[index])) {
        failures.push(`${scenario.id} ${path}[${index}]: engine ${value}, workbook ${expected[index]}`);
      }
    });
  }
  return failures;
}

const run = (scenario: GoldenScenario, replicate?: ReadonlySet<DeviationId>) =>
  compute(scenario.inputs, resolveAssumptions(scenario.overrides), { replicate });

/** Deviations that can change results for this scenario. */
function applicable(scenario: GoldenScenario): DeviationId[] {
  return DEVIATIONS.map((deviation) => deviation.id).filter(
    (id) => id !== 'ev-target-unset' || scenario.inputs.targets.evShareTarget === null,
  );
}

const covered = (path: string, affects: readonly string[]) =>
  affects.some((affected) => path === affected || path.startsWith(affected + '.'));

describe('energy profile engine against the Excel workbook', () => {
  it('has a fixture for the workbook version it documents', () => {
    expect(golden.manifest.workbook).toContain('Excel version 1.03');
    expect(scenarios.length).toBeGreaterThanOrEqual(50);
  });

  it('reproduces every mapped workbook cell when all deviations are replicated', () => {
    const failures = scenarios.flatMap((scenario) =>
      mismatches(run(scenario, ALL_DEVIATIONS), scenario, Object.keys(CELL_MAP)),
    );
    expect(failures).toEqual([]);
  });

  it('reproduces the months and yes/no decisions of the season matching when replicated', () => {
    for (const scenario of scenarios) {
      const results = run(scenario, ALL_DEVIATIONS);
      expect(WORKBOOK_MONTHS[results.summerMatch.monthIndex], scenario.id).toBe(scenario.cells['Calculations!B73']);
      expect(WORKBOOK_MONTHS[results.winterMatch.yieldMonthIndex], scenario.id).toBe(
        scenario.cells['Calculations!B97'],
      );
      expect(results.summerMatch.needed ? 'Yes' : 'No', scenario.id).toBe(scenario.cells['Calculations!B74']);
      expect(results.winterMatch.needed ? 'Yes' : 'No', scenario.id).toBe(scenario.cells['Calculations!B99']);
    }
  });

  it('differs from the workbook only where a registered deviation says so', () => {
    const failures = scenarios.flatMap((scenario) => {
      const affects = DEVIATIONS.filter((deviation) => applicable(scenario).includes(deviation.id)).flatMap(
        (deviation) => [...deviation.affects],
      );
      const unaffected = Object.keys(CELL_MAP).filter((path) => !covered(path, affects));
      return mismatches(run(scenario), scenario, unaffected);
    });
    expect(failures).toEqual([]);
  });

  it('really changes something for every registered deviation', () => {
    for (const deviation of DEVIATIONS) {
      const others = new Set([...ALL_DEVIATIONS].filter((id) => id !== deviation.id));
      const paths = Object.keys(CELL_MAP).filter((path) => covered(path, deviation.affects));
      const changed = scenarios.some((scenario) => mismatches(run(scenario, others), scenario, paths).length > 0);
      expect(changed, deviation.id).toBe(true);
    }
  });
});

describe('the four fixes, worked by hand', () => {
  // 20 mid-terrace homes: 10 gas, 5 hybrid, 5 all-electric; 1.2 cars per home, 20% electric.
  const base = (): ProfileInputs => {
    const inputs = emptyInputs();
    inputs.houses.between = { gas: 10, hybrid: 5, electric: 5 };
    inputs.carsPerHousehold = 1.2;
    inputs.evShare = 0.2;
    inputs.targets.evShareTarget = 0.2;
    return inputs;
  };
  // 980 m3 x 9.77 x 0.9 = 8617.14 kWh of heat per home.
  const heatingMwh = (5 * ((8617.14 * 0.7) / 5) + 5 * (8617.14 / 5)) / 1000; // 14.649138
  const electricityMwh = (20 * 2670) / 1000; // 53.4
  const mobilityMwh = (Math.round(5 * 12675.77183969024) * 0.175) / 1000; // 5 EVs -> 11.091325

  it('1. residential total includes heat-pump electricity', () => {
    const results = compute(base());
    expect(results.annual.residentialTarget).toBeCloseTo(electricityMwh + heatingMwh, 9);
    expect(results.annual.usageTarget).toBeCloseTo(electricityMwh + heatingMwh + mobilityMwh, 9);
    const workbook = compute(base(), undefined, { replicate: ALL_DEVIATIONS });
    expect(workbook.annual.residentialTarget).toBeCloseTo(electricityMwh, 9);
  });

  it("2. with no adoption target, today's electric cars stay in the picture", () => {
    const inputs = base();
    inputs.targets.evShareTarget = null;
    const results = compute(inputs);
    expect(results.evCars).toEqual({ current: 5, target: 5 });
    expect(results.annual.mobilityTarget).toBeCloseTo(mobilityMwh, 9);
    const workbook = compute(inputs, undefined, { replicate: ALL_DEVIATIONS });
    expect(workbook.annual.mobilityTarget).toBe(0);
  });

  it('3. winter matching uses the shortfall and the solar yield of the same month', () => {
    const inputs = base();
    inputs.solarPanels = 1000; // 352 MWh a year: 10.56 in January, 7.04 in December
    const decemberUsage = electricityMwh * 0.11 + heatingMwh * 0.15 + mobilityMwh / 12;
    const results = compute(inputs);
    expect(results.winterMatch.monthIndex).toBe(11);
    expect(results.winterMatch.yieldMonthIndex).toBe(11);
    expect(results.winterMatch.shortfall).toBeCloseTo(decemberUsage - 7.04, 9);
    expect(results.winterMatch.panels).toBe(Math.round((decemberUsage - 7.04) / 0.00704));
    expect(results.winterMatch.panels).toBe(278);
    // The workbook looks at January (more sun, same demand) and reports that nothing is needed.
    const workbook = compute(inputs, undefined, { replicate: ALL_DEVIATIONS });
    expect(workbook.winterMatch.needed).toBe(false);
    expect(workbook.winterMatch.panels).toBe(0);
  });

  it('4. the winter-match production counts existing solar once', () => {
    const inputs = base();
    inputs.solarPanels = 1000;
    const results = compute(inputs);
    results.monthly.productionWinterMatch.forEach((value, month) => {
      expect(value).toBeCloseTo(results.monthly.production[month] + results.monthly.winterAddedSolar[month], 9);
    });
    const workbook = compute(inputs, undefined, { replicate: ALL_DEVIATIONS });
    expect(workbook.monthly.productionWinterMatch[5]).toBeCloseTo(
      workbook.monthly.production[5] + workbook.monthly.solar[5] + workbook.monthly.winterAddedSolar[5],
      9,
    );
  });
});

describe('invariants', () => {
  const flat = (results: ProfileResults) =>
    [...Object.values(results.annual), ...Object.values(results.monthly).flat()] as number[];

  it('gives zeros, never NaN, for an empty community', () => {
    const results = compute(emptyInputs());
    expect(flat(results).every((value) => value === 0)).toBe(true);
    expect(results.coverage).toBeNull();
    expect(results.summerMatch.panels).toBe(0);
    expect(results.winterMatch.panels).toBe(0);
  });

  it('keeps yearly totals equal to the sum of the months', () => {
    for (const scenario of scenarios) {
      const results = run(scenario);
      const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);
      // Only meaningful when the seasonality columns still sum to 100%.
      if (Object.keys(scenario.overrides).some((path) => path.startsWith('seasonality.'))) continue;
      expect(total(results.monthly.usage), scenario.id).toBeCloseTo(results.annual.usage, 6);
      expect(total(results.monthly.usageTarget), scenario.id).toBeCloseTo(results.annual.usageTarget, 6);
      expect(total(results.monthly.production), scenario.id).toBeCloseTo(results.annual.production, 6);
      expect(flat(results).every(Number.isFinite), scenario.id).toBe(true);
    }
  });

  it('rounds like Excel ROUND: half away from zero', () => {
    expect([0.5, 1.5, 2.5, 2.4999, -2.5, 0].map(excelRound)).toEqual([1, 2, 3, 2, -3, 0]);
  });
});

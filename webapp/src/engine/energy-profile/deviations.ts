/**
 * Every place where the web calculator intentionally differs from the Excel
 * workbook "Energy profile tool 1A, version 1.03". The registry drives three
 * things: the `replicate` option of `compute` (used by the tests to prove the
 * workbook is reproduced exactly), the test that checks nothing else differs,
 * and the public "Differences from the Excel workbook" page.
 *
 * Texts for each entry live in the UI strings under `deviations.<id>`.
 */
export const DEVIATIONS = [
  {
    id: 'residential-total-heating',
    workbookCells: ['Input - Output!B32', 'Input - Output!B34'],
    affects: ['annual.residentialTarget', 'annual.usageTarget'],
  },
  {
    id: 'ev-target-unset',
    workbookCells: ['Input - Output!B28', 'Input - Output!B33', 'Calculations!B113'],
    // Only differs when no adoption target is entered and some cars are electric today.
    affects: [
      'evCars.target',
      'monthly.mobilityTarget',
      'monthly.usageTarget',
      'annual.mobilityTarget',
      'annual.usageTarget',
      'summerMatch',
      'winterMatch',
      'monthly.summerAddedSolar',
      'monthly.productionSummerMatch',
      'monthly.winterAddedSolar',
      'monthly.productionWinterMatch',
      'annual.solarSummerMatch',
      'annual.productionSummerMatch',
      'annual.solarWinterMatch',
      'annual.productionWinterMatch',
    ],
  },
  {
    id: 'winter-month-mismatch',
    workbookCells: ['Calculations!B97', 'Calculations!B98', 'Calculations!B100', 'Calculations!B101'],
    affects: [
      'winterMatch',
      'monthly.winterAddedSolar',
      'monthly.productionWinterMatch',
      'annual.solarWinterMatch',
      'annual.productionWinterMatch',
    ],
  },
  {
    id: 'winter-chart-double-count',
    workbookCells: ['Graphs scenario!B17:M17'],
    affects: ['monthly.productionWinterMatch'],
  },
] as const;

export type DeviationId = (typeof DEVIATIONS)[number]['id'];

export const ALL_DEVIATIONS: ReadonlySet<DeviationId> = new Set(DEVIATIONS.map((deviation) => deviation.id));

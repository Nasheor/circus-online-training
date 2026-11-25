// Fetches the public EU data behind the country reference values of the
// Energy Profile and writes src/engine/energy-profile/countries.data.ts.
//
//   node scripts/country-data.mjs
//
// Method (also explained on the page "Where the numbers come from"):
// - The Netherlands keeps the values of the Excel workbook (v1.03).
// - Other countries: Dutch workbook value x (country indicator / Dutch
//   indicator), with the same indicator from the same source on both sides.
//   This keeps the workbook's five Dutch house types and its level.
// - Monthly patterns for heating, solar and wind are taken from the country's
//   own data (degree days, PVGIS, monthly wind production).
// Every raw indicator is written next to the derived value so it can be checked.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const EUROSTAT = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const PVGIS = 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc';
const COUNTRIES = ['NL', 'BE', 'DE', 'FR', 'IE'];
const HOUSEHOLD_YEARS = ['2020', '2021', '2022', '2023', '2024'];
const HDD_YEARS = Array.from({ length: 10 }, (_, i) => String(2015 + i));
const WIND_YEARS = ['2020', '2021', '2022', '2023', '2024'];
// One point per country for PVGIS: the capital city (a neutral, explainable choice).
const PV_POINTS = {
  NL: { place: 'Amsterdam', lat: 52.37, lon: 4.9 },
  BE: { place: 'Brussels', lat: 50.85, lon: 4.35 },
  DE: { place: 'Berlin', lat: 52.52, lon: 13.4 },
  FR: { place: 'Paris', lat: 48.86, lon: 2.35 },
  IE: { place: 'Dublin', lat: 53.35, lon: -6.26 },
};
const PV_SETTINGS = { peakpower: 1, loss: 14, optimalangles: 1 };

const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;

/** Fetch a Eurostat dataset and return rows {dim: code, ..., value}. */
async function eurostat(dataset, params) {
  const query = new URLSearchParams({ format: 'JSON', lang: 'EN' });
  for (const [key, value] of Object.entries(params)) {
    for (const v of [value].flat()) query.append(key, v);
  }
  const url = `${EUROSTAT}/${dataset}?${query}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.error) throw new Error(`${dataset}: ${JSON.stringify(data.error)}`);
  const ids = data.id;
  const sizes = data.size;
  const codes = ids.map((id) => {
    const index = data.dimension[id].category.index;
    return Object.keys(index).sort((a, b) => index[a] - index[b]);
  });
  const rows = [];
  for (const [flat, value] of Object.entries(data.value)) {
    let rest = Number(flat);
    const row = { value };
    for (let d = ids.length - 1; d >= 0; d--) {
      row[ids[d]] = codes[d][rest % sizes[d]];
      rest = Math.floor(rest / sizes[d]);
    }
    rows.push(row);
  }
  return { rows, updated: data.updated };
}

const pick = (rows, match) =>
  rows.filter((row) => Object.entries(match).every(([key, value]) => row[key] === value)).map((row) => row.value);

function requireAll(values, expected, what) {
  if (values.length !== expected) throw new Error(`${what}: expected ${expected} values, got ${values.length}`);
  return values;
}

/** Round shares to 3 decimals so that they still add up to exactly 1 (largest remainder). */
function shares(values) {
  const total = values.reduce((a, b) => a + b, 0);
  const exact = values.map((v) => (v / total) * 1000);
  const floored = exact.map(Math.floor);
  let missing = 1000 - floored.reduce((a, b) => a + b, 0);
  const order = exact.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (missing <= 0) break;
    floored[i] += 1;
    missing -= 1;
  }
  return floored.map((v) => v / 1000);
}

const sources = {};

// 1. Household energy by end use (TJ) and number of households (thousands).
const hhq = await eurostat('nrg_d_hhq', {
  geo: COUNTRIES,
  time: HOUSEHOLD_YEARS,
  unit: 'TJ',
  siec: ['TOTAL', 'E7000'],
  nrg_bal: ['FC_OTH_HH_E', 'FC_OTH_HH_E_SH', 'FC_OTH_HH_E_WH'],
});
const hh = await eurostat('lfst_hhnhtych', {
  geo: COUNTRIES,
  time: HOUSEHOLD_YEARS,
  phhcomp: 'TOTAL',
  n_child: 'TOTAL',
  agechild: 'TOTAL',
});
sources.households = { nrg_d_hhq: hhq.updated, lfst_hhnhtych: hh.updated };

const household = {};
for (const geo of COUNTRIES) {
  const perYear = HOUSEHOLD_YEARS.map((time) => {
    const get = (siec, nrg_bal) =>
      requireAll(pick(hhq.rows, { geo, time, siec, nrg_bal }), 1, `${geo} ${time} ${siec} ${nrg_bal}`)[0];
    const homes = requireAll(pick(hh.rows, { geo, time }), 1, `${geo} ${time} households`)[0] * 1000;
    const kwh = (tj) => (tj * 1e9) / 3600 / homes; // 1 TJ = 1e9 kJ; kWh per household
    const electricityAll = get('E7000', 'FC_OTH_HH_E');
    const electricityHeat = get('E7000', 'FC_OTH_HH_E_SH') + get('E7000', 'FC_OTH_HH_E_WH');
    return {
      // Electricity not used for space or water heating, per household.
      electricityKwh: kwh(electricityAll - electricityHeat),
      // Final energy (all fuels) for space and water heating, per household.
      spaceHeatKwh: kwh(get('TOTAL', 'FC_OTH_HH_E_SH')),
      waterHeatKwh: kwh(get('TOTAL', 'FC_OTH_HH_E_WH')),
    };
  });
  household[geo] = {
    electricityKwh: mean(perYear.map((y) => y.electricityKwh)),
    spaceHeatKwh: mean(perYear.map((y) => y.spaceHeatKwh)),
    waterHeatKwh: mean(perYear.map((y) => y.waterHeatKwh)),
  };
}

// 2. Monthly heating degree days, averaged per calendar month.
const hdd = await eurostat('nrg_chdd_m', {
  geo: COUNTRIES,
  indic_nrg: 'HDD',
  time: HDD_YEARS.flatMap((year) => Array.from({ length: 12 }, (_, m) => `${year}-${String(m + 1).padStart(2, '0')}`)),
});
sources.hdd = hdd.updated;
const degreeDays = {};
for (const geo of COUNTRIES) {
  degreeDays[geo] = Array.from({ length: 12 }, (_, m) => {
    const values = HDD_YEARS.map(
      (year) => requireAll(pick(hdd.rows, { geo, time: `${year}-${String(m + 1).padStart(2, '0')}` }), 1, `${geo} HDD`)[0],
    );
    return mean(values);
  });
}

// 3. Monthly wind production (all wind), averaged per calendar month.
const wind = await eurostat('nrg_cb_pem', {
  geo: COUNTRIES,
  siec: 'RA300',
  unit: 'GWH',
  time: WIND_YEARS.flatMap((year) => Array.from({ length: 12 }, (_, m) => `${year}-${String(m + 1).padStart(2, '0')}`)),
});
sources.wind = wind.updated;
const windMonthly = {};
for (const geo of COUNTRIES) {
  windMonthly[geo] = Array.from({ length: 12 }, (_, m) =>
    mean(
      WIND_YEARS.map(
        (year) => requireAll(pick(wind.rows, { geo, time: `${year}-${String(m + 1).padStart(2, '0')}` }), 1, `${geo} wind`)[0],
      ),
    ),
  );
}

// 4. PVGIS yield of 1 kWp, optimal angles, 14 % system loss.
const pv = {};
for (const geo of COUNTRIES) {
  const point = PV_POINTS[geo];
  const query = new URLSearchParams({ lat: point.lat, lon: point.lon, ...PV_SETTINGS, outputformat: 'json' });
  const data = await (await fetch(`${PVGIS}?${query}`)).json();
  if (!data.outputs) throw new Error(`PVGIS ${geo}: ${JSON.stringify(data).slice(0, 200)}`);
  pv[geo] = {
    ...point,
    yearlyKwhPerKwp: data.outputs.totals.fixed.E_y,
    monthlyKwhPerKwp: data.outputs.monthly.fixed.map((m) => m.E_m),
    database: data.inputs.meteo_data.radiation_db,
    years: `${data.inputs.meteo_data.year_min}-${data.inputs.meteo_data.year_max}`,
  };
}

// Derived per-country values.
const round = (value, digits) => Number(value.toFixed(digits));
const derived = {};
for (const geo of COUNTRIES) {
  const h = household[geo];
  const nl = household.NL;
  const heat = h.spaceHeatKwh + h.waterHeatKwh;
  const nlHeat = nl.spaceHeatKwh + nl.waterHeatKwh;
  const hddShares = degreeDays[geo].map((v) => v / degreeDays[geo].reduce((a, b) => a + b, 0));
  derived[geo.toLowerCase()] = {
    electricityFactor: round(h.electricityKwh / nl.electricityKwh, 3),
    heatFactor: round(heat / nlHeat, 3),
    solarFactor: round(pv[geo].yearlyKwhPerKwp / pv.NL.yearlyKwhPerKwp, 3),
    // Space heating follows degree days; water heating is spread evenly.
    heatingSeason: shares(hddShares.map((s) => (h.spaceHeatKwh * s + h.waterHeatKwh / 12) / heat)),
    solarSeason: shares(pv[geo].monthlyKwhPerKwp),
    windSeason: shares(windMonthly[geo]),
  };
}

const raw = {
  household: Object.fromEntries(
    COUNTRIES.map((geo) => [
      geo.toLowerCase(),
      Object.fromEntries(Object.entries(household[geo]).map(([k, v]) => [k, Math.round(v)])),
    ]),
  ),
  pvgis: Object.fromEntries(
    COUNTRIES.map((geo) => [
      geo.toLowerCase(),
      { place: pv[geo].place, lat: pv[geo].lat, lon: pv[geo].lon, yearlyKwhPerKwp: pv[geo].yearlyKwhPerKwp, database: pv[geo].database, years: pv[geo].years },
    ]),
  ),
};

const out = `// Generated by scripts/country-data.mjs on ${new Date().toISOString().slice(0, 10)}. Do not edit by hand.
// Sources: Eurostat nrg_d_hhq + lfst_hhnhtych (${HOUSEHOLD_YEARS[0]}-${HOUSEHOLD_YEARS.at(-1)}),
// nrg_chdd_m (${HDD_YEARS[0]}-${HDD_YEARS.at(-1)}), nrg_cb_pem (${WIND_YEARS[0]}-${WIND_YEARS.at(-1)}); JRC PVGIS 5.3 PVcalc.

export const COUNTRY_DATA_RETRIEVED = '${new Date().toISOString().slice(0, 10)}';

export const COUNTRY_DATA_PERIODS = ${JSON.stringify({ households: `${HOUSEHOLD_YEARS[0]}–${HOUSEHOLD_YEARS.at(-1)}`, degreeDays: `${HDD_YEARS[0]}–${HDD_YEARS.at(-1)}`, wind: `${WIND_YEARS[0]}–${WIND_YEARS.at(-1)}`, pvgis: { ...PV_SETTINGS } })} as const;

/** Raw indicators, per household (kWh) and per kWp (PVGIS), for checking. */
export const COUNTRY_RAW = ${JSON.stringify(raw, null, 2)} as const;

/** Country / Netherlands ratios and monthly patterns derived from the raw indicators. */
export const COUNTRY_DERIVED = ${JSON.stringify(derived, null, 2)} as const;
`;
const target = fileURLToPath(new URL('../src/engine/energy-profile/countries.data.ts', import.meta.url));
writeFileSync(target, out);
console.log(JSON.stringify({ raw, derived, sources }, null, 1));

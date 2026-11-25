import { describe, expect, it } from 'vitest';
import {
  emptyInputs,
  MAX_PANELS_PER_HOME,
  NL_REFERENCE,
  readAssumption,
  referenceFor,
  resolveAssumptions,
} from '~/engine/energy-profile/assumptions';
import { compute } from '~/engine/energy-profile/compute';
import { COUNTRIES, SOURCE_KINDS, sourceOf } from '~/engine/energy-profile/countries';
import { COUNTRY_DERIVED } from '~/engine/energy-profile/countries.data';
import { computeProfile, maxSolarPanels } from '~/engine/energy-profile/profile';
import { HOUSE_TYPES, SEASONAL_SERIES } from '~/engine/energy-profile/types';
import { en } from '~/content/locales/en';

describe('country reference values', () => {
  it('keeps the Excel workbook values for the Netherlands', () => {
    expect(referenceFor('nl')).toBe(NL_REFERENCE);
    expect(resolveAssumptions({})).toEqual(NL_REFERENCE);
  });

  it('scales the Dutch values by the EU ratios for the other countries', () => {
    for (const country of COUNTRIES.filter((c) => c !== 'nl')) {
      const reference = referenceFor(country);
      const factors = COUNTRY_DERIVED[country];
      for (const type of HOUSE_TYPES) {
        const nl = NL_REFERENCE.houses[type];
        expect(Math.abs(reference.houses[type].electricityKwh - nl.electricityKwh * factors.electricityFactor)).toBeLessThanOrEqual(5);
        expect(Math.abs(reference.houses[type].gasM3 - nl.gasM3 * factors.heatFactor)).toBeLessThanOrEqual(5);
      }
      expect(reference.kwhPerWp).toBeCloseTo(NL_REFERENCE.kwhPerWp * factors.solarFactor, 2);
      // Technical values and the wind hours stay the workbook's.
      expect(reference.hybridCop).toBe(NL_REFERENCE.hybridCop);
      expect(reference.windFullLoadHours).toBe(NL_REFERENCE.windFullLoadHours);
    }
  });

  it('has monthly patterns that add up to 100% in every country', () => {
    for (const country of COUNTRIES) {
      for (const series of SEASONAL_SERIES) {
        const total = referenceFor(country).seasonality[series].reduce((a, b) => a + b, 0);
        expect(Math.abs(total - 1), `${country} ${series}`).toBeLessThan(0.0005);
      }
    }
  });

  it('names a source with a text for every value in every country', () => {
    const paths = [
      ...HOUSE_TYPES.flatMap((t) => [`houses.${t}.electricityKwh`, `houses.${t}.gasM3`, `maxPanelsPerHome.${t}`]),
      ...Object.keys(NL_REFERENCE).filter((key) => typeof (NL_REFERENCE as any)[key] === 'number'),
      ...SEASONAL_SERIES.map((series) => `seasonality.${series}.0`),
    ];
    for (const country of COUNTRIES) {
      for (const path of paths) {
        const kind = sourceOf(country, path);
        expect(SOURCE_KINDS).toContain(kind);
        expect(en.profile.sources.short[kind]).toBeTruthy();
        expect(en.profile.sourcesPage.kinds[kind]).toBeTruthy();
        expect(Number.isFinite(readAssumption(referenceFor(country), path)), `${country} ${path}`).toBe(true);
      }
      if (country === 'nl') expect(sourceOf(country, 'houses.detached.gasM3')).toBe('workbook');
    }
  });
});

describe('roof limit on the solar panels', () => {
  const village = () => {
    const inputs = emptyInputs();
    inputs.houses.detached.gas = 10;
    inputs.houses.apartment.electric = 20;
    return inputs;
  };

  it('derives the panels per home from the PBL roof areas and a 1.94 m² panel', () => {
    expect(MAX_PANELS_PER_HOME).toEqual({ corner: 16, between: 16, semiDetached: 23, detached: 31, apartment: 12 });
  });

  it('allows homes × panels per home of each type', () => {
    expect(maxSolarPanels(village(), NL_REFERENCE)).toBe(10 * 31 + 20 * 12);
    expect(maxSolarPanels(emptyInputs(), NL_REFERENCE)).toBe(0);
  });

  it('caps the panels used in the calculation, and leaves the workbook model untouched', () => {
    const inputs = { ...village(), solarPanels: 5000 };
    const outcome = computeProfile({ inputs, assumptionOverrides: {} });
    expect(outcome.panelsCapped).toBe(true);
    expect(outcome.panelsUsed).toBe(550);
    expect(outcome.results).toEqual(compute({ ...inputs, solarPanels: 550 }, NL_REFERENCE));

    const below = computeProfile({ inputs: { ...village(), solarPanels: 300 }, assumptionOverrides: {} });
    expect(below.panelsCapped).toBe(false);
    expect(below.results).toEqual(compute({ ...village(), solarPanels: 300 }, NL_REFERENCE));
  });

  it('follows a changed roof limit', () => {
    const inputs = { ...village(), solarPanels: 5000 };
    const outcome = computeProfile({ inputs, assumptionOverrides: { 'maxPanelsPerHome.detached': 40 } });
    expect(outcome.panelLimit).toBe(10 * 40 + 20 * 12);
  });

  it('uses the chosen country', () => {
    const inputs = { ...village(), solarPanels: 100 };
    const nl = computeProfile({ inputs, assumptionOverrides: {}, country: 'nl' });
    const fr = computeProfile({ inputs, assumptionOverrides: {}, country: 'fr' });
    expect(fr.assumptions).toEqual(referenceFor('fr'));
    expect(fr.results.annual.solar).toBeGreaterThan(nl.results.annual.solar);
  });
});

import { en } from '../content/locales/en';
import type { Locale } from './config';
import { coverage, withFallback } from './merge';
import type { DeepPartial } from './merge';

export type Strings = typeof en;

/** Register a translation here once its files exist in src/content/locales/<locale>/. */
const TRANSLATIONS: Partial<Record<Locale, DeepPartial<Strings>>> = {};

const cache = new Map<Locale, Strings>([['en', en]]);

/** All text for a locale, with English filling any gaps. */
export function getStrings(locale: Locale): Strings {
  const cached = cache.get(locale);
  if (cached) return cached;
  const strings = withFallback<Strings>(en, TRANSLATIONS[locale]);
  cache.set(locale, strings);
  return strings;
}

/** How much of the English text a locale has translated, 0..1. */
export const translationCoverage = (locale: Locale): number =>
  locale === 'en' ? 1 : coverage(en, TRANSLATIONS[locale]);

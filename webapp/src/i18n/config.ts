export const LOCALES = ['en', 'fr', 'nl', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Languages that are built and offered in the language switcher.
 * Add a locale here once its strings in src/i18n/ui and src/content/locales exist.
 */
export const PUBLISHED_LOCALES: readonly Locale[] = ['en'];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
  de: 'Deutsch',
};

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** getStaticPaths helper for pages under src/pages/[locale]/. */
export const localePaths = () => PUBLISHED_LOCALES.map((locale) => ({ params: { locale } }));

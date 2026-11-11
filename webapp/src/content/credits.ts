/**
 * Third-party pictures used on the site, with what their licence requires us to show.
 * Text (captions, alt) lives in the locales; this file holds the locale-neutral facts.
 */

export interface PhotoCredit {
  id: string;
  /** Path under public/. */
  file: string;
  width: number;
  height: number;
  author: string;
  holder: string;
  /** The photo's own page, where the licence is stated. */
  source: string;
  licence: string;
  licenceUrl: string;
}

export const PHOTOS = {
  // Flickr 6317368252, "Past and current directors of Hepburn Wind", launch of the Hepburn Community
  // Wind Farm, 5 November 2011 (Victoria, Australia). Licence checked on the photo page 2026-11-10.
  // Interim file is Flickr's 1024 px size; replace with the original download (same name) when available.
  heroHepburn: {
    id: 'hero-hepburn',
    file: 'home/hero-hepburn.webp',
    width: 683,
    height: 1024,
    author: 'Tibor Hegedis',
    holder: 'Hepburn Wind',
    source: 'https://www.flickr.com/photos/43929929@N07/6317368252/',
    licence: 'CC BY 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
} as const satisfies Record<string, PhotoCredit>;

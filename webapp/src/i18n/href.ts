import type { Locale } from './config';

// Works under any deployment sub-path: every internal link goes through here.
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Link to a page: href('en', 'tools/cards') -> /en/tools/cards/ (suffix carries ?query or #hash). */
export function href(locale: Locale, path = '', suffix = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return `${base}${locale}/${clean ? clean + '/' : ''}${suffix}`;
}

/** Link to a file in public/. */
export function asset(path: string): string {
  return base + path.replace(/^\/+/, '');
}

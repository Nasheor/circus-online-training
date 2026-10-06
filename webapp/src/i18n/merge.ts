export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/** Translation over English: any key a translation lacks falls back to the English value. */
export function withFallback<T>(english: T, translation: DeepPartial<T> | undefined): T {
  if (translation === undefined || translation === null) return english;
  if (Array.isArray(english) || typeof english !== 'object' || english === null) return translation as T;
  const merged: Record<string, unknown> = { ...(english as Record<string, unknown>) };
  for (const [key, value] of Object.entries(translation as Record<string, unknown>)) {
    merged[key] = withFallback((english as Record<string, unknown>)[key], value as never);
  }
  return merged as T;
}

/** Share of English leaf values that a translation provides, 0..1. */
export function coverage<T>(english: T, translation: DeepPartial<T> | undefined): number {
  let total = 0;
  let translated = 0;
  const walk = (source: unknown, target: unknown) => {
    if (Array.isArray(source) || typeof source !== 'object' || source === null) {
      total += 1;
      if (target !== undefined && target !== null) translated += 1;
      return;
    }
    for (const [key, value] of Object.entries(source)) walk(value, (target as Record<string, unknown> | undefined)?.[key]);
  };
  walk(english, translation);
  return total === 0 ? 1 : translated / total;
}

/** Strip SAP single-quote wrapping: "'foo'" → "foo", "foo" → "foo" */
export function stripSAPQuotes(val: string): string {
  if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
  return val;
}

/** Strip quotes from all string values in an object */
export function cleanSAPRecord<T extends Record<string, unknown>>(record: T): T {
  const cleaned = {} as Record<string, unknown>;
  for (const [key, val] of Object.entries(record)) {
    cleaned[key] = typeof val === "string" ? stripSAPQuotes(val) : val;
  }
  return cleaned as T;
}

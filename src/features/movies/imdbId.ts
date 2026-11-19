const imdbIdPattern = /^tt[0-9]+$/;

export function isImdbId(value: unknown): value is string {
  return typeof value === "string" && imdbIdPattern.test(value);
}

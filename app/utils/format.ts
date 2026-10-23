// Format an ISO date (e.g. "2026-03-12") for the site locale: "12 mars 2026"
// in French, "March 12, 2026" in English. Returns the raw input if it isn't a
// parseable date. Auto-imported by Nuxt.
export function formatDate(iso: string, locale = "en"): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

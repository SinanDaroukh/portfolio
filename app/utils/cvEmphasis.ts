// Key phrases set in italics in the CV's experience descriptions. Kept here by
// hand rather than in app/data/cv/linkedin.json, so a LinkedIn re-import
// (`pnpm run cv`) doesn't wipe them. A phrase must match the text exactly
// (same apostrophes); one that no longer appears is simply ignored.
export const CV_EMPHASIS: Record<"fr" | "en", string[]> = {
  fr: [
    // C9 Corp.
    "applications mobiles et web", "CI/CD", "l’analyse du besoin", "au forfait ou en régie",
    // Booklink
    "Flutter / Firebase", "FlutterFlow", "Flutter maintenable", "fonctionnalités d'engagement",
    "fonctionnalités sociales", "Goodreads, Babelio et Gleeph", "Refonte UI", "feature flags",
    "règles de sécurité Firestore",
    // Braincube
    "plateforme de données industrielles", "nouvelles fonctionnalités",
    "spécifications techniques et fonctionnelles", "vulnérabilités (CVE)", "documentation technique",
    // Michelin
    "rentabilité", "Modélisation et maquettage",
    // be ys Cloud
    "cloud français, souverain et sécurisé", "front-end", "tests",
    // CERN
    "WinCC-OA", "visualisation des données d'expérience",
    // LightStart Apps
    "application mobile cross-platforme", "back-end",
  ],
  en: [
    // C9 Corp.
    "mobile and web app development", "CI/CD", "analysing the need", "Fixed-price or time-and-materials",
    // Booklink
    "Flutter / Firebase", "FlutterFlow", "maintainable Flutter codebase", "engagement features",
    "social features", "Goodreads, Babelio and Gleeph", "UI redesign", "feature flags",
    "Firestore security rules",
    // Braincube
    "industrial data platform", "new features", "technical and functional specifications",
    "vulnerabilities (CVEs)", "technical documentation",
    // Michelin
    "profitability", "Modelled and prototyped",
    // be ys Cloud
    "French, sovereign and secure cloud", "front-end", "tests",
    // CERN
    "WinCC-OA", "visualised experiment data",
    // LightStart Apps
    "cross-platform mobile app", "back-end",
  ],
};

export interface CvSegment {
  text: string;
  em: boolean;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// Splits text into plain and emphasised segments. Longest phrases win, and a
// phrase only matches as a whole (not inside a longer word).
export function cvEmphasize(text: string, phrases: string[]): CvSegment[] {
  if (!text || !phrases.length) return [{ text, em: false }];
  const alts = [...phrases].sort((a, b) => b.length - a.length).map(escape).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${alts})(?![\\p{L}\\p{N}])`, "gu");
  return text
    .split(re)
    .map((part, i) => ({ text: part, em: i % 2 === 1 }))
    .filter((s) => s.text);
}

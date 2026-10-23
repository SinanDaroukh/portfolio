// C9 Corp — site data: CV (built from app/data/cv/, see below) + projects.
// NB: articles live in Nuxt Content (content/articles/*.md, queried via
// queryCollection('articles')) — not here. Auto-imported by Nuxt from utils/.

import cvSource from "~/data/cv/linkedin.json";
import cvTranslationsEn from "~/data/cv/translations.en.json";

export interface C9CvEntry {
  role: string;
  org: string;
  period: string;
  city: string;
  lead: string;
  bullets: string[];
}
export interface C9CvContent {
  name: string;
  role: string;
  location: string;
  email: string[]; // [user, domain], see ProtectedEmail
  links: { kind: string; href: string }[];
  experience: C9CvEntry[];
  education: { degree: string; org: string; period: string }[];
  stack: string[];
  certifications: string[];
  languages: { name: string; level: string }[];
}

// Email addresses are stored as [user, domain] and only assembled in the
// browser by ProtectedEmail, so they never appear whole in the source, the
// JS bundle or the server HTML (address harvesters miss them).
export const C9_EMAIL_CONTACT = ["s.daroukh", "gmail.com"];

// Booking link used by the home page's "Book a call" CTA.
export const C9_CALENDLY_URL = "https://calendly.com/c9corp/30min";

// ---------------------------------------------------------------- CV
// Built from app/data/cv/: linkedin.json is the CV in the profile's language
// (French), generated from a LinkedIn data export by `pnpm run cv`;
// translations.en.json holds the English texts. A missing English text falls
// back to the French one (the script lists those to translate).

type CvLocale = "fr" | "en";
type Translations = Record<string, { source: string; text: string; stale?: boolean }>;

// Not in the LinkedIn export (or kept by hand on purpose).
const CV_EMAIL = C9_EMAIL_CONTACT;
const CV_LINKS = [
  { kind: "GitHub", href: "https://github.com/SinanDaroukh" },
  { kind: "LinkedIn", href: "https://www.linkedin.com/in/sdaroukh/" },
];
const CV_PROFICIENCY: Record<string, Record<CvLocale, string>> = {
  native: { fr: "Natif", en: "Native" },
  full: { fr: "Professionnel complet", en: "Full Professional" },
  professional: { fr: "Professionnel", en: "Professional" },
  limited: { fr: "Notions avancées", en: "Limited working" },
  elementary: { fr: "Notions", en: "Elementary" },
};
const CV_PRESENT: Record<CvLocale, string> = { fr: "présent", en: "present" };
// Notes appended to a language level (LinkedIn only exports the level itself),
// keyed by the language id in linkedin.json.
const CV_LEVEL_NOTES: Record<string, string> = { anglais: "TOEIC 915" };

function cvSlug(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[^\x00-\x7f]/g, "") // same as the script: drop non-ASCII after NFKD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// LinkedIn descriptions are free text. When some lines start with a list
// marker, the lines before the first one are a lead paragraph and each marked
// line is a bullet. Otherwise a single line is a lead, several lines bullets.
const CV_MARKER = /^\s*[-•–*·]\s*/;
function cvDescription(description: string) {
  const lines = description.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const first = lines.findIndex((l) => CV_MARKER.test(l));
  if (first === -1) {
    return lines.length === 1 ? { lead: lines[0]!, bullets: [] } : { lead: "", bullets: lines };
  }
  return {
    lead: lines.slice(0, first).join(" "),
    bullets: lines.slice(first).map((l) => l.replace(CV_MARKER, "")),
  };
}

function buildCv(locale: CvLocale): C9CvContent {
  const translations = cvTranslationsEn as Translations;
  const tr = (key: string, text: string) =>
    locale === cvSource.lang ? text : translations[key]?.text || text;
  const period = (start: string | null, end: string | null) => {
    if (!start) return end ?? "";
    if (!end) return `${start} — ${CV_PRESENT[locale]}`;
    return start === end ? start : `${start} — ${end}`;
  };
  const p = cvSource.profile;

  return {
    name: p.name,
    role: tr("profile.headline", p.headline),
    location: tr("profile.location", p.location),
    email: CV_EMAIL,
    links: CV_LINKS,
    experience: cvSource.positions.map((e) => ({
      role: tr(`positions.${e.id}.title`, e.title),
      org: e.company,
      period: period(e.start, e.end),
      city: tr(`positions.${e.id}.location`, e.location),
      ...cvDescription(tr(`positions.${e.id}.description`, e.description)),
    })),
    education: cvSource.education.map((e) => ({
      degree: tr(`education.${e.id}.degree`, e.degree),
      org: tr(`education.${e.id}.school`, e.school),
      period: period(e.start, e.end),
    })),
    stack: cvSource.skills.map((s) => tr(`skills.${cvSlug(s)}`, s)),
    certifications: cvSource.certifications.map((c) => c.name),
    languages: cvSource.languages.map((l) => ({
      name: tr(`languages.${l.id}.name`, l.name),
      level: [CV_PROFICIENCY[l.proficiency]?.[locale], CV_LEVEL_NOTES[l.id] && `(${CV_LEVEL_NOTES[l.id]})`]
        .filter(Boolean)
        .join(" "),
    })),
  };
}

export const C9_CV_FR = buildCv("fr");
export const C9_CV_EN = buildCv("en");

export const C9_PROJECTS = [
  {
    title: "C9 Corp — Personal site",
    sub: "Nuxt 3 · Tailwind · @nuxt/content · i18n (EN/FR)",
    body: "The site you are looking at. One components file, two locales, intentionally small.",
    year: "2026",
    featured: true,
  },
  {
    title: "Interchain Zone — Module sandbox",
    sub: "Cosmos SDK · IBC · Go",
    body: "Two end-to-end zone modules built during the IDA cohort, including state migrations.",
    year: "2025",
    featured: false,
  },
  {
    title: "Internal tool — Confidential",
    sub: "Nuxt 3 · Tailwind",
    body: "An internal tool consumed by ~30 colleagues. Carried a small design system that outlived the project.",
    year: "2024",
    featured: false,
  },
  {
    title: "Field notes",
    sub: "Markdown · Long-form",
    body: "An on-going set of essays. Updated when there is something worth saying.",
    year: "ongoing",
    featured: false,
  },
];

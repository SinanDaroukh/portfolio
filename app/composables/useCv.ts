// Returns the CV content for the active locale (reactive to the locale toggle).
// Section labels are handled separately via i18n ($t('cv.*')); this covers the
// structured résumé data (roles, bullets, degrees, languages…).
import type { C9CvContent } from "~/utils/c9Data";

export function useCv() {
  const { locale } = useI18n();
  return computed<C9CvContent>(() => (locale.value === "fr" ? C9_CV_FR : C9_CV_EN));
}

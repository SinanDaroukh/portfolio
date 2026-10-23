// Site colour theme. The visitor's explicit choice lives in a cookie so SSR can
// put the right class on <html> (no flash); with no choice saved, the OS
// preference applies through the `prefers-color-scheme` block in tokens.css.
type Theme = "light" | "dark";

export function useTheme() {
  const saved = useCookie<Theme | null>("c9-theme", {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  // Only known on the client; read once the page is mounted.
  const prefersDark = useState("c9-prefers-dark", () => false);

  onMounted(() => {
    prefersDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const isDark = computed(() =>
    saved.value ? saved.value === "dark" : prefersDark.value
  );

  function toggle() {
    saved.value = isDark.value ? "light" : "dark";
  }

  return { saved, isDark, toggle };
}

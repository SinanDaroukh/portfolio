// Shared "a human is here" flag for ProtectedEmail. It turns true on the
// visitor's first real interaction (pointer, touch, key, wheel), which address
// harvesters — even headless browsers running the JS — rarely simulate.
const EVENTS = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel"] as const;

export function useEmailReveal() {
  const revealed = useState("c9-email-revealed", () => false);

  onMounted(() => {
    if (revealed.value) return;
    const reveal = () => {
      revealed.value = true;
      EVENTS.forEach((e) => window.removeEventListener(e, reveal));
    };
    EVENTS.forEach((e) => window.addEventListener(e, reveal, { passive: true, once: true }));
  });

  return revealed;
}

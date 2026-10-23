// Open/closed state of the easter-egg cat gallery, shared between the corner
// cats (which open it) and the gallery itself.
import type { CatFilter } from "~/utils/catPhotos";

export function useCatGallery() {
  const state = useState<{ open: boolean; cat: CatFilter }>("cat-gallery", () => ({
    open: false,
    cat: "all",
  }));

  function open(cat: CatFilter = "all") {
    state.value = { open: true, cat };
  }

  function close() {
    state.value = { ...state.value, open: false };
  }

  return { state, open, close };
}

import { useEffect } from "react";

export function useHashWarp(
  onWarp: (id: string) => void,
  onHighlight?: (id: string) => void
) {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      onWarp(hash);
      onHighlight?.(hash);
    }
  }, [onWarp, onHighlight]);
}

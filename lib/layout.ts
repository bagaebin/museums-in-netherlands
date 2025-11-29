import type { Museum } from "../types";

type LayoutMode = "grid" | "topic" | "map";

export function getPosition(
  museum: Museum,
  mode: LayoutMode,
  cellSize = 180,
  padding = 24
): { x: number; y: number } {
  if (mode === "map") {
    return {
      x: museum.positionMap.x * 900 + padding,
      y: museum.positionMap.y * 600 + padding,
    };
  }

  if (mode === "topic") {
    const bucket = museum.region.length % 3;
    return {
      x: (museum.positionGrid.x + bucket * 0.5) * cellSize + padding,
      y: (museum.positionGrid.y + bucket * 0.3) * cellSize + padding,
    };
  }

  return {
    x: museum.positionGrid.x * cellSize + padding,
    y: museum.positionGrid.y * cellSize + padding,
  };
}

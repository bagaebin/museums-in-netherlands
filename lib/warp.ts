import { MutableRefObject } from "react";
import { MuseumData } from "./types";

export function getHashId(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.hash.replace("#", "") || null;
}

export function focusLocker(
  containerRef: MutableRefObject<SVGSVGElement | null>,
  targetId: string,
  positions: Record<string, { x: number; y: number }>
) {
  const svg = containerRef.current;
  if (!svg) return;
  const pos = positions[targetId];
  if (!pos) return;
  const viewBox = svg.viewBox.baseVal;
  const centerX = pos.x - viewBox.width / 2;
  const centerY = pos.y - viewBox.height / 2;
  svg.setAttribute("viewBox", `${centerX} ${centerY} ${viewBox.width} ${viewBox.height}`);
}

export function findMuseumByHash(museums: MuseumData[], hashId: string | null): MuseumData | undefined {
  if (!hashId) return undefined;
  return museums.find((m) => m.id === hashId);
}

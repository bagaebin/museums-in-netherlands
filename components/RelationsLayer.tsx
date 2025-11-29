"use client";

import type { LayoutMode, Museum } from "../types";
import { getPosition } from "../lib/layout";

interface RelationsLayerProps {
  museums: Museum[];
  mode: LayoutMode;
}

export function RelationsLayer({ museums, mode }: RelationsLayerProps) {
  const connections = museums.flatMap((museum) =>
    museum.relations.map((rel) => ({
      source: museum,
      target: museums.find((m) => m.id === rel.targetId),
      label: rel.label,
    }))
  );

  return (
    <g>
      {connections.map((conn, idx) => {
        if (!conn.target) return null;
        const sourcePos = getPosition(conn.source, mode);
        const targetPos = getPosition(conn.target, mode);
        const pathId = `rel-${idx}`;
        const cx = (sourcePos.x + targetPos.x) / 2;
        const cy = Math.min(sourcePos.y, targetPos.y) - 60;
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${cx} ${cy}, ${cx} ${cy}, ${targetPos.x} ${targetPos.y}`;
        const distance = Math.hypot(sourcePos.x - targetPos.x, sourcePos.y - targetPos.y);
        const reveal = Math.min(1, distance / 320);
        const chars = Math.ceil(conn.label.length * reveal);

        return (
          <g key={pathId}>
            <path id={pathId} d={d} fill="none" stroke="#ffb347" strokeWidth={2} opacity={0.7} />
            <text fontSize={12} fill="#f6f6fa">
              <textPath xlinkHref={`#${pathId}`}>{conn.label.slice(0, chars)}</textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
}

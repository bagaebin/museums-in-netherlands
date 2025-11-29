"use client";

import { motion } from "framer-motion";
import { LayoutMode, MuseumData } from "@/lib/types";

interface RelationsLayerProps {
  museums: MuseumData[];
  positions: Record<string, { x: number; y: number }>;
  layout: LayoutMode;
}

export function RelationsLayer({ museums, positions }: RelationsLayerProps) {
  const paths: { id: string; d: string; label: string }[] = [];

  museums.forEach((museum) => {
    museum.relations?.forEach((rel, idx) => {
      const source = positions[museum.id];
      const target = positions[rel.targetId];
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const cx1 = source.x + dx * 0.25;
      const cy1 = source.y - 40;
      const cx2 = source.x + dx * 0.75;
      const cy2 = target.y + 40;
      const pathD = `M ${source.x + 70} ${source.y + 90} C ${cx1 + 70} ${cy1 + 90}, ${cx2 + 70} ${
        cy2 + 90
      }, ${target.x + 70} ${target.y + 90}`;
      paths.push({ id: `${museum.id}-${idx}`, d: pathD, label: rel.label });
    });
  });

  return (
    <g>
      {paths.map((path) => (
        <g key={path.id}>
          <motion.path
            d={path.d}
            stroke="rgba(198,255,0,0.65)"
            strokeWidth={3}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(198,255,0,0.3))" }}
            id={`path-${path.id}`}
          />
          <text fill="var(--accent)" fontSize="10" letterSpacing="0.4px">
            <textPath href={`#path-${path.id}`} startOffset="50%" textAnchor="middle">
              {path.label}
            </textPath>
          </text>
        </g>
      ))}
    </g>
  );
}

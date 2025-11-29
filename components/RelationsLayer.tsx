'use client';

import { motion } from 'motion/react';
import { PositionedMuseum } from '../lib/types';

interface RelationsLayerProps {
  museums: PositionedMuseum[];
  activeId: string | null;
}

const pathId = (source: string, target: string) => `path-${source}-${target}`;

export function RelationsLayer({ museums, activeId }: RelationsLayerProps) {
  const map = new Map(museums.map((m) => [m.id, m] as const));
  return (
    <g>
      {museums.map((museum) =>
        museum.relations.map((rel) => {
          const target = map.get(rel.targetId);
          if (!target) return null;
          const dx = target.x - museum.x;
          const dy = target.y - museum.y;
          const distance = Math.hypot(dx, dy);
          const ctrlOffset = distance * 0.3;
          const path = `M ${museum.x} ${museum.y} C ${museum.x + ctrlOffset} ${museum.y} ${target.x - ctrlOffset} ${target.y} ${target.x} ${target.y}`;
          const visibleChars = Math.max(1, Math.floor((distance / 320) * rel.label.length));
          const text = rel.label.slice(0, visibleChars);
          const isHighlighted = activeId && (activeId === museum.id || activeId === rel.targetId);
          return (
            <g key={pathId(museum.id, rel.targetId)}>
              <motion.path
                id={pathId(museum.id, rel.targetId)}
                d={path}
                fill="none"
                stroke={isHighlighted ? '#22d3ee' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 0.6 } }}
              />
              <text fontSize={12} fill={isHighlighted ? '#22d3ee' : '#cbd5e1'}>
                <textPath href={`#${pathId(museum.id, rel.targetId)}`} startOffset="50%" textAnchor="middle">
                  {text}
                </textPath>
              </text>
            </g>
          );
        })
      )}
    </g>
  );
}

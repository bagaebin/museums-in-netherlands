'use client';

import { motion } from 'framer-motion';
import { Museum, Position } from '../lib/types';
import { TILE_WIDTH, TILE_HEIGHT, STAGE_PADDING, computePathPoints, estimateReveal } from '../lib/layout';

interface RelationsLayerProps {
  museums: Museum[];
  positions: Record<string, Position>;
  stage: { width: number; height: number };
}

export function RelationsLayer({ museums, positions, stage }: RelationsLayerProps) {
  const relationThickness = Math.min(TILE_WIDTH, TILE_HEIGHT);

  const getAnchors = (source: Position, target: Position) => {
    const sourceCenter = { x: source.x + TILE_WIDTH / 2, y: source.y + TILE_HEIGHT / 2 };
    const targetCenter = { x: target.x + TILE_WIDTH / 2, y: target.y + TILE_HEIGHT / 2 };
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        start: { x: dx > 0 ? source.x + TILE_WIDTH : source.x, y: sourceCenter.y },
        end: { x: dx > 0 ? target.x : target.x + TILE_WIDTH, y: targetCenter.y },
      };
    }

    return {
      start: { x: sourceCenter.x, y: dy > 0 ? source.y + TILE_HEIGHT : source.y },
      end: { x: targetCenter.x, y: dy > 0 ? target.y : target.y + TILE_HEIGHT },
    };
  };

  return (
    <svg
      className="relations-layer"
      viewBox={`0 0 ${stage.width} ${stage.height}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ ['--relation-thickness' as string]: `${relationThickness}px` }}
    >
      {museums.map((museum) =>
        museum.relations.map((rel) => {
          const targetPos = positions[rel.targetId];
          const sourcePos = positions[museum.id];
          if (!targetPos || !sourcePos) return null;
          const { start, end } = getAnchors(sourcePos, targetPos);
          start.x += STAGE_PADDING;
          start.y += STAGE_PADDING;
          end.x += STAGE_PADDING;
          end.y += STAGE_PADDING;
          const path = computePathPoints(start, end);
          const distance = Math.hypot(end.x - start.x, end.y - start.y);
          const label = estimateReveal(rel.label, distance);
          const pathId = `path-${museum.id}-${rel.targetId}`;
          return (
            <g key={pathId}>
              <motion.path
                id={pathId}
                d={path}
                className="relation-path"
                strokeWidth={relationThickness}
                strokeDasharray="12 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.text className="relation-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                  {label}
                </textPath>
              </motion.text>
            </g>
          );
        })
      )}
    </svg>
  );
}

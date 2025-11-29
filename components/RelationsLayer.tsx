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

  const getEdgeSegment = (source: Position, target: Position) => {
    const sourceCenter = { x: source.x + TILE_WIDTH / 2, y: source.y + TILE_HEIGHT / 2 };
    const targetCenter = { x: target.x + TILE_WIDTH / 2, y: target.y + TILE_HEIGHT / 2 };
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const horizontalDominant = Math.abs(dx) >= Math.abs(dy);

    if (horizontalDominant) {
      if (dx >= 0) {
        return [
          { x: source.x + TILE_WIDTH, y: source.y },
          { x: source.x + TILE_WIDTH, y: source.y + TILE_HEIGHT },
        ];
      }
      return [
        { x: source.x, y: source.y },
        { x: source.x, y: source.y + TILE_HEIGHT },
      ];
    }

    if (dy >= 0) {
      return [
        { x: source.x, y: source.y + TILE_HEIGHT },
        { x: source.x + TILE_WIDTH, y: source.y + TILE_HEIGHT },
      ];
    }

    return [
      { x: source.x, y: source.y },
      { x: source.x + TILE_WIDTH, y: source.y },
    ];
  };

  const renderedPairs = new Set<string>();

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
          const pairId = [museum.id, rel.targetId].sort().join('-');
          if (renderedPairs.has(pairId)) return null;
          renderedPairs.add(pairId);

          const targetPos = positions[rel.targetId];
          const sourcePos = positions[museum.id];
          if (!targetPos || !sourcePos) return null;
          const sourceSegment = getEdgeSegment(sourcePos, targetPos).map((p) => ({
            x: p.x + STAGE_PADDING,
            y: p.y + STAGE_PADDING,
          }));
          const targetSegment = getEdgeSegment(targetPos, sourcePos).map((p) => ({
            x: p.x + STAGE_PADDING,
            y: p.y + STAGE_PADDING,
          }));

          const [sA, sB] = sourceSegment;
          const [tA, tB] = targetSegment;
          const labelStart = { x: (sA.x + sB.x) / 2, y: (sA.y + sB.y) / 2 };
          const labelEnd = { x: (tA.x + tB.x) / 2, y: (tA.y + tB.y) / 2 };
          const dx = labelEnd.x - labelStart.x;
          const dy = labelEnd.y - labelStart.y;
          const angle = Math.atan2(dy, dx);
          const labelFrom = Math.abs(angle) > Math.PI / 2 ? labelEnd : labelStart;
          const labelTo = Math.abs(angle) > Math.PI / 2 ? labelStart : labelEnd;
          const path = computePathPoints(labelFrom, labelTo);
          const distance = Math.hypot(labelTo.x - labelFrom.x, labelTo.y - labelFrom.y);
          const label = estimateReveal(rel.label, distance);
          const pathId = `path-${pairId}`;
          const ribbonPoints = `${sA.x},${sA.y} ${sB.x},${sB.y} ${tB.x},${tB.y} ${tA.x},${tA.y}`;
          return (
            <g key={pathId}>
              <motion.polygon
                points={ribbonPoints}
                className="relation-ribbon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.path id={pathId} d={path} className="relation-label-path" />
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

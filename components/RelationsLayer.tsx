'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { LayoutMode, Museum, Position, RelationHub } from '../lib/types';
import { TILE_WIDTH, TILE_HEIGHT, STAGE_PADDING, estimateReveal } from '../lib/layout';

interface RelationsLayerProps {
  museums: Museum[];
  positions: Record<string, Position>;
  stage: { width: number; height: number };
  layout: LayoutMode;
  onRelationClick?: (
    sourceId: string,
    targetId: string,
    label?: string,
    meta?: { hub?: RelationHub; targetType?: 'hub-member' | 'hub-node' }
  ) => void;
  relationHubs?: RelationHub[];
}

export function RelationsLayer({
  museums,
  positions,
  stage,
  layout,
  onRelationClick,
  relationHubs = [],
}: RelationsLayerProps) {
  const [hoveredRibbonId, setHoveredRibbonId] = useState<string | null>(null);

  const museumById = useMemo(
    () => Object.fromEntries(museums.map((museum) => [museum.id, museum])),
    [museums]
  );

  const relationThickness = Math.min(TILE_WIDTH, TILE_HEIGHT);

  const getEdgeSegment = (source: Position, target: Position) => {
    const edges = {
      left: [
        { x: source.x, y: source.y },
        { x: source.x, y: source.y + TILE_HEIGHT },
      ],
      right: [
        { x: source.x + TILE_WIDTH, y: source.y },
        { x: source.x + TILE_WIDTH, y: source.y + TILE_HEIGHT },
      ],
      top: [
        { x: source.x, y: source.y },
        { x: source.x + TILE_WIDTH, y: source.y },
      ],
      bottom: [
        { x: source.x, y: source.y + TILE_HEIGHT },
        { x: source.x + TILE_WIDTH, y: source.y + TILE_HEIGHT },
      ],
    } as const;

    const sourceRect = {
      left: source.x,
      right: source.x + TILE_WIDTH,
      top: source.y,
      bottom: source.y + TILE_HEIGHT,
    };
    const targetRect = {
      left: target.x,
      right: target.x + TILE_WIDTH,
      top: target.y,
      bottom: target.y + TILE_HEIGHT,
    };

    if (layout === 'grid') {
      const horizontalGap =
        targetRect.left >= sourceRect.right
          ? targetRect.left - sourceRect.right
          : sourceRect.left >= targetRect.right
            ? sourceRect.left - targetRect.right
            : 0;
      const verticalGap =
        targetRect.top >= sourceRect.bottom
          ? targetRect.top - sourceRect.bottom
          : sourceRect.top >= targetRect.bottom
            ? sourceRect.top - targetRect.bottom
            : 0;

      if (horizontalGap <= verticalGap) {
        if (targetRect.left >= sourceRect.right) return edges.right;
        if (targetRect.right <= sourceRect.left) return edges.left;
      }

      if (targetRect.top >= sourceRect.bottom) return edges.bottom;
      if (targetRect.bottom <= sourceRect.top) return edges.top;
    }

    const sourceCenter = { x: source.x + TILE_WIDTH / 2, y: source.y + TILE_HEIGHT / 2 };
    const targetCenter = { x: target.x + TILE_WIDTH / 2, y: target.y + TILE_HEIGHT / 2 };
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const horizontalDominant = Math.abs(dx) >= Math.abs(dy);

    if (horizontalDominant) {
      if (dx >= 0) return edges.right;
      return edges.left;
    }

    if (dy >= 0) return edges.bottom;

    return edges.top;
  };

  const getEdgeTowardsPoint = (source: Position, targetPoint: Position) => {
    const paddedSource = {
      x: source.x + STAGE_PADDING,
      y: source.y + STAGE_PADDING,
    };

    const edges = {
      left: [
        { x: paddedSource.x, y: paddedSource.y },
        { x: paddedSource.x, y: paddedSource.y + TILE_HEIGHT },
      ],
      right: [
        { x: paddedSource.x + TILE_WIDTH, y: paddedSource.y },
        { x: paddedSource.x + TILE_WIDTH, y: paddedSource.y + TILE_HEIGHT },
      ],
      top: [
        { x: paddedSource.x, y: paddedSource.y },
        { x: paddedSource.x + TILE_WIDTH, y: paddedSource.y },
      ],
      bottom: [
        { x: paddedSource.x, y: paddedSource.y + TILE_HEIGHT },
        { x: paddedSource.x + TILE_WIDTH, y: paddedSource.y + TILE_HEIGHT },
      ],
    } as const;

    const center = {
      x: paddedSource.x + TILE_WIDTH / 2,
      y: paddedSource.y + TILE_HEIGHT / 2,
    };
    const dx = targetPoint.x - center.x;
    const dy = targetPoint.y - center.y;
    const horizontalDominant = Math.abs(dx) >= Math.abs(dy);

    if (horizontalDominant) {
      if (dx >= 0) return edges.right;
      return edges.left;
    }

    if (dy >= 0) return edges.bottom;

    return edges.top;
  };

  const computeHubAnchor = (hub: RelationHub): Position | null => {
    const memberCenters = hub.members
      .map((id) => positions[id])
      .filter(Boolean)
      .map((pos) => ({
        x: pos!.x + TILE_WIDTH / 2 + STAGE_PADDING,
        y: pos!.y + TILE_HEIGHT / 2 + STAGE_PADDING,
      }));

    if (!memberCenters.length) return null;

    const sum = memberCenters.reduce(
      (acc, cur) => ({ x: acc.x + cur.x, y: acc.y + cur.y }),
      { x: 0, y: 0 }
    );

    const base = { x: sum.x / memberCenters.length, y: sum.y / memberCenters.length };
    const layoutOffset = hub.layoutOffsets?.find((item) => item.layout === layout)?.offset;
    const offset = layoutOffset ?? hub.offset ?? { x: 0, y: 0 };

    return { x: base.x + offset.x, y: base.y + offset.y };
  };

  const renderedPairs = new Set<string>();

  return (
    <svg
      className="relations-layer"
      viewBox={`0 0 ${stage.width} ${stage.height}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ overflow: 'visible', ['--relation-thickness' as string]: `${relationThickness}px` }}
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
          const path = `M ${labelFrom.x} ${labelFrom.y} L ${labelTo.x} ${labelTo.y}`;
          const distance = Math.hypot(labelTo.x - labelFrom.x, labelTo.y - labelFrom.y);
          const label = estimateReveal(rel.label, distance);
          const pathId = `path-${pairId}`;
          const ribbonPoints = `${sA.x},${sA.y} ${sB.x},${sB.y} ${tB.x},${tB.y} ${tA.x},${tA.y}`;
          const activateRelation = () => onRelationClick?.(museum.id, rel.targetId);

          return (
            <g
              key={pathId}
              role="button"
              tabIndex={0}
              className="relation-hit"
              aria-label={`${museum.name} – ${museumById[rel.targetId]?.name ?? rel.targetId} 연결 보기`}
              onClick={activateRelation}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  activateRelation();
                }
              }}
              style={{ pointerEvents: 'auto' }}
            >
              <motion.polygon
                points={ribbonPoints}
                className="relation-ribbon interactive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.path id={pathId} d={path} className="relation-label-path" />
              <motion.text
                className="relation-label interactive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                  {label}
                </textPath>
              </motion.text>
            </g>
          );
        })
      )}
      {relationHubs.map((hub) => {
        const anchor = computeHubAnchor(hub);
        if (!anchor) return null;

        const hubLabel = estimateReveal(hub.label, 180);
        const hasHubInfo = Boolean(hub.info);
        const hubHitRadius = 60;

        const activateHubInfo = () => {
          if (!hasHubInfo) return;
          onRelationClick?.(hub.id, hub.id, hub.label, { hub, targetType: 'hub-node' });
        };

        return (
          <g key={hub.id} className="relation-hub-cluster">
            <g
              role={hasHubInfo ? 'button' : 'presentation'}
              tabIndex={hasHubInfo ? 0 : -1}
              className={`relation-hit relation-hub-node-hit${hasHubInfo ? ' interactive' : ''}`}
              aria-label={hasHubInfo ? `${hub.label} 허브 정보 보기` : undefined}
              onClick={activateHubInfo}
              onKeyDown={(event) => {
                if (!hasHubInfo) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  activateHubInfo();
                }
              }}
              style={{ pointerEvents: hasHubInfo ? 'auto' : 'none' }}
            >
              <motion.circle
                className="relation-hub-hit-zone"
                cx={anchor.x}
                cy={anchor.y}
                r={hubHitRadius}
                initial={{ opacity: 0 }}
                animate={{ opacity: hasHubInfo ? 0.14 : 0 }}
              />
            </g>
            {hub.members.map((memberId) => {
              const memberPosition = positions[memberId];
              if (!memberPosition) return null;

              const segment = getEdgeTowardsPoint(memberPosition, anchor);
              const [mA, mB] = segment;
              const mid = { x: (mA.x + mB.x) / 2, y: (mA.y + mB.y) / 2 };
              const labelDistance = Math.hypot(mid.x - anchor.x, mid.y - anchor.y);

              // Bezier Curve Logic for Organic Ribbon
              // Start points: mA, mB (Locker edge)
              // End points: hA, hB (Hub center with thickness)
              
              const dx = anchor.x - mid.x;
              const dy = anchor.y - mid.y;
              
              // Calculate perpendicular vector for thickness at anchor
              // We use the edge vector (mB - mA) to determine orientation and thickness
              const edgeVec = { x: mB.x - mA.x, y: mB.y - mA.y };
              
              // Scale factor for thickness at the hub (1.0 = same as locker edge)
              const thicknessScale = 0.8
              
              const hA = { 
                x: anchor.x - (edgeVec.x * thicknessScale) / 2, 
                y: anchor.y - (edgeVec.y * thicknessScale) / 2 
              };
              const hB = { 
                x: anchor.x + (edgeVec.x * thicknessScale) / 2, 
                y: anchor.y + (edgeVec.y * thicknessScale) / 2 
              };

              // Control point offset factor
              const cpFactor = 0.5;
              
              // Control points from Member side
              const cp1A = { x: mA.x + dx * cpFactor, y: mA.y + dy * cpFactor };
              const cp1B = { x: mB.x + dx * cpFactor, y: mB.y + dy * cpFactor };

              // Control points from Anchor side
              // Now relative to hA/hB to maintain parallel flow
              // const cp2A = { x: hA.x - dx * cpFactor, y: hA.y - dy * cpFactor }; 
              // const cp2B = { x: hB.x - dx * cpFactor, y: hB.y - dy * cpFactor };

              // Straight Line Logic (Trapezoid)
              const ribbonPath = `
                M ${mA.x} ${mA.y}
                L ${hA.x} ${hA.y}
                L ${hB.x} ${hB.y}
                L ${mB.x} ${mB.y}
                Z
              `;

              const labelPath = `M ${anchor.x} ${anchor.y} L ${mid.x} ${mid.y}`;
              const pathId = `hub-path-${hub.id}-${memberId}`;
              const gradientId = `grad-${hub.id}-${memberId}`;
              const isHovered = hoveredRibbonId === pathId;

              const label = estimateReveal(
                `${hub.label} · ${museumById[memberId]?.name ?? memberId}`,
                labelDistance
              );

              const activateRelation = () =>
                onRelationClick?.(hub.id, memberId, label, { hub, targetType: 'hub-member' });

              return (
                <g
                  key={pathId}
                  role="button"
                  tabIndex={0}
                  className="relation-hit relation-hub-hit"
                  aria-label={`${hub.label} – ${museumById[memberId]?.name ?? memberId} 허브 연결 보기`}
                  onClick={activateRelation}
                  onMouseEnter={() => setHoveredRibbonId(pathId)}
                  onMouseLeave={() => setHoveredRibbonId(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      activateRelation();
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1={mid.x}
                      y1={mid.y}
                      x2={anchor.x}
                      y2={anchor.y}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffb400" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffb400" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={ribbonPath}
                    className="relation-ribbon interactive"
                    style={{ fill: isHovered ? `url(#${gradientId})` : undefined }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path id={pathId} d={labelPath} className="relation-label-path" />
                  <motion.text
                    className="relation-label relation-hub-label interactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                      {label}
                    </textPath>
                  </motion.text>
                </g>
              );
            })}
            <motion.text
              className="relation-label relation-hub-label"
              x={anchor.x}
              y={anchor.y - 20}
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {hubLabel}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

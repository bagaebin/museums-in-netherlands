'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LayoutMode, Museum, Position, RelationHub } from '../lib/types';
import { TILE_WIDTH, TILE_HEIGHT, STAGE_PADDING, estimateReveal } from '../lib/layout';

const buildSmoothClosedPath = (points: Position[], tension = 0.2): string | null => {
  if (points.length < 2) return null;
  if (points.length === 2) {
    const [a, b] = points;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y} Z`;
  }

  const wrapped = [...points, points[0], points[1], points[2 % points.length]];
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length; i += 1) {
    const p0 = wrapped[i];
    const p1 = wrapped[i + 1];
    const p2 = wrapped[i + 2];
    const p3 = wrapped[i + 3];

    const cp1 = {
      x: p1.x + ((p2.x - p0.x) / 6) * tension,
      y: p1.y + ((p2.y - p0.y) / 6) * tension,
    };
    const cp2 = {
      x: p2.x - ((p3.x - p1.x) / 6) * tension,
      y: p2.y - ((p3.y - p1.y) / 6) * tension,
    };

    d += ` C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p2.x} ${p2.y}`;
  }

  return `${d} Z`;
};

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
        const branchThickness = Math.max(12, Math.min(22, relationThickness * 0.18));
        const labelOffset = branchThickness * 1.4 + 12;
        const memberMeta = hub.members
          .map((memberId) => {
            const memberPosition = positions[memberId];
            if (!memberPosition) return null;

            const segment = getEdgeTowardsPoint(memberPosition, anchor);
            const [mA, mB] = segment;
            const mid = { x: (mA.x + mB.x) / 2, y: (mA.y + mB.y) / 2 };
            const angle = Math.atan2(mid.y - anchor.y, mid.x - anchor.x);

            return { memberId, segment, mid, angle };
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
          .sort((a, b) => a.angle - b.angle);

        const enrichedMembers = memberMeta.map((meta, index) => {
          const { memberId, segment, mid, angle } = meta;
          const [mA, mB] = segment;
          const prev = memberMeta[(index - 1 + memberMeta.length) % memberMeta.length]?.angle ?? angle;
          const next = memberMeta[(index + 1) % memberMeta.length]?.angle ?? angle;
          const twoPi = Math.PI * 2;
          const gapPrev = ((angle - prev + twoPi) % twoPi) / 2;
          const gapNext = ((next - angle + twoPi) % twoPi) / 2;
          const arcPadding = 0.04;
          const availableHalf = Math.max(0.02, Math.min(gapPrev, gapNext) - arcPadding);
          const memberWidth = Math.hypot(mA.x - mB.x, mA.y - mB.y);
          const halfFromWidth = Math.asin(Math.min(1, memberWidth / Math.max(1, branchThickness * 4)));
          const halfAngle = Math.min(halfFromWidth || availableHalf, availableHalf);
          const baseA = angle - halfAngle;
          const baseB = angle + halfAngle;
          const hubEdgeCenter = {
            x: anchor.x + Math.cos(angle) * branchThickness,
            y: anchor.y + Math.sin(angle) * branchThickness,
          };

          return {
            memberId,
            segment,
            mid,
            angle,
            baseA,
            baseB,
            memberA: mA,
            memberB: mB,
            hubEdgeCenter,
          };
        });

        const mergedPath = buildSmoothClosedPath(enrichedMembers.map(({ mid }) => mid), 0.35);

        const activateHubInfo = () => {
          if (!hasHubInfo) return;
          onRelationClick?.(hub.id, hub.id, hub.label, { hub, targetType: 'hub-node' });
        };
        return (
          <g
            key={hub.id}
            className="relation-hub-cluster"
            style={{ ['--hub-branch-thickness' as string]: `${branchThickness}px` }}
          >
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
                r={Math.max(branchThickness * 2.5, 40)}
                initial={{ opacity: 0 }}
                animate={{ opacity: hasHubInfo ? 0.04 : 0 }}
              />
            </g>
            {mergedPath ? (
              <motion.path
                className="relation-hub-merged"
                d={mergedPath}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ) : null}
            {enrichedMembers.map((meta) => {
              const { memberId, mid, hubEdgeCenter } = meta;
              const labelDistance = Math.hypot(mid.x - hubEdgeCenter.x, mid.y - hubEdgeCenter.y);
              const path = `M ${hubEdgeCenter.x} ${hubEdgeCenter.y} L ${mid.x} ${mid.y}`;
              const pathId = `hub-path-${hub.id}-${memberId}`;
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
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      activateRelation();
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <motion.path
                    d={path}
                    className="relation-ribbon relation-hub-ribbon relation-hub-branch interactive"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path id={pathId} d={path} className="relation-label-path" />
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
              y={anchor.y - labelOffset}
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

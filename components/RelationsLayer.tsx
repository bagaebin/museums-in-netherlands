'use client';

import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
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
  relationHubOffsets?: Record<string, Partial<Record<LayoutMode, Position>>>;
  onHubOffsetChange?: (hubId: string, layout: LayoutMode, offset: Position) => void;
}

export function RelationsLayer({
  museums,
  positions,
  stage,
  layout,
  onRelationClick,
  relationHubs = [],
  relationHubOffsets = {},
  onHubOffsetChange,
}: RelationsLayerProps) {
  const museumById = useMemo(
    () => Object.fromEntries(museums.map((museum) => [museum.id, museum])),
    [museums]
  );

  const relationThickness = Math.min(TILE_WIDTH, TILE_HEIGHT);
  // 마름모의 크기 설정
  const RHOMBUS_RADIUS = TILE_WIDTH / 1.6;

  const intersectRhombus = (center: Position, target: Position) => {
    const dx = target.x - center.x;
    const dy = target.y - center.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    if (dist === 0) return center;
    const k = RHOMBUS_RADIUS / dist;
    return { x: center.x + k * dx, y: center.y + k * dy };
  };

  const getSmartEdgeConnection = (source: Position, target: Position) => {
    const getEdges = (pos: Position) => {
      const padded = { x: pos.x + STAGE_PADDING, y: pos.y + STAGE_PADDING };
      return {
        left: [
          { x: padded.x, y: padded.y },
          { x: padded.x, y: padded.y + TILE_HEIGHT },
        ],
        right: [
          { x: padded.x + TILE_WIDTH, y: padded.y },
          { x: padded.x + TILE_WIDTH, y: padded.y + TILE_HEIGHT },
        ],
        top: [
          { x: padded.x, y: padded.y },
          { x: padded.x + TILE_WIDTH, y: padded.y },
        ],
        bottom: [
          { x: padded.x, y: padded.y + TILE_HEIGHT },
          { x: padded.x + TILE_WIDTH, y: padded.y + TILE_HEIGHT },
        ],
      };
    };

    const sEdges = getEdges(source);
    const tEdges = getEdges(target);

    const sCenter = { x: source.x + TILE_WIDTH / 2, y: source.y + TILE_HEIGHT / 2 };
    const tCenter = { x: target.x + TILE_WIDTH / 2, y: target.y + TILE_HEIGHT / 2 };
    const dx = tCenter.x - sCenter.x;
    const dy = tCenter.y - sCenter.y;

    // Candidates
    const candidates = [];

    // 1. Horizontal Pair
    const sHorz = dx >= 0 ? sEdges.right : sEdges.left;
    const tHorz = dx >= 0 ? tEdges.left : tEdges.right;
    candidates.push({ s: sHorz, t: tHorz, type: 'horizontal' });

    // 2. Vertical Pair
    const sVert = dy >= 0 ? sEdges.bottom : sEdges.top;
    const tVert = dy >= 0 ? tEdges.top : tEdges.bottom;
    candidates.push({ s: sVert, t: tVert, type: 'vertical' });

    // Evaluate
    let best = candidates[0];
    let maxMinDist = -1;

    for (const cand of candidates) {
      // Calculate min width of the ribbon
      // Ribbon is s[0]-s[1]-t[1]-t[0] (approx order)
      // Actually s[0], s[1] are one edge. t[0], t[1] are other edge.
      // We connect s[0]-t[0] and s[1]-t[1] (or crossed).
      // Let's assume uncrossed.
      const d1 = Math.hypot(cand.s[0].x - cand.t[0].x, cand.s[0].y - cand.t[0].y);
      const d2 = Math.hypot(cand.s[1].x - cand.t[1].x, cand.s[1].y - cand.t[1].y);
      const d3 = Math.hypot(cand.s[0].x - cand.t[1].x, cand.s[0].y - cand.t[1].y);
      const d4 = Math.hypot(cand.s[1].x - cand.t[0].x, cand.s[1].y - cand.t[0].y);

      // Uncrossed: s0-t0, s1-t1 vs s0-t1, s1-t0
      // We want the one with shorter connections (uncrossed)
      const uncrossedDist = d1 + d2;
      const crossedDist = d3 + d4;
      
      let p1, p2, p3, p4;
      if (uncrossedDist < crossedDist) {
        p1 = cand.s[0]; p2 = cand.s[1]; p3 = cand.t[1]; p4 = cand.t[0];
      } else {
        p1 = cand.s[0]; p2 = cand.s[1]; p3 = cand.t[0]; p4 = cand.t[1];
      }

      // Calculate width at midpoint
      const m1 = { x: (p1.x + p4.x) / 2, y: (p1.y + p4.y) / 2 };
      const m2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
      const width = Math.hypot(m1.x - m2.x, m1.y - m2.y);

      if (width > maxMinDist) {
        maxMinDist = width;
        best = cand;
      }
    }

    return { source: best.s, target: best.t };
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
    const runtimeOffset = relationHubOffsets[hub.id]?.[layout];
    const offset = runtimeOffset ?? layoutOffset ?? hub.offset ?? { x: 0, y: 0 };

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
          
          const smartConn = getSmartEdgeConnection(sourcePos, targetPos);
          const sourceSegment = smartConn.source.map((p) => ({
            x: p.x + STAGE_PADDING,
            y: p.y + STAGE_PADDING,
          }));
          const targetSegment = smartConn.target.map((p) => ({
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

        const currentOffset = relationHubOffsets[hub.id]?.[layout] ?? { x: 0, y: 0 };

        const hubLabel = estimateReveal(hub.label, 180);
        const hasHubInfo = Boolean(hub.info);
        const hubHitRadius = RHOMBUS_RADIUS;

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

        // 1. Assign initial sides based on angle
        const getPreferredSide = (angle: number) => {
          if (angle >= -Math.PI && angle < -Math.PI / 2) return 3; // Top-Left
          if (angle >= -Math.PI / 2 && angle < 0) return 0; // Top-Right
          if (angle >= 0 && angle < Math.PI / 2) return 1; // Bottom-Right
          return 2; // Bottom-Left
        };

        const membersWithSide = memberMeta.map((m) => ({
          ...m,
          assignedSide: getPreferredSide(m.angle),
        }));

        // 2. Resolve conflicts (distribute to empty adjacent sides)
        const sideGroups: number[][] = [[], [], [], []];
        membersWithSide.forEach((m, i) => {
          sideGroups[m.assignedSide].push(i);
        });

        // Helper to check if a side is "good enough" (facing the member)
        const isSideValid = (sideIndex: number, memberAngle: number) => {
          const sideAngles = [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];
          const sideAngle = sideAngles[sideIndex];
          const diff = Math.abs(memberAngle - sideAngle);
          const normalizedDiff = Math.min(diff, Math.PI * 2 - diff);
          // Allow up to ~80 degrees deviation (almost perpendicular is okay, but not back-facing)
          return normalizedDiff < (Math.PI / 2) * 0.9;
        };

        for (let s = 0; s < 4; s++) {
          if (sideGroups[s].length > 1) {
            const group = sideGroups[s];
            const prevSide = (s + 3) % 4;
            const nextSide = (s + 1) % 4;

            // Try move first member to prev side if empty AND valid
            if (sideGroups[prevSide].length === 0) {
              const idxToMove = group[0]; // Check first member
              if (isSideValid(prevSide, membersWithSide[idxToMove].angle)) {
                group.shift();
                membersWithSide[idxToMove].assignedSide = prevSide;
                sideGroups[prevSide].push(idxToMove);
              }
            }

            // If still > 1, try move last member to next side if empty AND valid
            if (group.length > 1) {
              if (sideGroups[nextSide].length === 0) {
                const idxToMove = group[group.length - 1]; // Check last member
                if (isSideValid(nextSide, membersWithSide[idxToMove].angle)) {
                  group.pop();
                  membersWithSide[idxToMove].assignedSide = nextSide;
                  sideGroups[nextSide].push(idxToMove);
                }
              }
            }
          }
        }

        const enrichedMembers = membersWithSide.map((meta) => {
          const { memberId, segment, mid, assignedSide } = meta;
          const [mA, mB] = segment;

          const top = { x: anchor.x, y: anchor.y - RHOMBUS_RADIUS };
          const right = { x: anchor.x + RHOMBUS_RADIUS, y: anchor.y };
          const bottom = { x: anchor.x, y: anchor.y + RHOMBUS_RADIUS };
          const left = { x: anchor.x - RHOMBUS_RADIUS, y: anchor.y };

          const sideVertices = [
            [top, right],    // Side 0: Top-Right
            [right, bottom], // Side 1: Bottom-Right
            [bottom, left],  // Side 2: Bottom-Left
            [left, top],     // Side 3: Top-Left
          ];

          const [v1, v2] = sideVertices[assignedSide];

          // Match vertices to member edge points to avoid twisting
          // Calculate total distance for both possible pairings
          const d1 = Math.hypot(v1.x - mA.x, v1.y - mA.y) + Math.hypot(v2.x - mB.x, v2.y - mB.y);
          const d2 = Math.hypot(v1.x - mB.x, v1.y - mB.y) + Math.hypot(v2.x - mA.x, v2.y - mA.y);

          // Assign hubA and hubB such that hubA connects to mA and hubB connects to mB
          const hubA = d1 < d2 ? v1 : v2;
          const hubB = d1 < d2 ? v2 : v1;

          // Center of the chosen side for label positioning
          const hubEdgeCenter = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 };

          return {
            memberId,
            mid,
            hubEdgeCenter,
            start: hubA,
            end: hubB,
            startM: mA,
            endM: mB,
          };
        });

        const rhombusPath = `M ${anchor.x + RHOMBUS_RADIUS} ${anchor.y} L ${anchor.x} ${anchor.y + RHOMBUS_RADIUS} L ${anchor.x - RHOMBUS_RADIUS} ${anchor.y} L ${anchor.x} ${anchor.y - RHOMBUS_RADIUS} Z`;

        const activateHubInfo = () => {
          if (!hasHubInfo) return;
          onRelationClick?.(hub.id, hub.id, hub.label, { hub, targetType: 'hub-node' });
        };

        const startDrag = (event: React.PointerEvent<SVGGElement>) => {
          if (!onHubOffsetChange) return;
          if (event.button !== 0) return;
          event.preventDefault();
          const startPoint = { x: event.clientX, y: event.clientY };
          const baseOffset = currentOffset;

          const handleMove = (e: PointerEvent) => {
            const dx = e.clientX - startPoint.x;
            const dy = e.clientY - startPoint.y;
            onHubOffsetChange?.(hub.id, layout, { x: baseOffset.x + dx, y: baseOffset.y + dy });
          };

          const stop = () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', stop);
            window.removeEventListener('pointercancel', stop);
          };

          window.addEventListener('pointermove', handleMove);
          window.addEventListener('pointerup', stop);
          window.addEventListener('pointercancel', stop);
        };
        return (
          <g
            key={hub.id}
            className="relation-hub-cluster"
            onPointerDown={startDrag}
            style={{ cursor: onHubOffsetChange ? 'grab' : undefined }}
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
              <motion.path
                className="relation-hub-hit-zone"
                d={rhombusPath}
                initial={{ opacity: 0 }}
                animate={{ opacity: hasHubInfo ? 0.14 : 0 }}
              />
              <motion.path
                className="relation-hub-node"
                d={rhombusPath}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </g>
            {enrichedMembers.map((meta) => {
              const { memberId, mid, hubEdgeCenter, start, end, startM, endM } = meta;
              const labelDistance = Math.hypot(mid.x - hubEdgeCenter.x, mid.y - hubEdgeCenter.y);
              const ribbonPoints = `${start.x},${start.y} ${end.x},${end.y} ${endM.x},${endM.y} ${startM.x},${startM.y}`;
              
              // Calculate angle to determine text direction
              const dx = mid.x - hubEdgeCenter.x;
              const dy = mid.y - hubEdgeCenter.y;
              const angle = Math.atan2(dy, dx);
              
              // If angle is such that text would be upside down (left-to-right reading), swap start/end
              // Angles where text is upside down: roughly (90, 270) degrees, i.e., PI/2 to 3PI/2
              // Math.atan2 returns -PI to PI.
              // Upside down range: abs(angle) > PI/2
              const isInverted = Math.abs(angle) > Math.PI / 2;

              const path = isInverted
                ? `M ${mid.x} ${mid.y} L ${hubEdgeCenter.x} ${hubEdgeCenter.y}`
                : `M ${hubEdgeCenter.x} ${hubEdgeCenter.y} L ${mid.x} ${mid.y}`;
                
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
                  <motion.polygon
                    points={ribbonPoints}
                    className="relation-ribbon relation-hub-ribbon interactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
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
              y={anchor.y}
              dy=".3em"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ pointerEvents: 'none', fill: 'var(--foreground)' }}
            >
              {hub.label}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

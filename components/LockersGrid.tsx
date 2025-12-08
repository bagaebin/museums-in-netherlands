'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { LayoutMode, Museum, Position } from '../lib/types';
import { TILE_HEIGHT } from '../lib/layout';
import { Locker, ClipStyle } from './Locker';
import { RelationsLayer } from './RelationsLayer';

interface LockersGridProps {
  museums: Museum[];
  positions: Record<string, Position>;
  activeId?: string | null;
  expandedId?: string | null;
  layout: LayoutMode;
  onOpen: (id: string) => void;
  onExpand?: (id: string) => void;
  onPositionChange: (id: string, pos: Position) => void;
  highlightId?: string | null;
  clipStyle?: ClipStyle;
  expansionRadius?: number;
  stage: { width: number; height: number };
  onRelationClick?: (sourceId: string, targetId: string) => void;
  topicRowLabels?: string[];
  showTopicRowLabels?: boolean;
}

export function LockersGrid({
  museums,
  positions,
  activeId,
  expandedId,
  layout,
  onOpen,
  onExpand,
  onPositionChange,
  highlightId,
  clipStyle = 'rect',
  expansionRadius = 800,
  stage,
  onRelationClick,
  topicRowLabels,
  showTopicRowLabels = false,
}: LockersGridProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const sorted = useMemo(() => museums.slice().sort((a, b) => a.name.localeCompare(b.name)), [museums]);

  const rowAnchors = useMemo(() => {
    if (layout !== 'topic' || !topicRowLabels?.length) return [];
    const values = Object.values(positions);
    if (!values.length) return [];
    const tolerance = TILE_HEIGHT * 0.55;
    const clusters: { center: number; count: number }[] = [];

    values
      .map((pos) => pos.y)
      .sort((a, b) => a - b)
      .forEach((y) => {
        const existing = clusters.find((cluster) => Math.abs(cluster.center - y) <= tolerance);
        if (existing) {
          existing.center = (existing.center * existing.count + y) / (existing.count + 1);
          existing.count += 1;
        } else {
          clusters.push({ center: y, count: 1 });
        }
      });

    return clusters
      .map((cluster) => cluster.center + TILE_HEIGHT / 2)
      .sort((a, b) => a - b)
      .slice(0, topicRowLabels.length);
  }, [layout, positions, topicRowLabels]);

  return (
    <div className="lockers-layer">
      <AnimatePresence>
        {showTopicRowLabels && rowAnchors.length > 0 && topicRowLabels?.length ? (
          <motion.div className="topic-row-tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {topicRowLabels.map((label, index) => {
              const y = rowAnchors[index];
              if (typeof y !== 'number') return null;
              return (
                <motion.div
                  key={label}
                  className="topic-row-tag"
                  style={{ top: y ?? 0 }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18, delay: index * 0.04 }}
                >
                  <span>{label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {sorted.map((museum) => (
        <Locker
          key={`${layout}-${museum.id}`}
          museum={museum}
          position={positions[museum.id] ?? { x: 0, y: 0 }}
          isActive={activeId === museum.id}
          isExpanded={expandedId === museum.id}
          onOpen={() => onOpen(museum.id)}
          onExpand={() => onExpand?.(museum.id)}
          onDrag={(pos) => onPositionChange(museum.id, pos)}
          clipStyle={clipStyle}
          highlight={highlightId === museum.id}
          expansionRadius={expansionRadius}
          draggable={layout !== 'map'}
        />
      ))}
      {animationComplete && (
        <RelationsLayer
          museums={museums}
          positions={positions}
          stage={stage}
          layout={layout}
          onRelationClick={onRelationClick}
        />
      )}
    </div>
  );
}

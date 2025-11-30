'use client';

import { useMemo, useState } from 'react';
import { LayoutMode, Museum, Position } from '../lib/types';
import { Locker, ClipStyle } from './Locker';
import { RelationsLayer } from './RelationsLayer';

interface LockersGridProps {
  museums: Museum[];
  positions: Record<string, Position>;
  activeId?: string | null;
  layout: LayoutMode;
  onOpen: (id: string) => void;
  onExpand?: (id: string) => void;
  onPositionChange: (id: string, pos: Position) => void;
  highlightId?: string | null;
  clipStyle?: ClipStyle;
  expansionRadius?: number;
  stage: { width: number; height: number };
  onRelationClick?: (sourceId: string, targetId: string) => void;
}

export function LockersGrid({
  museums,
  positions,
  activeId,
  layout,
  onOpen,
  onExpand,
  onPositionChange,
  highlightId,
  clipStyle = 'rect',
  expansionRadius = 800,
  stage,
  onRelationClick,
}: LockersGridProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const sorted = useMemo(() => museums.slice().sort((a, b) => a.name.localeCompare(b.name)), [museums]);

  return (
    <div className="lockers-layer">
      {sorted.map((museum) => (
        <Locker
          key={`${layout}-${museum.id}`}
          museum={museum}
          position={positions[museum.id] ?? { x: 0, y: 0 }}
          isActive={activeId === museum.id}
          onOpen={() => onOpen(museum.id)}
          onExpand={() => onExpand?.(museum.id)}
          onDrag={(pos) => onPositionChange(museum.id, pos)}
          onAnimationComplete={() => setAnimationComplete(true)}
          clipStyle={clipStyle}
          highlight={highlightId === museum.id}
          expansionRadius={expansionRadius}
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

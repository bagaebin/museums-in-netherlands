'use client';

import { useMemo } from 'react';
import { LayoutMode, Museum, Position } from '../lib/types';
import { Locker, ClipStyle } from './Locker';

interface LockersGridProps {
  museums: Museum[];
  positions: Record<string, Position>;
  activeId?: string | null;
  layout: LayoutMode;
  onOpen: (id: string) => void;
  onPositionChange: (id: string, pos: Position) => void;
  highlightId?: string | null;
  clipStyle?: ClipStyle;
  expansionRadius?: number;
}

export function LockersGrid({
  museums,
  positions,
  activeId,
  layout,
  onOpen,
  onPositionChange,
  highlightId,
  clipStyle = 'rect',
  expansionRadius = 800,
}: LockersGridProps) {
  const sorted = useMemo(() => museums.slice().sort((a, b) => a.name.localeCompare(b.name)), [museums]);

  return (
    <div className="lockers-layer">
      {sorted.map((museum) => (
        <Locker
          key={museum.id}
          museum={museum}
          position={positions[museum.id] ?? { x: 0, y: 0 }}
          isActive={activeId === museum.id}
          onOpen={() => onOpen(museum.id)}
          onDrag={(pos) => onPositionChange(museum.id, pos)}
          clipStyle={clipStyle}
          highlight={highlightId === museum.id}
          expansionRadius={expansionRadius}
        />
      ))}
    </div>
  );
}

'use client';

import { motion } from 'motion/react';
import { PositionedMuseum } from '../lib/types';
import { Locker } from './Locker';
import { RelationsLayer } from './RelationsLayer';

interface LockersGridProps {
  museums: PositionedMuseum[];
  activeId: string | null;
  onOpen: (id: string) => void;
  highlightedId?: string | null;
}

export function LockersGrid({ museums, activeId, onOpen, highlightedId }: LockersGridProps) {
  return (
    <motion.svg width="100%" height="100%" viewBox="0 0 1000 720">
      <RelationsLayer museums={museums} activeId={activeId} />
      {museums.map((museum) => (
        <Locker
          key={museum.id}
          museum={museum}
          x={museum.x}
          y={museum.y}
          isActive={activeId === museum.id}
          highlight={highlightedId === museum.id}
          onOpen={() => onOpen(museum.id)}
        />
      ))}
    </motion.svg>
  );
}

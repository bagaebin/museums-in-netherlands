'use client';

import { motion, Variants } from 'framer-motion';
import { Museum, Position } from '../lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';

const doorVariants: Variants = {
  open: {
    rotateY: -90,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
  closed: {
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

const detailBgRectVariants: Variants = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 16px)',
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 18,
      delay: 0.12,
    },
  },
  closed: {
    clipPath: 'inset(50% 50% 50% 50% round 16px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

const detailBgCircleVariants: Variants = {
  open: (radius: number = 800) => ({
    clipPath: `circle(${radius}px at 50% 50%)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
      delay: 0.12,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 50% 50%)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

const detailContentVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.25,
    },
  },
  closed: {
    opacity: 0,
    y: 10,
  },
};

export type ClipStyle = 'rect' | 'circle';

interface LockerProps {
  museum: Museum;
  position: Position;
  isActive: boolean;
  onOpen: () => void;
  onExpand?: () => void;
  clipStyle?: ClipStyle;
  highlight?: boolean;
  onDrag?: (pos: Position) => void;
  expansionRadius?: number;
}

export function Locker({
  museum,
  position,
  isActive,
  onOpen,
  onExpand,
  clipStyle = 'rect',
  highlight = false,
  onDrag,
  expansionRadius = 800,
}: LockerProps) {
  const variants = useMemo(() => {
    return clipStyle === 'circle' ? detailBgCircleVariants : detailBgRectVariants;
  }, [clipStyle]);

  const [isHeld, setIsHeld] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const dragOrigin = useRef<Position | null>(null);

  const triggerExpand = () => {
    if (isActive && onExpand) {
      onExpand();
    }
  };

  const startHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setIsHeld(true), 650);
  };

  const cancelHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsHeld(false);
  };

  useEffect(() => () => holdTimer.current && clearTimeout(holdTimer.current), []);

  const isOpen = isActive || isHeld;
  const radius = isHeld ? expansionRadius : 700;

  return (
    <motion.div
      id={`locker-${museum.id}`}
      className={`locker-tile${isHeld ? ' expanded' : ''}`}
      style={{ zIndex: isHeld ? 5 : undefined }}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      drag
      dragMomentum={false}
      onPointerEnter={startHold}
      onPointerLeave={cancelHold}
      onPointerDown={cancelHold}
      onDragStart={() => {
        cancelHold();
        dragOrigin.current = position;
      }}
      onDrag={(_, info) => {
        if (!dragOrigin.current) return;
        onDrag?.({
          x: dragOrigin.current.x + info.offset.x,
          y: dragOrigin.current.y + info.offset.y,
        });
      }}
      onDragEnd={(_, info) => {
        if (!dragOrigin.current) return;
        const nextX = dragOrigin.current.x + info.offset.x;
        const nextY = dragOrigin.current.y + info.offset.y;
        dragOrigin.current = null;
        onDrag?.({ x: nextX, y: nextY });
      }}
    >
      {highlight && <div className="highlight-ring" aria-hidden />}
      <motion.div
        className={`detail-bg${isHeld ? ' expanded' : ''}`}
        variants={variants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        custom={radius}
        aria-hidden
        onClick={triggerExpand}
      />
      <motion.button
        className="locker-surface"
        variants={doorVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        style={{ transformOrigin: 'left center' }}
        onClick={() => {
          if (isActive && onExpand) {
            onExpand();
            return;
          }
          onOpen();
        }}
      >
        {museum.name}
      </motion.button>
      <motion.div
        className="detail-content"
        variants={detailContentVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        onClick={triggerExpand}
      >
        <h4>{museum.name}</h4>
        <p>{museum.detail.description}</p>
        <a href={museum.detail.url} target="_blank" rel="noreferrer">
          사이트 바로가기 ↗
        </a>
      </motion.div>
    </motion.div>
  );
}

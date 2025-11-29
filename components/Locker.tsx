'use client';

import { motion, Variants } from 'framer-motion';
import { Museum, Position } from '../lib/types';
import { useMemo } from 'react';

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
  clipStyle?: ClipStyle;
  highlight?: boolean;
  onDrag?: (pos: Position) => void;
}

export function Locker({
  museum,
  position,
  isActive,
  onOpen,
  clipStyle = 'rect',
  highlight = false,
  onDrag,
}: LockerProps) {
  const variants = useMemo(() => {
    return clipStyle === 'circle' ? detailBgCircleVariants : detailBgRectVariants;
  }, [clipStyle]);

  return (
    <motion.div
      id={`locker-${museum.id}`}
      className="locker-tile"
      style={{ x: position.x, y: position.y }}
      layout
      drag
      dragMomentum={false}
      onDrag={(_, info) => onDrag?.({ x: position.x + info.point.x - info.offset.x, y: position.y + info.point.y - info.offset.y })}
      onDragEnd={(_, info) => {
        const nextX = position.x + info.point.x - info.offset.x;
        const nextY = position.y + info.point.y - info.offset.y;
        onDrag?.({ x: nextX, y: nextY });
      }}
      animate={isActive ? 'open' : 'closed'}
      initial="closed"
    >
      {highlight && <div className="highlight-ring" aria-hidden />}
      <motion.div
        className="detail-bg"
        variants={variants}
        custom={700}
        aria-hidden
      />
      <motion.button
        className="locker-surface"
        variants={doorVariants}
        style={{ transformOrigin: 'left center' }}
        onClick={onOpen}
      >
        {museum.name}
      </motion.button>
      <motion.div className="detail-content" variants={detailContentVariants}>
        <h4>{museum.name}</h4>
        <p>{museum.detail.description}</p>
        <a href={museum.detail.url} target="_blank" rel="noreferrer">
          사이트 바로가기 ↗
        </a>
      </motion.div>
    </motion.div>
  );
}

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
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 18,
      delay: 0.12,
    },
  },
  closed: {
    clipPath: 'inset(50% 50% 50% 50% round 0px)',
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
  draggable?: boolean;
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
  draggable = true,
}: LockerProps) {
  const variants = useMemo(() => {
    return clipStyle === 'circle' ? detailBgCircleVariants : detailBgRectVariants;
  }, [clipStyle]);

  const baseColor = museum.interiorBaseColor || museum.interiorColor || '#ffe3a3';
  const hoverColor = museum.interiorHoverColor || baseColor;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef<Position | null>(null);
  const suppressClick = useRef(false);
  
  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
    }
  }, [isActive]);

  const isOpen = isActive || isExpanded;
  const radius = isExpanded ? expansionRadius : 700;

  const handleExpand = () => {
    if (isDragging || suppressClick.current || !isActive) return;
    setIsExpanded(true);
    onExpand?.();
  };

  return (
    <motion.div
      id={`locker-${museum.id}`}
      className={`locker-tile${isExpanded ? ' expanded' : ''}`}
      style={{
        zIndex: isExpanded ? 5 : undefined,
        ['--detail-base' as const]: baseColor,
        ['--detail-hover' as const]: hoverColor,
      }}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      drag={draggable}
      dragMomentum={false}
      onDragStart={() => {
        if (!draggable) return;
        setIsDragging(true);
        setIsExpanded(false);
        dragOrigin.current = position;
        suppressClick.current = true;
      }}
      onDrag={(_, info) => {
        if (!draggable || !dragOrigin.current) return;
        onDrag?.({
          x: dragOrigin.current.x + info.offset.x,
          y: dragOrigin.current.y + info.offset.y,
        });
      }}
      onDragEnd={(_, info) => {
        if (!draggable || !dragOrigin.current) return;
        const nextX = dragOrigin.current.x + info.offset.x;
        const nextY = dragOrigin.current.y + info.offset.y;
        dragOrigin.current = null;
        setIsDragging(false);
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 120);
        onDrag?.({ x: nextX, y: nextY });
      }}
    >
      {highlight && <div className="highlight-ring" aria-hidden />}
      <motion.div
        className={`detail-bg${isExpanded ? ' expanded' : ''}`}
        variants={variants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        custom={radius}
        aria-hidden
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      />
      <motion.button
        className="locker-surface"
        variants={doorVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        style={{ transformOrigin: 'left center' }}
        aria-label={`${museum.name} locker`}
        onClick={() => {
          if (isDragging || suppressClick.current) {
            return;
          }
          setIsExpanded(false);
          onOpen();
        }}
      >
        <div className={`door-peek-label${isOpen ? ' hidden' : ''}`} aria-hidden>
          {museum.name}
        </div>
        {museum.doorSvg && (
          <img
            src={museum.doorSvg}
            alt={`${museum.name} locker graphic`}
            className={`door-graphic${isOpen ? ' hidden' : ''}`}
            aria-hidden={isOpen}
          />
        )}
      </motion.button>
      <motion.div
        className="detail-content"
        variants={detailContentVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={handleExpand}
      >
        <h4>{museum.name}</h4>
      </motion.div>
    </motion.div>
  );
}

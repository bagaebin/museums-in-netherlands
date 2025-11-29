'use client';

import { motion, Variants } from 'framer-motion';
import { Museum, Position } from '../lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';

const HOVER_EXPAND_DELAY = 1500;

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

  const [isHovered, setIsHovered] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const hoverStart = useRef<number | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const hoverIntentId = useRef(0);
  const dragOrigin = useRef<Position | null>(null);
  const suppressClick = useRef(false);

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const scheduleHoverExpand = () => {
    clearHoverTimer();

    const intentId = ++hoverIntentId.current;
    hoverStart.current = Date.now();

    hoverTimer.current = setTimeout(() => {
      const dwell = hoverStart.current ? Date.now() - hoverStart.current : 0;
      const stillValid =
        intentId === hoverIntentId.current && isActive && isHovered && !isDragging && dwell >= HOVER_EXPAND_DELAY;

      if (!stillValid) return;

      setIsHeld(true);
      onExpand?.();
    }, HOVER_EXPAND_DELAY);
  };

  useEffect(() => () => clearHoverTimer(), []);

  useEffect(() => {
    clearHoverTimer();

    if (isActive && isHovered && !isDragging && !isHeld) {
      scheduleHoverExpand();
      return;
    }

    if (!isActive || isDragging || !isHovered) {
      hoverStart.current = null;
      hoverIntentId.current++;

      if (isHeld) {
        setIsHeld(false);
      }
    }
  }, [isActive, isHovered, isDragging, isHeld]);

  useEffect(() => {
    if (!isActive) {
      setIsHeld(false);
      clearHoverTimer();
      hoverStart.current = null;
      hoverIntentId.current++;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
    }
  }, [position.x, position.y, isDragging]);

  const isDoorOpen = isActive;
  const isExpanded = isHeld;
  const radius = isExpanded ? expansionRadius : 700;

  return (
    <motion.div
      id={`locker-${museum.id}`}
      className={`locker-tile${isExpanded ? ' expanded' : ''}`}
      style={{ zIndex: isExpanded ? 5 : undefined }}
      initial={{ x: currentPosition.x, y: currentPosition.y }}
      animate={{ x: currentPosition.x, y: currentPosition.y }}
      drag
      dragMomentum={false}
      onPointerEnter={() => {
        if (isDragging) return;
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        clearHoverTimer();
        hoverStart.current = null;
        hoverIntentId.current++;
      }}
      onDragStart={() => {
        clearHoverTimer();
        setIsDragging(true);
        setIsHovered(false);
        setIsHeld(false);
        dragOrigin.current = currentPosition;
        suppressClick.current = true;
      }}
      onDrag={(_, info) => {
        if (!dragOrigin.current) return;
        const next = {
          x: dragOrigin.current.x + info.offset.x,
          y: dragOrigin.current.y + info.offset.y,
        };
        setCurrentPosition(next);
        onDrag?.(next);
      }}
      onDragEnd={(_, info) => {
        if (!dragOrigin.current) return;
        const nextX = dragOrigin.current.x + info.offset.x;
        const nextY = dragOrigin.current.y + info.offset.y;
        dragOrigin.current = null;
        setIsDragging(false);
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 120);
        setIsHovered(false);
        hoverStart.current = null;
        hoverIntentId.current++;
        const next = { x: nextX, y: nextY };
        setCurrentPosition(next);
        onDrag?.(next);
      }}
    >
      {highlight && <div className="highlight-ring" aria-hidden />}
      <motion.div
        className={`detail-bg${isExpanded ? ' expanded' : ''}`}
        variants={variants}
        animate={isExpanded ? 'open' : 'closed'}
        initial="closed"
        custom={radius}
        aria-hidden
      />
      <motion.button
        className="locker-surface"
        variants={doorVariants}
        animate={isDoorOpen ? 'open' : 'closed'}
        initial="closed"
        style={{ transformOrigin: 'left center' }}
        onPointerEnter={() => {
          if (isDragging) return;
          setIsHovered(true);
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          clearHoverTimer();
          hoverStart.current = null;
          hoverIntentId.current++;
        }}
        onClick={() => {
          if (isDragging || suppressClick.current) {
            return;
          }
          setIsHeld(false);
          clearHoverTimer();
          hoverStart.current = null;
          hoverIntentId.current++;
          onOpen();
        }}
      >
        {museum.name}
      </motion.button>
      <motion.div
        className="detail-content"
        variants={detailContentVariants}
        animate={isExpanded ? 'open' : 'closed'}
        initial="closed"
        style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
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

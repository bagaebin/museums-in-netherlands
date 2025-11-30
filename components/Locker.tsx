'use client';

import { motion, Variants } from 'framer-motion';
import { Museum, Position } from '../lib/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const [hoverProgress, setHoverProgress] = useState(0);
  const lockerRef = useRef<HTMLDivElement | null>(null);
  const hoverRaf = useRef<number | null>(null);
  const hoverSessionActive = useRef(false);
  const dragOrigin = useRef<Position | null>(null);
  const suppressClick = useRef(false);

  const stopHoverTracking = useCallback(
    (preserveProgress = false) => {
      if (hoverRaf.current) {
        cancelAnimationFrame(hoverRaf.current);
      }
      hoverRaf.current = null;
      hoverSessionActive.current = false;

      if (!preserveProgress) {
        setHoverProgress(0);
      }
    },
    []
  );

  const resetHoverState = useCallback(() => {
    setIsHovered(false);
    setIsHeld(false);
    stopHoverTracking();
  }, [stopHoverTracking]);

  const beginHoverTracking = useCallback(() => {
    if (hoverSessionActive.current || !isActive || isDragging || isHeld || !isHovered) return;

    hoverSessionActive.current = true;
    setHoverProgress(0);

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / HOVER_EXPAND_DELAY, 1);
      setHoverProgress(progress);

      if (progress >= 1) {
        stopHoverTracking(true);
        setIsHeld(true);
        onExpand?.();
        return;
      }

      hoverRaf.current = requestAnimationFrame(tick);
    };

    hoverRaf.current = requestAnimationFrame(tick);
  }, [isActive, isDragging, isHeld, isHovered, onExpand, stopHoverTracking]);

  useEffect(() => {
    if (isActive && isHovered && !isDragging && !isHeld) {
      beginHoverTracking();
    } else {
      stopHoverTracking(isHeld);
      if (!isActive || !isHovered || isDragging) {
        setIsHeld(false);
      }
    }
  }, [isActive, isHovered, isDragging, isHeld, beginHoverTracking, stopHoverTracking]);

  useEffect(() => {
    const handleWindowPointerLeave = () => {
      if (isHovered || isHeld) {
        resetHoverState();
      }
    };

    window.addEventListener('pointerleave', handleWindowPointerLeave);

    return () => {
      window.removeEventListener('pointerleave', handleWindowPointerLeave);
      stopHoverTracking();
    };
  }, [isHovered, isHeld, resetHoverState, stopHoverTracking]);

  const isDoorOpen = isActive;
  const isExpanded = isHeld;
  const isBackgroundOpen = isActive && (isHovered || isExpanded);
  const radius = isExpanded ? expansionRadius : 700;

  const positionTransition = isDragging
    ? { type: 'tween', duration: 0 }
    : { type: 'tween', ease: 'easeInOut', duration: 0.25 };

  return (
    <motion.div
      id={`locker-${museum.id}`}
      className={`locker-tile${isHeld ? ' expanded' : ''}`}
      ref={lockerRef}
      style={{ zIndex: isHeld ? 5 : undefined }}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={positionTransition}
      drag
      dragMomentum={false}
      onPointerEnter={() => {
        if (isDragging) return;
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        resetHoverState();
      }}
      onDragStart={() => {
        setIsDragging(true);
        setIsHovered(false);
        setIsHeld(false);
        setHoverProgress(0);
        stopHoverTracking();
        dragOrigin.current = position;
        suppressClick.current = true;
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
        setIsDragging(false);
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 120);
        setIsHovered(false);
        setHoverProgress(0);
        stopHoverTracking();
        onDrag?.({ x: nextX, y: nextY });
      }}
    >
      {highlight && <div className="highlight-ring" aria-hidden />}
      <div className="hover-gauge" aria-hidden>
        <motion.div
          className="hover-gauge-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hoverProgress }}
          transition={{ type: 'tween', duration: 0.08 }}
        />
      </div>
      <motion.div
        className={`detail-bg${isHeld ? ' expanded' : ''}`}
        variants={variants}
        animate={isBackgroundOpen ? 'open' : 'closed'}
        initial="closed"
        custom={radius}
        aria-hidden
      />
      <motion.div
        className="locker-inner-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        aria-hidden
      >
        {museum.name}
      </motion.div>
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
          resetHoverState();
        }}
        onClick={() => {
          if (isDragging || suppressClick.current) {
            return;
          }
          setIsHeld(false);
          setHoverProgress(0);
          stopHoverTracking();
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
        onPointerLeave={() => {
          resetHoverState();
        }}
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

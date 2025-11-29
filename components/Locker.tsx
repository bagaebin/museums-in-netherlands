'use client';

import { useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import { Museum } from '../lib/types';

interface LockerProps {
  museum: Museum;
  x: number;
  y: number;
  isActive: boolean;
  highlight?: boolean;
  onOpen: () => void;
}

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

const detailBgVariants: Variants = {
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

const circleDetailBgVariants: Variants = {
  open: (radius = 320) => ({
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

export function Locker({ museum, x, y, isActive, highlight, onOpen }: LockerProps) {
  const state = isActive ? 'open' : 'closed';
  const label = useMemo(() => `${museum.name}\n${museum.city}`, [museum.city, museum.name]);

  return (
    <motion.g
      style={{ x, y, transformStyle: 'preserve-3d', cursor: 'grab' }}
      drag
      dragMomentum={false}
      dragElastic={0.2}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <motion.foreignObject width={140} height={140} pointerEvents="none">
        <div
          style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            perspective: '800px',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(34,211,238,0.04))',
              borderRadius: '16px',
              boxShadow: highlight
                ? '0 0 0 3px rgba(34,211,238,0.6), 0 12px 24px rgba(0,0,0,0.35)'
                : '0 12px 24px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
            }}
            variants={detailBgVariants}
            animate={state}
            initial="closed"
          />

          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(145deg, #111827, #0b1224)',
              borderRadius: '16px',
              transformOrigin: 'left center',
              border: '2px solid rgba(255,255,255,0.12)',
              color: '#e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: '8px',
              backfaceVisibility: 'hidden',
            }}
            variants={doorVariants}
            animate={state}
            initial="closed"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
          >
            <div style={{ fontSize: 14, color: '#94a3b8' }}>Locker</div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{label}</div>
            <div style={{ marginTop: 'auto', fontSize: 12, color: '#cbd5e1' }}>탭하여 열기</div>
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              color: '#e2e8f0',
              background: 'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.08), transparent 40%), rgba(15, 23, 42, 0.96)',
              borderRadius: '16px',
              pointerEvents: 'auto',
            }}
            variants={circleDetailBgVariants}
            animate={state}
            initial="closed"
          >
            <motion.div variants={detailContentVariants} animate={state} initial="closed">
              <div style={{ fontSize: 12, letterSpacing: 0.6, color: '#94a3b8' }}>DETAIL</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{museum.name}</div>
              <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>{museum.detail.description}</p>
              <a
                href={museum.detail.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#22d3ee', fontSize: 13 }}
              >
                방문하기 →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.foreignObject>
    </motion.g>
  );
}

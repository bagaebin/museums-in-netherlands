'use client';

import { motion } from 'motion/react';

interface FabButtonsProps {
  onInfo: () => void;
  onGallery: () => void;
}

export function FabButtons({ onInfo, onGallery }: FabButtonsProps) {
  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onInfo}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          border: 'none',
          background: 'linear-gradient(135deg, #22d3ee, #7dd3fc)',
          color: '#0b1224',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        i
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGallery}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          border: 'none',
          background: 'linear-gradient(135deg, #f97316, #fbbf24)',
          color: '#0b1224',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        📸
      </motion.button>
    </div>
  );
}

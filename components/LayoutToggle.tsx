'use client';

import { motion } from 'motion/react';
import { LayoutMode } from '../lib/types';

interface LayoutToggleProps {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const modes: LayoutMode[] = ['grid', 'topic', 'map'];

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  return (
    <div style={{ display: 'inline-flex', gap: 8, background: 'rgba(255,255,255,0.06)', padding: 6, borderRadius: 12 }}>
      {modes.map((m) => (
        <motion.button
          key={m}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(m)}
          style={{
            border: 'none',
            padding: '10px 16px',
            borderRadius: 10,
            background: mode === m ? 'linear-gradient(135deg, #22d3ee, #7dd3fc)' : 'rgba(255,255,255,0.08)',
            color: mode === m ? '#0b1224' : '#e2e8f0',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {m.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}

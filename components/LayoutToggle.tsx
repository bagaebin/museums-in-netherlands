'use client';

import { LayoutMode } from '../lib/types';

interface LayoutToggleProps {
  value: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const modes: LayoutMode[] = ['grid', 'topic', 'map'];

export function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div className="layout-toggle">
      {modes.map((mode) => (
        <button key={mode} aria-pressed={value === mode} onClick={() => onChange(mode)}>
          {mode.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

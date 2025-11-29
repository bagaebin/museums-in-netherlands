"use client";

import { LayoutMode } from "@/lib/types";

interface LayoutToggleProps {
  layout: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const modes: LayoutMode[] = ["grid", "topic", "map"];

export function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div style={{ display: "inline-flex", background: "#181b23", borderRadius: 14, padding: 4, border: "1px solid #222733" }}>
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "none",
            background: layout === mode ? "var(--accent)" : "transparent",
            color: layout === mode ? "#111" : "var(--text)",
            fontWeight: 700,
            transition: "all 0.2s ease",
          }}
        >
          {mode.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

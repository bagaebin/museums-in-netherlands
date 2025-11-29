"use client";

import { motion } from "framer-motion";
import type { LayoutMode } from "../types";

interface LayoutToggleProps {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const modes: LayoutMode[] = ["grid", "topic", "map"];

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  return (
    <div className="flex gap-2 bg-[#1a1b25] border border-[#2c2d38] rounded-full p-1">
      {modes.map((item) => (
        <motion.button
          key={item}
          onClick={() => onChange(item)}
          className={`px-4 py-2 rounded-full text-sm ${
            mode === item ? "bg-[#ffb347] text-black" : "text-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {item.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}

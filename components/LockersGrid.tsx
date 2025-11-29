"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import museumsData from "../data/museums.json";
import type { LayoutMode, Museum } from "../types";
import { getPosition } from "../lib/layout";
import { Locker } from "./Locker";
import { RelationsLayer } from "./RelationsLayer";
import { LayoutToggle } from "./LayoutToggle";
import { useHashWarp } from "../lib/warp";

const lockerVariant = {
  animate: (mode: LayoutMode) => ({
    transition: { duration: 0.65, type: "spring", bounce: 0.22 },
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  }),
  initial: { opacity: 0, scale: 0.95 },
};

export function LockersGrid() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const museums = useMemo(() => museumsData as Museum[], []);

  useHashWarp(
    (id) => setActiveId(id),
    (id) => setHighlightId(id)
  );

  useEffect(() => {
    if (activeId) {
      const element = document.getElementById(`locker-${activeId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [activeId]);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">네덜란드 뮤지엄 락커</h1>
        <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-[#2c2d38] bg-[#0f1017]">
        <svg className="absolute inset-0 w-full h-full">
          <RelationsLayer mode={layoutMode} museums={museums} />
        </svg>
        <div className="relative grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {museums.map((museum) => {
            const { x, y } = getPosition(museum, layoutMode);
            return (
              <motion.div
                key={museum.id}
                id={`locker-${museum.id}`}
                className="p-4"
                animate={{ x, y }}
                variants={lockerVariant}
                initial="initial"
                transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
              >
                <div className={`relative ${highlightId === museum.id ? "ring-2 ring-amber-400" : ""}`}>
                  <Locker
                    museum={museum}
                    isActive={activeId === museum.id}
                    onOpen={() => setActiveId(museum.id)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

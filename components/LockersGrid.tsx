"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPositionByLayout, computeTopicLayout } from "@/lib/layout";
import { LayoutMode, MuseumData } from "@/lib/types";
import { Locker } from "./Locker";
import { RelationsLayer } from "./RelationsLayer";
import { findMuseumByHash, focusLocker, getHashId } from "@/lib/warp";

interface LockersGridProps {
  museums: MuseumData[];
  layout: LayoutMode;
  activeId: string | null;
  onActiveChange: (id: string) => void;
}

export function LockersGrid({ museums, layout, activeId, onActiveChange }: LockersGridProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [topicNodes, setTopicNodes] = useState(() => computeTopicLayout(museums));

  useEffect(() => {
    setTopicNodes(computeTopicLayout(museums));
  }, [museums]);

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    museums.forEach((museum) => {
      const pos = getPositionByLayout(museum, layout, topicNodes, 1200, 800);
      map[museum.id] = pos;
    });
    return map;
  }, [layout, museums, topicNodes]);

  useEffect(() => {
    const hashId = getHashId();
    const target = findMuseumByHash(museums, hashId);
    if (hashId && target) {
      onActiveChange(target.id);
      focusLocker(svgRef, target.id, positions);
    }
  }, [museums, onActiveChange, positions]);

  const width = 1200;
  const height = 800;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "70vh" }}>
        <RelationsLayer museums={museums} positions={positions} layout={layout} />
        {museums.map((museum) => {
          const pos = positions[museum.id];
          return (
            <g key={museum.id} transform={`translate(${pos.x}, ${pos.y})`}>
              <foreignObject width={140} height={180}>
                <Locker
                  museum={museum}
                  isActive={activeId === museum.id}
                  onOpen={() => onActiveChange(museum.id)}
                />
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

"use client";

import { Variants, motion } from "framer-motion";
import { useMemo } from "react";
import { MuseumData } from "@/lib/types";

interface LockerProps {
  museum: MuseumData;
  isActive: boolean;
  onOpen: () => void;
  clipStyle?: "rect" | "circle";
}

const doorVariants: Variants = {
  open: {
    rotateY: -90,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  closed: {
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const detailBgVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 16px)",
    transition: {
      type: "spring",
      stiffness: 40,
      damping: 18,
      delay: 0.12,
    },
  },
  closed: {
    clipPath: "inset(50% 50% 50% 50% round 16px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const detailBgCircle: Variants = {
  open: (radius: number = 360) => ({
    clipPath: `circle(${radius}px at 50% 50%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      delay: 0.12,
    },
  }),
  closed: {
    clipPath: "circle(0px at 50% 50%)",
    transition: {
      type: "spring",
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

export function Locker({ museum, isActive, onOpen, clipStyle = "rect" }: LockerProps) {
  const radius = 420;
  const bgVariants = useMemo(() => (clipStyle === "circle" ? detailBgCircle : detailBgVariants), [clipStyle]);

  return (
    <div className="locker" style={{ width: 140, height: 180, position: "relative" }}>
      <motion.div
        className="locker-bg"
        initial="closed"
        animate={isActive ? "open" : "closed"}
        variants={bgVariants}
        custom={radius}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(145deg, #262b38, #131823)",
          borderRadius: 16,
          zIndex: 0,
        }}
      />
      <motion.button
        type="button"
        className="locker-door"
        onClick={onOpen}
        initial="closed"
        animate={isActive ? "open" : "closed"}
        variants={doorVariants}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(120deg, #1f2430, #2c3140)",
          color: "var(--text)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          transformOrigin: "left center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      >
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{museum.city}</span>
          <strong style={{ fontSize: 18 }}>{museum.name}</strong>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>#{museum.topic || "mixed"}</span>
        </div>
      </motion.button>
      <motion.div
        className="locker-detail"
        initial="closed"
        animate={isActive ? "open" : "closed"}
        variants={detailContentVariants}
        style={{
          position: "absolute",
          inset: 0,
          padding: "16px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>{museum.detail.description}</p>
        <a
          href={museum.detail.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 13,
            color: "var(--accent)",
            fontWeight: 600,
          }}
        >
          웹사이트 바로가기 ↗
        </a>
      </motion.div>
    </div>
  );
}

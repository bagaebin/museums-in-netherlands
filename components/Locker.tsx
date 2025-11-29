"use client";

import { motion, Variants } from "framer-motion";
import { useMemo } from "react";
import type { Museum } from "../types";

interface LockerProps {
  museum: Museum;
  isActive: boolean;
  onOpen: () => void;
  clipShape?: "rect" | "circle";
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

const detailBgRectVariants: Variants = {
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

const detailBgCircleVariants: Variants = {
  open: (radius = 800) => ({
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

export function Locker({ museum, isActive, onOpen, clipShape = "rect" }: LockerProps) {
  const currentBgVariants = useMemo(
    () => (clipShape === "circle" ? detailBgCircleVariants : detailBgRectVariants),
    [clipShape]
  );

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-0 rounded-xl border border-[#2c2d38]"
        style={{
          background: "linear-gradient(145deg, #1a1b25, #0f1017)",
          overflow: "hidden",
        }}
        variants={currentBgVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        custom={900}
      />

      <motion.div
        className="absolute inset-0 p-4 text-sm text-left"
        variants={detailContentVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <div className="text-lg font-semibold">{museum.name}</div>
        <div className="text-xs text-gray-300 mb-2">{museum.city}</div>
        <p className="text-sm leading-relaxed text-gray-100">{museum.detail.description}</p>
        <a
          href={museum.detail.url}
          className="mt-2 inline-block text-amber-300"
          target="_blank"
        >
          바로가기
        </a>
      </motion.div>

      <motion.button
        className="relative z-10 w-44 h-48 rounded-xl border border-[#3a3b47] bg-[#13141d] text-left p-4 shadow-lg"
        style={{ transformOrigin: "left center" }}
        onClick={onOpen}
        variants={doorVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <div className="text-sm uppercase tracking-wide text-gray-400">Locker</div>
        <div className="text-xl font-bold">{museum.name}</div>
        <div className="text-xs text-gray-500">{museum.region}</div>
      </motion.button>
    </div>
  );
}

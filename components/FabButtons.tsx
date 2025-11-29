"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function FabButtons() {
  const [open, setOpen] = useState<"intent" | "gallery" | null>(null);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      <motion.button
        className="w-14 h-14 rounded-full bg-[#ffb347] text-black font-semibold shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(open === "intent" ? null : "intent")}
      >
        i
      </motion.button>
      <motion.button
        className="w-14 h-14 rounded-full bg-[#ff8c42] text-black font-semibold shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(open === "gallery" ? null : "gallery")}
      >
        📷
      </motion.button>

      {open === "intent" && (
        <motion.div
          className="absolute bottom-20 right-0 w-64 p-4 rounded-xl bg-[#1a1b25] border border-[#2c2d38] text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-semibold mb-2">프로젝트 의도</div>
          <p className="text-gray-200">
            네덜란드 뮤지엄을 사물함 메타포로 탐색하며, 문을 열고 내부 공간을 확장해 상세 정보를 확인합니다.
          </p>
        </motion.div>
      )}

      {open === "gallery" && (
        <motion.div
          className="absolute bottom-20 right-0 w-64 p-4 rounded-xl bg-[#1a1b25] border border-[#2c2d38] text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-semibold mb-2">갤러리</div>
          <p className="text-gray-200">실제 작업 사진, 모형, 프로토타입을 여기에 연결할 수 있습니다.</p>
        </motion.div>
      )}
    </div>
  );
}

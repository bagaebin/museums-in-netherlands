'use client';

import { motion } from 'framer-motion';

interface FabButtonsProps {
  onShowOverview: () => void;
  onShowGallery: () => void;
}

export function FabButtons({ onShowOverview, onShowGallery }: FabButtonsProps) {
  return (
    <div className="fab-cluster">
      <motion.button
        className="fab-button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowOverview}
      >
        ℹ️ 프로젝트 설명
      </motion.button>
      <motion.button
        className="fab-button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowGallery}
      >
        🖼️ 갤러리 보기
      </motion.button>
    </div>
  );
}

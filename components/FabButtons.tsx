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
        onClick={onShowOverview}
      >
          ABOUT
      </motion.button>
      <motion.button
        className="fab-button"
        onClick={onShowGallery}
      >
          GALLERY
      </motion.button>
    </div>
  );
}

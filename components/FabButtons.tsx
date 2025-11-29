"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function FabButtons() {
  const [showIntent, setShowIntent] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowIntent(true)}
        style={fabStyle}
      >
        프로젝트 의도
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowGallery(true)}
        style={fabStyle}
      >
        갤러리
      </motion.button>

      {showIntent && (
        <Popup title="프로젝트 의도" onClose={() => setShowIntent(false)}>
          <p>
            네덜란드 주요 미술관을 사물함 메타포로 탐색하며, 물리적으로 여닫는 듯한 제스처를 통해 관계와 맥락을 직관적으로
            경험합니다.
          </p>
        </Popup>
      )}
      {showGallery && (
        <Popup title="갤러리" onClose={() => setShowGallery(false)}>
          <p>실제 전시 공간과 스토리지 룸 분위기를 담은 사진/렌더링을 모아 보여줍니다.</p>
        </Popup>
      )}
    </div>
  );
}

const fabStyle: React.CSSProperties = {
  background: "var(--accent)",
  color: "#0d0f13",
  border: "none",
  padding: "12px 16px",
  borderRadius: 999,
  boxShadow: "0 10px 40px rgba(198,255,0,0.35)",
  fontWeight: 800,
};

function Popup({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: "#11141b",
          padding: 24,
          borderRadius: 16,
          maxWidth: 420,
          width: "90%",
          border: "1px solid #1f2430",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong>{title}</strong>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)" }}>
            닫기
          </button>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>{children}</div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import museumsData from '../data/museums.json';
import { LayoutToggle } from '../components/LayoutToggle';
import { LockersGrid } from '../components/LockersGrid';
import { RelationsLayer } from '../components/RelationsLayer';
import { FabButtons } from '../components/FabButtons';
import { applyHashWarp } from '../lib/warp';
import { computeLayoutPositions } from '../lib/layout';
import { LayoutMode, Museum, Position } from '../lib/types';

const museums = museumsData as Museum[];

export default function HomePage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 760 });
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    computeLayoutPositions(museums, 'grid', { width: 1200, height: 760 })
  );

  useEffect(() => {
    const resize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      setStageSize({ width: rect.width, height: rect.height });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    setPositions(computeLayoutPositions(museums, layout, stageSize));
  }, [layout, stageSize]);

  useEffect(() => {
    applyHashWarp(museums, {
      onOpen: (id) => setActiveId(id),
      onHighlight: (id) => {
        setHighlightId(id);
        setTimeout(() => setHighlightId(null), 2600);
      },
    });
  }, []);

  const overviewContent = useMemo(
    () => (
      <div>
        <h3>프로젝트 개요</h3>
        <p>네덜란드 박물관을 사물함 메타포로 탐험하며, 문이 열리고 내부 배경이 확장되는 모션을 체험합니다.</p>
      </div>
    ),
    []
  );

  const galleryContent = useMemo(
    () => (
      <div>
        <h3>레퍼런스 갤러리</h3>
        <p>실제 수장고, 전시 사진 등을 모아 컨셉을 빠르게 공유합니다.</p>
      </div>
    ),
    []
  );

  const [modal, setModal] = useState<'overview' | 'gallery' | null>(null);

  const handlePositionChange = (id: string, pos: Position) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  };

  return (
    <main className="main-shell">
      <header className="controls">
        <LayoutToggle value={layout} onChange={setLayout} />
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>Layout: {layout}</span>
      </header>
      <div className="atlas-stage" ref={stageRef}>
        <RelationsLayer museums={museums} positions={positions} stage={stageSize} />
        <LockersGrid
          museums={museums}
          positions={positions}
          activeId={activeId}
          layout={layout}
          highlightId={highlightId}
          onOpen={(id) => setActiveId(id === activeId ? null : id)}
          onPositionChange={handlePositionChange}
          clipStyle={layout === 'map' ? 'circle' : 'rect'}
          expansionRadius={Math.hypot(stageSize.width, stageSize.height)}
        />
      </div>

      {modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 20,
          }}
          onClick={() => setModal(null)}
        >
          <div
            style={{
              background: 'var(--panel)',
              padding: 24,
              borderRadius: 16,
              width: 'min(480px, 90vw)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                right: 18,
                top: 12,
                background: 'transparent',
                color: 'var(--text)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
              }}
              onClick={() => setModal(null)}
            >
              ✕
            </button>
            {modal === 'overview' ? overviewContent : galleryContent}
          </div>
        </div>
      )}

      <FabButtons onShowOverview={() => setModal('overview')} onShowGallery={() => setModal('gallery')} />
    </main>
  );
}

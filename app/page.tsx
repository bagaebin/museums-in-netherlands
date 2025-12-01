'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [relationDetail, setRelationDetail] = useState<
    | {
        source: Museum;
        target: Museum;
        label: string;
      }
    | null
  >(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 760 });
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    computeLayoutPositions(museums, 'grid', { width: 1200, height: 760 })
  );
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panOrigin = useRef<{ x: number; y: number } | null>(null);

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
    setExpandedId(null);
  }, [layout, stageSize]);

  useEffect(() => {
    if (layout === 'map') {
      const initialScale = 0.38;
      setMapScale(initialScale);
      setMapOffset({
        x: (stageSize.width - stageSize.width * initialScale) / 2,
        y: (stageSize.height - stageSize.height * initialScale) / 2,
      });
      return;
    }

    setMapScale(1);
    setMapOffset({ x: 0, y: 0 });
  }, [layout, stageSize]);

  useEffect(() => {
    applyHashWarp(museums, {
      onOpen: (id) => {
        setActiveId(id);
        setExpandedId(null);
      },
      onHighlight: (id) => {
        setHighlightId(id);
        setTimeout(() => setHighlightId(null), 2600);
      },
    });
  }, []);

  const museumById = useMemo(
    () => Object.fromEntries(museums.map((museum) => [museum.id, museum])),
    []
  );

  const expandedMuseum = expandedId ? museumById[expandedId] : null;

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

  const handleLockerOpen = (id: string) => {
    setActiveId(id);
    setExpandedId(null);
    setRelationDetail(null);
  };

  const handleRelationClick = (sourceId: string, targetId: string) => {
    const source = museumById[sourceId];
    const target = museumById[targetId];
    const forwardLabel = source?.relations.find((rel) => rel.targetId === targetId)?.label;
    const reverseLabel = target?.relations.find((rel) => rel.targetId === sourceId)?.label;

    if (!source || !target) return;

    setRelationDetail({
      source,
      target,
      label: forwardLabel ?? reverseLabel ?? '연결 정보',
    });
    setExpandedId(null);
  };

  const handlePositionChange = (id: string, pos: Position) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  };

  const handleWheelZoom = (event: React.WheelEvent) => {
    if (layout !== 'map') return;
    event.preventDefault();
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const zoomIntensity = 0.0012;
    const nextScale = Math.min(Math.max(mapScale - event.deltaY * zoomIntensity, 0.3), 2.6);
    const scaleRatio = nextScale / mapScale;

    const nextOffset = {
      x: cursor.x - (cursor.x - mapOffset.x) * scaleRatio,
      y: cursor.y - (cursor.y - mapOffset.y) * scaleRatio,
    };

    setMapScale(nextScale);
    setMapOffset(nextOffset);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (layout !== 'map' || event.button !== 0) return;
    setIsPanning(true);
    panOrigin.current = { x: event.clientX, y: event.clientY };
    (event.target as HTMLElement)?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (layout !== 'map' || !isPanning || !panOrigin.current) return;
    const dx = event.clientX - panOrigin.current.x;
    const dy = event.clientY - panOrigin.current.y;
    panOrigin.current = { x: event.clientX, y: event.clientY };
    setMapOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const stopPanning = (event: React.PointerEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    panOrigin.current = null;
    (event.target as HTMLElement)?.releasePointerCapture(event.pointerId);
  };

  return (
    <main className="main-shell">
      <header className="controls">
        <LayoutToggle value={layout} onChange={setLayout} />
      </header>
      <div
        ref={stageRef}
        className={`atlas-stage${layout === 'map' ? ' map-mode' : ''}${isPanning ? ' is-panning' : ''}`}
        onWheel={handleWheelZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPanning}
        onPointerCancel={stopPanning}
      >
        <div
          className="atlas-content"
          style={{
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`,
            transformOrigin: '0 0',
          }}
        >
          {layout === 'map' && (
            <div className="map-layer" aria-hidden>
              <div className="map-background" />
            </div>
          )}
          <RelationsLayer
            museums={museums}
            positions={positions}
            stage={stageSize}
            layout={layout}
            onRelationClick={handleRelationClick}
          />
          <LockersGrid
            museums={museums}
            positions={positions}
            activeId={activeId}
            layout={layout}
            highlightId={highlightId}
            onOpen={handleLockerOpen}
            onExpand={(id) => {
              setActiveId(id);
              setExpandedId(id);
            }}
            onPositionChange={handlePositionChange}
            clipStyle={layout === 'map' ? 'circle' : 'rect'}
            expansionRadius={Math.hypot(stageSize.width, stageSize.height)}
          />
        </div>
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

      <AnimatePresence>
        {relationDetail && (
          <motion.div
            className="relation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRelationDetail(null)}
          >
            <motion.div
              className="relation-panel"
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="relation-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setRelationDetail(null);
                }}
                aria-label="연결 정보 닫기"
              >
                ✕
              </button>
              <div className="relation-head">
                <span className="relation-chip">연결 정보</span>
                <h3>
                  {relationDetail.source.name} ↔ {relationDetail.target.name}
                </h3>
                <p>{relationDetail.label}</p>
              </div>
              <div className="relation-meta">
                <div>
                  <small>출발</small>
                  <strong>{relationDetail.source.name}</strong>
                  <span>{relationDetail.source.city}</span>
                </div>
                <div>
                  <small>도착</small>
                  <strong>{relationDetail.target.name}</strong>
                  <span>{relationDetail.target.city}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandedMuseum && (
          <motion.div
            className="mega-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="mega-panel"
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 14 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mega-close" onClick={() => setExpandedId(null)} aria-label="닫기">
                ✕
              </button>

              <div className="mega-header">
                <span className="mega-kicker">{expandedMuseum.city}</span>
                <h2>{expandedMuseum.name}</h2>
                <p>{expandedMuseum.detail.description}</p>
              </div>

              <div className="mega-grid">
                <div className="mega-copy">
                  <h4>연결된 파트너</h4>
                  <ul>
                    {expandedMuseum.relations.map((rel) => (
                      <li key={rel.targetId}>
                        <strong>{museumById[rel.targetId]?.name ?? rel.targetId}</strong>
                        <span> · {rel.label}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={expandedMuseum.detail.url} target="_blank" rel="noreferrer" className="mega-link">
                    공식 사이트 바로가기 ↗
                  </a>
                </div>
                <div className="mega-gallery">
                  {expandedMuseum.detail.images?.map((src, index) => (
                    <div key={src} className="mega-image">
                      <img src={`${src}&auto=format&fit=crop&w=900&q=80`} alt={`${expandedMuseum.name} 이미지 ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import museumsData from '../data/museums.json';
import { LayoutToggle } from '../components/LayoutToggle';
import { LockersGrid } from '../components/LockersGrid';
import { FabButtons } from '../components/FabButtons';
import { attachHashListener, warpToHash } from '../lib/warp';
import { computeLayout } from '../lib/layout';
import { LayoutMode, Museum, PositionedMuseum } from '../lib/types';

export default function Home() {
  const museums = museumsData as Museum[];
  const [mode, setMode] = useState<LayoutMode>('grid');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const canvas = { width: 1000, height: 720 };

  const positioned = useMemo<PositionedMuseum[]>(() => computeLayout(mode, museums, canvas), [mode, museums]);

  useEffect(() => {
    warpToHash(museums, {
      setActiveId,
      focusOnMuseum: (id) => setHighlightedId(id),
    });
    const detach = attachHashListener(museums, {
      setActiveId,
      focusOnMuseum: (id) => setHighlightedId(id),
    });
    return detach;
  }, [museums]);

  return (
    <div className="layout-shell">
      <header className="controls">
        <div>
          <h1 style={{ margin: 0 }}>네덜란드 뮤지엄 락커 아틀라스</h1>
          <div className="badge">사물함 문을 열고, 떨어뜨려 보고, 관계를 확인하세요.</div>
        </div>
        <LayoutToggle mode={mode} onChange={setMode} />
      </header>

      <div className="canvas">
        <LockersGrid museums={positioned} activeId={activeId} onOpen={setActiveId} highlightedId={highlightedId} />
        <FabButtons
          onInfo={() => alert('프로젝트 의도: 사물함형 네트워크로 뮤지엄을 탐험하는 인터랙션 프로토타입입니다.')}
          onGallery={() => alert('실제 전시장 사진 및 프로토타입 샷을 여기에 연결하세요.')}
        />
      </div>
    </div>
  );
}

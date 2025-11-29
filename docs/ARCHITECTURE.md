# 아키텍처

## 폴더 구조
- `app/`: Next.js App Router 페이지와 레이아웃
- `components/`: 재사용 가능한 UI (Locker, Grid, 토글, FAB 등)
- `data/`: 뮤지엄 JSON 데이터
- `lib/`: 레이아웃 계산, 워프(NFC/해시) 헬퍼, 타입 정의
- `styles/`: 전역 스타일, 토큰
- `docs/`: 기획 및 기술 문서 (한글)

## 주요 컴포넌트 관계
- `app/page.tsx`: 레이아웃 모드, 활성 Locker 상태를 관리하며 Grid·FAB·토글을 배치
- `LockersGrid`: SVG 캔버스와 관계 레이어, 각각의 `Locker`를 렌더링
- `Locker`: 문/배경/콘텐츠 3단 레이어로 모션 변형
- `RelationsLayer`: 뮤지엄 간 Bézier 곡선과 textPath 라벨
- `LayoutToggle`: Grid/Topic/Map 전환 버튼
- `FabButtons`: 설명/갤러리 팝업 트리거

## React + SVG 구조
- 상위에 `motion.svg` 캔버스, 내부에 `motion.g`로 각각의 사물함을 배치
- `foreignObject`를 이용해 HTML 기반의 문/배경/콘텐츠 레이어를 SVG 좌표계에 삽입
- Bézier 곡선과 textPath는 순수 SVG로 그려 UI 레이어와 공존

## 상태 관리
- `useState`로 `layoutMode`, `activeId`, `highlightedId`를 관리
- `useMemo`로 레이아웃 계산 (grid/topic/map)
- `useEffect`에서 `warpToHash` + `attachHashListener`를 호출해 NFC/URL 해시 워프 처리

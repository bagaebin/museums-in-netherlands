# 아키텍처

## 폴더 구조
- `app/`: Next.js App Router 엔트리, 글로벌 레이아웃 및 페이지
- `components/`: 재사용 가능한 UI 컴포넌트 (Locker, 레이아웃 토글, FAB 등)
- `lib/`: 레이아웃 계산, 워프 유틸리티, 타입 정의
- `data/`: 단일 JSON 데이터셋
- `docs/`: 스펙 및 가이드 문서
- `public/`: 정적 자산 자리

## 주요 컴포넌트 관계
- `app/page.tsx`: 전체 상태를 소유(레이아웃 모드, 활성 사물함, 위치 맵). `RelationsLayer`와 `LockersGrid`에 전달.
- `LockersGrid`: 각 `Locker`를 렌더링하고 드래그 위치 변화를 부모에 보고.
- `Locker`: 문(door)·내부 배경(detail background)·콘텐츠(detail content)을 `open`/`closed` 상태로 구동하며, 문 여닫이는 클릭으로만 트리거된다. 열린 상태에서 동일 타일 위에 1.5초 이상 호버하면 "held"로 확장되어 배경이 스테이지 전체를 채우고 팝업을 띄운다.
- `RelationsLayer`: 현재 위치값을 사용해 곡선 경로와 텍스트를 SVG로 그림. 스테이지 실측 크기로 `viewBox`를 동기화해 리사이즈 후에도 경로가 타일 모서리를 정확히 잇는다.
- `FabButtons`/`LayoutToggle`: 인터랙션 제어 UI.
- stage는 시각적 여백을 주기 위해 32px padding이 있고, 레이아웃 계산은 padding을 제외한 usable 영역을 기준으로 수행된다. Relations 레이어는 최종 렌더링 시 padding 보정을 더해 SVG와 HTML 좌표계를 일치시킨다.

## React + SVG 구조
- `atlas-stage`: HTML 레이어에 SVG(`RelationsLayer`)와 HTML 락커(`LockersGrid`)를 겹침.
- 관계 경로는 SVG `<path>` + `<textPath>`로 표현하고, 사물함 자체는 모션 가능한 `<div>`/`<button>`으로 구현.

## 상태 관리
- 페이지 단에서 `useState`로 레이아웃 모드와 현재 열려 있는 사물함 ID 관리.
- 해시 기반 워프는 `useEffect`에서 실행되어 자동으로 문을 열고 하이라이트.
- 위치 정보는 `positions` 상태에 저장되어 드래그 후에도 관계 곡선이 즉시 업데이트됨.

# 아키텍처 개요

## 폴더 구조
- `app/` : Next.js App Router 엔트리, 전역 스타일과 페이지 컴포넌트.
- `components/` : Locker, RelationsLayer, LayoutToggle, FabButtons 등 UI 블록.
- `lib/` : 데이터 타입 정의, 레이아웃 계산, NFC 워프 헬퍼.
- `data/` : 미술관 JSON 데이터.
- `docs/` : 기획/스펙 문서(한글).

## 주요 모듈 관계
- `app/page.tsx`는 전역 상태(레이아웃, activeId)를 관리하며 `LockersGrid`와 UI 토글을 조합한다.
- `LockersGrid`는 레이아웃 모드에 따라 좌표를 계산하고, `RelationsLayer`와 `Locker`를 SVG에 배치한다.
- `RelationsLayer`는 미술관 간 관계를 베지어 경로와 `<textPath>` 라벨로 렌더링한다.
- `Locker`는 문 회전, 내부 배경 확장, 상세 콘텐츠 등장까지 단일 `isActive` 상태를 Variants로 연동한다.
- `lib/layout.ts`는 Grid/Topic/Map 좌표 계산을, `lib/warp.ts`는 해시 기반 포커스/오픈을 담당한다.

## React + SVG 구조
- 상위 `svg`에서 관계 경로와 `<foreignObject>`로 감싼 React Locker 컴포넌트를 배치한다.
- 문(door), 배경(detail background), 콘텐츠(detail content)를 분리한 3레이어 구조로 애니메이션을 제어한다.

## 상태 관리
- 레이아웃 모드와 현재 열린 Locker ID를 `useState`로 관리.
- 해시 변화 감지 후 `focusLocker`가 뷰박스를 이동시켜 NFC 워프 경험을 제공.
- Topic 레이아웃 노드는 `useState`로 보관해 레이아웃 변경 시 재계산한다.

# 아키텍처

## 폴더 구조
- `app/`: Next.js App Router 엔트리. `page.tsx`에서 전체 레이아웃을 구성한다.
- `components/`: UI와 인터랙션을 담당하는 React 컴포넌트 모음.
- `lib/`: 레이아웃 계산, 워프 로직 등 순수 유틸리티.
- `data/`: 정적 뮤지엄 데이터(JSON).
- `docs/`: 기획 및 스펙 문서.
- `types.ts`: 데이터 타입 정의.

## 주요 컴포넌트 관계
- `LockersGrid`가 전체 상태(레이아웃, 활성 락커)를 관리하고 `Locker`에 전달한다.
- `RelationsLayer`는 같은 데이터로 곡선을 렌더링해 네트워크를 표현한다.
- `LayoutToggle`은 레이아웃 모드 스위치를 제공한다.
- `FabButtons`는 프로젝트 설명과 갤러리 팝업을 띄우는 플로팅 UI이다.

## React + SVG 구조
- 배경에 `svg`를 깔고, `path`와 `textPath`로 관계선을 그린다.
- 각 락커는 `motion.button`과 `motion.div`로 문/배경/콘텐츠 레이어를 구성한다.
- clip-path를 이용해 내부 공간을 확장하는 애니메이션을 적용한다.

## 상태 관리 방식
- 전역은 `LockersGrid` 내부의 `useState`로 단순 관리: `layoutMode`, `activeId`, `highlightId`.
- URL 해시를 읽어 자동으로 특정 락커를 열기 위해 `useHashWarp` 훅을 사용한다.
- 레이아웃 모드에 따라 위치 계산은 `getPosition`에서 처리한다.

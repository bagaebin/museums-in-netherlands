# 디자인 요소 조정 스펙

프로토타입의 디자인·애니메이션 요소를 빠르게 수정할 때 참조해야 할 위치와 상수를 한글로 정리했습니다. 각 항목은 기본값, 역할, 연관 동작을 함께 명시해 두었습니다.

## 전역 색상·배경·컨트롤
- **전역 컬러 토큰**: `app/globals.css`의 `:root`에 정의된 `--bg`, `--panel`, `--accent`, `--muted`, `--text` 값으로 전체 테마 색을 제어합니다(1~6행). 배경·패널·강조·보조 텍스트 색 모두 여기서 일괄 변경 가능합니다.
- **바디 배경 그래디언트**: 동일 파일의 `body` 섹션에서 두 개의 radial-gradient와 기본 배경색을 합성합니다(13~21행). 무드 변경 시 투명도와 위치(예: `circle at 20% 20%`)를 조정하세요.
- **전체 캔버스 레이아웃**: `.main-shell`(29~35행)과 `.atlas-stage`(37~47행)가 전체 뷰포트 크기, 블러, 배경 그라디언트, 테두리 제거를 담당합니다. 스테이지 블러 강도는 `backdrop-filter: blur(10px)`으로 제어합니다.
- **상단 컨트롤 스타일**: `.controls` 블록(75~88행)과 `.layout-toggle button`(90~108행)이 레이아웃 토글 패널의 배경 알파, 테두리 투명도, 버튼 패딩·반응 효과를 관리합니다.
- **FAB(오른쪽 하단) 스타일**: `.fab-cluster`와 `.fab-button`(110~131행)에서 위치, 간격, 라운딩(999px), 그림자 강도를 수정합니다.

## 사물함 타일 및 디테일 노출
- **타일 기본 크기·스타일**: `.locker-tile`(133~143행)이 너비·높이 160px, 원근감(`perspective: 1400px`), 테두리/그림자 투명도를 관리합니다. 크기를 변경하면 `lib/layout.ts`의 `TILE_WIDTH`, `TILE_HEIGHT`도 함께 맞춰야 합니다.
- **도어 면 스타일**: `.locker-surface`(145~156행)에서 표면 그라디언트, 테두리, 글자 두께를 조정합니다.
- **내부 배경/확장 모션**: `.detail-bg`(158~170행)이 사물함 내부 그라디언트와 확장 시 inset 변화를 정의합니다. 드래그/확장 모션은 `components/Locker.tsx`의 `detailBgRectVariants`와 `detailBgCircleVariants`에서 스프링 강성, 지연 시간, `clipPath` 형태를 제어합니다(26~64행).
- **디테일 텍스트 레이어**: `.detail-content`(172~188행)에서 내부 타이포 크기와 패딩을, `detailContentVariants`에서 등장 시 투명도·Y축 이동·지연을 관리합니다(66~78행).
- **하이라이트 링**: `.highlight-ring`(189~196행)의 점선 색상과 `@keyframes pulse`(198~208행)의 투명도 사이클로 깜박임 강도를 조정합니다.
- **확장 반경**: 사물함을 확장할 때 배경 원이 커지는 반경 기본값은 `Locker` 컴포넌트의 `expansionRadius` prop 기본값 `800`이며, 확장 상태는 `radius = isExpanded ? expansionRadius : 700` 로직으로 제어됩니다(120~123행 및 103~104행). 외부에서 다른 값을 넘겨 효과를 튜닝할 수 있습니다.

## 레이아웃 및 위치 계산 상수
- **타일 치수·패딩**: `lib/layout.ts` 상단의 `TILE_WIDTH`, `TILE_HEIGHT`, `GRID_GAP`, `STAGE_PADDING` 상수(7~10행)가 배치 계산의 기본 단위를 정의합니다. CSS 타일 크기와 동기화 필수입니다.
- **그리드/토픽/맵 배치 알고리즘**: 같은 파일의 `computeLayoutPositions`와 `buildGridPositions`, `buildTopicPositions`, `buildMapPositions`(12~86행)에서 레이아웃 모드별 좌표 계산 방식을 확인할 수 있습니다. 토픽 모드의 행·열 수(`cols`, `rows`)와 로컬 오프셋(`localX`, `localY`)이 여기 정의됩니다.
- **센터링 로직**: `centerPositions`(88~105행)이 배치 후 스테이지 중앙으로 이동시키는 오프셋을 계산합니다. 스테이지 여백을 바꾸려면 `STAGE_PADDING`과 함께 조정하세요.

## 관계(링크) 시각화
- **두께 계산 기준**: `RelationsLayer`에서 `relationThickness = Math.min(TILE_WIDTH, TILE_HEIGHT)`로 설정해 `--relation-thickness` CSS 변수에 전달합니다(28~112행). 타일 크기 변경 시 자동 반영됩니다.
- **경로 선택 로직**: 같은 파일의 `getEdgeSegment` 함수(30~100행)가 박스 간 연결선이 어느 면에서 나갈지 결정합니다. `layout === 'grid'` 분기에서 가로·세로 간격 우선순위를 조정할 수 있습니다.
- **레이블 노출 길이**: `estimateReveal`을 사용해 거리 대비 텍스트 노출 길이를 조절하며, 기본 임계값은 `lib/layout.ts`의 `threshold = 280` 입니다(124~128행).
- **스타일링 포인트**: `.relation-*` CSS 블록(210~247행)이 링크 선의 색, 호버 시 강조(`fill: rgba(255, 180, 0, 0.28)`)를 담당합니다. 패널/오버레이 스타일은 249~399행을 참고하세요.

## 오버레이(관계 상세, 메가 패널)
- **관계 상세 모달**: `.relation-overlay`, `.relation-panel`, `.relation-close`, `.relation-meta` 등(249~350행)에서 블러 정도, 패딩, 카드 라운딩, 텍스트 크기를 조정합니다.
- **메가 패널**: `.mega-overlay`, `.mega-panel`, `.mega-header`, `.mega-grid`, `.mega-gallery`(352~509행)에서 확장 뷰 배경 그래디언트, 블러, 최대 폭, 갤러리 그리드, 반응형 브레이크포인트(900px)를 설정합니다.

## 사용자 인터랙션 트리거
- **해시 기반 오픈/하이라이트**: `lib/warp.ts`의 `applyHashWarp`에서 URL 해시로 특정 사물함을 열고 강조하는 로직을 제어합니다. 스크롤 동작과 `onHighlight` 지연 없이 즉시 실행됩니다(8~19행). 하이라이트 효과를 변경하려면 `Locker` 컴포넌트의 `highlight` 처리와 CSS 하이라이트 링을 함께 수정해야 합니다.
- **FAB 연결**: `components/FabButtons.tsx`에서 프로젝트 설명/갤러리 모달 버튼 텍스트와 애니메이션(`whileHover`, `whileTap`)을 제어합니다(1~20행). 모달 스타일은 상단 전역 CSS 항목 참조.

## 데이터 구조 참고
- **박물관 데이터 필드**: `lib/types.ts`의 `Museum` 인터페이스가 `topic`, `positionGrid`, `positionMap`, `relations`, `detail` 필드를 정의합니다(13~22행). 레이아웃·관계·갤러리 이미지를 수정할 때 필요한 키 이름을 확인하세요.
- **샘플 데이터 위치**: `data/museums.json`에 실제 좌표와 관계 라벨이 들어 있습니다. 위치를 바꿀 때는 위 인터페이스 필드와 배치 상수를 함께 고려하세요.

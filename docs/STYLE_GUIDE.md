# 스타일 가이드

## 컬러 토큰
- 배경: `#0f1115`
- 패널: `#1b1f28`
- 포인트: `#ffb400`
- 텍스트: `#e6edf3`
- 보조 텍스트: `#9aa4b5`

## 타이포그래피
- 기본 폰트: Inter, system-ui
- 제목: 20~28px, 굵기 700
- 본문: 14~16px, 굵기 400~500, 줄간 1.4
- 캡션: 12px, 보조 텍스트 컬러 사용

## 사물함 규칙
- 모서리: radius 16px
- 스트로크: 1px, 투명도 6~10%
- 그림자: 0 12px 40px rgba(0,0,0,0.35)
- 힌지 회전 중심: `transform-origin: left center`
- clip-path 라운드 값: 16px 기준, 필요 시 토큰화 가능

## 사물함 크기 조정
- 사물함 크기를 줄이려면 `app/globals.css`의 `.locker-tile` 클래스에서 `width`와 `height` 값을 조정하세요.
- 기본값: `width: 160px;`, `height: 160px;`
- 예: 크기를 120px로 줄이려면 다음과 같이 설정합니다:
  ```css
  .locker-tile {
    width: 120px;
    height: 120px;
  }
  ```

## 연결선 크기 조정
- 연결선의 크기를 줄이려면 `app/globals.css`의 `.relation-path` 클래스에서 `stroke-width` 값을 조정하세요.
- 기본값: `stroke-width: 2px;`
- 예: 크기를 1px로 줄이려면 다음과 같이 설정합니다:
  ```css
  .relation-path {
    stroke-width: 1px;
  }
  ```

## 연결선 디자인 톤
- 기본 리본(폴리곤) 컬러는 `rgba(21, 24, 33, 0.34)`이며 스트로크는 `rgba(21, 24, 33, 0.52)`로 약간 더 불투명하게 유지합니다.
- 리본과 허브 병합 면(`.relation-hub-merged`) 모두에 `backdrop-filter: blur(8px);`를 적용해 배경을 부드럽게 흐리게 처리합니다.
- 그림자 강도는 리본 `drop-shadow(0 10px 30px rgba(0, 0, 0, 0.24))`, 허브 병합 면 `drop-shadow(0 8px 24px rgba(0, 0, 0, 0.18))`을 사용해 깊이를 강조합니다.
- 위 값들은 연결선이 배경보다 또렷하게 보이되 과도하게 두드러지지 않도록 설계된 기본 톤입니다. 필요 시 동일한 비율을 유지하며 값만 미세 조정하세요.

## 기타
- FAB: pill 형태, 그림자 강조, hover 시 scale 1.04
- 관계 곡선: stroke 2px, 점선 12/10 패턴, 텍스트 12px

## 지도 레이아웃 확장 팁
- 지도 그래픽을 더 넓게 쓰면서도 전체 아트워크를 유지하려면 두 지점을 조정합니다.
  - `app/globals.css`의 `.map-layer` inset/width/height 비율을 늘리면 배경 캔버스 자체가 커져 화면 밖까지 여유 공간이 생깁니다. `background-size: contain`이라 지도가 잘리지 않고 확대됩니다.
  - 락커 배치 범위를 추가로 넓히려면 `lib/layout.ts`의 `MAP_OVERSCAN` 값을 올리세요. 스테이지 계산 시 여백을 더 확보해 네덜란드 외곽까지 포지셔닝이 가능합니다.
- 두 값을 함께 높이면 지도 시각 영역과 배치 가능 영역을 동시에 확장할 수 있습니다. 극단적으로 키울 경우 확대/이동 한계를 고려해 `mapScale` 상한(현재 2.6)도 검토하세요.

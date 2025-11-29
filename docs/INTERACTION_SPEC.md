# 인터랙션 상세 스펙

## 사물함 드래그
- 각 사물함(`motion.g`)은 드래그 가능하며, 위치가 벌어지면 관계 곡선 길이가 늘어난다.
- 드래그 시 관성 없이(`dragMomentum=false`), 탄성(`dragElastic=0.2`)만 적용해 손맛을 유지.

## 치즈 곡선 생성/업데이트
- 인접했던 두 사물함이 떨어질 때 Bézier 곡선: `M start C cx1 cy1 cx2 cy2 end` 형태로 계산.
- 컨트롤 포인트는 거리의 30%를 오프셋으로 사용하여 탄성 있는 곡선 형태를 부여.
- `distance`가 늘어날수록 `strokeDasharray`가 뚜렷해지고 텍스트가 더 길게 노출.

## 관계 텍스트 등장 로직
- `<textPath>`로 라벨을 곡선에 붙이고, `distance / 320 * label.length`만큼 문자 수를 노출.
- 최소 1글자부터 점진적으로 드러나며, 곡선이 다시 짧아지면 노출 길이도 줄어든다.

## 사물함 문 애니메이션
```ts
const doorVariants = {
  open: { rotateY: -90, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  closed:{ rotateY: 0,  transition: { type: 'spring', stiffness: 200, damping: 20 } }
};
```
- `transformOrigin: 'left center'`로 실제 힌지처럼 동작.
- hover 시 소폭 스케일 업, 클릭 시 isOpen 상태를 토글.

## 내부 배경 확장 애니메이션
- 사각형 inset 방식:
```ts
open: { clipPath: 'inset(0% 0% 0% 0% round 16px)', transition:{ type:'spring', stiffness:40, damping:18, delay:0.12 } }
closed:{ clipPath: 'inset(50% 50% 50% 50% round 16px)', transition:{ type:'spring', stiffness:400, damping:40 } }
```
- 원형 확장 대안도 `circle(radius at 50% 50%)`로 제공.
- 문 열림보다 0.1~0.2초 늦게 시작하여 레이어 순서를 강조.

## 상세 콘텐츠 등장 타이밍
- `detailContentVariants`: `open` 상태에서 opacity 1, y 0으로 전환하며 `delay: 0.25` 적용.
- 문 → 배경 → 콘텐츠 순으로 하나의 `isOpen` 상태에 맞춰 orchestrate.

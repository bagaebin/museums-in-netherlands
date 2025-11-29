# 인터랙션 스펙

## 사물함 드래그
- 향후 확장 시 SVG `<g>` 또는 `<foreignObject>`에 Pointer 이벤트/Draggable을 붙여 위치를 조정한다.
- 인접한 두 사물함이 원래 붙어 있다가 떨어질 때, 이전 접촉면 기준으로 곡선을 생성한다.

## 치즈 곡선 생성 및 업데이트
1. 드래그 시작 시 기존 인접 좌표를 기록.
2. 사물함이 벌어지는 동안 두 중심 좌표를 사용해 `Cubic Bezier` 제어점을 계산한다.
3. 거리 증가에 비례해 제어점 오프셋을 키워 탄성 있는 곡선을 만든다.
4. `pathLength` 애니메이션으로 자연스러운 등장 효과를 주고, 라벨은 `<textPath>`에 연결한다.

## 관계 텍스트 글자 단위 등장
- `path.getTotalLength()`로 현재 길이를 측정하고, 길이 비율에 따라 문자열 슬라이싱해 노출.
- 또는 `stroke-dashoffset` 마스크로 글자를 점진적으로 가리는 방식 적용 가능.

## 사물함 문 애니메이션
- `rotateY`를 -90deg로 회전시키며 `transformOrigin: left center`를 사용한다.
- Variants:
  ```ts
  const doorVariants = {
    open: { rotateY: -90, transition: { type: "spring", stiffness: 200, damping: 20 } },
    closed: { rotateY: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };
  ```

## 내부 사각형/원 확장 애니메이션
- **사각형(Inset)**: `clipPath: inset(50% 50% 50% 50% round 16px)`에서 시작해 `inset(0% 0% 0% 0% round 16px)`으로 확장한다.
- **원형(Circle)**: `clipPath: circle(0px at 50% 50%)`에서 원하는 반경까지 스프링으로 확대.
- 두 애니메이션 모두 문이 열리는 순간보다 약 0.1~0.2초 지연을 준다.

## 상세 콘텐츠 등장 타이밍
- 배경 확장이 시작된 뒤 약 0.25초 후 `opacity`와 `y` 값을 조정해 부드럽게 떠오르게 한다.
- 닫힐 때는 즉시 `opacity` 0과 `y` 오프로 내려가도록 설정한다.

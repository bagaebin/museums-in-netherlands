# 다점(branch) 관계 렌더링 스펙 (테스트 패치)

## 목적
- 3개 이상의 락커가 하나의 연결 중점에서 퍼져나가는 가지형 구조를 표현한다.
- 기존 1:1 리본 렌더링을 유지하되, 다점 관계는 **중앙 허브(anchor)**를 중심으로 여러 락커가 동시에 연결되는 다각형 묶음으로 보여준다.
- 데이터 추가만으로 토폴로지를 정의하고, 레이아웃 전환(grid/topic/map)에 따라 허브 좌표를 자동으로 재계산한다.

## 데이터 계약
`data/relationHubs.json` 파일에 다점 허브를 정의한다.

```json
{
  "id": "river-culture-hub",             // 고유 ID
  "label": "라인강 협력 라운지",           // 허브 라벨
  "members": ["arnhem-museum", "depot-boijmans", "museum-arnhem"],
  "offset": { "x": 0, "y": -30 },        // (선택) 기본 오프셋(px) – 멤버 중심점에서 상대값
  "layoutOffsets": [                       // (선택) 레이아웃별 오프셋 우선 적용
    { "layout": "map", "offset": { "x": 18, "y": -24 } }
  ]
}
```

규칙:
- `members`는 3개 이상이어야 하며, 모두 `museums.json`의 `id`와 일치해야 한다.
- `offset`/`layoutOffsets[].offset` 값은 **멤버들의 중심점 평균 좌표**에 더해지는 px 단위 변위다.
- `layoutOffsets`에 해당 레이아웃 값이 없으면 `offset`을 사용하고, 둘 다 없으면 변위 0을 적용한다.

## 렌더링 요구사항
- 허브의 기준점(anchor)은 현재 레이아웃에서 멤버 타일 중심점의 평균값을 기준으로 계산한다.
- 각 멤버는 허브를 향해 **타일 가장자리 중심점**을 선택해 접속하며, 허브 기준점과 멤버 가장자리 중심점을 잇는 폴리곤(삼각형)에 `relation-ribbon` 스타일 변형을 적용한다.
- 허브 라벨은 기준점 위쪽에 배치하고, 확대/축소에 따라 텍스트가 잘리지 않도록 `relation-label` 스타일을 재사용한다.
- 기존 1:1 리본 렌더링은 그대로 유지한다(회귀 방지).

## 상호작용 및 접근성
- 허브 삼각형 전체를 클릭/포커스 가능 영역으로 두고, `aria-label`은 "허브라벨 – 멤버이름" 형태로 노출한다.
- 클릭 시 기존 relation 패널을 재사용하며, 허브 라벨과 멤버 이름을 함께 전달한다.

## 허브 교차점 팝업(추가 요구)
- 목적: 3개 이상 락커가 연결된 허브의 **교차점(중앙 노드)**을 키워서 클릭/포커스로 허브 자체 정보를 보여주는 팝업을 띄운다.
- 표시 정보: 허브가 제공하는 `fund`, `studio`, `curator` 등 지원 주체 목록과 간단 설명.

### 데이터 계약 (허브 정보 확장)
`data/relationHubs.json`에 선택 필드 `info`를 추가한다.

```json
{
  "id": "rhine-culture-branch",
  "label": "라인 컬처 허브",
  "members": ["arnhem-museum", "depot-boijmans", "kunsthal-rotterdam", "rijksmuseum-amsterdam"],
  "offset": { "x": 0, "y": -24 },
  "info": {
    "summary": "라인강 예술 생태계를 연결하는 프로젝트 허브",
    "providers": [
      { "role": "fund", "name": "Rijnfonds" },
      { "role": "studio", "name": "Studio Delta" },
      { "role": "curator", "name": "J. van Rijk" }
    ]
  }
}
```

규칙:
- `info.providers[].role`은 `fund` | `studio` | `curator` | `producer` | `other` 중 하나이며 UI에서 라벨/아이콘으로 매핑한다.
- `info.summary`는 160자 내외의 짧은 문장으로 팝업 상단에 노출한다.
- `info`는 선택 사항이나, 제공되면 교차점 팝업을 활성화한다.

### 렌더링 & 상호작용
- 허브 중심 노드의 반지름을 기존 10px → **14px**로 키우고, 접근성을 위해 24px 투명 히트 존을 추가한다.
- 중심 노드 클릭/Enter/Space 시 허브 팝업을 열고, 다른 멤버 삼각형 클릭 동작과 충돌하지 않도록 **포인터 이벤트 우선순위**를 중앙 노드에 준다.
- 팝업은 기존 relation 패널 스타일을 재사용하되, 헤드라인에는 허브 라벨과 멤버 수, 본문에 `info.summary`·`providers` 배지를 렌더링한다.
- 팝업 닫기: ESC 키, 바깥 영역 클릭, 패널 내 닫기 버튼.

## 구현 메모
- `lib/types.ts`에 `RelationHub` 타입을 추가한다.
- `app/page.tsx`에서 허브 데이터를 로드해 `RelationsLayer`에 전달한다.
- `RelationsLayer`는 허브 렌더링 로직을 별도로 추가하되, 기존 `getEdgeSegment` 로직을 재사용 또는 확장한다.
- CSS는 `relation-ribbon`·`relation-label` 변형 클래스 추가 정도로 최소화한다.

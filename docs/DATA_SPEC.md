# 데이터 스펙

## JSON 스키마
- `id`: 뮤지엄을 구분하는 고유 식별자 (NFC 해시와 동일하게 사용)
- `name`: 뮤지엄 이름
- `type`: 분류(뮤지엄, 아카이브 등)
- `region`: 행정 구역 코드 (예: NL-Gelderland)
- `city`: 도시명
- `positionGrid`: 그리드 레이아웃 좌표 `{ x, y }`
- `positionMap`: 지도 뷰 정규화 좌표 `{ x, y }` (0~1 범위)
- `relations`: 다른 뮤지엄과의 연결 배열
  - `targetId`: 연결 대상 `id`
  - `label`: 관계 설명 텍스트
- `detail`: 상세 정보
  - `description`: 설명 문단
  - `images`: 관련 이미지 URL 배열
  - `url`: 외부 공식 사이트

## 예시 JSON 조각
```json
{
  "id": "museum-sonje",
  "name": "Museum Sonje",
  "type": "museum",
  "region": "NL-Gelderland",
  "city": "Arnhem",
  "positionGrid": { "x": 0, "y": 0 },
  "positionMap": { "x": 0.63, "y": 0.47 },
  "relations": [
    { "targetId": "stedelijk-amsterdam", "label": "공동 기획 경험" }
  ],
  "detail": {
    "description": "동시대 미술을 중심으로 한 실험적 전시를 소개합니다.",
    "images": ["https://..."],
    "url": "https://..."
  }
}
```

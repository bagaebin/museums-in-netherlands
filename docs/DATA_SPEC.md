# 데이터 스펙

## JSON 스키마
- `id`: 고유 식별자 (NFC 해시, URL 앵커로 사용)
- `name`: 뮤지엄 이름
- `type`: 시설 유형 (museum 등)
- `region`: 행정 구역 코드
- `city`: 도시명
- `positionGrid {x, y}`: 촘촘한 그리드 배치 좌표
- `positionMap {x, y}`: 지도 배치 정규화 좌표 (0~1)
- `relations[]`: 관련 뮤지엄과 관계 라벨
  - `targetId`: 연결 대상 뮤지엄 id
  - `label`: 관계 설명 텍스트
- `detail`: 상세 정보
  - `description`: 소개 텍스트
  - `images[]`: 대표 이미지 URL 목록
  - `url`: 외부 상세 페이지 링크

## 예시 조각
```json
{
  "id": "museum-sonje",
  "name": "Museum Sonje",
  "region": "NL-Gelderland",
  "city": "Arnhem",
  "positionGrid": { "x": 0, "y": 0 },
  "positionMap": { "x": 0.63, "y": 0.47 },
  "relations": [
    { "targetId": "stedelijk-amsterdam", "label": "공동 기획 경험" }
  ],
  "detail": {
    "description": "현대 미술 중심의 실험적 전시를 선보이는 공간",
    "images": ["https://..."],
    "url": "https://example.com"
  }
}
```

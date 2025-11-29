# 데이터 스키마

모든 박물관 정보는 단일 JSON 파일(`data/museums.json`)에 저장된다.

## 필드 설명
- `id`: 고유 식별자. NFC 해시와 URL 해시(#id)에서 사용.
- `name`: 박물관 명칭.
- `type`: 기관 유형(예: museum, gallery 등).
- `region`: 행정 구역 코드.
- `city`: 도시명.
- `topic`: 주제/테마 클러스터링에 사용되는 키워드.
- `positionGrid {x, y}`: 그리드 레이아웃의 정수 좌표.
- `positionMap {x, y}`: 지도 레이아웃에서 0~1 정규화된 좌표.
- `relations[]`: 인접·협업 관계 배열.
  - `targetId`: 연결 대상 박물관의 id.
  - `label`: 관계 라벨(곡선 textPath에 표시).
- `detail`: 상세 정보 오브젝트.
  - `description`: 설명 문장.
  - `images[]`: 대표 이미지 URL 목록.
  - `url`: 외부 상세 페이지 링크.

## 예시 조각
```json
{
  "id": "museum-sonje",
  "name": "Museum Sonje",
  "type": "museum",
  "region": "NL-Gelderland",
  "city": "Arnhem",
  "topic": "현대미술",
  "positionGrid": { "x": 0, "y": 0 },
  "positionMap": { "x": 0.63, "y": 0.47 },
  "relations": [
    { "targetId": "stedelijk-amsterdam", "label": "공동 기획 경험" }
  ],
  "detail": {
    "description": "아른험에 위치한 현대미술 중심 기관으로 실험적 전시를 선보인다.",
    "images": ["https://images.unsplash.com/photo-1529429617124-aee5f4ae7890"],
    "url": "https://museum-sonje.example.com"
  }
}
```

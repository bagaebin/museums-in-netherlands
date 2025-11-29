# 데이터 스펙

## JSON 스키마
```jsonc
[
  {
    "id": "string",          // 고유 식별자 (해시/NFC와 매핑)
    "name": "string",        // 미술관 이름
    "type": "string",        // 분류(박물관/미술관 등)
    "region": "string",      // ISO-like 지역 코드
    "city": "string",        // 도시명
    "positionGrid": { "x": 0, "y": 0 }, // 그리드 좌표
    "positionMap": { "x": 0.52, "y": 0.42 }, // 0~1 정규화 지도 좌표
    "topic": "string",       // 주제/클러스터 라벨
    "relations": [
      { "targetId": "other-id", "label": "관계 설명" }
    ],
    "detail": {
      "description": "string",
      "images": ["https://..."],
      "url": "https://..."
    }
  }
]
```

## 필드 설명
- **id**: URL 해시, NFC 태그, React key로 사용되는 핵심 키.
- **name**: UI에 노출되는 대표 명칭.
- **type**: 기관 종류(박물관/미술관/갤러리 등) 구분.
- **region/city**: 지역 기반 검색·필터링에 활용.
- **positionGrid**: 촘촘한 기본 격자 배치를 위한 좌표.
- **positionMap**: 지도 모드에서 SVG 뷰포트에 투사할 정규화 좌표.
- **topic**: 주제 레이아웃에서 클러스터링 기준.
- **relations**: 인접/협업 등 관계 리스트. `targetId`는 다른 미술관 id와 일치해야 한다.
- **detail**: 상세 소개 텍스트와 이미지, 외부 링크.

## 예시 조각
```json
{
  "id": "rijksmuseum",
  "name": "Rijksmuseum",
  "region": "NL-Noord-Holland",
  "city": "Amsterdam",
  "positionGrid": { "x": 0, "y": 0 },
  "positionMap": { "x": 0.52, "y": 0.42 },
  "relations": [
    { "targetId": "stedelijk", "label": "근대/현대 예술 협업" }
  ],
  "detail": {
    "description": "네덜란드 국립미술관...",
    "images": ["https://images.unsplash.com/..."],
    "url": "https://www.rijksmuseum.nl/"
  }
}
```

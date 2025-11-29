# NFC 연동 가이드

## URL 기록 방식
- 각 NFC 스티커에 `https://사이트도메인/#museum-id` 형태로 URL을 기록한다.
- `museum-id`는 `data/museums.json`의 `id`와 동일해야 한다.

## 해시 기반 워프
- 페이지 로드 시 `warpToHash`가 `location.hash`를 읽어 대응하는 사물함을 찾는다.
- 찾으면 `setActiveId`로 문/배경/콘텐츠 애니메이션을 시작하고, `highlightedId`로 외곽선에 빛을 준다.
- `hashchange` 이벤트를 구독해 브라우저 내 해시 변경에도 동일 동작을 수행.

## 플랫폼 동작 예상
- **안드로이드**: Web NFC 또는 브라우저가 URL을 열어 해시 포함 페이지로 이동. 오픈 애니메이션 자동 실행.
- **iOS**: NFC 태그 탭 시 사파리에서 URL을 열고 동일하게 해시 파싱 후 워프.
- 네트워크가 없는 현장에서도 해시 로직은 동작하며, 로컬 캐시된 페이지면 즉시 반응.

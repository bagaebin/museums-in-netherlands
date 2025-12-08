## 범례
- `id`: 고유 식별자. NFC 해시와 URL 해시(#id)에서 사용.
- `name`: 박물관 명칭.
- `type`: 기관 유형(예: museum, gallery 등).
- `location`: 주소.
- `location_url`: 주소 텍스트에 연결할 구글 지도 URL.
- `opening_time`: 운영 시간.
- `what_they_do`: 설립 목적 및 주요 활동.
- `detail`: 상세 정보.
- `oranization`: 조직 정보 링크
- `doorSvg`: 닫힌 문 위에 표시할 SVG 경로. 체커보드 배경 위에 꽉 차게 렌더링된다.
- `interiorBaseColor`: 문이 열리기 전부터 내부 전체를 채우는 기본 배경색. 문에 뚫린 구멍 사이로도 보인다.
- `interiorHoverColor`: 문이 열리면서 중앙에서 안쪽으로 차오르는 포인트 배경색. 기본 배경과 구분되도록 살짝 안쪽에 인셋된다.
- `topic`: 주제/테마 클러스터링에 사용되는 키워드.
- `positionGrid {x, y}`: 그리드 레이아웃의 정수 좌표.
- `positionMap {x, y}`: 지도 레이아웃에서 0~1 정규화된 좌표.
- `relations[]`: 인접·협업 관계 배열.
- `relationHubs[]` (별도 파일): 3개 이상의 박물관을 하나의 허브로 묶어 가지형 렌더링을 지원.
  - `targetId`: 연결 대상 박물관의 id.
  - `label`: 관계 라벨(곡선 textPath에 표시).
  - `description`: 설명 문장.
  - `images[]`: 대표 이미지 URL 목록.
  - `url`: 외부 상세 페이지 링크.

## 01_Arnhem Museum
- `id`: arnhem-museum
- `name`: Museum Arnhem
- `type`: museum

- `location`: Utrechtseweg 87 6812 AA Arnhem
- `location_url`: https://share.google/ck6H3AdsWZF65Ggk3

- `opening_time`: 
Tue - Sun | 11:00 - 17:00
Mon Closed

- `what_they_do`:
### Highlighting perspectives that are often absent in traditional museum spaces
* work closely with artists, partners, and audiences who are not commonly represented in museums.
* contemporary art, magic and neorealism, fashion, & jewelry

- `detail`:
### Renovation & Expansion 2017–2022
reopened on 13 May 2022.

* A new wing was added to the building, offering panoramic * views of Arnhem and the river landscape.
included a thorough renovation and restoration of the original 1873 gentlemen’s club building, which later became the museum.
* The wing designed by Benthem Crouwel Architects(https://www.benthemcrouwel.com)
* The sculpture garden redesigned by Karres en Brands(https://www.karresenbrands.com/en/)

[More]
Design Building(https://www.museumarnhem.nl/en/about-us/new-building/design-building)
Design Garden(https://www.museumarnhem.nl/en/about-us/new-building/design-garden)
Renovation(https://youtube.com/playlist?list=PLmdb8MuNrDmfWd4bl5Hin64-9vB5zMYN7&si=vXt85gg8-IoZEqmV)

- `organization`:
https://www.museumarnhem.nl/en/about-us/organisation

- `external_URL`:
  * Website: https://www.museumarnhem.nl/nl

- `doorSvg`: /locker-doors/arnhem.svg
- `positionGrid`:
      x: 0
      y: 0
- `positionMap`:
      x: 0.67
      y: 0.58
- `topic`: Contemporary Art, Neorealism, Fashion, Jewerly
- `relations`:
  (1)
      targetId: design-den-bosch
      label: Anne-Karlijn van Kesteren
      description: 
      * Develops exhibitions that connect historical research, design, visual culture, and contemporary issues. Her work operates at the intersection of technology, influence, and multiple voices.
      external_link: 
      * [LinkdedIn] (https://www.linkedin.com/in/annekarlijnvankesteren/?originalSubdomain=nl)
      * [Instagram](https:​​/​/www​.instagram​.com​/annekarlijnvankesteren​/)
      
- `interiorBaseColor`: #D6D4D9
- `interiorHoverColor`: #797D80

---

## 02_Bauhaus Museum Dessau
- `id`: bauhaus-dessau
- `name`: Bauhaus Museum Dessau
- `type`: museum

- `location`: Mies-van-der-Rohe-Platz 1, 06844 Dessau-Roßlau, Garmany
- `location_url`: https://maps.app.goo.gl/MRQNnEeGBoKMhqyU6

- `opening_time`: 
[Nov – Feb] Tue – Sun | 10 am – 5 pm
[Mar – Oct] Tue – Sun | 10 am – 6 pm

- `what_they_do`: 
### Analysing the significance and potential of the Bauhaus heritage for the 21st century
* historiographically reflexive manner

- `detail`:(None)

- `organization`:
https://bauhaus-dessau.de/en/institution/departments/

- `external_URL`:
  * Website: https://bauhaus-dessau.de

- `doorSvg`: /locker-doors/bauhaus-dessau.svg
- `positionGrid`:
      x: 1
      y: 0
- `positionMap`:
      x: 0.9
      y: 0.48

- `topic`: Design, Educational

- `relations`:(None)
      
- `interiorBaseColor`: #FFA6C8
- `interiorHoverColor`: #ED1C25

---

## 03_Depot Boijmans Van Beuningen
- `id`: depot-boijmans
- `name`: Depot Boijmans Van Beuningen
- `type`: museum

- `location`: Museumpark 24, Rotterdam
- `location_url`: https://maps.app.goo.gl/KBohuQhARx7pWZgu8

- `opening_time`: 
  Tue - Sun | 11:00 - 17:00

- `what_they_do`:
### Behind-the-scenes view of how a museum operates
* Preserves and makes accessible the museum’s entire art collection
* The collection has been growing since 1849 and now includes over 155,000 artworks, among them 89,000 prints and drawings.
* Upon entering the building, visitors can look directly into the art intake room through glass walls.

- `detail`: (None)

- `organization`:
https://www.boijmans.nl/en/organisation-mission

- `external_URL`:
  * Website: https://www.boijmans.nl/en
  * Instagram: https://www.instagram.com/boijmans/

- `doorSvg`: /locker-doors/depot.svg
- `positionGrid`:
      x: 2
      y: 0
- `positionMap`:
      x: 0.46
      y: 0.64

- `topic`: Conservation

- `relations`: (Working)
      
- `interiorBaseColor`: #FFB2D0
- `interiorHoverColor`: #EF307E

---

## 04_Design Museum Den Bosch
- `id`: design-den-bosch
- `name`: Design Museum Den Bosch
- `type`: museum

- `location`: De Mortel 4 5211 HV ‘s-Hertogenbosch
- `location_url`: https://maps.app.goo.gl/k28Sf9iTTNbT9mRn6

- `opening_time`: 
Tue - Sun | 11:00 - 17:00
Every first Thu of the month | 19:00 - 22:00

- `what_they_do`:
*** Highlight the influence of design on our daily lives and tell the story that lies behind it
* In 2018, adopted a new name to fit this profile more closely, Design Museum Den Bosch.
* Have assembled unique ceramic and jewellery collections, with an ongoing and in-depth focus on the applied arts.

- `detail`: (None)

- `organization`: https://designmuseum.nl/organisatie/

- `external_URL`:
  * Website: https://designmuseum.nl/en/homepage/
  * Instagram: https://www.instagram.com/designmuseumdenbosch/

- `doorSvg`: /locker-doors/design-den-bosch.svg
- `positionGrid`:
      x: 3
      y: 0
- `positionMap`:
      x: 0.55
      y: 0.68

- `topic`: Design

- `relations`:
  (1)
      targetId: next-nature
      label: Timo de Rijk
      description: Director of Design Museum Den Bosch
      images: 
      url: 
      * LinkdedIn: https://www.linkedin.com/in/timo-de-rijk-499a3723/
      * Instagram: https://www.instagram.com/timotheusderijk/
      * DESING DEBATE 2025 in NEXT NATURE Museum: https://nextnature.org/en/events/design-debate-2025
      
- `interiorBaseColor`: #D6D4D9
- `interiorHoverColor`: #797D80

---

## 05_Sonneveld House
- `id`: huis-sonneveld
- `name`: Sonneveld House
- `type`: house-museum

- `location`: Jongkindstraat 12, Rotterdam
- `location_url`: https://share.google/fJuaBBwbw2Qe81ljf

- `opening_time`: 
Tue - Sun | 10:00 - 17:00

- `what_they_do`:
### A museum house and one of the best-preserved homes in the functionalist Nieuwe Bouwen style

- `detail`: (None)

- `organization`:
https://nieuweinstituut.nl/en/projects/over-ons/organisatie

- `external_URL`:
* Website: https://nieuweinstituut.nl/projects/huis-sonneveld

- `doorSvg`: /locker-doors/huis-sonneveld.svg
- `positionGrid`:
      x: 0
      y: 1
- `positionMap`:
      x: 0.47
      y: 0.62
- `topic`: Architecture
- `relations`:
  (1)
      targetId: nieuwe-instituut
      label: The same organization
      description: Nearby location

- `interiorBaseColor`: #FFA6C8
- `interiorHoverColor`: #ED1C25

---

## 06_Kunsthal Rotterdam
- `id`: kunsthal-rotterdam
- `name`: Kunsthal Rotterdam
- `type`: museum

- `location`: Museumpark, Westzeedijk 341, 3015 AA Rotterdam
- `location_url`: https://maps.app.goo.gl/4bQpzQVAt3JJKumf7

- `opening_time`: 
Tue - Fri | 10:00 - 17:00
Sat - Sun | 10:00 - 18:00

- `what_they_do`:
### Transforming, and with its regularly changing exhibitions able to offer crossovers between various art disciplines
* From modern masters and contemporary art to forgotten cultures, photography, fashion and design.

- `detail`: (None)

- `organization`:
https://www.kunsthal.nl/en/about-kunsthal/organisation/who-we-are/

- `external_URL`:
  * Website: https://www.kunsthal.nl/en/
  * Instagram: https://www.instagram.com/kunsthal/

- `doorSvg`: /locker-doors/kunsthal-rotterdam.svg
- `positionGrid`:
      x: 1
      y: 1
- `positionMap`:
      x: 0.45
      y: 0.62
- `topic`: Photography, Fashion, Design

- `relations`: (None)
      
- `interiorBaseColor`: #F2F285
- `interiorHoverColor`: #8C7F3F

---

## 07_Kunstinstituut Melly
- `id`: kunstinstituut-melly
- `name`: Kunstinstituut Melly
- `type`: museum

- `location`: Witte de Withstraat 50, 3012 BR Rotterdam
- `location_url`: https://www.google.com/maps/place//data=!4m2!3m1!1s0x47c4335ffe41c503:0x7615a24dfae30408?sa=X&ved=1t:8290&ictx=111

- `opening_time`: 
Wed - Sun | 11:00 - 18:00
Fri during the Kunstavond(https://kunstavond.info) | 11:00 - 21:00

- `what_they_do`:
### An art-house with a mission to present and discuss the ideas and work created today by visual artists and cultural makers

- `detail`:
Closely connected to the local community.

- `organization`:
https://www.kunstinstituutmelly.nl/en/about#team-supervisory-board

- `external_URL`:

- `doorSvg`: /locker-doors/kunstinstituut-melly.svg
- `positionGrid`:
      x: 2
      y: 1
- `positionMap`:
      x: 0.47
      y: 0.63

- `topic`: Contemporary art, Design

- `relations`: (None)
      
- `interiorBaseColor`: #FFA6C8
- `interiorHoverColor`: #ED1C25

---

## 08_Het Natuurhistorisch | A dead serious museum Rotterdam
- `id`: natural-history-rotterdam
- `name`: Het Natuurhistorisch | A dead serious museum
- `type`: museum

- `location`: Westzeedijk 345, 3015 AA Rotterdam
- `location_url`: https://www.google.com/maps/place//data=!4m2!3m1!1s0x47c4349e86f20bd7:0x1200e69c3526a2ee?sa=X&ved=1t:8290&ictx=111

- `opening_time`: 
Tue - Sun | 11:00 - 17:00
Mon Closed

- `what_they_do`:
### Informing and inspiring people of all ages and backgrounds about the diversity and resilience of (urban) nature.

- `detail`:
Exhibitions encompassing urban ecology and natural history, presented with delightful storytelling.
[Detail URL] https://www.hetnatuurhistorisch.nl
[Images] https://images.unsplash.com/photo-1469474968028-56623f02e42e

- `organization`:
https://www.hetnatuurhistorisch.nl/organisatie/medewerkers/

- `external_URL`:
  * Website: https://www.hetnatuurhistorisch.nl
  * Instagram: https://www.instagram.com/het_natuurhistorisch/?hl=nl

- `doorSvg`: /locker-doors/natural-history-rotterdam.svg
- `positionGrid`:
      x: 3
      y: 1
- `positionMap`:
      x: 0.44
      y: 0.64

- `topic`: Nature, Science, Educational

- `relations`: 
      
- `interiorBaseColor`: #F2F285
- `interiorHoverColor`: #8C7F3F

---

## 09_Next Nature Museum
- `id`: next-nature
- `name`: Next Nature Museum
- `type`: museum

- `location`: Noord Brabantlaan 1A 5652LA Eindhoven
- `location_url`: https://share.google/3QTt8oaTusbRgg0uL

- `opening_time`: Wed - Sun | 11:00 - 17:00

- `what_they_do`: 
### The story of humankind changing its world with the fruits of knowledge and technology
* Surrounded by technology that it becomes our 'next nature'
* Stimulate debate, educate, initiate publications, events and traveling expositions on how to dream, build and live in the next nature.

- `detail`: (None)

- `organization`:
https://nextnature.org/en/mission/people/team

- `external_URL`:
* Website: https://nextnature.org/en/museum/on-show
* Instagram: https://www.instagram.com/nextnaturemuseum/

- `doorSvg`: /locker-doors/next-nature.svg
- `positionGrid`:
      x: 0
      y: 2
- `positionMap`:
      x: 0.58
      y: 0.72

- `topic`: Nature, Science

- `relations`: (Working - Dutch Design Week 2025)
      
- `interiorBaseColor`: #00A7FF
- `interiorHoverColor`: #0056B2

---

## 10_Nieuwe Instituut
- `id`: nieuwe-instituut
- `name`: Nieuwe Instituut
- `type`: institute

- `location`: Museumpark 25 3015 CB Rotterdam
- `location_url`: https://share.google/Zr9BWOJ1Ky8bvA2u9

- `opening_time`: 
Tue - Wed | 10:00 - 17:00
Thu | 10:00 - 21:00
Fri - Sun | 10:00 - 17:00

- `what_they_do`:
### Focusing on major developments in society, such as the housing shortage, the climate crisis, and the emergence of artificial intelligence
* shows the work of designers, brings people together, and collects, develops and shares knowledge.

- `detail`:
Connects research exhibitions and forums based on archives of architecture, design, and digital culture.
[Detail URL] https://nieuweinstituut.nl
[Images] https://images.unsplash.com/photo-1529429617124-aee5f4ae7890

- `organization`:
https://nieuweinstituut.nl/en/projects/over-ons/organisatie

- `external_URL`:
* Website: https://nieuweinstituut.nl/
* Instagram: https://www.instagram.com/nieuweinstituut/

- `doorSvg`: /locker-doors/nieuwe-instituut.svg
- `positionGrid`:
      x: 1
      y: 2
- `positionMap`:
      x: 0.47
      y: 0.65
- `topic`: Architecture
- `relations`: (None)
      
- `interiorBaseColor`: #F2F285
- `interiorHoverColor`: #222222

---

## 11_Miffy Museum
- `id`: nijntje-museum
- `name`: Miffy Museum
- `type`: museum

- `location`: agnietenstraat 2 3512 xb utrecht
- `location_url`: https://share.google/caUTVUceuBgX0p0Af

- `opening_time`: 
Tue - Sun | 10:00 - 17:00
Mon Closed

- `what_they_do`:
### An unforgettable journey of active discovery for toddlers and preschoolers
* Inspired by the theory Cultuur in de Spiegel (B. van Heusden), which states that early memory-building is essential for developing into balanced, social, and independent individuals.
* The themed rooms contain analogue, mechanical, and sensory interactive installations that aim to offer real, tangible experiences rather than digital simulations.

- `detail`: (None)

- `organization`: https://www.centraalmuseum.nl/en/about

- `external_URL`:
* Miffy: https://www.miffy.com
* Dick Bruna Studio: https://www.centraalmuseum.nl/en/now/permanent-collection/atelier-dick-bruna

- `doorSvg`: /locker-doors/nijntje.svg
- `positionGrid`:
      x: 2
      y: 2
- `positionMap`:
      x: 0.53
      y: 0.6

- `topic`: Children, Educational

- `relations`: (None)
      
- `interiorBaseColor`: #D6D4D9
- `interiorHoverColor`: #797D80

---

## 12_Rijksmuseum
- `id`: rijksmuseum-amsterdam
- `name`: Rijksmuseum
- `type`: museum

- `location`: Museumstraat 1, Amsterdam
- `location_url`: https://share.google/7qxvVrRe3pq1gGBiq

- `opening_time`: 
9:00 -17:00

- `what_they_do`:
### Focusing on Vincent van Gogh and his time makes us unique as a museum

- `detail`: (None)

- `organization`:
https://www.rijksmuseum.nl/en/about-us/who-we-are

- `external_URL`:
* Website: https://www.rijksmuseum.nl/en
* Instagram: https://www.instagram.com/rijksmuseum/

- `doorSvg`: /locker-doors/rijks-amsterdam.svg
- `positionGrid`:
      x: 0
      y: 3
- `positionMap`:
      x: 0.42
      y: 0.39

- `topic`: National

- `relations`: None
      
- `interiorBaseColor`: #D6D4D9
- `interiorHoverColor`: #797D80

---

## 13_Stedelijk Museum Amsterdam
- `id`: stedelijk-amsterdam
- `name`: Stedelijk Museum Amsterdam
- `type`: museum

- `location`: Museumplein 10 1071 DJ Amsterdam
- `location_url`: https://share.google/yXu6priucQM7nIlCw

- `opening_time`: 
Mon - Sun | 10:00 - 18:00

- `what_they_do`:
### The place where everyone can discover and experience modern and contemporary visual art and design
* The interactions between audiences and art are driven by dialogues with artists

- `detail`: (None)

- `organization`:
https://www.stedelijk.nl/en/our-team

- `external_URL`:
  * Website: https://www.stedelijk.nl/en/
  * Instagram: https://www.instagram.com/stedelijkmuseum/

- `doorSvg`: /locker-doors/stedelijk-amsterdam.svg
- `positionGrid`:
      x: 1
      y: 3
- `positionMap`:
      x: 0.43
      y: 0.41
- `topic`: Contemporary Art
- `relations`: (None)
      
- `interiorBaseColor`: #D6D4D9
- `interiorHoverColor`: #797D80
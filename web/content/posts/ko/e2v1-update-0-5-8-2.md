---
id: "e2v1-update-0-5-8-2"
slug: "e2v1-update-0-5-8-2"
locale: "ko"
type: "post"
category: "update"
segment: "official"
status: "published"
title: "Reality Thread 8 업데이트 – 0.5.8.2 버전 출시"
summary: "Reality Thread 8 출시 24시간 만에 0.5.8.2 업데이트가 배포되어 초기 버그가 수정되었습니다. 캐릭터 스폰 및 스킨 변경 오류, 액션 바 멈춤 현상, Mentar 동기화 문제 등이 해결되어 플레이어 경험이 개선될 예정입니다."
cover_image_url: "https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/rt8_0582.png"
source: "gemini"
source_url: "https://earth2.io/news/e2v1-update-0-5-8-2"
published_at: "2026-05-31T00:00:00+00:00"
created_at: "2026-06-06T13:09:54.355752+00:00"
updated_at: "2026-06-06T13:49:45.477935+00:00"
---

![ellipse](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/ellipse.svg)

# Reality Thread 8 업데이트 – 0.5.8.2 버전 출시

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/rt8_0582.png)

**2026년 5월 31일 – 호주 –** Reality Thread 8이 공식 출시된 지 24시간이 조금 지난 시점에, Earth 2 팀은 초기 출시 기간 동안 플레이어들이 발견한 소수의 문제들을 해결하기 위한 업데이트를 배포했습니다.

RT8의 규모와 동시에 도입된 수많은 시스템을 고려할 때, 롤아웃 자체는 매우 순조롭게 진행되었습니다. 출시 후 몇 가지 문제가 확인되었지만, 팀은 신속하게 조사하고 수정 사항을 개발하여 배포할 수 있었습니다.

버전 0.5.8.2는 초기 RT8 출시 약 24시간 후에 배포되었습니다. 이후 커뮤니티에 이 업데이트를 제공하기 전에 추가 시간을 들여 배포를 모니터링했습니다.

## 캐릭터 스폰 및 스킨 변경 문제

일부 플레이어에게 영향을 미치는 문제가 확인되었는데, 이로 인해 캐릭터 스폰 및 스킨 변경 인터페이스가 완료되지 않고 계속 로드되는 현상이 발생했습니다.

이 문제는 모든 플레이어에게 영향을 미치지는 않았지만, 팀은 0.5.8.2에서 이 문제에 대한 맞춤형 수정 사항을 구현했으며, 영향을 받은 플레이어는 이제 새로운 캐릭터를 스폰하고 스킨을 정상적으로 변경할 수 있어야 합니다.

저희는 캐릭터 스폰 및 스킨 변경 인터페이스의 검색 기능 내에서 때때로 중복된 스킨 항목이 표시될 수 있는 별도의 문제를 인지하고 있습니다. 로딩 문제가 일부 플레이어가 이러한 시스템에 전혀 접근하지 못하게 했기 때문에, 해당 문제 해결이 우선시되었습니다.

중복 검색 결과 문제는 우선순위가 낮다고 판단되며, 향후 업데이트에서 해결될 예정입니다.

## 액션 바 멈춤 현상 수정

특정 상황에서 특정 아이템을 사용한 후 액션 바가 응답하지 않게 될 수 있는 버그가 확인되었습니다.

플레이어는 영향을 받는 아이템을 인벤토리로 다시 옮겨서 일시적으로 문제를 해결할 수 있었지만, 이는 분명히 이상적인 해결책은 아니었습니다.

영구적인 수정 사항이 이제 배포되었으며, 액션 바는 더 이상 그러한 조건에서 멈추지 않아야 합니다.

## Mentar 동기화 업데이트

이 업데이트의 일환으로, Mentar는 멀티플레이어 동기화 가시성에서 제거되었습니다.

다른 플레이어는 일반적으로 Mentar가 소환될 때 이를 볼 필요가 없으며, 일부 미래의 게임 플레이 상황에서는 해당 정보가 비공개로 유지되어야 할 수 있습니다.

따라서 Mentar는 이제 이를 소유하고 소환하는 플레이어에게만 보입니다.

## 레시피 하이라이트 문제

Superior Backpack 레시피에서 문제가 확인되었습니다.

레시피에는 Backpack 2개가 정확하게 필요하지만, 새로운 레시피 재료 식별 시스템은 Backpack 1개만 추가되었을 때 레시피가 완료된 것으로 잘못 강조 표시했습니다.

이 문제는 이제 수정되었습니다.

0.5.8.2 배포 전 임시 조치로, 팀은 적절한 수정이 준비되는 동안 Superior Backpack 레시피를 Backpack 1개 또는 2개로 제작할 수 있도록 허용했습니다. 이 임시 해결책은 이제 제거되었으며, 플레이어는 다시 올바른 레시피 요구 사항을 따라야 합니다.

현재까지 파악된 바로는 RT8에 포함된 약 100개의 다른 레시피는 올바르게 작동하고 있습니다. 그러나 플레이어가 레시피 재료 식별 시스템에서 추가적인 불일치를 발견하면 알려주시기 바랍니다.

또한 시각적으로 표시되는 레시피 자체가 항상 진실의 원천임을 기억하는 것이 중요합니다. 레시피 재료 식별 시스템은 플레이어를 돕기 위한 편의 기능이지만, 레시피 표시와 강조 표시 시스템 사이에 불일치가 발생할 경우, 표시된 레시피 요구 사항이 우선합니다.

## 불안정한 카메라 수정

팀은 또한 특정 조건에서 캐릭터 카메라가 불안정해질 수 있는 상황을 확인했습니다.

수정 사항이 배포되었으며, 이 문제는 이제 해결되어야 합니다.

## Master of Tiles Badge 접근 권한

팀이 0.5.8.2가 접근 권한을 부여할 만큼 충분히 안정적이라고 판단함에 따라, Master of Tiles Badge 소지자에게 접근 권한이 부여되었음을 기쁘게 확인합니다.

모든 Master of Tile Badgers 여러분께 축하드리며, E2V1에 오신 것을 환영합니다!

접근 권한이 해제된 후, 런처를 새로 설치한 후 E2V1 실행에 문제가 발생했다는 소수의 플레이어 보고를 확인했습니다.

팀은 한 가지 잠재적인 원인을 파악하고 저희 측에서 수정 사항을 구현했습니다.

최근 런처를 설치했고 E2V1 진입에 문제가 발생한다면, 먼저 다음을 시도해 주십시오:

- 런처를 완전히 닫습니다.

- 런처를 다시 엽니다.

- 업데이트 버튼을 다시 누르고 런처가 다른 업데이트 확인을 수행하고 문제를 해결하도록 허용합니다.

대부분의 경우 이 방법으로 문제가 해결될 것이며, 이미 플레이어의 문제가 해결되었다는 보고를 받았습니다.

문제가 계속 발생하면:

- 런처를 완전히 제거합니다.

- 최신 버전을 다운로드합니다.

- 새로 설치를 수행합니다.

이후에도 문제가 계속 발생하면, 팀에 문의해 주시면 계속 조사하겠습니다.

## Master of Tiles Badge 소지자를 위한 신규 플레이어 알림

## Master of Tiles Badge 소지자를 위한 신규 플레이어 알림

새롭게 접근 권한을 부여받은 플레이어 여러분, E2V1 내에서 시작하는 것이 개발 현 단계에서는 여전히 다소 어려울 수 있다는 점을 기억해 주십시오.

저희는 이 점을 충분히 인지하고 있으며, 플레이어가 다음을 더 쉽게 수행할 수 있도록 향후 개선된 온보딩 시스템을 도입할 계획을 이미 가지고 있습니다:

- 속성 찾기

- 토지 상호작용

- 자산 관리

- Mentar 소환

- 캐릭터 생성

현재로서는 오픈 월드 컨트롤에 익숙해진 후, 플레이어는 메인 자유 비행 인터페이스의 오른쪽 상단에 있는 프로필 아이콘을 클릭하여 속성을 빠르게 찾을 수 있습니다. 팝업 인터페이스를 사용하여 방문하려는 속성을 찾으면 **Open in E2V1**을 누르십시오.

이렇게 하면 카메라가 선택된 속성 위치로 즉시 이동합니다.

도착 후 속성 경계나 깃발이 보이지 않으면, 오른쪽 메뉴에 있는 **Property Data Sync** 버튼을 사용하십시오.

동기화되면:

- 속성을 강조 표시하고

- Tile을 더블 클릭하거나 오른쪽 드롭다운 메뉴에서 Mentar 버튼을 사용하십시오.

- 이렇게 하면 Mentar가 소환됩니다.

- Mentar를 클릭하고

- Spawn Character 옵션을 선택하십시오.

캐릭터가 Mentar에 저장되면, 오른쪽 메뉴에서 사용할 수 있는 Character Spawn 인터페이스를 사용하여 향후 캐릭터 생성이 훨씬 쉬워집니다.

## 이전 Reality Threads

Reality Thread 1 출시 이후, E2V1은 상당한 수의 업데이트, 시스템 및 개선 사항을 받았습니다.

저희는 새로 접근 권한을 부여받은 플레이어들이 이전 Reality Thread 기사와 릴리스 노트를 검토할 것을 강력히 권장합니다. 이전에 도입된 많은 시스템이 현재 게임 플레이에서 계속 중요한 역할을 하기 때문입니다.

아래 요약은 높은 수준의 개요만을 제공하며, 각 릴리스에 포함된 모든 기능을 다루지는 않습니다.

### Reality Thread 1

[https://earth2.io/news/reality-thread-1](https://earth2.io/news/reality-thread-1)

다음과 같은 주요 기반 시스템 포함:

- 캐릭터 생성

- 캐릭터 저장

- Mentar 시스템

- 인벤토리 기반

- Discovery 시스템

- 핵심 월드 상호작용 시스템

- 초기 E2V1 게임 플레이 기반

- 기타

### Reality Thread 2

[https://earth2.io/news/reality-thread-2](https://earth2.io/news/reality-thread-2)

주로 다음을 포함한 개선, 수정 및 정제에 중점:

- 안정성 개선

- 성능 업데이트

- 버그 수정

- 전반적인 편의성 개선

### Reality Thread 3

[https://earth2.io/news/reality-thread-3](https://earth2.io/news/reality-thread-3)

### Reality Thread 3

[https://earth2.io/news/reality-thread-3](https://earth2.io/news/reality-thread-3)

E2V1에 멀티플레이어 기능을 도입한 릴리스로 다음을 포함합니다:

- 서버 권한 멀티플레이어

- 캐릭터 동기화

- 실시간 플레이어 상호작용

- 멀티플레이어 인프라

- 글로벌 멀티플레이어 기반

- 기타

### Reality Thread 4

[https://earth2.io/news/reality-thread-4](https://earth2.io/news/reality-thread-4)

초기 전투 및 제작 시스템으로 다음을 포함합니다:

- 제작 시스템 기반

- Glider

- Backpack

- Campfire

- 기본 Tile 검색

- Torch

- Material 클래스

- Global Positioning System

- 멀티플레이어 개선

- Spear

- Shield

- 캐릭터 모드 Tile 선택

- 성능 개선

- 기타

### Reality Thread 5

[https://earth2.io/news/reality-thread-5](https://earth2.io/news/reality-thread-5)

텔레포테이션 및 이동성 중심 시스템으로 다음을 포함합니다:

- Global Teleportation System

- EPL 관리

- Badge Holder System – Badgers에 대한 첫 접근

- Mentar Storage Chip

- Global Build System 기반

- Campfire 업데이트

- Shovel

- Garden Seeds

- Submerged Swimming System

- 기타

### Reality Thread 6

[https://earth2.io/news/reality-thread-6](https://earth2.io/news/reality-thread-6)

캐릭터 진행 및 생존 중심 시스템으로 다음을 포함합니다:

- 요리

- Cooking Pot Set

- 의류 제작

- 의류 장착

- Global Property Sync 업데이트

- 인벤토리 업데이트

- 액션 바 업데이트

- 이모트

- Firetorch 검색

- Aqua Rune Discovery 검색

### Reality Thread 7

[https://earth2.io/news/reality-thread-7](https://earth2.io/news/reality-thread-7)

주요 플레이어 경제 및 인프라 업데이트로 다음을 포함합니다:

- Global Quest Systems (E2V1 제공 및 웹 생성)

- Quest Link

- Cosmetic Skins 및 사용 방법

- Teleport Cargo Implant

- Defoliator

- Land Clearing Set

- Tile Scanner

- 레시피 필터

- 인벤토리 필터

- Hot Swap 시스템 (많은 플레이어가 아직 사용법을 익혀야 함)

- Firewood Bundle

- 장비 UI 개선

- 확장된 ESS 유틸리티 시스템

- 기타

### Reality Thread 8

[https://earth2.io/news/reality-thread-8](https://earth2.io/news/reality-thread-8)

농업, 인프라 및 월드 상호작용 시스템으로 다음을 포함합니다:

- 정원 가꾸기

- Garden Bed

- Watering Can

- Kitchen

- 새로운 레시피

- 내부 E2V1 퀘스트 생성 – E2V1 내에서 필요한 아이템에 대한 퀘스트 생성

- 기본 구조물 철거

- Gaia Pulse Reactor

- Superior Backpack

- Water Bottle

- 수분 공급 개선

- The Hordes Scanner

- My Property Scanner

- 레시피 재료 식별자

- 최고 가치 퀘스트 정렬

- 퀘스트 가시성 필터

- The Beach Ball

- The Superior Beach Ball

- 글라이더 자유 카메라 모드

- 캐릭터 이름 변경

- 상당한 UI/UX 개선

- 성능 개선

- 멀티플레이어 개선

- 기타 등등

위에 요약된 내용은 각 Reality Thread의 주요 추가 사항 중 일부만을 강조한 것이며, 해당 릴리스에 포함된 모든 변경 사항, 수정 사항 및 개선 사항의 완전한 목록을 나타내지는 않습니다.

## 마무리 생각

전반적으로 RT8 이후 첫 48시간은 매우 긍정적이었습니다.

업데이트의 규모와 게임 플레이, 멀티플레이어, 백엔드 서비스, API 및 월드 시스템 전반에 걸쳐 동시에 출시된 상호 연결된 시스템의 수를 고려할 때, 출시가 매우 순조롭게 진행되었습니다.

플레이어가 Reality Thread 8에서 도입된 많은 새로운 시스템을 탐색하는 데 더 많은 시간을 할애함에 따라, 팀은 계속해서 피드백을 모니터링하고, 보고서를 조사하며, 개선 작업을 진행할 것입니다.

개발이 계속됨에 따라 E2V1을 테스트하고, 문제를 보고하며, 개선하는 데 시간을 할애해 주시는 모든 분들께 항상 감사드립니다.

여정에 동참하고 미래를 만들어가세요. Earth 2, 인민의 메타버스.

**Earth2 소개**

**Earth 2®는 두 번째 지구를 위한 미래 지향적인 개념입니다. 가상과 물리적 현실 사이의 메타버스이며, 실제 지리적 위치가 사용자 생성 디지털 가상 환경에 해당합니다.** 이러한 환경은 소유, 구매, 판매가 가능하며, 가까운 미래에는 심층적으로 맞춤 설정할 수 있습니다.

[X](https://twitter.com/earth2io) | [Reddit](https://www.reddit.com/r/earth2io/) | [Discord](https://discord.gg/Wj4sbCWHed) | [Instagram](https://www.instagram.com/earth2io) | [Facebook](https://www.facebook.com/earth2game) | [LinkedIn](https://www.linkedin.com/company/earth2io)

![divider](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/divider-line.png)

## 관련 기사

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/reality-thread-8-web-1.jpg)

#### 챕터 5 - Reality Thread 8 – 변화의 씨앗

2026년 5월 26일 – 호주 – 마지막 주요 Earth 2 릴리스 이후 불과 2개월 만에, Reality Thread 8은 E2V1의 또 다른 도약을 알리며, Earth 2 내부에 농업의 첫 번째 버전을 도입하고 Earth 2 토지에 목적과 유용성을 증가시키는 성장하는 시스템 네트워크를 확장합니다. 주요 기능은 […]입니다.

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/image-1774.png)

#### Reality Thread 7 업데이트 0.4.7.1

#### Reality Thread 7 업데이트 0.4.7.1

2026년 3월 24일 – 호주 – Chapter 4: Reality Thread 7이 공식적으로 출시된 지 불과 24시간 만에, Earth 2 팀은 초기 배포에서 확인된 여러 문제를 해결하기 위해 업데이트 0.4.7.1을 배포했습니다. 모든 Reality Thread 릴리스와 마찬가지로, 팀은 성능, 플레이어 피드백 및 시스템을 적극적으로 모니터링해 왔습니다.

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/essence-burn-web.jpg)

#### $ESS 업데이트 보고서 Q4-25

2026년 3월 23일 – 호주 시드니 – 2025년 4분기 $ESS 통계 보고서를 공유하게 되어 기쁩니다. 이 업데이트에는 언급된 기간 동안의 $ESS 지표에 대한 주요 세부 정보와 아래 각 범주에 대한 자세한 설명이 포함되어 있습니다. ESS 반감기 이벤트는 시스템 내부에서 완벽하게 정렬되었으며 또한 [...]

## 커뮤니티에 참여하세요

놀라운 커뮤니티의 일원이 되어 동료 플레이어와 소통하고 새로운 Earth 2 개발에 대한 최신 업데이트를 받아보세요.

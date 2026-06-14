---
id: "ether-update"
slug: "ether-update"
locale: "ko"
type: "post"
category: "update"
segment: "official"
status: "published"
title: "E-ther 거래 시스템 업데이트 및 E-ther 뱅킹에 한 걸음 더"
summary: "Earth 2가 E-ther 거래 기록을 제공하고, E-ther를 통합 관리하는 시스템으로 변경했습니다. 이는 향후 Civilian 출시, E-ther 뱅킹 시스템 등 E-ther 활용도를 높이기 위한 준비 작업입니다. 플레이어 경험에 미치는 영향은 미미할 것입니다."
cover_image_url: "https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/v2-ether-transactions-web.jpg"
source: "gemini"
source_url: "https://earth2.io/news/ether-update"
published_at: "2023-04-20T00:00:00+00:00"
created_at: "2026-04-12T16:56:31.048758+00:00"
updated_at: "2026-04-26T02:29:46.914181+00:00"
---

# E-ther 거래 시스템 업데이트 및 E-ther 뱅킹에 한 걸음 더

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/v2-ether-transactions-web.jpg)

2023년 4월 20일 – 시드니, 호주 – Earth 2는 플레이어가 Earth 2 EcoSim 내에서 획득한 E-ther에 대한 상세 거래 기록을 확인할 수 있도록 중요한 변경 사항을 적용했습니다. 이러한 업데이트는 향후 Civilian 출시, 미래의 E-ther 뱅킹 시스템 등 Earth 2 내에서 E-ther의 활용도를 높이기 위한 준비 과정입니다.

이번 E-ther 업데이트는 플레이어 경험에 미치는 영향이 미미하며, 대부분의 경우 플레이어는 평소와 같이 E-ther 획득 알림을 받고 E-ther를 획득할 수 있습니다.

획득한 E-ther 저장(및 거래) 변경 사항

Civilian 합성과 EcoSim 내 다른 미래 기능에 맞게 E-ther 시스템이 올바르게 작동하도록 하기 위해, E-ther를 속성별로 "로컬"에 저장하는 방식(기존 방식)에서 벗어나 총액을 집계하여 "글로벌" 플레이어 잔액으로 저장하는 새로운 시스템을 구현했습니다. 이를 통해 플레이어는 E-ther가 발생한 위치에 관계없이 모든 속성에서 향후 E-ther를 사용할 수 있습니다. 즉, E-ther는 플레이어 소유의 땅에서 증발하지만, 일단 획득하면 특정 속성에서 발생한 것으로 구분되지 않고 완전히 통합된 글로벌 잔액으로 저장됩니다.

이는 Civilian 출시 전에 필요한 중요한 변경 사항일 뿐만 아니라, 플레이어가 E-ther의 일부를 Essence로 전환할 수 있도록 하는 미래의 E-ther 뱅킹 시스템에 필요한 업데이트입니다.

플레이어 경험 변화

이번 기술 업데이트는 백엔드 시스템을 상당히 재작업해야 했지만, 플레이어가 E-ther를 수집하고 저장하는 방식에 큰 영향을 미치지 않을 것입니다. 플레이어로서 유일하게 눈에 띄는 변화는 EDC (T1+EDC Land 소유자에게만 해당) 가치 차감이 E-ther가 Essence로 변환될 때가 아닌 E-ther가 획득될 때 발생한다는 점입니다. 이는 E-ther가 이제 속성별이 아닌 플레이어별로 통합된 글로벌 잔액으로 관리되기 때문입니다.

기존 시스템은 플레이어가 E-ther를 Essence로 변환할 때 관련 property에 직접 연결되어 해당 property별로 수집된 E-ther를 저장하도록 구축되었으며, 이를 통해 로컬 property의 EDC 잔액을 보다 쉽게 차감할 수 있었습니다. 앞으로 저희 엔지니어링 팀은 이 레거시 시스템을 계속 사용하는 데 여러 가지 단점이 있음을 확인했고, 그 결과 property 소유자가 E-ther를 Essence로 변환할 때가 아니라 E-ther를 획득할 때 해당 property의 EDC에서 Essence 상당의 가치를 차감하기로 결정했습니다.

이번 업데이트는 개발자들이 공식 발표 전에 새로운 시스템이 올바르게 작동하는지 확인할 시간을 주기 위해 4월 14일경에 조용히 배포되었습니다.

업데이트된 EDC 차감 프로세스 (차감률 감소)

플레이어의 EDC 총액에서 차감되는 Essence는 E-ther의 고정 비율 변환 금액과 동일하며, 플레이어의 Essence 획득/EDC 차감 가치를 정확하게 계산할 수 있습니다. E-ther에서 Essence로의 전환율은 향후 모든 Land Tile에 대해 변경될 수 있지만, EDC가 있는 기존 Tier 1 land의 E-ther 증발량은 구현된 모든 변경 사항을 고려하여 조정될 것입니다. E-ther를 변환하는 단계(이전 방식)가 아닌 E-ther를 획득하는 단계에서 EDC 차감을 계산한다는 것은 EDC 총액이 플레이어가 E-ther를 모아서 Essence로 대량 변환했을 때처럼 큰 금액으로 줄어드는 것이 아니라 더 작은 단위로 줄어든다는 것을 의미합니다.

EDC 총액은 증발된 E-ther가 EDC property 소유자에 의해 획득될 때만 줄어들며, E-ther가 소멸되거나 다른 플레이어에 의해 Raid 당하는 경우에는 줄어들지 않습니다.

플레이어는 이전과 마찬가지로 E-ther를 직접 Essence로 변환하거나, 부스팅된 EDC E-ther를 다른 용도로 사용할 수 있습니다. 선택은 전적으로 플레이어에게 달려 있습니다.

E-ther 거래 페이지 업데이트

플레이어는 또한 획득한 E-ther 거래가 이제 해당 property별로 나열되는 것을 확인할 수 있습니다. 이는 많은 플레이어에게 매우 유용하며 플레이어의 property에서 얼마나 많은 E-ther가 획득되었는지, 그리고 Cydroid에서 얼마나 많은 E-ther가 Raid 당하고 분배되었는지에 대한 통찰력을 제공할 것입니다.

![이미지 2](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/20bb7ec3b441.jpg)

E-ther 거래에 대한 최신 업데이트 요약:

- 획득한 E-ther는 이제 property별이 아닌 플레이어의 글로벌 잔액에 저장됩니다 (이전 방식).

- 획득한 E-ther 값은 이제 플레이어의 거래 내역에 나열됩니다.

- EDC 차감은 플레이어가 property에서 E-ther를 획득할 때 발생하며, 플레이어가 E-ther를 Essence로 변환할 때 발생하는 것이 아닙니다 (기존 방식).

- E-ther 획득 시점에 이루어지는 EDC 차감은 이제 점진적이고 자동적으로 이루어지며, 플레이어가 수동으로 E-ther를 Essence로 변환하는 것에 의존하지 않습니다.

- property에서 Raid로 획득한 E-ther는 플레이어의 EDC 값을 감소시키지 않습니다. 소유 플레이어가 E-ther를 획득하고 해당 E-ther가 글로벌 잔액에 추가될 때만 EDC 차감이 이루어집니다.

- Raid의 결과로 분배된 E-ther 또한 새로운 E-ther 거래 페이지에 나열됩니다.

Earth 2 내부의 미래 계획에 필요한 시스템을 지속적으로 조정, 개선 및 개발하는 동안 지속적인 지원과 인내에 감사드립니다.

지난 한 달 동안 Earth 2는 Cydroid, Raiding, 여러 Raiding 개선 사항, Red Energy, Silver 및 Copper에 대한 새로운 E2PRV 시스템, 그리고 현재 E-ther 거래를 출시했습니다.

이러한 모든 릴리스는 우리 팀이 동시에 Civilians 출시, E2V1의 지속적인 개발, EcoSim 게임 디자인 역학에 대한 대규모 내부 진행 상황 및 백그라운드에서 끊임없이 발생하는 다른 많은 '것들'에 박차를 가하면서 이루어졌습니다!

—

Earth 2에 대하여

Earth 2®는 두 번째 지구에 대한 미래 지향적인 개념입니다. 가상 현실과 물리적 현실 사이의 메타버스로, 실제 지리적 위치가 사용자가 생성한 디지털 가상 환경에 해당합니다. 이러한 환경은 소유, 구매, 판매할 수 있으며 가까운 미래에는 깊이 사용자 정의할 수 있습니다.

Twitter | Reddit | Discord | Instagram | Facebook | LinkedIn

## 관련 기사

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/essence-burn-web.jpg)

#### $ESS 업데이트 보고서 Q4-25

2026년 3월 23일 – 호주 시드니 – 2025년 4분기 $ESS 통계 보고서를 공유하게 되어 기쁩니다. 이 업데이트에는 아래의 각 범주에 대한 자세한 설명을 포함하여 언급된 기간 동안의 $ESS 지표에 대한 주요 세부 정보가 포함되어 있습니다. ESS 반감기 이벤트는 시스템 내부적으로 완벽하게 조정되었음을 참고하십시오. 또한 [...]

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/earth-2-essence_monthly-stats_jul-sep-2025-web.jpg)

#### Earth 2 $ESS 업데이트 보고서: (2025년 4월~6월, 2025년 7월~9월)

2025년 10월 31일 – 호주 시드니 – Earth 2는 2025년 4월부터 2025년 9월까지의 $ESS 통계 보고서를 공유하게 되어 기쁩니다. 이 업데이트에는 아래의 각 범주에 대한 자세한 설명을 포함하여 언급된 기간 동안의 $ESS 지표에 대한 주요 세부 정보가 포함되어 있습니다. 이것은 2분기 보고서입니다.

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/e2v1-pre-alpha-web.jpg)

#### E2V1 Pre-Alpha 챕터 1에 오신 것을 환영합니다: Reality Thread 1

2025년 7월 14일 – 호주 시드니 – Earth 2는 E2V1 Pre-Alpha: 챕터 1의 첫 번째 플레이 가능한 테스트 릴리스를 발표하게 되어 매우 자랑스럽습니다. 모든 것은 Earth 2의 짜여진 디지털 구조에서 생명체의 초기 가닥인 Reality Thread 1에서 시작됩니다. 이는 E2V1 개발에 있어 중요한 순간입니다. 왜냐하면 […]

## 커뮤니티에 참여하세요

저희의 놀라운 커뮤니티의 일원이 되어 동료 플레이어와 소통하고 새로운 Earth 2 개발에 대한 최신 업데이트를 받으세요.


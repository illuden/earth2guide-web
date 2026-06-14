---
id: "ether-update"
slug: "ether-update"
locale: "zh"
type: "post"
category: "update"
segment: "official"
status: "published"
title: "E-ther交易系统更新，为E-ther银行奠定基础"
summary: "Earth 2对E-ther交易系统进行了重要更新，为即将推出的Civilians和未来的E-ther银行系统做准备。更新后，E-ther将以“全局”玩家余额的形式存储，为后续功能提供支持。"
cover_image_url: "https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/v2-ether-transactions-web.jpg"
source: "gemini"
source_url: "https://earth2.io/news/ether-update"
published_at: "2023-04-20T00:00:00+00:00"
created_at: "2026-04-12T16:56:31.048758+00:00"
updated_at: "2026-04-26T02:29:46.914181+00:00"
---

# E-ther交易系统更新，为E-ther银行奠定基础及更多

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/v2-ether-transactions-web.jpg)

2023年4月20日 – 澳大利亚悉尼 – Earth 2 实施了重要变更，玩家现在可以查看 Earth 2 EcoSim 内获得的 E-ther 的详细交易记录。 这些更新是为了配合 E-ther 在 Earth 2 中日益增长的效用而进行的，例如即将发布的 Civilians，未来的 E-ther 银行系统等等。

本次 E-ther 更新对玩家体验的影响很小，在大多数情况下，玩家仍将像往常一样收到待领取的 E-ther 通知，并像往常一样领取 E-ther。

已领取 E-ther 存储（和交易）的变更

为了使 E-ther 机制能够正确地用于 Civilian Synthesis 和 EcoSim 中的其他未来效用，我们实施了一个新系统，该系统不再按地块“本地”存储 E-ther（以前的工作方式）并计算总数，而是将其作为聚合的“全局”玩家余额存储，使玩家的 E-ther 余额可用于其任何地块的未来使用，无论它来自哪个位置。 这意味着 E-ther 仍然会在玩家拥有的土地上蒸发，但是，一旦被领取，此 E-ther 将作为完全成熟的聚合全局余额存储，而不会被区分为来自特定地块。

这不仅是 Civilians 发布之前需要进行的重大更改，而且还是未来 E-ther 银行系统所必需的更新，该系统将允许玩家将部分 E-ther 转换为 Essence。

玩家体验的变更

虽然此技术更新需要对我们的后端系统进行大量改造，但它不会对玩家收集和存储 E-ther 的体验产生重大影响。 作为玩家，您可能注意到的唯一变化是，EDC（仅与 T1+EDC 土地持有者相关）价值扣除发生在领取 E-ther 时，而不是在 E-ther 转化为 Essence 时。 这是因为 E-ther 现在作为每个玩家的聚合全局余额进行存储，而不是每个地块。

我们之前的系统是专门为存储每个地块上认领的 E-ther 而构建的，这使得当玩家将 E-ther 转化为 Essence 时，能够直接链接到相关地块，从而更容易扣除本地地块的 EDC 余额。展望未来，我们的工程团队发现继续使用这个遗留系统存在许多缺点，因此决定在该地块的所有者认领 E-ther 时，从该地块的 EDC 中扣除等值的 Essence，而不是在 E-ther 转化为 Essence 时扣除。

为了让我们的开发人员有时间确保新系统正常运行，这项更新已于 4 月 14 日左右悄悄部署，之后才正式发布公告。

更新后的 EDC 扣除流程（降低扣除率）

从玩家的 EDC 总额中扣除的 Essence 等于 E-ther 的一个静态百分比转换量，这使得能够准确计算玩家的 Essence 增益/EDC 扣除值。虽然未来所有 Land Tile 的 E-ther 转化为 Essence 的比率可能会发生变化，但原始 Tier 1 土地上的 EDC 的 E-ther 蒸发量将进行调整，以适应任何已实施的变更。在 E-ther 认领阶段（而不是过去发生的转化阶段）计算 EDC 扣除额，也意味着 EDC 总额现在以较小的增量减少，而不是像以前那样，玩家在批量转化为 Essence 之前会收集并储存 E-ther，导致 EDC 总额大量减少。

只有当 EDC 地块的所有者认领蒸发的 E-ther 时，EDC 总额才会减少；如果 E-ther 消散或被其他玩家 Raid，则不会减少。

玩家仍然可以选择像往常一样直接将 E-ther 转化为 Essence，或者将提升的 EDC E-ther 用于其他用途。选择完全取决于玩家。

E-ther 交易页面更新

玩家还会注意到，他们认领的 E-ther 交易现在按其来源地块列出。 这将对许多玩家非常有用，并提供有关玩家地块上认领了多少 E-ther 以及 Cydroid Raid 和分配了多少 E-ther 的见解。

![图片 2](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/20bb7ec3b441.jpg)

总结 E-ther 交易的最新更新：

- 认领的 E-ther 现在存储在玩家的全局余额中，而不是像以前那样按地块存储

- 认领的 E-ther 值现在列在玩家的交易中

- 当玩家从他们的地块认领 E-ther 时，会扣除 EDC，而不是像以前那样在玩家将 E-ther 转化为 Essence 时扣除。

- 在 E-ther 认领时扣除的 EDC 现在是增量的和自动的，而不是依赖玩家手动将他们的 E-ther 转化为 Essence。

- 从地块 Raid 获得的 E-ther 不会减少玩家的 EDC 值。只有当所有者玩家认领他们的 E-ther 并且 E-ther 被添加到他们的全局余额时，才会扣除 EDC。

- 由于 Raid 而分配的 E-ther 也列在新的 E-ther 交易页面中

感谢您一直以来的支持和耐心，我们将继续调整、改进和开发 Earth 2 未来计划所需的系统。

在过去的一个月中，Earth 2 发布了 Cydroid、Raid、多次 Raid 改进、Red Energy、新的针对 Silver 和 Copper 的 E2PRV 系统以及现在的 E-ther 交易。

所有这些发布都是在我们团队同时接近发布 Civilians、继续开发 E2V1、大规模内部推进 EcoSim 游戏设计动态以及许多其他在后台不断发生的“事情”的情况下进行的！

—

关于 Earth2

Earth 2® 是第二个地球的未来概念；一个 Metaverse，介于虚拟和物理现实之间，其中真实世界的地理位置对应于用户生成的数字虚拟环境。这些环境可以被拥有、购买、出售，并且在不久的将来可以进行深度定制。

Twitter | Reddit | Discord | Instagram | Facebook | LinkedIn

## 相关文章

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/essence-burn-web.jpg)

#### $ESS 更新报告 Q4-25

2026 年 3 月 23 日 – 澳大利亚悉尼 – 我们很高兴分享 2025 年第四季度的 $ESS 统计报告。此更新包括上述期间 $ESS 指标的关键详细信息，包括下面每个类别的详细说明。请注意，$ESS 减半事件在系统内部完美对齐，因为它也 [...]

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/earth-2-essence_monthly-stats_jul-sep-2025-web.jpg)

#### Earth 2 $ESS 更新报告：（2025 年 4 月至 6 月，2025 年 7 月至 9 月）

2025 年 10 月 31 日 – 澳大利亚悉尼 – Earth 2 很高兴分享 2025 年 4 月至 2025 年 9 月的 $ESS 统计报告。此更新包括上述期间 $ESS 指标的关键详细信息，包括下面每个类别的详细说明。请注意，这是一个双季度报告，而 [...]

![news](https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev/news/e2v1-pre-alpha-web.jpg)

#### 欢迎来到 E2V1 Pre-Alpha 第一章：现实线程 1

2025 年 7 月 14 日 – 澳大利亚悉尼 – 我们非常自豪地宣布 E2V1 Pre-Alpha 第一章的首次可玩测试版本：现实线程 1。一切都始于现实线程 1，这是 Earth 2 编织的数字结构中生命形式的初始线索。这是 E2V1 开发中的一个重要时刻，因为它 [...]

## 加入我们的社区

成为我们精彩社区的一员，与其他玩家联系，并获取有关 Earth 2 最新发展的最新信息。

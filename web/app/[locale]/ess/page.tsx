import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { JsonLd, faqLd, ORG_ID } from '@/components/seo/JsonLd'
import data from '@/public/data/ess_onchain.json'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const isKo = locale === 'ko'
  const title = isKo ? 'ESS 온체인 대시보드 — 소각·출금·고래' : 'ESS 链上数据 — 销毁·提现·巨鲸'
  const description = isKo
    ? `Earth 2 Essence($ESS) 온체인 데이터: 총공급 ${nf(data.supply.total)}·소각 ${nf(data.supply.burned)}(${data.supply.burn_pct}%), earth2 지갑 보유, 개인지갑 출금(주간 USD 평가액), ESS/ETH 풀 유동성, 100만+ 고래 ${data.whales.count}개와 꾸준히 매수하는 지갑. 매주 자동 갱신.`
    : `Earth 2 Essence($ESS) 链上数据：总供应 ${nf(data.supply.total)}·销毁 ${nf(data.supply.burned)}(${data.supply.burn_pct}%)、earth2 钱包持有、个人钱包提现（每周美元估值）、ESS/ETH 流动性、百万级巨鲸 ${data.whales.count} 个与持续买入钱包。每周自动更新。`
  return {
    title,
    description,
    keywords: isKo
      ? ['ESS 온체인', 'Earth 2 Essence', 'ESS 소각', 'ESS 고래', 'ESS 출금', '어스2 에센스', 'ESS 가격', 'ESS 홀더', '$ESS']
      : ['ESS 链上', 'Earth 2 Essence', 'ESS 销毁', 'ESS 巨鲸', 'ESS 提现', 'Earth2 价格', '$ESS'],
    alternates: {
      canonical: `/${locale}/ess`,
      languages: { ko: '/ko/ess', zh: '/zh/ess', 'x-default': '/ko/ess' },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/ess`,
      type: 'website',
      locale: isKo ? 'ko_KR' : 'zh_CN',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Earth2Guide ESS On-chain' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// ---- helpers ----
const nf = (n: number) => Math.round(n).toLocaleString('en-US')
const usd = (n: number) =>
  Math.abs(n) >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : Math.abs(n) >= 1e3 ? `$${(n / 1e3).toFixed(1)}k` : `$${Math.round(n)}`
const short = (a: string) => `${a.slice(0, 8)}…${a.slice(-4)}`
const es = (a: string) => `https://etherscan.io/address/${a}`

const CARD = 'bg-[#161b2b] border border-[#3c494e]/30 rounded-lg p-4'
const H2 = 'text-xl lg:text-2xl font-headline font-bold text-[#dee1f7] mb-3 uppercase tracking-tight'
const TH = 'text-left text-xs font-semibold text-[#859398] px-3 py-2 border-b border-[#3c494e]/30'
const TD = 'px-3 py-2 border-b border-[#3c494e]/15 text-[#dee1f7]'
const MONO = 'font-mono text-[13px] text-[#00d4ff] hover:underline'

type Loc = 'ko' | 'zh'
const STR = {
  ko: {
    title: 'ESS 온체인 대시보드',
    intro: 'Earth 2 Essence($ESS) 토큰의 이더리움 온체인 데이터를 정리합니다. 모든 수치는 컨트랙트의 전체 Transfer 기록을 재구성한 결과이며, 매주 자동 갱신됩니다.',
    asof: '기준',
    block: '블록',
    disclaimer: '본 페이지는 공개 블록체인 데이터를 정리한 정보 제공용이며, 투자 조언이 아닙니다. earth2 트레저리·할당 지갑은 온체인 흐름에 근거한 추정으로 공식 라벨이 아닙니다. 플랫폼 내부에 적립된(미출금) ESS는 온체인에 없어 포함되지 않습니다.',
    sc_supply: '총 공급량', sc_supply_note: '발행 − 소각',
    sc_burn: '총 소각량', sc_burn_note: (p: number) => `발행의 ${p}% · 전량 earth2 소각`,
    sc_e2: 'earth2 보유(추정)', sc_e2_note: (p: number) => `공급의 ${p}%`,
    sc_circ: '유통(비-earth2)', sc_circ_note: (p: number) => `공급의 ${p}%`,
    sc_wd: '개인지갑 누적 출금', sc_wd_note: (n: number) => `${nf(n)}건`,
    sc_dex: 'DEX 유동성 ESS', sc_dex_note: 'V3+V4 풀 예치',
    s1: '공급 · 소각',
    s1b: (m: number, b: number, p: number, s: number) =>
      `발행 ${nf(m)} ESS 전량이 earth2 메인 지갑으로 민팅된 뒤, earth2가 자체 지갑에서 ${nf(b)} ESS(발행의 ${p}%)를 소각했습니다(소각은 100% earth2발). 현재 총공급 ${nf(s)} ESS. 검증: 발행−소각 = 전 지갑 잔액 합계 = 공급량(일치).`,
    s2: 'Earth 2 지갑 (고래 집계 제외)',
    s2note: '메인 분배 지갑(0x68d3)은 발행·출금·소각을 집행하는 핵심 지갑으로 확정적이며, 트레저리·할당 지갑은 온체인 흐름상 earth2 관련으로 추정합니다.',
    th_role: '구분', th_addr: '주소', th_bal: '보유 ESS', th_usd: '≈USD', th_basis: '근거',
    s3: '개인지갑 출금 — 물량 & 당시 USD 평가액',
    s3b: (e: number, t: number, ut: number, un: number) =>
      `메인 지갑에서 개인 EOA로 나간 누적 출금은 ${nf(e)} ESS / ${nf(t)}건입니다. 각 주 출금량에 그 시점 ESS 가격을 적용한 평가액 합계는 ${usd(ut)}이며, 같은 물량을 현재가로 보면 ${usd(un)}입니다(초기 출금이 고가였기 때문). 거래소·DEX·earth2 내부 이동은 제외했습니다.`,
    chart_title: '월별 개인지갑 출금 (ESS)',
    th_week: '주차(ISO)', th_wd_ess: '출금 ESS', th_wd_usd: '당시 평가액',
    recent12: '최근 12주',
    s4: 'ESS/ETH 풀 유동성 (TVL)',
    th_pool: '풀', th_ess: '예치 ESS', th_weth: '예치 WETH', th_tvl: 'TVL(USD)',
    v4note: '* Uniswap V4는 단일 PoolManager가 모든 풀 토큰을 함께 보관해 페어 WETH를 풀별로 분리할 수 없습니다. 따라서 V4 TVL은 ESS측 가치 이상이며 실제는 더 큽니다. 유동성 대부분이 V4로 이동했습니다.',
    s5: '고래 — 100만 ESS+ 보유 (earth2·DEX 제외)',
    th_senders: '유입처', th_frome: 'earth2 직수령',
    s6: '꾸준히 매수·보유하는 지갑',
    s6note: (n: number, a: number) =>
      `DEX(풀/라우터)에서 5주 이상 매수하고 매수량의 50% 이상을 계속 보유 중인 지갑(트레이더 제외) ${n}개. 그중 최근 60일 내에도 매수한 지갑 ${a}개.`,
    th_bought: '누적매수', th_ret: '유지율', th_weeks: '매수 주수', th_period: '기간', th_active: '상태',
    active: '최근매수',
    method: '방법론 · 한계',
    method_b: '데이터는 퍼블릭 이더리움 RPC로 ESS 전체 Transfer를 수집해 전 지갑 잔액을 재구성한 결과입니다. 가격은 CoinGecko(현재)·DefiLlama(주간 과거), 환율은 CoinGecko 기준. 시각 버킷은 블록→시각 선형보간을 사용합니다. ‘매수’는 DEX 컨트랙트로부터의 유입으로 정의해 일부 비매수 유입이 포함될 수 있는 휴리스틱입니다. Earth 2®는 해당 소유주의 상표이며 본 사이트는 운영사와 무관합니다.',
    units_ess: 'ESS',
  },
  zh: {
    title: 'ESS 链上数据看板',
    intro: '整理 Earth 2 Essence($ESS) 在以太坊上的链上数据。所有数值均基于合约全部 Transfer 记录重建，每周自动更新。',
    asof: '截至', block: '区块',
    disclaimer: '本页面整理公开区块链数据，仅供信息参考，非投资建议。earth2 金库·分配钱包为基于链上流动的推测，并非官方标注。平台内部累积（未提现）的 ESS 不在链上，不计入。',
    sc_supply: '总供应量', sc_supply_note: '发行 − 销毁',
    sc_burn: '总销毁量', sc_burn_note: (p: number) => `占发行 ${p}% · 全部由 earth2 销毁`,
    sc_e2: 'earth2 持有(推测)', sc_e2_note: (p: number) => `占供应 ${p}%`,
    sc_circ: '流通(非 earth2)', sc_circ_note: (p: number) => `占供应 ${p}%`,
    sc_wd: '个人钱包累计提现', sc_wd_note: (n: number) => `${nf(n)} 笔`,
    sc_dex: 'DEX 流动性 ESS', sc_dex_note: 'V3+V4 池存入',
    s1: '供应 · 销毁',
    s1b: (m: number, b: number, p: number, s: number) =>
      `发行 ${nf(m)} ESS 全部铸造至 earth2 主钱包，随后 earth2 从自有钱包销毁 ${nf(b)} ESS（占发行 ${p}%，销毁 100% 来自 earth2）。当前总供应 ${nf(s)} ESS。校验：发行−销毁 = 全部钱包余额合计 = 供应量（一致）。`,
    s2: 'Earth 2 钱包 (不计入巨鲸)',
    s2note: '主分发钱包(0x68d3) 执行发行·提现·销毁，为确定钱包；金库·分配钱包依据链上流动推测为 earth2 相关。',
    th_role: '类别', th_addr: '地址', th_bal: '持有 ESS', th_usd: '≈USD', th_basis: '依据',
    s3: '个人钱包提现 — 数量 & 当时美元估值',
    s3b: (e: number, t: number, ut: number, un: number) =>
      `从主钱包提现至个人 EOA 的累计为 ${nf(e)} ESS / ${nf(t)} 笔。按各周提现量乘以当时 ESS 价格的估值合计为 ${usd(ut)}；同样数量按当前价计为 ${usd(un)}（早期提现价格较高）。已排除交易所·DEX·earth2 内部转移。`,
    chart_title: '每月个人钱包提现 (ESS)',
    th_week: '周(ISO)', th_wd_ess: '提现 ESS', th_wd_usd: '当时估值',
    recent12: '最近 12 周',
    s4: 'ESS/ETH 池流动性 (TVL)',
    th_pool: '池', th_ess: '存入 ESS', th_weth: '存入 WETH', th_tvl: 'TVL(USD)',
    v4note: '* Uniswap V4 由单一 PoolManager 统一保管所有池代币，无法按池拆分配对 WETH。因此 V4 TVL 不低于 ESS 侧价值，实际更高。大部分流动性已迁移至 V4。',
    s5: '巨鲸 — 持有 100 万 ESS+（不含 earth2·DEX）',
    th_senders: '来源数', th_frome: 'earth2 直转',
    s6: '持续买入·持有的钱包',
    s6note: (n: number, a: number) =>
      `在 DEX（池/路由）买入达 5 周以上且仍持有买入量 50% 以上的钱包（排除交易者）共 ${n} 个，其中最近 60 天内仍有买入的 ${a} 个。`,
    th_bought: '累计买入', th_ret: '保留率', th_weeks: '买入周数', th_period: '区间', th_active: '状态',
    active: '近期买入',
    method: '方法 · 局限',
    method_b: '数据通过公共以太坊 RPC 收集 ESS 全部 Transfer 并重建全部钱包余额。价格来自 CoinGecko(当前)·DefiLlama(历史周线)，汇率以 CoinGecko 为准。时间分桶采用区块→时间线性插值。“买入”定义为来自 DEX 合约的流入，属启发式，可能包含部分非买入流入。Earth 2® 为其所有者商标，本站与运营方无关。',
    units_ess: 'ESS',
  },
} as const

// ---- inline SVG bar chart (static, no deps) ----
function MonthlyChart({ months, accent }: { months: { m: string; ess: number }[]; accent: string }) {
  const W = 1000, H = 220, padB = 28, padT = 8
  const max = Math.max(1, ...months.map((d) => d.ess))
  const bw = W / months.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="monthly withdrawals">
      {months.map((d, i) => {
        const h = ((d.ess / max) * (H - padB - padT))
        const x = i * bw
        const showLbl = i % 3 === 0 || i === months.length - 1
        return (
          <g key={d.m}>
            <rect x={x + bw * 0.15} y={H - padB - h} width={bw * 0.7} height={h} rx={1} fill={accent} opacity={0.85} />
            {showLbl && (
              <text x={x + bw / 2} y={H - 8} fontSize={11} fill="#859398" textAnchor="middle">
                {d.m.slice(2)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function LegendRow({ color, label, v, total }: { color: string; label: string; v: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />{label}</span>
      <span className="tabular-nums text-[#dee1f7]">{nf(v)} <span className="text-[#859398]">({((v / total) * 100).toFixed(1)}%)</span></span>
    </div>
  )
}

function SupplyDonut({ segs }: { segs: { value: number; color: string }[] }) {
  const total = segs.reduce((s, x) => s + x.value, 0) || 1
  const r = 70, C = 2 * Math.PI * r
  let off = 0
  return (
    <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0" role="img" aria-label="supply composition">
      <g transform="rotate(-90 90 90)">
        {segs.map((s, i) => {
          const dash = (s.value / total) * C
          const node = (
            <circle key={i} cx="90" cy="90" r={r} fill="none" stroke={s.color} strokeWidth="26" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-off} />
          )
          off += dash
          return node
        })}
      </g>
    </svg>
  )
}

export default async function EssPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const L: Loc = locale === 'zh' ? 'zh' : 'ko'
  const t = STR[L]
  const d = data
  const P = d.prices
  const months = d.withdrawals.monthly
  const weeksRecent = d.withdrawals.weekly.slice(-12)
  const sm = d.withdrawals.summary
  const gen = d.generated_at.slice(0, 10)
  const pageUrl = `${BASE_URL}/${locale}/ess`

  const faqItems = L === 'ko'
    ? [
        { q: 'ESS(Earth 2 Essence) 총 공급량은 얼마인가요?', a: `현재 총 공급량은 ${nf(d.supply.total)} ESS입니다(발행 ${nf(d.supply.minted)} − 소각 ${nf(d.supply.burned)}). ${d.as_of_date} 기준.` },
        { q: 'ESS는 얼마나 소각되었나요?', a: `누적 ${nf(d.supply.burned)} ESS(발행량의 ${d.supply.burn_pct}%)가 소각되었으며, 전량 earth2 지갑에서 직접 소각됐습니다.` },
        { q: 'earth2가 보유한 ESS는 얼마나 되나요?', a: `earth2 관련 지갑(메인 분배 + 트레저리·할당 추정)이 약 ${nf(d.earth2.total)} ESS(공급의 ${d.earth2.pct}%)를 보유합니다. 비-earth2 유통량은 ${nf(d.circulating.amount)} ESS(${d.circulating.pct}%)입니다.` },
        { q: '개인 지갑으로 출금된 ESS는 얼마인가요?', a: `메인 지갑에서 개인 지갑으로 누적 ${nf(d.withdrawals.total_ess)} ESS가 출금됐고, 출금 당시 가격 기준 평가액은 약 ${usd(d.withdrawals.usd_at_time)}입니다(거래소·DEX·내부 이동 제외).` },
        { q: 'ESS 고래(대량 보유 지갑)는 몇 개인가요?', a: `100만 ESS 이상을 보유한 비-earth2·비-DEX 지갑은 ${d.whales.count}개로, 합계 ${nf(d.whales.total)} ESS입니다. 또 DEX에서 꾸준히 매수·보유 중인 지갑은 ${d.accumulators.count}개입니다.` },
      ]
    : [
        { q: 'ESS(Earth 2 Essence) 总供应量是多少？', a: `当前总供应量为 ${nf(d.supply.total)} ESS（发行 ${nf(d.supply.minted)} − 销毁 ${nf(d.supply.burned)}）。截至 ${d.as_of_date}。` },
        { q: 'ESS 销毁了多少？', a: `累计销毁 ${nf(d.supply.burned)} ESS（占发行 ${d.supply.burn_pct}%），全部由 earth2 钱包直接销毁。` },
        { q: 'earth2 持有多少 ESS？', a: `earth2 相关钱包（主分发 + 推测金库·分配）约持有 ${nf(d.earth2.total)} ESS（占供应 ${d.earth2.pct}%）。非 earth2 流通量为 ${nf(d.circulating.amount)} ESS（${d.circulating.pct}%）。` },
        { q: '提现到个人钱包的 ESS 有多少？', a: `从主钱包提现至个人钱包累计 ${nf(d.withdrawals.total_ess)} ESS，按当时价格估值约 ${usd(d.withdrawals.usd_at_time)}（已排除交易所·DEX·内部转移）。` },
        { q: 'ESS 巨鲸（大额持有钱包）有多少个？', a: `持有 100 万 ESS 以上的非 earth2·非 DEX 钱包共 ${d.whales.count} 个，合计 ${nf(d.whales.total)} ESS。另有 ${d.accumulators.count} 个钱包在 DEX 持续买入并持有。` },
      ]

  const graphLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: L === 'ko' ? 'Earth 2 Essence($ESS) 온체인 데이터' : 'Earth 2 Essence($ESS) 链上数据',
        description: t.intro,
        url: pageUrl,
        identifier: d.contract,
        creator: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        dateModified: d.generated_at,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        inLanguage: L === 'ko' ? 'ko-KR' : 'zh-CN',
        keywords: ['Earth 2 Essence', 'ESS', 'on-chain', 'Ethereum', 'token burn', 'whales'],
        measurementTechnique: 'Ethereum on-chain ERC-20 Transfer event reconstruction',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Total supply', value: d.supply.total, unitText: 'ESS' },
          { '@type': 'PropertyValue', name: 'Total burned', value: d.supply.burned, unitText: 'ESS' },
          { '@type': 'PropertyValue', name: 'earth2-held (estimated)', value: d.earth2.total, unitText: 'ESS' },
          { '@type': 'PropertyValue', name: 'Withdrawn to personal wallets', value: d.withdrawals.total_ess, unitText: 'ESS' },
          { '@type': 'PropertyValue', name: 'Whales (>= 1M ESS)', value: d.whales.count },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Earth2Guide', item: `${BASE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.title, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-12">
      <JsonLd data={graphLd} />
      <JsonLd data={faqLd(faqItems, locale)} />
      <h1 className="text-3xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-3">
        {t.title}
      </h1>
      <p className="text-[#bbc9cf] leading-relaxed max-w-3xl mb-3">{t.intro}</p>
      <p className="text-sm text-[#859398] mb-2">
        {t.asof} {d.as_of_date} · {t.block} {nf(d.as_of_block)} · ESS ${P.ess_usd.toFixed(5)} (₩{P.ess_krw.toFixed(2)}) · ETH ${nf(P.eth_usd)}
        {' · '}{L === 'ko' ? '갱신' : '更新'} {gen}
        {' · '}
        <a className="text-[#00d4ff] hover:underline font-mono" href={`https://etherscan.io/token/${d.contract}`}>{short(d.contract)}</a>
      </p>
      <p className="text-xs text-[#859398] bg-[#161b2b] border border-[#3c494e]/30 rounded-lg p-3 mb-8 leading-relaxed">
        ⚠ {t.disclaimer}
      </p>

      {/* scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        <Card label={t.sc_supply} val={nf(d.supply.total)} note={t.sc_supply_note} />
        <Card label={t.sc_burn} val={nf(d.supply.burned)} note={t.sc_burn_note(d.supply.burn_pct)} color="#ffd479" />
        <Card label={t.sc_e2} val={nf(d.earth2.total)} note={t.sc_e2_note(d.earth2.pct)} color="#00d4ff" />
        <Card label={t.sc_circ} val={nf(d.circulating.amount)} note={t.sc_circ_note(d.circulating.pct)} />
        <Card label={t.sc_wd} val={nf(d.withdrawals.total_ess)} note={t.sc_wd_note(d.withdrawals.tx_count)} color="#16ff9e" />
        <Card label={t.sc_dex} val={nf(d.pools.total_dex_ess)} note={t.sc_dex_note} />
      </div>

      {/* supply / burn */}
      <section className="mb-10">
        <h2 className={H2}>{t.s1}</h2>
        <div className={CARD + ' mb-4 flex flex-col sm:flex-row items-center gap-6'}>
          <SupplyDonut segs={[
            { value: d.circulating.amount, color: '#16ff9e' },
            { value: d.earth2.total, color: '#00d4ff' },
            { value: d.supply.burned, color: '#6b7280' },
            { value: d.supply.max_planned - d.supply.minted, color: '#2f3445' },
          ]} />
          <div className="flex-1 w-full">
            <div className="text-xs text-[#859398] mb-2">{L === 'ko' ? `계획 총 발행량 ${nf(d.supply.max_planned)} ESS 기준 · 현재 ${d.supply.minted_pct}% 발행` : `按计划最大发行量 ${nf(d.supply.max_planned)} ESS · 已发行 ${d.supply.minted_pct}%`}</div>
            <div className="space-y-1.5 text-sm">
              <LegendRow color="#16ff9e" label={L === 'ko' ? '유통 (비-earth2)' : '流通 (非 earth2)'} v={d.circulating.amount} total={d.supply.max_planned} />
              <LegendRow color="#00d4ff" label={L === 'ko' ? 'earth2 보유 (추정)' : 'earth2 持有 (推测)'} v={d.earth2.total} total={d.supply.max_planned} />
              <LegendRow color="#6b7280" label={L === 'ko' ? '소각' : '销毁'} v={d.supply.burned} total={d.supply.max_planned} />
              <LegendRow color="#2f3445" label={L === 'ko' ? '미발행 (계획 잔여)' : '未发行 (计划剩余)'} v={d.supply.max_planned - d.supply.minted} total={d.supply.max_planned} />
            </div>
          </div>
        </div>
        <div className={CARD + ' text-[#bbc9cf] leading-relaxed text-sm'}>
          {t.s1b(d.supply.minted, d.supply.burned, d.supply.burn_pct, d.supply.total)}
        </div>
      </section>

      {/* earth2 wallets */}
      <section className="mb-10">
        <h2 className={H2}>{t.s2}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr>
              <th className={TH}>{t.th_role}</th><th className={TH}>{t.th_addr}</th>
              <th className={TH + ' text-right'}>{t.th_bal}</th><th className={TH + ' text-right'}>{t.th_usd}</th>
            </tr></thead>
            <tbody>
              {d.earth2.wallets.map((w) => (
                <tr key={w.addr}>
                  <td className={TD}>{L === 'ko' ? w.role_ko : w.role_zh}</td>
                  <td className={TD}><a className={MONO} href={es(w.addr)}>{short(w.addr)}</a></td>
                  <td className={TD + ' text-right tabular-nums'}>{nf(w.bal)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{usd(w.bal * P.ess_usd)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className={TD}>Σ</td><td className={TD}></td>
                <td className={TD + ' text-right tabular-nums'}>{nf(d.earth2.total)}</td>
                <td className={TD + ' text-right tabular-nums'}>{usd(d.earth2.total * P.ess_usd)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#859398] mt-2 leading-relaxed">{t.s2note}</p>
      </section>

      {/* withdrawals */}
      <section className="mb-10">
        <h2 className={H2}>{t.s3}</h2>
        <div className={CARD + ' mb-4 border-[#00d4ff]/40'}>
          <div className="text-xs text-[#00d4ff] mb-3 font-semibold">{L === 'ko' ? `월간 요약 · 지난달 ${sm.last_month}` : `月度摘要 · 上月 ${sm.last_month}`}</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><div className="text-[11px] text-[#859398]">{L === 'ko' ? '유저 출금' : '用户提现'}</div><div className="text-lg font-bold text-[#16ff9e] tabular-nums">{nf(sm.last.withdrawn_ess)}</div><div className="text-[11px] text-[#859398]">≈{usd(sm.last.withdrawn_usd)}{sm.mom_withdrawn_pct != null ? ` · ${L === 'ko' ? '전월비' : '环比'} ${sm.mom_withdrawn_pct > 0 ? '+' : ''}${sm.mom_withdrawn_pct}%` : ''}</div></div>
            <div><div className="text-[11px] text-[#859398]">{L === 'ko' ? 'DEX 매도 추정' : 'DEX 卖出估计'}</div><div className="text-lg font-bold text-[#f0883e] tabular-nums">{nf(sm.last.sold_ess)}</div><div className="text-[11px] text-[#859398]">≈{usd(sm.last.sold_usd)}</div></div>
            <div><div className="text-[11px] text-[#859398]">{L === 'ko' ? '유저 보유율(누적)' : '用户保留率(累计)'}</div><div className="text-lg font-bold text-[#dee1f7] tabular-nums">{sm.cumulative.held_pct}%</div><div className="text-[11px] text-[#859398]">{nf(sm.cumulative.held_by_users_ess)} ESS</div></div>
            <div><div className="text-[11px] text-[#859398]">{L === 'ko' ? '이탈(매도·이전)' : '流出(卖出·转移)'}</div><div className="text-lg font-bold text-[#dee1f7] tabular-nums">{sm.cumulative.left_pct}%</div><div className="text-[11px] text-[#859398]">{nf(sm.cumulative.left_wallets_ess)} ESS</div></div>
          </div>
          <div className="text-[11px] text-[#859398] mt-3 leading-relaxed">{L === 'ko' ? `출금 누적 ${nf(sm.cumulative.withdrawn_ess)} ESS 중 현재 유저 보유 ${nf(sm.cumulative.held_by_users_ess)}(${sm.cumulative.held_pct}%). 출금 수령 지갑의 DEX 매도 추정 누적 ~${nf(sm.cumulative.dex_sold_gross_ess)} ESS(당시가 ${usd(sm.cumulative.dex_sold_gross_usd_attime)}, 매수분 재매도·CEX 제외 추정).` : `累计提现 ${nf(sm.cumulative.withdrawn_ess)} ESS 中当前用户保留 ${nf(sm.cumulative.held_by_users_ess)}(${sm.cumulative.held_pct}%)。提现钱包 DEX 卖出估计累计 ~${nf(sm.cumulative.dex_sold_gross_ess)} ESS(按当时价 ${usd(sm.cumulative.dex_sold_gross_usd_attime)}，不含再买卖·CEX）。`}</div>
        </div>
        <div className={CARD + ' text-[#bbc9cf] leading-relaxed text-sm mb-4'}>
          {t.s3b(d.withdrawals.total_ess, d.withdrawals.tx_count, d.withdrawals.usd_at_time, d.withdrawals.usd_now)}
        </div>
        <div className={CARD + ' mb-4'}>
          <div className="text-xs text-[#859398] mb-2">{t.chart_title}</div>
          <MonthlyChart months={months} accent="#16ff9e" />
        </div>
        <div className="text-sm text-[#859398] mb-1">{t.recent12}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr>
              <th className={TH}>{t.th_week}</th>
              <th className={TH + ' text-right'}>{t.th_wd_ess}</th>
              <th className={TH + ' text-right'}>{t.th_wd_usd}</th>
            </tr></thead>
            <tbody>
              {weeksRecent.map((w) => (
                <tr key={w.w}>
                  <td className={TD}>{w.w}</td>
                  <td className={TD + ' text-right tabular-nums'}>{nf(w.ess)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{usd(w.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* pools */}
      <section className="mb-10">
        <h2 className={H2}>{t.s4}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr>
              <th className={TH}>{t.th_pool}</th>
              <th className={TH + ' text-right'}>{t.th_ess}</th>
              <th className={TH + ' text-right'}>{t.th_weth}</th>
              <th className={TH + ' text-right'}>{t.th_tvl}</th>
            </tr></thead>
            <tbody>
              <tr>
                <td className={TD}>Uniswap V3 ESS/WETH</td>
                <td className={TD + ' text-right tabular-nums'}>{nf(d.pools.v3_ess)}</td>
                <td className={TD + ' text-right tabular-nums'}>{d.pools.v3_weth.toFixed(3)}</td>
                <td className={TD + ' text-right tabular-nums'}>{usd(d.pools.v3_tvl_usd)}</td>
              </tr>
              <tr>
                <td className={TD}>Uniswap V4 ESS/ETH</td>
                <td className={TD + ' text-right tabular-nums'}>{nf(d.pools.v4_ess)}</td>
                <td className={TD + ' text-right text-[#859398]'}>—*</td>
                <td className={TD + ' text-right tabular-nums'}>≥ {usd(d.pools.v4_ess_usd)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#859398] mt-2 leading-relaxed">{t.v4note}</p>
      </section>

      {/* whales */}
      <section className="mb-10">
        <h2 className={H2}>{t.s5}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr>
              <th className={TH}>#</th><th className={TH}>{t.th_addr}</th>
              <th className={TH + ' text-right'}>{t.th_bal}</th><th className={TH + ' text-right'}>{t.th_usd}</th>
              <th className={TH + ' text-right'}>{t.th_senders}</th><th className={TH + ' text-right'}>{t.th_frome}</th>
            </tr></thead>
            <tbody>
              {d.whales.list.map((w, i) => (
                <tr key={w.addr}>
                  <td className={TD + ' text-[#859398]'}>{i + 1}</td>
                  <td className={TD}><a className={MONO} href={es(w.addr)}>{short(w.addr)}</a></td>
                  <td className={TD + ' text-right tabular-nums'}>{nf(w.bal)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{usd(w.bal_usd)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{w.senders}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{w.from_e ? nf(w.from_e) : '—'}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className={TD}></td><td className={TD}>Σ {d.whales.count}</td>
                <td className={TD + ' text-right tabular-nums'}>{nf(d.whales.total)}</td>
                <td className={TD + ' text-right tabular-nums'}>{usd(d.whales.total * P.ess_usd)}</td>
                <td className={TD}></td><td className={TD}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* accumulators */}
      <section className="mb-10">
        <h2 className={H2}>{t.s6}</h2>
        <p className="text-sm text-[#bbc9cf] mb-3">{t.s6note(d.accumulators.count, d.accumulators.active_count)}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr>
              <th className={TH}>{t.th_addr}</th>
              <th className={TH + ' text-right'}>{t.th_bal}</th><th className={TH + ' text-right'}>{t.th_usd}</th>
              <th className={TH + ' text-right'}>{t.th_bought}</th><th className={TH + ' text-right'}>{t.th_ret}</th>
              <th className={TH + ' text-right'}>{t.th_weeks}</th><th className={TH}>{t.th_period}</th><th className={TH}>{t.th_active}</th>
            </tr></thead>
            <tbody>
              {d.accumulators.list.slice(0, 15).map((a) => (
                <tr key={a.addr}>
                  <td className={TD}><a className={MONO} href={es(a.addr)}>{short(a.addr)}</a></td>
                  <td className={TD + ' text-right tabular-nums'}>{nf(a.bal)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{usd(a.bal_usd)}</td>
                  <td className={TD + ' text-right tabular-nums text-[#bbc9cf]'}>{nf(a.bought)}</td>
                  <td className={TD + ' text-right tabular-nums'}>{a.retention}%</td>
                  <td className={TD + ' text-right tabular-nums'}>{a.buy_weeks}</td>
                  <td className={TD + ' text-[#859398] text-xs'}>{a.first}→{a.last}</td>
                  <td className={TD}>{a.active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16ff9e]/15 text-[#16ff9e] border border-[#16ff9e]/30">{t.active}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className={H2}>{L === 'ko' ? '자주 묻는 질문' : '常见问题'}</h2>
        <div className="space-y-3">
          {faqItems.map((it) => (
            <div key={it.q} className={CARD}>
              <div className="text-[#dee1f7] font-semibold mb-1 text-sm">{it.q}</div>
              <div className="text-[#bbc9cf] text-sm leading-relaxed">{it.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* method */}
      <section className="mb-6">
        <h2 className={H2}>{t.method}</h2>
        <p className="text-xs text-[#859398] leading-relaxed bg-[#161b2b] border border-[#3c494e]/30 rounded-lg p-4">{t.method_b}</p>
      </section>
    </div>
  )
}

function Card({ label, val, note, color }: { label: string; val: string; note: string; color?: string }) {
  return (
    <div className={CARD}>
      <div className="text-xs text-[#859398] mb-1">{label}</div>
      <div className="text-xl lg:text-2xl font-bold tabular-nums" style={{ color: color ?? '#dee1f7' }}>{val}</div>
      <div className="text-[11px] text-[#859398] mt-1">{note}</div>
    </div>
  )
}

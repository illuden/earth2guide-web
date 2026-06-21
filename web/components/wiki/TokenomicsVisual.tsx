import type { Locale } from '@/lib/supabase/types'

// 어스2 토크노믹스 플래그십 전용 시각화 — 가치순환 다이어그램 + 핵심 숫자 + Source/Sink.
// 정적(서버 컴포넌트). 사이트 팔레트 매칭. earth2-tokenomics 위키에서만 마운트.

interface Props {
  locale: Locale
}

// 파이 슬라이스 SVG 경로 (0deg = 상단, 시계방향)
function piePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const pt = (deg: number): [number, number] => {
    const a = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const [x0, y0] = pt(startDeg)
  const [x1, y1] = pt(endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}
function midPoint(cx: number, cy: number, r: number, startDeg: number, endDeg: number): [number, number] {
  const mid = (startDeg + endDeg) / 2
  const a = ((mid - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

const T = {
  ko: {
    flowTitle: '가치 순환 한눈에 보기',
    nodes: [
      { name: 'Tile', sub: '토지 · 생산 기반', color: '#39c5cf' },
      { name: 'Mentar', sub: '생산설비 · 스테이킹', color: '#7da6ff' },
      { name: 'E-ther', sub: '생명 · 매일 생성', color: '#58a6ff' },
      { name: 'Essence ($ESS)', sub: '경제 동력', color: '#bc8cff' },
      { name: '소각 (Burn)', sub: '업그레이드·제작·텔레포트', color: '#f85149' },
    ],
    keyTitle: '핵심 숫자',
    keys: [
      { v: '10억', l: '$ESS 최대 발행량 (ERC-20 고정)' },
      { v: '75%', l: '커뮤니티 배분 (채굴 65%+P2E 10%)' },
      { v: '1.5억', l: 'Tier 1 Jewel 하드캡' },
      { v: '소각 중심', l: '디플레이션 설계' },
    ],
    distTitle: '토큰 분배 (백서 기준)',
    dist: [
      { p: '65%', n: 65, l: '랜드 채굴 (Raid 포함)', c: '#39c5cf' },
      { p: '25%', n: 25, l: '트레저리 (개발·마케팅·유동성)', c: '#d29922' },
      { p: '10%', n: 10, l: 'P2E·리워드 (스테이킹·에어드랍 등)', c: '#3fb950' },
    ],
    distNote: '※ 공식 백서 기준 — 커뮤니티 합계 75%(채굴 65% + P2E 10%). 백서는 초안이라 변경될 수 있음.',
    srcTitle: '가치 생성 (Source)',
    srcItems: ['토지에서 E-ther 매일 생성 → Essence 변환', 'Mentar 스테이킹 → 생산량 증가', 'Tier별 차등 산출 (Tier 1 우위)'],
    sinkTitle: '가치 소각 (Sink)',
    sinkItems: ['업그레이드·제작·EPL·텔레포트 수수료', '랜드 업그레이드 수익 50% 소각', '자원 검증 실패분 전액 소각'],
    note: '※ 운영진 발언 기준이며 일정·수치는 변경 이력이 있습니다. 최신값은 공식 문서(earth2.io) 확인.',
  },
  zh: {
    flowTitle: '价值循环一览',
    nodes: [
      { name: 'Tile', sub: '土地 · 生产基础', color: '#39c5cf' },
      { name: 'Mentar', sub: '生产设备 · 质押', color: '#7da6ff' },
      { name: 'E-ther', sub: '生命 · 每日生成', color: '#58a6ff' },
      { name: 'Essence ($ESS)', sub: '经济动力', color: '#bc8cff' },
      { name: '销毁 (Burn)', sub: '升级·制作·传送', color: '#f85149' },
    ],
    keyTitle: '核心数字',
    keys: [
      { v: '10亿', l: '$ESS 最大发行量 (ERC-20 固定)' },
      { v: '75%', l: '社区分配 (挖矿 65%+P2E 10%)' },
      { v: '1.5亿', l: 'Tier 1 Jewel 硬顶' },
      { v: '销毁为主', l: '通缩设计' },
    ],
    distTitle: '代币分配 (白皮书)',
    dist: [
      { p: '65%', n: 65, l: '土地挖矿 (含 Raid)', c: '#39c5cf' },
      { p: '25%', n: 25, l: '金库 Treasury (开发·营销·流动性)', c: '#d29922' },
      { p: '10%', n: 10, l: 'P2E·奖励 (质押·空投等)', c: '#3fb950' },
    ],
    distNote: '※ 以官方白皮书为准 — 社区合计 75%(挖矿 65% + P2E 10%)。白皮书为草案，可能变更。',
    srcTitle: '价值生成 (Source)',
    srcItems: ['土地每日生成 E-ther → 转换 Essence', 'Mentar 质押 → 产量增加', '按 Tier 差异产出 (Tier 1 优势)'],
    sinkTitle: '价值销毁 (Sink)',
    sinkItems: ['升级·制作·EPL·传送手续费', '土地升级收益 50% 销毁', '资源验证失败全额销毁'],
    note: '※ 基于运营方发言，时间与数值有变更记录。最新值以官方文档(earth2.io)为准。',
  },
}

export default function TokenomicsVisual({ locale }: Props) {
  const t = locale === 'zh' ? T.zh : T.ko

  // 파이 슬라이스 누적 각도 계산
  const CX = 110
  const CY = 110
  const R = 104
  let acc = 0
  const slices = t.dist.map((d) => {
    const start = acc * 3.6
    acc += d.n
    const end = acc * 3.6
    return { ...d, start, end }
  })

  return (
    <div className="my-8 space-y-6">
      {/* 가치 순환 다이어그램 */}
      <div className="rounded-xl border border-[#3c494e]/50 bg-[#0f1422] p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#bc8cff] mb-4">
          {t.flowTitle}
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2">
          {t.nodes.map((n, i) => (
            <div key={n.name} className="flex flex-col sm:flex-row items-center gap-2">
              <div
                className="w-full sm:w-auto text-center rounded-lg border bg-[#161b2b] px-4 py-3"
                style={{ borderColor: n.color + '80' }}
              >
                <div className="font-semibold text-[15px]" style={{ color: n.color }}>
                  {n.name}
                </div>
                <div className="text-[11px] text-[#8b97a8] mt-0.5">{n.sub}</div>
              </div>
              {i < t.nodes.length - 1 && (
                <span className="text-[#5b6b7a] text-lg leading-none rotate-90 sm:rotate-0">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 핵심 숫자 카드 */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#bc8cff] mb-3">
          {t.keyTitle}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {t.keys.map((k) => (
            <div
              key={k.l}
              className="rounded-xl border border-[#3c494e]/50 bg-[#161b2b] p-4 text-center"
            >
              <div className="text-2xl font-bold text-[#00d4ff] leading-tight">{k.v}</div>
              <div className="text-[12px] text-[#9aa7b4] mt-1.5 leading-snug">{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 토큰 분배 파이차트 (백서 기준) — 숫자 조각 안에, 중앙 배치 */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#bc8cff] mb-3">
          {t.distTitle}
        </div>
        <div className="rounded-xl border border-[#3c494e]/50 bg-[#161b2b] p-6 flex flex-col items-center">
          <svg
            viewBox="0 0 220 220"
            className="w-[210px] h-[210px] sm:w-[240px] sm:h-[240px]"
            role="img"
            aria-label={t.distTitle}
          >
            {slices.map((s) => (
              <path
                key={`p-${s.l}`}
                d={piePath(CX, CY, R, s.start, s.end)}
                fill={s.c}
                stroke="#161b2b"
                strokeWidth="2.5"
              />
            ))}
            {slices.map((s) => {
              const [lx, ly] = midPoint(CX, CY, R * 0.62, s.start, s.end)
              return (
                <text
                  key={`t-${s.l}`}
                  x={lx}
                  y={ly}
                  fill="#0d1117"
                  fontSize="20"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {s.p}
                </text>
              )
            })}
          </svg>
          <ul className="mt-5 w-full max-w-[340px] flex flex-col gap-2.5">
            {slices.map((s) => (
              <li key={`l-${s.l}`} className="flex items-center gap-3 text-[13px]">
                <span className="flex-none w-3.5 h-3.5 rounded-sm" style={{ background: s.c }} />
                <span className="font-bold text-[#dee1f7] w-10 flex-none">{s.p}</span>
                <span className="text-[#bbc9cf] leading-snug">{s.l}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] text-[#6e7d8c] italic mt-2">{t.distNote}</p>
      </div>

      {/* Source vs Sink */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#3fb95040] bg-[#101a14] p-5">
          <div className="text-sm font-semibold text-[#3fb950] mb-3">↑ {t.srcTitle}</div>
          <ul className="space-y-2">
            {t.srcItems.map((s) => (
              <li key={s} className="text-[13px] text-[#bbc9cf] leading-snug flex gap-2">
                <span className="text-[#3fb950] flex-none">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[#f8514940] bg-[#1a1110] p-5">
          <div className="text-sm font-semibold text-[#f85149] mb-3">↓ {t.sinkTitle}</div>
          <ul className="space-y-2">
            {t.sinkItems.map((s) => (
              <li key={s} className="text-[13px] text-[#bbc9cf] leading-snug flex gap-2">
                <span className="text-[#f85149] flex-none">−</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-[11px] text-[#6e7d8c] italic">{t.note}</p>
    </div>
  )
}

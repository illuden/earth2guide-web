'use client'

// ============================================================
// EssencePriceWidget — ESS($ESS) 실시간 시세 카드
// CoinGecko 무료 API로 마운트 시점에 USD/KRW + 24h 변동을 불러옴.
// 정적 사이트(output:export)에서도 동작 — 전부 클라이언트 사이드 fetch.
// 마운트 예시: essence / earth2-status-2026 위키 상세 페이지 상단.
//
// ⚠️ 배포 영향: 이 파일은 어디서도 import하지 않으면 빌드/사이트에 영향 없음.
//    실제 노출은 wiki [slug] 페이지에서 조건부 렌더로 붙이는 별도 단계(승인 후).
// ============================================================

import { useCallback, useEffect, useState } from 'react'

const COINGECKO_ENDPOINT =
  'https://api.coingecko.com/api/v3/simple/price' +
  '?ids=earth-2-essence&vs_currencies=usd,krw' +
  '&include_24hr_change=true&include_last_updated_at=true'

// ESS ERC-20 컨트랙트 (Ethereum mainnet)
const ESS_CONTRACT = '0x2c0687215aca7f5e2792d956e170325e92a02aca'

// Uniswap 거래 딥링크. 수익화(integrator fee)는 아래 NOTE 참고.
const UNISWAP_SWAP_URL =
  `https://app.uniswap.org/swap?outputCurrency=${ESS_CONTRACT}&chain=mainnet`
const COINGECKO_PAGE = 'https://www.coingecko.com/en/coins/earth-2-essence'

// ------------------------------------------------------------
// 💰 수익모델 NOTE (Uniswap 수수료 공유 — Hyperliquid 레퍼럴 유사)
// 위 단순 딥링크는 수수료가 없음. 거래마다 커미션을 받으려면 둘 중 하나:
//   (A) Uniswap 공식 임베드 위젯/Trading API — integrator fee + 수령 지갑 설정
//   (B) 0x Swap API의 affiliate fee(feeRecipient) 또는 LiFi integrator fee
// 둘 다 "수령 지갑 주소"와 fee bps 설정이 필요 → Alvin 결정 후 연결.
// ESS는 ETH L1 + 얇은 유동성이라 현재 볼륨 기준 수익은 미미(업사이드 옵션용).
// ------------------------------------------------------------

type Locale = 'ko' | 'zh'

interface CoinGeckoResponse {
  'earth-2-essence'?: {
    usd?: number
    krw?: number
    usd_24h_change?: number
    krw_24h_change?: number
    last_updated_at?: number
  }
}

interface PriceState {
  usd: number
  krw: number
  usdChange: number
  krwChange: number
  updatedAt: number | null
}

type Status = 'loading' | 'ready' | 'error'

const T: Record<Locale, Record<string, string>> = {
  ko: {
    name: 'Earth 2 Essence',
    refresh: '↻ 새로고침',
    loading: '시세 불러오는 중…',
    krwLabel: '원화 환산',
    updated: '업데이트',
    swap: 'Uniswap에서 거래 ↗',
    chart: '차트 보기',
    error: '시세를 불러오지 못했습니다.',
    errorLink: 'CoinGecko에서 직접 확인 ↗',
    disclaimer:
      '정보 제공 목적이며 투자 조언이 아닙니다. ESS는 변동성이 크고 유동성이 얇습니다.',
    source: '데이터: CoinGecko · 거래: Uniswap(Ethereum)',
  },
  zh: {
    name: 'Earth 2 Essence',
    refresh: '↻ 刷新',
    loading: '正在加载价格…',
    krwLabel: '韩元价格',
    updated: '更新于',
    swap: '在 Uniswap 交易 ↗',
    chart: '查看图表',
    error: '无法加载价格。',
    errorLink: '在 CoinGecko 上查看 ↗',
    disclaimer: '仅供参考，非投资建议。ESS 波动较大且流动性较低。',
    source: '数据：CoinGecko · 交易：Uniswap（以太坊）',
  },
}

function formatUsd(n: number): string {
  if (n >= 1)
    return n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })
}

function formatKrw(n: number): string {
  return Math.round(n).toLocaleString('ko-KR')
}

function changeMeta(v: number): { up: boolean; text: string } {
  const up = v >= 0
  return { up, text: `${up ? '▲' : '▼'} ${Math.abs(v).toFixed(2)}%` }
}

export interface EssencePriceWidgetProps {
  locale?: Locale
}

export default function EssencePriceWidget({
  locale = 'ko',
}: EssencePriceWidgetProps) {
  const t = T[locale] ?? T.ko
  const [status, setStatus] = useState<Status>('loading')
  const [price, setPrice] = useState<PriceState | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(COINGECKO_ENDPOINT, {
        headers: { accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as CoinGeckoResponse
      const d = data['earth-2-essence']
      if (!d || typeof d.usd !== 'number') throw new Error('no data')
      setPrice({
        usd: d.usd,
        krw: d.krw ?? 0,
        usdChange: d.usd_24h_change ?? 0,
        krwChange: d.krw_24h_change ?? 0,
        updatedAt: d.last_updated_at ?? null,
      })
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updatedText =
    price?.updatedAt != null
      ? new Date(price.updatedAt * 1000).toLocaleString(
          locale === 'zh' ? 'zh-CN' : 'ko-KR',
          { dateStyle: 'short', timeStyle: 'short' }
        )
      : ''

  const usdChg = price ? changeMeta(price.usdChange) : null
  const krwChg = price ? changeMeta(price.krwChange) : null

  return (
    <div className="w-full max-w-[360px] bg-[#0f1424] border border-[#3c494e] rounded-2xl p-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#00e0ff,#0072b5)] flex items-center justify-center font-extrabold text-[#04121c] text-[13px]">
            E2
          </div>
          <div>
            <div className="font-bold text-[#dee1f7] text-[15px] leading-tight">
              {t.name}
            </div>
            <div className="text-[11.5px] text-[#7b8794]">$ESS · Ethereum</div>
          </div>
        </div>
        <button
          onClick={() => void load()}
          disabled={status === 'loading'}
          className="bg-transparent border border-[#3c494e] text-[#7b8794] rounded-lg px-2 py-1 text-[11px] cursor-pointer transition-colors hover:text-[#00d4ff] hover:border-[#00d4ff] disabled:opacity-50 disabled:cursor-wait"
        >
          {t.refresh}
        </button>
      </div>

      {/* 본문 */}
      {status === 'loading' && (
        <div className="text-[#7b8794] text-sm py-2 animate-pulse">
          {t.loading}
        </div>
      )}

      {status === 'error' && (
        <div className="text-[#f87171] text-[12.5px] leading-relaxed">
          {t.error}{' '}
          <a
            href={COINGECKO_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] hover:underline"
          >
            {t.errorLink}
          </a>
        </div>
      )}

      {status === 'ready' && price && usdChg && krwChg && (
        <div>
          <div className="text-[30px] font-extrabold text-[#dee1f7] tracking-tight leading-tight">
            <span className="text-sm text-[#7b8794] font-semibold mr-1">$</span>
            {formatUsd(price.usd)}
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[13px] font-bold mt-1 px-2 py-0.5 rounded-full ${
              usdChg.up
                ? 'text-[#4ade80] bg-[#4ade80]/10'
                : 'text-[#f87171] bg-[#f87171]/10'
            }`}
          >
            {usdChg.text}{' '}
            <span className="opacity-70 font-medium">(24h)</span>
          </span>

          <div className="mt-2.5 pt-2.5 border-t border-[#3c494e]/50 flex items-baseline justify-between text-[13px]">
            <span className="text-[#7b8794]">{t.krwLabel}</span>
            <span>
              <span className="text-[#dee1f7] font-bold text-[15px]">
                ₩{formatKrw(price.krw)}
              </span>
              <span
                className={`text-xs font-semibold ml-1.5 ${
                  krwChg.up ? 'text-[#4ade80]' : 'text-[#f87171]'
                }`}
              >
                {krwChg.text}
              </span>
            </span>
          </div>

          {updatedText && (
            <div className="text-[10.5px] text-[#5f6b78] mt-1.5 text-right">
              {t.updated}: {updatedText}
            </div>
          )}
        </div>
      )}

      {/* 액션 */}
      <div className="flex gap-2 mt-3.5">
        <a
          href={UNISWAP_SWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center no-underline text-[12.5px] font-bold py-2.5 px-2.5 rounded-[10px] text-white bg-[linear-gradient(135deg,#ff2d9b,#ff5fae)] hover:brightness-110 transition"
        >
          {t.swap}
        </a>
        <a
          href={COINGECKO_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center no-underline text-[12.5px] font-bold py-2.5 px-2.5 rounded-[10px] text-[#bbc9cf] bg-[#161b2b] border border-[#3c494e] hover:text-[#00d4ff] hover:border-[#00d4ff] transition"
        >
          {t.chart}
        </a>
      </div>

      {/* 푸터 */}
      <div className="mt-2.5 text-[10.5px] text-[#5f6b78] leading-relaxed text-center">
        {t.disclaimer}
        <br />
        {t.source}
      </div>
    </div>
  )
}

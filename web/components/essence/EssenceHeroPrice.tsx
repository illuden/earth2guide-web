'use client'

// ESS($ESS) 실시간 시세 — 홈 Hero용 컴팩트 표시 + '에센스 거래하기' CTA(→ essence 설명 페이지)
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/supabase/types'

const ENDPOINT =
  'https://api.coingecko.com/api/v3/simple/price' +
  '?ids=earth-2-essence&vs_currencies=usd,krw&include_24hr_change=true'

type Status = 'loading' | 'ready' | 'error'

function fmtUsd(n: number): string {
  if (n >= 1)
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

export interface EssenceHeroPriceProps {
  locale: Locale
}

export default function EssenceHeroPrice({ locale }: EssenceHeroPriceProps) {
  const t = useTranslations('essence')
  const [status, setStatus] = useState<Status>('loading')
  const [usd, setUsd] = useState<number | null>(null)
  const [krw, setKrw] = useState<number | null>(null)
  const [chg, setChg] = useState(0)

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(ENDPOINT, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('http')
      const d = (await res.json())['earth-2-essence']
      if (!d || typeof d.usd !== 'number') throw new Error('no data')
      setUsd(d.usd)
      setKrw(typeof d.krw === 'number' ? d.krw : null)
      setChg(typeof d.usd_24h_change === 'number' ? d.usd_24h_change : 0)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const up = chg >= 0

  return (
    <div className="inline-flex flex-col items-center gap-2.5 px-7 py-5 bg-[#0f1424]/70 border border-[#00d4ff]/20 rounded-lg backdrop-blur-sm">
      <span className="text-[11px] font-label uppercase tracking-widest text-[#00d4ff]/70">
        {t('priceLabel')}
      </span>

      {status === 'ready' && usd != null ? (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl lg:text-5xl font-headline font-bold text-[#dee1f7]">
              ${fmtUsd(usd)}
            </span>
            <span className={`text-sm font-bold ${up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              {up ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}%
            </span>
          </div>
          {krw != null && (
            <span className="text-xs text-[#a8e8ff]/60">
              ₩{Math.round(krw).toLocaleString('ko-KR')} · 24h
            </span>
          )}
        </>
      ) : status === 'error' ? (
        <span className="text-sm text-[#f87171] py-2">{t('error')}</span>
      ) : (
        <span className="text-sm text-[#859398] py-2 animate-pulse">{t('loading')}</span>
      )}

      <Link
        href={`/${locale}/wiki/essence`}
        className="mt-1 px-7 py-2.5 bg-[#00d4ff] text-[#003642] font-headline font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-[#a8e8ff] transition-colors"
      >
        {t('tradeCta')} →
      </Link>
    </div>
  )
}

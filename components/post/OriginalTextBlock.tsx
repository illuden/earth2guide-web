'use client'

import { useState } from 'react'

interface OriginalTextBlockProps {
  text: string
  sourceUrl?: string | null
}

export function OriginalTextBlock({ text, sourceUrl }: OriginalTextBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-8 border border-[#3c494e]/50 rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#161b2b] hover:bg-[#1a1f2f] transition-colors text-left"
      >
        <span className="text-sm font-label text-[#bbc9cf] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#859398]">
            {open ? 'expand_less' : 'expand_more'}
          </span>
          원문 보기
        </span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#00d4ff]/60 hover:text-[#00d4ff] font-label uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            출처
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        )}
      </button>

      {open && (
        <div className="px-5 py-4 bg-[#090e1c] border-t border-[#3c494e]/30">
          <p className="text-sm text-[#859398] leading-relaxed whitespace-pre-wrap font-mono">
            {text}
          </p>
        </div>
      )}
    </div>
  )
}

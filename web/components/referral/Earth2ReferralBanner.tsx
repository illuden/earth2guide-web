export function Earth2ReferralBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#003642] via-[#001f27] to-[#003642] border border-[#00d4ff]/20 rounded-sm p-6 lg:p-8">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08),transparent_70%)]" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-1">
            Exclusive Offer
          </p>
          <h3 className="text-xl lg:text-2xl font-headline font-bold text-[#dee1f7]">
            Earth 2 가입 시 리퍼럴 코드 입력
          </h3>
          <p className="text-[#a8e8ff]/70 text-sm mt-1">
            코드{' '}
            <span className="font-bold text-[#00d4ff] text-base tracking-widest">00000</span>
            {' '}입력 → 7.5% 할인 혜택
          </p>
        </div>

        <a
          href="https://earth2.io/?r=00000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-8 py-3 bg-[#00d4ff] text-[#003642] font-headline font-bold uppercase tracking-wider text-sm hover:bg-[#a8e8ff] transition-colors rounded-sm"
        >
          지금 시작하기
        </a>
      </div>
    </div>
  )
}

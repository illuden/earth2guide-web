import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  const links = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: 'https://discord.gg/', label: 'Discord' },
    { href: 'https://twitter.com/', label: 'Twitter' },
  ]

  return (
    <footer className="w-full py-10 mt-20 bg-[#090e1c] border-t border-[#a8e8ff]/10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* 로고 */}
        <div className="text-lg font-bold text-[#00d4ff] font-headline uppercase tracking-tighter">
          Earth2Guide
        </div>

        {/* 링크 */}
        <div className="flex flex-wrap justify-center gap-6 text-[#a8e8ff]/50 text-xs tracking-tight">
          {links.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-[#00d4ff] transition-colors"
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 저작권 */}
        <div className="text-[#a8e8ff]/40 text-xs tracking-widest uppercase text-center md:text-right">
          © {year} Earth2Guide
        </div>
      </div>
    </footer>
  )
}

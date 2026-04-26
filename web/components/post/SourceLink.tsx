interface SourceLinkProps {
  url: string
  label?: string
}

export function SourceLink({ url, label = 'Earth 2 Official' }: SourceLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-[#00d4ff]/70 hover:text-[#00d4ff] transition-colors font-label"
    >
      <span className="material-symbols-outlined text-base">link</span>
      출처: {label}
      <span className="material-symbols-outlined text-base">north_east</span>
    </a>
  )
}

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: string
}

export function EmptyState({
  title = '결과가 없습니다',
  description = '아직 등록된 콘텐츠가 없습니다.',
  icon = 'inbox',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-5xl text-[#3c494e] mb-4">{icon}</span>
      <h3 className="text-lg font-headline font-bold text-[#bbc9cf] mb-2">{title}</h3>
      <p className="text-sm text-[#859398] max-w-xs">{description}</p>
    </div>
  )
}

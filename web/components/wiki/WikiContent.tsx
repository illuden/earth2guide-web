interface WikiContentProps {
  html: string
}

export function WikiContent({ html }: WikiContentProps) {
  return (
    <article
      className="prose prose-invert prose-sm lg:prose-base max-w-none
        prose-headings:font-headline prose-headings:text-[#dee1f7] prose-headings:border-b prose-headings:border-[#3c494e]/30 prose-headings:pb-2
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-p:text-[#bbc9cf] prose-p:leading-relaxed
        prose-a:text-[#00d4ff] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#dee1f7]
        prose-code:text-[#00d4ff] prose-code:bg-[#161b2b] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[#090e1c] prose-pre:border prose-pre:border-[#3c494e]
        prose-blockquote:border-l-[#00d4ff] prose-blockquote:bg-[#161b2b] prose-blockquote:px-4 prose-blockquote:rounded-r-sm
        prose-table:border prose-table:border-[#3c494e]
        prose-th:bg-[#161b2b] prose-th:text-[#a8e8ff]
        prose-td:border-[#3c494e]
        prose-img:rounded-sm prose-img:border prose-img:border-[#3c494e]/30
        prose-hr:border-[#3c494e]
        prose-li:text-[#bbc9cf]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

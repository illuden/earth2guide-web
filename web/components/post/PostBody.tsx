interface PostBodyProps {
  html: string
}

export function PostBody({ html }: PostBodyProps) {
  return (
    <article
      className="prose prose-invert prose-sm lg:prose-base max-w-none
        prose-headings:font-headline prose-headings:text-[#dee1f7]
        prose-p:text-[#bbc9cf] prose-p:leading-relaxed
        prose-a:text-[#00d4ff] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#dee1f7]
        prose-code:text-[#00d4ff] prose-code:bg-[#161b2b] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[#090e1c] prose-pre:border prose-pre:border-[#3c494e]
        prose-blockquote:border-l-[#00d4ff] prose-blockquote:text-[#bbc9cf]
        prose-img:rounded-lg prose-img:border prose-img:border-[#3c494e]/30
        prose-hr:border-[#3c494e]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

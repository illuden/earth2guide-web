import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostBodyProps {
  /** 마크다운 문자열 (DB의 body_ko / body_zh) */
  markdown: string
}

/**
 * 마크다운 → HTML 렌더링.
 * remark-gfm: 표, task list, 자동 링크, 취소선 등 지원
 * 보안: react-markdown 기본은 raw HTML 차단 (XSS 안전)
 *
 * 스타일링: Tailwind v4 + typography plugin 없이 components prop으로 직접 매핑
 */
export function PostBody({ markdown }: PostBodyProps) {
  return (
    <article className="text-[#bbc9cf] leading-relaxed font-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-headline text-3xl lg:text-4xl font-bold text-[#dee1f7] mt-10 mb-6 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-headline text-2xl lg:text-3xl font-bold text-[#dee1f7] mt-10 mb-4 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-headline text-xl lg:text-2xl font-semibold text-[#dee1f7] mt-8 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-headline text-lg font-semibold text-[#dee1f7] mt-6 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[#bbc9cf] leading-relaxed my-4">{children}</p>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                className="text-[#00d4ff] no-underline hover:underline"
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {children}
              </a>
            )
          },
          strong: ({ children }) => (
            <strong className="text-[#dee1f7] font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside my-4 ml-6 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside my-4 ml-6 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[#bbc9cf] leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#00d4ff] pl-4 my-6 italic text-[#bbc9cf]">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            return isInline ? (
              <code className="text-[#00d4ff] bg-[#161b2b] px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-[#090e1c] border border-[#3c494e] rounded-lg p-4 my-6 overflow-x-auto text-sm">
              {children}
            </pre>
          ),
          hr: () => <hr className="border-[#3c494e] my-8" />,
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => (
            <img
              src={typeof src === 'string' ? src : ''}
              alt={alt ?? ''}
              loading="lazy"
              className="rounded-lg border border-[#3c494e]/30 my-6 max-w-full h-auto"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 -mx-6 px-6 sm:mx-0 sm:px-0 rounded-sm border border-[#3c494e]/40">
              <table className="min-w-full w-max border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#161b2b]">{children}</thead>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-[#3c494e]/40 last:border-b-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[#dee1f7] font-semibold whitespace-nowrap border-r border-[#3c494e]/40 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[#bbc9cf] align-top border-r border-[#3c494e]/40 last:border-r-0">
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  )
}

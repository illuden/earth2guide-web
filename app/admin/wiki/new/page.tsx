import type { Metadata } from 'next'
import { WikiForm } from '@/components/admin/WikiForm'
import { createWikiAction } from '@/lib/actions/wiki'

export const metadata: Metadata = { title: '새 위키 문서' }

export default function AdminNewWikiPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-headline font-bold text-[#dee1f7]">새 위키 문서</h1>
        <p className="text-xs text-[#859398] mt-0.5">새로운 위키 문서를 작성합니다</p>
      </div>
      <WikiForm onSubmit={createWikiAction} />
    </div>
  )
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { adminGetWikiById } from '@/lib/supabase/queries'
import { WikiForm } from '@/components/admin/WikiForm'
import { updateWikiAction } from '@/lib/actions/wiki'

export const metadata: Metadata = { title: '위키 편집' }
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditWikiPage({ params }: PageProps) {
  const { id } = await params
  const page = await adminGetWikiById(id)

  if (!page) notFound()

  async function handleUpdate(data: Parameters<typeof updateWikiAction>[1]) {
    'use server'
    await updateWikiAction(id, data)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-headline font-bold text-[#dee1f7]">위키 편집</h1>
        <p className="text-xs text-[#859398] mt-0.5 font-mono">{page.slug}</p>
      </div>
      <WikiForm initialData={page} onSubmit={handleUpdate} />
    </div>
  )
}

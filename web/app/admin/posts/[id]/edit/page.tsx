import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { adminGetPostById } from '@/lib/supabase/queries'
import { PostForm } from '@/components/admin/PostForm'
import { updatePostAction } from '@/lib/actions/posts'

export const metadata: Metadata = { title: '포스트 편집' }
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await adminGetPostById(id)

  if (!post) notFound()

  async function handleUpdate(data: Parameters<typeof updatePostAction>[1]) {
    'use server'
    await updatePostAction(id, data)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-headline font-bold text-[#dee1f7]">포스트 편집</h1>
        <p className="text-xs text-[#859398] mt-0.5 font-mono">{post.slug}</p>
      </div>
      <PostForm initialData={post} onSubmit={handleUpdate} />
    </div>
  )
}

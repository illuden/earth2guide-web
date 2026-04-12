import type { Metadata } from 'next'
import { PostForm } from '@/components/admin/PostForm'
import { createPostAction } from '@/lib/actions/posts'

export const metadata: Metadata = { title: '새 포스트' }

export default function AdminNewPostPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-headline font-bold text-[#dee1f7]">새 포스트</h1>
        <p className="text-xs text-[#859398] mt-0.5">새로운 포스트를 작성합니다</p>
      </div>
      <PostForm onSubmit={createPostAction} />
    </div>
  )
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminUpsertPost, adminDeletePost } from '@/lib/supabase/queries'
import type { PostFormData } from '@/lib/supabase/types'

export async function createPostAction(data: PostFormData) {
  const result = await adminUpsertPost(data)
  if (!result) throw new Error('포스트 저장 실패')

  revalidatePath('/ko/news')
  revalidatePath('/ko/official')
  revalidatePath('/ko')
  redirect(`/admin/posts/${result.id}/edit`)
}

export async function updatePostAction(id: string, data: PostFormData) {
  const result = await adminUpsertPost(data, id)
  if (!result) throw new Error('포스트 수정 실패')

  revalidatePath('/ko/news')
  revalidatePath('/ko/official')
  revalidatePath(`/ko/news/${data.slug}`)
  revalidatePath(`/ko/official/${data.slug}`)
  revalidatePath('/ko')
}

export async function deletePostAction(id: string) {
  await adminDeletePost(id)
  revalidatePath('/admin/posts')
  revalidatePath('/ko/news')
  revalidatePath('/ko/official')
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminUpsertWiki, adminDeleteWiki } from '@/lib/supabase/queries'
import type { WikiFormData } from '@/lib/supabase/types'

export async function createWikiAction(data: WikiFormData) {
  const result = await adminUpsertWiki(data)
  if (!result) throw new Error('위키 저장 실패')

  revalidatePath('/ko/wiki')
  redirect('/admin/wiki')
}

export async function updateWikiAction(id: string, data: WikiFormData) {
  const result = await adminUpsertWiki(data, id)
  if (!result) throw new Error('위키 수정 실패')

  revalidatePath('/ko/wiki')
  revalidatePath(`/ko/wiki/${data.slug}`)
}

export async function deleteWikiAction(id: string) {
  await adminDeleteWiki(id)
  revalidatePath('/admin/wiki')
  revalidatePath('/ko/wiki')
}

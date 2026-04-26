import type { PostLocalized } from '@/lib/supabase/types'
import { PostCard } from './PostCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface PostListProps {
  posts: PostLocalized[]
  locale: 'ko' | 'zh'
  basePath?: string
}

export function PostList({ posts, locale, basePath }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState icon="article" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} basePath={basePath} />
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { getPosts } from '@/server/actions/getPosts'

export default function PostsList({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadPosts() {
    setLoading(true)
    const data = await getPosts()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [refreshKey])

  if (loading) return <p className="text-gray-500">Загрузка постов…</p>
  if (!posts.length) return <p className="text-gray-500">Постов пока нет</p>

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Посты</h2>

      {posts.map(post => (
        <div
          key={post.id}
          className="rounded-xl border p-4 shadow-sm bg-white"
        >
          <div className="text-lg font-medium">{post.title}</div>

          <div className="text-sm text-gray-500 mb-2">
            Автор: {post.owner?.email?.split('@')[0]}
          </div>

          {post.categories?.length > 0 && (
            <div className="mb-2 flex gap-2 flex-wrap">
              {post.categories.map((cat: any) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700">{post.content}</p>
        </div>
      ))}
    </div>
  )
}

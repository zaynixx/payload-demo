'use client'

import { useEffect, useState } from 'react'
import { getPosts } from '@/server/actions/getPosts'

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Загрузка постов...</p>
  if (!posts.length) return <p>Постов пока нет</p>

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Посты</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: 12 }}>
            <strong>{post.title}</strong>
            <br />
            {post.content}
          </li>
        ))}
      </ul>
    </div>
  )
}

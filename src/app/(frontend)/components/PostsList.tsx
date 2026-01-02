'use client'

import { useEffect, useState } from 'react'
import { getPosts } from '@/server/actions/getPosts'
import type { Post } from '@/payload-types'

export default function PostsList({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPosts().then(setPosts)
  }, [refreshKey])

  if (!posts.length) {
    return (
      <div style={empty}>
        <div style={emptyTitle}>Постов пока нет</div>
        <div style={emptySubtitle}>Создайте первый пост</div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ marginBottom: 20 }}>Посты</h2>

      {posts.map(post => (
        <div key={post.id} style={card}>
          {/* TITLE */}
          <div style={title}>{post.title}</div>

          {/* AUTHOR */}
          <div style={meta}>
            Автор:{' '}
            {post.owner &&
            typeof post.owner === 'object' &&
            'email' in post.owner
              ? post.owner.email?.split('@')[0]
              : '—'}
          </div>

          {/* CATEGORIES */}
          {post.categories?.length ? (
            <div style={categories}>
              Категории:{' '}
              {post.categories
                .filter(c => typeof c === 'object')
                .map(c => c.title)
                .join(' | ')}
            </div>
          ) : null}

          {/* CONTENT */}
          {post.content && (
            <div style={content}>{post.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const card: React.CSSProperties = {
  background: '#0b0b0b',
  borderRadius: 16,
  padding: '22px 26px',
  marginBottom: 28,
  border: '1px solid rgba(255,255,255,0.06)',
}

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 6,
  color: '#ffffff',
}

const meta: React.CSSProperties = {
  fontSize: 13,
  color: '#8b8b8b',
  marginBottom: 10,
}

const categories: React.CSSProperties = {
  fontSize: 13,
  color: '#4da3ff',
  marginBottom: 14,
}

const content: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.65,
  color: '#e6e6e6',
  whiteSpace: 'pre-wrap',
}

const empty: React.CSSProperties = {
  marginTop: 60,
  padding: 40,
  borderRadius: 16,
  background: '#f6f6f6',
  textAlign: 'center',
}

const emptyTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 6,
}

const emptySubtitle: React.CSSProperties = {
  fontSize: 14,
  color: '#777',
}

'use client'

import { useEffect, useState } from 'react'
import { authorizeUser } from '@/server/actions/authorizeUser'
import { createPost } from '@/server/actions/createPost'
import { getCategories } from '@/server/actions/getCategories'
import PostsList from './components/PostsList'

type Category = {
  id: string
  title: string
}

export default function HomeClient() {
  const [login, setLogin] = useState('test')
  const [password, setPassword] = useState('test')
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [postsVersion, setPostsVersion] = useState(0)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  async function onLogin() {
    const res = await authorizeUser(login, password)
    setUser(res.user)
    setDisplayName(login.includes('@') ? login.split('@')[0] : login)
  }

  function toggleCategory(id: string) {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  async function onCreatePost() {
    if (!title || !slug) return

    await createPost({
      title,
      slug,
      content,
      categoryIds: selectedCategories,
      ownerId: user.id,
    })

    setTitle('')
    setSlug('')
    setContent('')
    setSelectedCategories([])
    setPostsVersion(v => v + 1)
  }

  /* ---------------- LOGIN ---------------- */

  if (!user) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Вход</h1>
          <p style={styles.muted}>Войдите в свой аккаунт</p>

          <input
            style={styles.input}
            placeholder="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={onLogin}>
            Войти
          </button>
        </div>
      </div>
    )
  }

  /* ---------------- DASHBOARD ---------------- */

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={styles.h1}>Здравствуйте, {displayName}</h1>
        <p style={styles.muted}>Создавайте и управляйте постами</p>

        {/* CREATE POST */}
        <div style={styles.card}>
          <h2 style={styles.h2}>Создать пост</h2>

          <label style={styles.label}>Заголовок</label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <label style={styles.label}>Slug</label>
          <input
            style={styles.input}
            value={slug}
            onChange={e => setSlug(e.target.value)}
          />

          <label style={styles.label}>Категории</label>
          <div style={styles.chips}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                style={{
                  ...styles.chip,
                  ...(selectedCategories.includes(cat.id)
                    ? styles.chipActive
                    : {}),
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <label style={styles.label}>Содержание</label>
          <textarea
            style={{ ...styles.input, minHeight: 120 }}
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <button
            style={{
              ...styles.primaryBtn,
              opacity: title && slug ? 1 : 0.5,
            }}
            disabled={!title || !slug}
            onClick={onCreatePost}
          >
            Создать пост
          </button>
        </div>

        {/* POSTS */}
        <PostsList refreshKey={postsVersion} />
      </div>
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    padding: 32,
  },
  center: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  },
  card: {
    background: '#0b0b0b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  h1: {
    fontSize: 26,
    marginBottom: 6,
  },
  h2: {
    fontSize: 20,
    marginBottom: 16,
  },
  muted: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#111',
    color: '#fff',
    marginBottom: 16,
    fontSize: 14,
  },
  primaryBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: 15,
    cursor: 'pointer',
  },
  chips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    padding: '6px 14px',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.2)',
    background: '#000',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: 13,
  },
  chipActive: {
    background: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6',
  },
}

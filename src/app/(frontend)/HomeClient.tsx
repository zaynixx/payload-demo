'use client'

import { useState } from 'react'
import { authorizeUser } from '@/server/actions/authorizeUser'
import { createPost } from '@/server/actions/createPost'
import PostsList from './components/PostsList'

export default function HomeClient() {
  const [login, setLogin] = useState('test')
  const [password, setPassword] = useState('test')
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  const [postsVersion, setPostsVersion] = useState(0)

  async function onLogin() {
    const res = await authorizeUser(login, password)
    setUser(res.user)

    setDisplayName(
      login.includes('@') ? login.split('@')[0] : login
    )
  }

  async function onCreatePost() {
    await createPost({
      title,
      slug,
      content,
      categoryIds: [],
      ownerId: user.id,
    })

    setTitle('')
    setSlug('')
    setContent('')

    // 🔥 REALTIME UPDATE
    setPostsVersion(v => v + 1)
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 400 }}>
        <h1>Login</h1>
        <input
          placeholder="login"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />
        <br />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button onClick={onLogin}>Login</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Здравствуйте {displayName}</h1>

      <h2>Создать пост</h2>
      <input
        placeholder="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />
      <input
        placeholder="slug"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />
      <br />
      <textarea
        placeholder="content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <br />
      <button onClick={onCreatePost}>Create Post</button>

      {user && (
        <PostsList refreshKey={postsVersion} />
      )}
    </div>
  )
}

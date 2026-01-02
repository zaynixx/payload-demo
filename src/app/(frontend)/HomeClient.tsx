'use client'

import { useState } from 'react'
import { authorizeUser } from '@/server/actions/authorizeUser'
import { createPost } from '@/server/actions/createPost'
import { useRouter } from 'next/navigation'

export default function HomeClient() {
  const router = useRouter()

  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('test')
  const [user, setUser] = useState<any>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  async function onLogin() {
    const res = await authorizeUser(email, password)
    setUser(res.user)
    router.refresh()
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

    router.refresh()
  }

  if (!user) {
    return (
      <>
        <h1>Login</h1>
        <input
        placeholder="login"
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
        <br />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
        />
        <br />
        <button onClick={onLogin}>Login</button>
      </>
    )
  }

  return (
    <>
      <h1>Здравствуйте {user.username ?? user.email}</h1>

      <h2>Создать пост</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <br />
      <input value={slug} onChange={e => setSlug(e.target.value)} />
      <br />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <br />
      <button onClick={onCreatePost}>Create Post</button>
    </>
  )
}

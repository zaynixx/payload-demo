'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function authorizeUser(login: string, password: string) {
  const payload = await getPayload({ config })

  // 👇 делаем email из login
  const email = login.includes('@')
    ? login
    : `${login}@test.com`

  let result

  try {
    // 1️⃣ ПЫТАЕМСЯ ЛОГИНИТЬСЯ
    result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
  } catch (err) {
    // 2️⃣ ЕСЛИ НЕ ПОЛУЧИЛОСЬ — СОЗДАЁМ ЮЗЕРА
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        username: login,
      },
    })

    // 3️⃣ И СРАЗУ ЛОГИНИМСЯ
    result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
  }

  if (!result.token) {
    throw new Error('Auth failed')
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return { user: result.user }
}

'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function authorizeUser(login: string, password: string) {
  const payload = await getPayload({ config })

  const email = login.includes('@')
    ? login
    : `${login}@test.com`

  let result

  try {
    result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
  } catch (err) {

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        username: login,
      },
    })

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

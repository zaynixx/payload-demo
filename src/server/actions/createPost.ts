'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function createPost(data: {
  title: string
  slug: string
  content?: string
  categoryIds: string[]
  ownerId: string
}) {
  const payload = await getPayload({ config })

  // для простого теста — создаём пост, owner берём из формы/состояния
  const doc = await payload.create({
    collection: 'posts',
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      categories: data.categoryIds,
      owner: data.ownerId,
    },
  })

  return doc
}

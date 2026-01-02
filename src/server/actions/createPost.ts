'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function createPost(data: {
  title: string
  slug: string
  content: string
  categoryIds: string[]
  ownerId: string
}) {
  const payload = await getPayload({ config })

  const post = await payload.create({
    collection: 'posts',
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      categories: data.categoryIds,
      owner: data.ownerId,
    },
  })

  return post
}

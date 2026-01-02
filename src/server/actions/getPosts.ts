'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getPosts() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
  })

  return posts.docs
}

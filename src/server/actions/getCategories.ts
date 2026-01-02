'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getCategories() {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  return res.docs.map(cat => ({
    id: cat.id,
    title: cat.title,
  }))
}

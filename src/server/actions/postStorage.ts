
let posts: any[] = []
let nextId = 1

const mockCategories = [
  { id: "1", title: "Технологии" },
  { id: "2", title: "Наука" },
  { id: "3", title: "Искусство" },
]

export function getStoredPosts() {
  return [...posts].reverse() 
}

export function addPost(post: any) {
  const newPost = {
    ...post,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
    owner: {
      id: post.ownerId,
      email: "test@example.com",
    },
    categories:
      post.categoryIds?.map((id: string) => mockCategories.find((cat) => cat.id === id)).filter(Boolean) || [],
  }
  posts.push(newPost)
  return newPost
}

export function getMockCategories() {
  return mockCategories
}

export function clearPosts() {
  posts = []
  nextId = 1
}

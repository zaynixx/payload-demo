import HomeClient from './HomeClient'
import PostsList from './components/PostsList'

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 600 }}>
      <HomeClient />
      <PostsList />
    </main>
  )
}

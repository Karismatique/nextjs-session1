// app/page.tsx
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import NewPostForm from '@/components/NewPostForm'

export const dynamic = 'force-dynamic'; // Désactivation du cache de page 

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
    take: 20,
  })

  return (
    <div className="container">
      <h1 className="page-title">Fil d&apos;actualité</h1>
      <NewPostForm />
      
      <div className="feed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            author={post.author.name}
            handle={post.author.handle}
            title={`Post #${post.id}`} 
            body={post.content}
            likes={post.likes}
            time={post.createdAt.toLocaleDateString('fr-FR')}
          />
        ))}
      </div>
    </div>
  )
}
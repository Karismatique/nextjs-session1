// app/page.tsx
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import NewPostForm from '@/components/NewPostForm'
import { auth } from '@/auth' // On importe l'authentification

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth() // On récupère l'utilisateur connecté
  const currentUserId = session?.user?.id // On extrait son ID (undefined si non connecté)

 const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: true,
      likedBy: true // <-- TRÈS IMPORTANT : On demande la liste des likes !
    },
    take: 20,
  })

  return (
    <div className="container">
      <h1 className="page-title">Fil d'actualité</h1>
      <NewPostForm />
      
      <div className="feed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            author={post.author.name}
            handle={post.author.handle}
            body={post.content}
            likedBy={post.likedBy} // On passe la liste des likes à chaque PostCard
            time={post.createdAt.toLocaleDateString('fr-FR')}
            authorId={post.authorId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
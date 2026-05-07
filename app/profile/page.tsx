// app/profile/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session) redirect('/api/auth/signin')
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { posts: { orderBy: { createdAt: 'desc' } } },
  })
  
  if (!user) redirect('/')

  const image = (user as { image?: string }).image

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {image && (
          <img src={image} alt="avatar" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
        )}
        <div>
          <h1>{user.name}</h1>
          {user.handle && <p style={{ color: '#6b7280' }}>{user.handle}</p>}
        </div>
      </div>
      
      <h2>Mes posts ({user.posts.length})</h2>
      {user.posts.map(post => (
        <div key={post.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <p>{post.content}</p>
          <small style={{ color: '#9ca3af' }}>Likes : {post.likes}</small>
        </div>
      ))}
    </div>
  )
}
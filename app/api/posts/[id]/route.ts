// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> } // Adapté pour Next.js 15+

// ... (les méthodes GET et PATCH restent identiques)

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  
  // Couche 1 - Vérifier que l'utilisateur est connecté
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })
  
  if (!post) {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
  }
  
  // Couche 2 - Vérifier que l'utilisateur est bien l'auteur
  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Interdit : vous n'êtes pas l'auteur de ce post" }, { status: 403 })
  }
  
  await prisma.post.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}
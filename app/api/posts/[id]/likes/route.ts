// app/api/posts/[id]/likes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  try {
    // On tente de créer le Like. 
    // Si l'utilisateur a déjà liké, @@id bloquera la création ici.
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId: Number(id)
      }
    })

    return NextResponse.json({ message: "Like ajouté" })
  } catch (error) {
    // Si l'erreur est liée à l'unicité, cela veut dire que le like existe déjà
    return NextResponse.json({ error: "Déjà liké" }, { status: 400 })
  }
}
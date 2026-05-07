import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Typage adapté pour les versions récentes de Next.js (params est une promesse)
type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  try {
    // 1. On récupère l'ID depuis l'URL
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // 2. On vérifie que l'utilisateur est bien connecté
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 3. On met à jour le post en incrémentant (+1) le champ 'likes'
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { 
        likes: { increment: 1 } 
      }
    })

    // 4. On renvoie un succès propre en JSON
    return NextResponse.json(updatedPost)
    
  } catch (error) {
    console.error("Erreur API Like:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Schéma de validation strict avec Zod
const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Le contenu ne peut pas être vide')
    .max(280, 'Maximum 280 caractères')
})

// ACTION 1 : Créer un post
export async function createPost(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const result = createPostSchema.safeParse({
    content: formData.get('content')
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await prisma.post.create({
      data: { 
        content: result.data.content, 
        authorId: session.user.id 
      }
    })
    
    revalidatePath('/') // Demande à Next.js de recharger la page d'accueil
    return { success: true }
  } catch (error) {
    return { error: 'Erreur serveur lors de la création' }
  }
}

// ACTION 2 : Supprimer un post (avec vérification d'autorisation)
export async function deletePost(postId: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Non authentifié')

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new Error('Post introuvable')
  
  // Sécurité absolue : on vérifie que l'utilisateur est bien l'auteur
  if (post.authorId !== session.user.id) {
    throw new Error('Action non autorisée')
  }

  await prisma.post.delete({ where: { id: postId } })
  
  revalidatePath('/')
  revalidatePath('/profile') // On recharge aussi le profil si on supprime depuis là-bas
}
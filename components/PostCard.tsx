'use client'

import { useTransition, useState } from 'react'
import { deletePost } from '@/app/actions'
import { useRouter } from 'next/navigation'

type PostCardProps = {
  id: number
  author: string | null
  handle: string | null
  body: string
  likes: number
  time: string
  authorId: string
  currentUserId?: string
}

export default function PostCard({ id, author, handle, body, likes: initialLikes, time, authorId, currentUserId }: PostCardProps) {
  const [isPendingDelete, startTransition] = useTransition()
  
  // États pour gérer les likes côté client (pour un affichage immédiat)
  const [likes, setLikes] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)
  const router = useRouter()
  
  // Vérification de la propriété du post
  const isOwner = currentUserId === authorId

  // --- LOGIQUE DE SUPPRESSION (Server Action) ---
  const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer ce post ?')) {
      startTransition(async () => {
        try {
          await deletePost(id)
        } catch (error) {
          alert("Erreur lors de la suppression.")
        }
      })
    }
  }

  // --- LOGIQUE DE LIKE (API Route) ---
  const handleLike = async () => {
    if (!currentUserId) {
      alert("Vous devez être connecté pour liker un post !")
      return
    }
    
    if (isLiking) return
    setIsLiking(true)

    // On augmente le compteur tout de suite pour l'utilisateur
    setLikes((prev) => prev + 1)

    try {
      // On appelle votre route API existante pour sauvegarder le like
      const res = await fetch(`/api/posts/${id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // On envoie un JSON vide
      })

      if (!res.ok) {
        // En cas d'erreur serveur, on annule le like
        setLikes((prev) => prev - 1)
        alert("Erreur lors de l'ajout du like")
      } else {
        router.refresh() // Met à jour le cache de la page
      }
    } catch (error) {
      setLikes((prev) => prev - 1)
      console.error(error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{author}</strong> <span style={{ color: '#6b7280' }}>{handle}</span> • <small>{time}</small>
        </div>
        
        {isOwner && (
          <button 
            onClick={handleDelete}
            disabled={isPendingDelete}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: isPendingDelete ? 'wait' : 'pointer' }}
            title="Supprimer mon post"
          >
            {isPendingDelete ? '⏳' : '🗑️'}
          </button>
        )}
      </div>
      
      <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{body}</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleLike}
          disabled={isLiking}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.9rem', padding: 0 }}
        >
          ❤️ {likes} likes
        </button>
      </div>
    </div>
  )
}
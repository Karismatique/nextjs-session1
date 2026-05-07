// components/PostCard.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/app/actions' // Server Action de la Séance 7

interface Like {
  userId: string;
  postId: number;
}

interface PostCardProps {
  id: number
  author: string | null
  handle: string | null
  body: string
  time: string
  authorId: string
  currentUserId?: string
  likedBy: Like[] // La liste des likes récupérée via Prisma 'include'
}

export default function PostCard({ 
  id, author, handle, body, time, authorId, currentUserId, likedBy 
}: PostCardProps) {
  const router = useRouter()
  const [isPendingDelete, startTransition] = useTransition()

  // --- LOGIQUE DES LIKES (OPTION 2) ---
  // On initialise l'état en vérifiant si l'utilisateur connecté est dans la liste
  const [hasLiked, setHasLiked] = useState(
    likedBy.some(like => like.userId === currentUserId)
  )
  const [likesCount, setLikesCount] = useState(likedBy.length)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!currentUserId) return alert("Connectez-vous pour liker !")
    if (hasLiked || isLiking) return // Empêche le double-clic ou le re-like

    // Mise à jour optimiste (immédiate sur l'UI)
    setHasLiked(true)
    setLikesCount(prev => prev + 1)
    setIsLiking(true)

    try {
      const res = await fetch(`/api/posts/${id}/likes`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) 
      })

      if (!res.ok) throw new Error()
      router.refresh() // Synchronise le cache serveur
    } catch (error) {
      // Annulation en cas d'erreur
      setHasLiked(false)
      setLikesCount(prev => prev - 1)
      alert("Erreur lors du like")
    } finally {
      setIsLiking(false)
    }
  }

  // --- LOGIQUE DE SUPPRESSION (DÉFI C) ---
  const handleDelete = () => {
    if (!confirm('Supprimer ce post ?')) return
    startTransition(async () => {
      try {
        await deletePost(id)
      } catch (e) {
        alert("Erreur de suppression")
      }
    })
  }

  const isOwner = currentUserId === authorId

  return (
    <div style={{ 
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', 
      padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem' }}>
          <strong style={{ color: '#111827' }}>{author}</strong> 
          <span style={{ color: '#6b7280', marginLeft: '0.25rem' }}>{handle}</span> 
          <span style={{ color: '#9ca3af', margin: '0 0.5rem' }}>•</span>
          <small style={{ color: '#9ca3af' }}>{time}</small>
        </div>

        {isOwner && (
          <button 
            onClick={handleDelete} 
            disabled={isPendingDelete}
            style={{ 
              background: 'none', border: 'none', color: '#ef4444', 
              cursor: isPendingDelete ? 'wait' : 'pointer', fontSize: '1.1rem' 
            }}
          >
            {isPendingDelete ? '...' : '🗑️'}
          </button>
        )}
      </div>

      <p style={{ margin: '0.75rem 0 1.25rem 0', color: '#374151', lineHeight: '1.5' }}>
        {body}
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleLike}
          disabled={hasLiked || isLiking}
          style={{ 
            background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem',
            cursor: (hasLiked || isLiking) ? 'default' : 'pointer',
            color: hasLiked ? '#ef4444' : '#6b7280', fontWeight: hasLiked ? 'bold' : 'normal',
            transition: 'transform 0.1s ease'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{hasLiked ? '❤️' : '🤍'}</span>
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  )
}
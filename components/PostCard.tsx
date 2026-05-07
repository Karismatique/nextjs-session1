'use client'

import { useTransition } from 'react'
import { deletePost } from '@/app/actions'

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

export default function PostCard({ id, author, handle, body, likes, time, authorId, currentUserId }: PostCardProps) {
  const [isPending, startTransition] = useTransition() // Permet de gérer l'état de chargement de l'action
  
  // Vérification de la propriété du post
  const isOwner = currentUserId === authorId

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

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{author}</strong> <span style={{ color: '#6b7280' }}>{handle}</span> • <small>{time}</small>
        </div>
        
        {/* Affichage conditionnel de la poubelle (Option C) */}
        {isOwner && (
          <button 
            onClick={handleDelete}
            disabled={isPending}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: isPending ? 'wait' : 'pointer' }}
            title="Supprimer mon post"
          >
            {isPending ? '⏳' : '🗑️'}
          </button>
        )}
      </div>
      <p style={{ marginTop: '0.5rem' }}>{body}</p>
      <small style={{ color: '#9ca3af' }}>❤️ {likes} likes</small>
    </div>
  )
}
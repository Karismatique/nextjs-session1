// components/NewPostForm.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function NewPostForm() {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!session) {
    return (
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>
          <a href='/api/auth/signin' style={{ color: '#6d28d9', textDecoration: 'none', fontWeight: 'bold' }}>Connectez-vous</a> pour publier un post
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !session?.user?.id) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorId: session.user.id, // L'ID vient de la session, plus de hardcode !
        }),
      })
      if (res.ok) {
        setContent('')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#374151' }}>
        Publier en tant que <strong>{session.user.name}</strong>
      </p>
      <textarea 
        value={content} 
        onChange={e => setContent(e.target.value)}
        placeholder="Quoi de neuf dans votre stack ?" 
        rows={3}
        style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', fontFamily: 'inherit', resize: 'vertical' }} 
      />
      <button type="submit" disabled={loading || !content.trim()} style={{ background: '#6d28d9', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
        {loading ? 'Publication...' : 'Publier'}
      </button>
    </form>
  )
}
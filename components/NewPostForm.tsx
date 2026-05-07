'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useActionState } from 'react' // Nouveau hook React
import { createPost } from '@/app/actions'

export default function NewPostForm() {
  const { data: session } = useSession()
  // Connexion de la Server Action au formulaire
  const [state, formAction, pending] = useActionState(createPost, null)

  if (!session) {
    return (
      <p style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '12px' }}>
        <Link href='/api/auth/signin' style={{ color: '#6d28d9', fontWeight: 'bold' }}>Connectez-vous</Link> pour publier
      </p>
    )
  }

  return (
    <form action={formAction} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Publier en tant que <strong>{session.user?.name}</strong>
      </p>
      
      <textarea 
        name="content" // L'attribut name pour formData.get('content')
        rows={3} 
        placeholder="Quoi de neuf dans votre stack ?"
        style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', fontFamily: 'inherit', resize: 'vertical' }}
      />
      
      {/* Affichage des erreurs Zod ou Serveur */}
      {state?.error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{state.error}</p>}
      
      <button 
        type="submit" 
        disabled={pending}
        style={{ background: pending ? '#9ca3af' : '#6d28d9', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: pending ? 'not-allowed' : 'pointer' }}
      >
        {pending ? 'Publication...' : 'Publier'}
      </button>
    </form>
  )
}
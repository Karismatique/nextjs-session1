// components/NewPostForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const router = useRouter();

  // Tâche B : Fetch des utilisateurs au chargement pour récupérer le premier ID
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        if (users.length > 0) {
          setAuthorId(users[0].id); // Assigne l'ID du premier utilisateur disponible
        }
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorId, // L'ID réel provenant de la BDD est désormais envoyé
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur lors de la création');
      }
      
      setContent('');
      router.refresh(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  // (Le rendu JSX du formulaire reste le même que lors de la séance 4)
  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Quoi de neuf dans votre stack ?"
        rows={3}
        style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', resize: 'vertical', fontFamily: 'inherit', marginBottom: '0.75rem' }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{content.length} / 280 caractères</span>
        <button type="submit" disabled={loading || !content.trim() || !authorId} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: loading ? '#9ca3af' : '#6d28d9', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </div>
    </form>
  );
}
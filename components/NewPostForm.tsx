// components/NewPostForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'Alice Martin',
          handle: '@alice_dev',
          content,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur lors de la création');
      }
      
      setContent('');
      router.refresh(); // Recharge les données serveur sans rechargement complet
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

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
        <button type="submit" disabled={loading || !content.trim()} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: loading ? '#9ca3af' : '#6d28d9', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </div>
    </form>
  );
}
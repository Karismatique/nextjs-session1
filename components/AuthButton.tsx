// components/AuthButton.tsx
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>...</span>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn('github')}
        style={{ padding: '0.4rem 1rem', borderRadius: '8px', background: '#24292f', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
      >
        Se connecter avec GitHub
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {session.user?.image && (
        <Image src={session.user.image} alt={session.user.name ?? 'Avatar'} width={28} height={28} style={{ borderRadius: '50%' }} />
      )}
      <span style={{ fontSize: '0.875rem' }}>{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        style={{ fontSize: '0.8rem', color: '#6b7280', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        Déconnexion
      </button>
    </div>
  );
}
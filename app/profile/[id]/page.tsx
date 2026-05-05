import { Metadata } from 'next';
import Link from 'next/link';

type User = {
  id: number; name: string; username: string;
  company: { name: string }; address: { city: string };
  email: string; phone: string;
};
type Post = { id: number; title: string; body: string };
// On définit un type pour les props de nos fonctions, avec "params" qui est une Promise
type Props = { params: Promise<{ id: string }> };

// Cette fonction génère les métadonnées dynamiques pour chaque profil d'utilisateur
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // On "await" les params avant de lire l'id
  const { id } = await params; 
  
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return { title: 'Profil introuvable | LinkUp' };
  
  const user: User = await res.json();
  return {
    title: `${user.name} | LinkUp`,
    description: `Profil de ${user.name} sur LinkUp`,
  };
}
// Cette fonction génère les chemins statiques pour les profils d'utilisateurs
export async function generateStaticParams() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json());
  return users.map((u: { id: number }) => ({ id: String(u.id) }));
}

export default async function UserProfilePage({ params }: Props) {
  // On "await" les params avant de lire l'id
  const { id } = await params;

  // On utilise notre variable 'id' (qui contient le bon numéro) dans les URLs
  const [userRes, postsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { next: { revalidate: 300 } }),
    fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`, { next: { revalidate: 60 } })
  ]);

  if (!userRes.ok) throw new Error(`Utilisateur ${id} introuvable`);
  if (!postsRes.ok) throw new Error('Impossible de charger les posts');

  const [user, posts]: [User, Post[]] = await Promise.all([
    userRes.json(), 
    postsRes.json()
  ]);

  return (
    <div className="page-container">
      <Link href="/explore" style={{ display: 'inline-block', marginBottom: '1rem', color: '#6d28d9', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Retour à Explorer
      </Link>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {user.name.charAt(0)}
        </div>
        <h1 style={{ marginBottom: '0.25rem' }}>{user.name}</h1>
        <p style={{ color: '#6b7280', margin: '0 0 0.5rem' }}>@{user.username}</p>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
          {user.company.name} · {user.address.city}
        </p>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Posts ({posts.length})</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{post.title}</p>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
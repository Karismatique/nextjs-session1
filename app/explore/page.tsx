// app/explore/page.tsx
import Link from 'next/link';

// 1. Définition du type TypeScript fourni dans le TP
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  company: { name: string };
  address: { city: string };
};

// 2. Fonction de fetch isolée avec gestion du cache et des erreurs
async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 300 } // ISR : actualise le cache toutes les 300 secondes (5 minutes)
  });

  if (!res.ok) {
    throw new Error('Impossible de charger les utilisateurs');
  }

  return res.json();
}

// 3. Le Composant Serveur async
export default async function ExplorePage() {
  const users = await getUsers();

  return (
    <div className="container">
      <h1 className="page-title">Suggestions</h1>
      
      <div className="explore-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-content">
              
              <div className="user-info">
                <div className="user-names">
                  {/* Mise à jour ici : Le nom devient un lien dynamique */}
                  <Link 
                    href={`/profile/${user.id}`}
                    style={{
                      color: '#6d28d9',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    <span className="user-name">{user.name}</span>
                  </Link>
                  <span className="user-handle">@{user.username}</span> 
                </div>
                <p className="user-bio">📧 {user.email}</p>
                <span className="user-followers">
                  📍 {user.address.city}
                </span>
              </div>

              <button className="follow-button">
                Suivre
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


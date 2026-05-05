// app/page.tsx
import PostCard from '@/components/PostCard';

// Définition des types basés sur JSONPlaceholder
type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  username: string;
};

// Fonction pour récupérer les données en parallèle
async function getPostsWithUsers() {
  // Lancer les deux fetch en parallèle est plus rapide qu'en série
  const [postsRes, usersRes] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', { next: { revalidate: 60 } }),
    fetch('https://jsonplaceholder.typicode.com/users', { next: { revalidate: 300 } }),
  ]);

  // Vérification des erreurs
  if (!postsRes.ok || !usersRes.ok) {
    throw new Error('Erreur lors du chargement des données');
  }

  const [posts, users]: [Post[], User[]] = await Promise.all([
    postsRes.json(), 
    usersRes.json()
  ]);

  // Créer un dictionnaire userId -> user pour un accès rapide
  const usersById = Object.fromEntries(
    users.map((u) => [u.id, u])
  );

  // Combiner les données
  return posts.map((post) => ({
    ...post,
    author: usersById[post.userId]?.name ?? 'Inconnu',
    handle: '@' + (usersById[post.userId]?.username ?? 'inconnu')
  }));
}

export default async function HomePage() {
  const posts = await getPostsWithUsers();

  return (
    <div className="container">
      <h1 className="page-title">Fil d&apos;actualité</h1>
      <div className="feed">
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            author={post.author}
            handle={post.handle}
            body={post.body} // Nouveau champ pour l'API
            // eslint-disable-next-line react-hooks/purity
            likes={Math.floor(Math.random() * 50)} // Faux likes car l'API n'en a pas
            time="Récemment" // Fausse date car l'API n'en a pas
            id={0} title={''}          />
        ))}
      </div>
    </div>
  );
}
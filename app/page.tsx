// app/page.tsx
import { getAllPosts } from '@/lib/store';
import PostCard from '@/components/PostCard';
import NewPostForm from '@/components/NewPostForm';

// LIGNE MAGIQUE POUR DÉSACTIVER LE CACHE :
export const dynamic = 'force-dynamic'; 

export default async function HomePage() {
  // ON INVERSE LA LISTE POUR VOIR LE POST EN HAUT :
  const posts = getAllPosts().reverse(); 

  return (
    <div className="container">
      <h1 className="page-title">Fil d&apos;actualité</h1>
      
      <NewPostForm />
      
      <div className="feed">
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            id={post.id}
            author={post.author}
            handle={post.handle}
            title={`Post de ${post.author}`} 
            body={post.content} 
            likes={post.likes}
            time="À l'instant"
          />
        ))}
      </div>
    </div>
  );
}
// lib/store.ts

export type Post = {
  id: number;
  author: string;
  handle: string;
  content: string;
  likes: number;
  createdAt: string;
};

// 1. ASTUCE NEXT.JS : On crée un espace global qui survit aux redémarrages
const globalStore = globalThis as unknown as { posts: Post[] };

// 2. On initialise les posts UNIQUEMENT s'ils n'existent pas déjà dans la mémoire globale
if (!globalStore.posts) {
  globalStore.posts = [
    { id: 1, author: 'Alice Martin', handle: '@alice_dev', content: 'Je viens de déployer mon premier projet Next.js 🚀', likes: 24, createdAt: '2024-01-15T10:00:00Z' },
    { id: 2, author: 'Bob Nguyen', handle: '@bob_codes', content: 'Les Server Components changent vraiment la façon de penser le rendu !', likes: 18, createdAt: '2024-01-15T08:30:00Z' },
    { id: 3, author: 'Clara Dubois', handle: '@clara_ui', content: 'Tailwind ou CSS classique avec Next.js ? Curieuse des pratiques de votre équipe !', likes: 41, createdAt: '2024-01-14T18:00:00Z' },
  ];
}

// 3. Toutes nos fonctions tapent maintenant dans "globalStore.posts"
export const getAllPosts = () => [...globalStore.posts];

export const getPostById = (id: number) => globalStore.posts.find(p => p.id === id);

export const createPost = (data: Omit<Post, 'id' | 'createdAt' | 'likes'>) => {
  const newPost: Post = {
    id: Date.now(),
    ...data,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  // On "push" dans le tableau global pour que la page d'accueil le voie instantanément
  globalStore.posts.push(newPost);
  return newPost;
};

export const updatePost = (id: number, data: Partial<Post>) => {
  globalStore.posts = globalStore.posts.map(p => (p.id === id ? { ...p, ...data } : p));
  return globalStore.posts.find(p => p.id === id);
};

export const deletePost = (id: number) => {
  const exists = globalStore.posts.some(p => p.id === id);
  globalStore.posts = globalStore.posts.filter(p => p.id !== id);
  return exists;
};

export const toggleLike = (id: number, increment: boolean) => {
  globalStore.posts = globalStore.posts.map(p => (p.id === id ? { ...p, likes: p.likes + (increment ? 1 : -1) } : p));
  return globalStore.posts.find(p => p.id === id);
};
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/store';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const limit = Number(searchParams.get('limit') ?? 100);
  const author = searchParams.get('author');
  
  let posts = getAllPosts();
  
  if (author) {
    posts = posts.filter(p => p.handle.toLowerCase().includes(author.toLowerCase()));
  }
  
  return NextResponse.json({
    posts: posts.slice(0, limit),
    total: posts.length,
  });
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  const { author, handle, content } = body;

  if (!author || !handle || !content) {
    return NextResponse.json({ error: 'author, handle et content sont requis' }, { status: 400 });
  }

  // Challenge B : Limite de caractères côté serveur
  if (content.length > 280) {
    return NextResponse.json({ error: 'Le contenu ne doit pas dépasser 280 caractères' }, { status: 400 });
  }

  const post = createPost({ author, handle, content });
  return NextResponse.json(post, { status: 201 });
}
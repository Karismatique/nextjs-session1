// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/store';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const post = getPostById(Number(id));
  
  if (!post) {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const post = getPostById(Number(id));
  
  if (!post) return NextResponse.json({ error: 'Post introuvable' }, { status: 404 });
  
  const body = await request.json();
  const updated = updatePost(Number(id), body);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const deleted = deletePost(Number(id));
  
  if (!deleted) {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 });
  }
  return new Response(null, { status: 204 }); // 204: succès sans corps
}
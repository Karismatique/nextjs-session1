// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> } // Adapté pour Next.js 15+

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  })
  if (!post) return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const { content } = await request.json()
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { content },
      include: { author: true },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    })
    return new Response(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
  }
}
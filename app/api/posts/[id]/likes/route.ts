// app/api/posts/[id]/likes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> } // Adapté pour Next.js 15+

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const { increment } = await request.json()
  
  if (typeof increment !== 'boolean') {
    return NextResponse.json({ error: 'increment doit être un booléen' }, { status: 400 })
  }
  
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        likes: { [increment ? 'increment' : 'decrement']: 1 },
      },
    })
    return NextResponse.json({ likes: post.likes })
  } catch {
    return NextResponse.json({ error: 'Post introuvable' }, { status: 404 })
  }
}
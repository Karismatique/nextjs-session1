// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const limit = Number(searchParams.get('limit') ?? 20)
  
  const posts = await prisma.post.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
  
  return NextResponse.json({ posts, total: posts.length })
}

export async function POST(request: Request) {
  let body
  try { 
    body = await request.json() 
  } catch { 
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }) 
  }
  
  const { content, authorId } = body
  if (!content || !authorId) {
    return NextResponse.json({ error: 'content et authorId requis' }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: { content, authorId },
    include: { author: true },
  })
  
  return NextResponse.json(post, { status: 201 })
}
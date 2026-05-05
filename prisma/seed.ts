// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('Seeding...')
  
  const alice = await prisma.user.create({
    data: { name: 'Alice Martin', handle: '@alice_dev', email: 'alice@linkup.dev' },
  })
  
  const bob = await prisma.user.create({
    data: { name: 'Bob Nguyen', handle: '@bob_codes', email: 'bob@linkup.dev' },
  })
  
  const clara = await prisma.user.create({
    data: { name: 'Clara Dubois', handle: '@clara_ui', email: 'clara@linkup.dev' },
  })

  await prisma.post.createMany({
    data: [
      { content: 'Je viens de déployer mon premier projet Next.js 🚀', likes: 24, authorId: alice.id },
      { content: 'Les Server Components changent vraiment la façon de penser le rendu !', likes: 18, authorId: bob.id },
      { content: 'Tailwind ou CSS classique avec Next.js ? Curieuse des pratiques', likes: 41, authorId: clara.id },
      { content: 'Prisma + Next.js combo parfait pour une API type-safe', likes: 33, authorId: alice.id },
    ],
  })
  
  console.log('Seed terminé')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // 1. (Optionnel mais recommandé) On nettoie la base de données pour éviter les doublons
  await prisma.like.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // 2. Création des utilisateurs de test
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      handle: '@alice_dev',
    },
  })

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      handle: '@bob_builder',
    },
  })

  const clara = await prisma.user.create({
    data: {
      name: 'Clara',
      email: 'clara@example.com',
      handle: '@clara_codes',
    },
  })

  // 3. Création des posts (Remarquez l'absence totale du champ "likes: XX")
  await prisma.post.createMany({
    data: [
      { 
        content: 'Je viens de déployer mon premier projet Next.js 🚀', 
        authorId: alice.id 
      },
      { 
        content: 'Les Server Components changent vraiment la façon de penser le rendu !', 
        authorId: bob.id 
      },
      { 
        content: 'Du CSS classique avec Next.js ? Curieuse des pratiques', 
        authorId: clara.id 
      },
      { 
        content: 'Next.js combo parfait pour une API type-safe', 
        authorId: alice.id 
      },
    ],
  })

  console.log('✅ Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
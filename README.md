# LinkUp - Projet d'évaluation Next.js

Application de micro-blogging développée dans le cadre de l'évaluation finale du module Next.js (M2 DEVFLSTK). 

**Lien de production (Vercel) :** [nextjs-session1-gilt.vercel.app]

---

## Fonctionnalité d'extension choisie

**Option C : Suppression de ses propres posts** (Avec en bonus : un système de Likes persistant en base de données).

* **Suppression sécurisée :** Un bouton de suppression n'apparaît que sur les posts de l'utilisateur connecté. L'action est gérée via une Server Action avec une vérification stricte des droits (l'`authorId` du post doit correspondre à la session).
* **Likes (Relation Many-to-Many) :** Les likes sont gérés via une table de liaison `Like` dans Prisma, empêchant de liker deux fois le même post. L'UI utilise une mise à jour optimiste pour plus de fluidité.

---

## Stack Technique & Base du projet

* **Routing & API :** Next.js 16 (App Router), API Routes REST, Server Actions.
* **Base de données :** PostgreSQL hébergé sur Neon.tech, ORM Prisma.
* **Authentification :** NextAuth.js avec fournisseur OAuth GitHub.
* **Validation :** Zod pour sécuriser les formulaires côté serveur.
* **Déploiement :** Vercel.

---

## Installation en local

### 1. Cloner et installer les dépendances
```bash
git clone https://github.com/Karismatique/nextjs-session1.git
cd nextjs-session1
npm install
```
---

### 2. Variables d'environnement (.env)
Créez un fichier .env à la racine et ajoutez vos clés :
```bash
# Base de données PostgreSQL (Neon)
DATABASE_URL="votre_url_neon"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="votre_secret_nextauth"

# GitHub OAuth
AUTH_GITHUB_ID="votre_client_id_github"
AUTH_GITHUB_SECRET="votre_client_secret_github"

```

### 3. Base de données
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

###  4. Lancer le projet

```bash
npm run dev
```
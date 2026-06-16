# KanbanRT

Application web de gestion de tâches collaborative inspirée de la méthode Kanban, développée avec React et Supabase.



## Équipe

- CHIBOUB Mohamed 
- MELLIER Mathias
- LAPASIN Quentin



## Stack technique

- **React 19** + **Vite**  -> interface utilisateur et bundler
- **React Router DOM** -> navigation entre les pages et protection des routes (`/login`, `/dashboard`, `/profile`)
- **Supabase** -> base de données PostgreSQL, authentification  et stockage de fichiers 
- **Resend** -> envoi de courriels transactionnels, relayé par une API Route serverless Vercel
- **Vercel** -> hébergement et déploiement continu 


## Installation locale

```bash
git clone https://github.com/Mathias42lm/R2.09.git
cd .\R2.09\
npm install
```



Créez ensuite un fichier `.env.local` à la racine du projet (jamais commité) avec vos clés Supabase, récupérées dans Settings → API de votre projet Supabase :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```



Puis lancez le serveur de développement :

```bash
npm run dev
```

L'application est alors accessible sur [http://localhost:5173](http://localhost:5173/).



## Application déjà déployée

[https://r2-09.vercel.app/login](https://r2-09.vercel.app/login)
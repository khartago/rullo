# Elrulo Breakthrough Padel Cup — Beyond the Ribat

Site tournoi mobile-first pour **El Rulo Padel Club** (Monastir) — 17ème étape FTT.

## Fonctionnalités

- Accueil premium avec stats live
- 10 catégories (P50 → P1000, Hommes / Femmes / Mixte)
- Tableaux interactifs (qualification + finale)
- Order of Play (filtres court / date)
- Liste des équipes
- Admin mobile : saisie scores, WO, marquer LIVE, avancement auto des tableaux
- FR / EN
- Footer **Rynex Solutions** → [LinkedIn](https://www.linkedin.com/in/rayane-bouzir-594a09274/)
- Lien page officielle [FTTLP](https://fttlp.com/tournoi/17eme-etape-ftt-el-rulo-padel-club)

## Démarrage local

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- Site : http://localhost:3000/fr
- Admin : http://localhost:3000/admin (mot de passe dans `.env` → `ADMIN_PASSWORD`)

## Déploiement Render (recommandé)

### 1. Configurer le MCP Render (Cursor)

1. Créer une clé API : [Render → Account Settings → API Keys](https://dashboard.render.com/u/settings#api-keys)
2. Remplacer `YOUR_RENDER_API_KEY` dans `~/.cursor/mcp.json` (entrée `render`)
3. Redémarrer Cursor, puis vérifier avec la commande `/deploy-to-render`

### 2. Base PostgreSQL locale (dev)

```bash
docker compose up -d
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

### 3. GitHub

```bash
git init
git add .
git commit -m "El Rulo tournament site"
git remote add origin https://github.com/<user>/el-rullo.git
git push -u origin main
```

### 4. Déployer sur Render

1. Ouvrir le Blueprint :  
   `https://dashboard.render.com/blueprint/new?repo=https://github.com/<user>/el-rullo`
2. Renseigner les secrets :
   - `ADMIN_PASSWORD` — mot de passe admin fort
   - `NEXT_PUBLIC_SITE_URL` — `https://el-rullo.onrender.com` (URL Render finale)
3. Cliquer **Apply** — Render crée la base Postgres + le service web
4. Le seed tournoi s'exécute au premier déploiement (`releaseCommand`)

Fichier IaC : `render.yaml` (région Frankfurt, plan free).

> **Note :** la base Postgres gratuite Render expire après 90 jours. Passer au plan payant ou exporter avant expiration.

## Déploiement gratuit (Vercel + Turso)

### 1. Turso (base SQLite cloud — gratuite)

```bash
# Installer turso CLI : https://docs.turso.tech/cli
turso db create el-rullo
turso db show el-rullo --url
turso db tokens create el-rullo
```

### 2. GitHub

```bash
git init
git add .
git commit -m "El Rulo tournament site"
git remote add origin <votre-repo>
git push -u origin main
```

### 3. Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Variables d'environnement :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | URL libsql Turso |
| `TURSO_AUTH_TOKEN` | Token Turso |
| `ADMIN_PASSWORD` | Mot de passe admin fort |
| `AUTH_SECRET` | Chaîne aléatoire 32+ caractères |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-app.vercel.app` |

3. Build command : `prisma generate && prisma db push && npm run db:seed && next build`

   Ou seed manuellement une fois après le premier deploy.

4. Domaine gratuit : `el-rullo.vercel.app`

### MCP Vercel (optionnel)

Ajouter dans `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "vercel": { "url": "https://mcp.vercel.com" }
  }
}
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev local |
| `npm run build` | Build production |
| `npm run db:push` | Sync schéma Prisma |
| `npm run db:seed` | Charger tournoi depuis seed |

## Stack

Next.js 16 · Tailwind CSS 4 · Prisma · PostgreSQL · next-intl · Framer Motion

---

Créé par **Rynex Solutions**

# sinan.daroukh.fr

Site personnel de Sinan Daroukh (C9 Corp), ingénieur logiciel freelance à
Clermont-Ferrand : page d'accueil, CV, articles et mentions légales, en
français et en anglais.

## Stack

- [Nuxt 4](https://nuxt.com) (dossier `app/`), rendu côté serveur
- [Nuxt Content 3](https://content.nuxt.com) pour les articles (Markdown)
- [@nuxtjs/i18n](https://i18n.nuxtjs.org) : français par défaut, anglais, mêmes URL
- Design system C9 en CSS (`app/styles/tokens.css`, `components.css`) ;
  Tailwind 4 est installé pour une migration future du thème
- FontAwesome pour les icônes
- Vercel pour l'hébergement, Web Analytics et Speed Insights (sans cookie)

## Démarrer

Prérequis : Node 24 et pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # build de production
pnpm preview      # sert le build localement
```

## Organisation

```
app/
  components/   Accueil, CV, barre de navigation, chats, galerie, logo…
  composables/  Thème, SEO, protection de l'e-mail, présence d'articles…
  data/cv/      Données du CV (générées depuis LinkedIn) + traductions EN
  pages/        /, /cv, /articles, /mentions-legales, /portfolio (non indexée)
  styles/       Design system C9 (tokens + composants)
  utils/        Données du site (e-mail, lien Calendly, construction du CV…)
  error.vue     Page 404 (logo qui rebondit façon économiseur DVD)
content/        Articles publiés (content/articles/*.md)
drafts/         Brouillons non publiés (modèle d'article)
i18n/locales/   Textes FR et EN
public/         Images, polices, favicon, robots.txt, image de partage
scripts/        Scripts de maintenance (Python)
server/routes/  sitemap.xml
```

## Contenus

### Textes de l'accueil

Tous les textes passent par `i18n/locales/fr-FR.json` et `en-US.json`
(clés `home.*`). L'e-mail et le lien de réservation sont dans
`app/utils/c9Data.ts`.

### Articles

Copier `drafts/article-exemple.md` dans `content/articles/<slug>.md`
(URL : `/articles/<slug>`). Le front-matter suit le schéma de
`content.config.ts`. Tant qu'aucun article n'existe, la section Articles est
masquée partout (menu, accueil, sitemap) et `/articles` renvoie une 404.

### CV

Le CV est généré depuis un export LinkedIn :

1. LinkedIn → Préférences → Confidentialité des données → « Obtenir une copie
   de vos données ».
2. Déposer le ZIP (ou les CSV) dans `linkedin/` (ignoré par git).
3. `pnpm run cv` (options : `--input`, `--out`, `--dry-run`).

Le script écrit `app/data/cv/linkedin.json` et liste les textes à traduire
dans `translations.en.json` (le français s'affiche en attendant). Les mots
mis en italique sont listés dans `app/utils/cvEmphasis.ts`.

### Photos des chats (easter egg)

En thème sombre, deux chats en pixel art dépassent en bas de l'écran ; les
caresser trois fois (ou taper « miaou ») ouvre une galerie.

1. Déposer les photos dans `photos/cats/<chat>/` (`coquelicot`, `puff` ou
   `ensemble`) ; `photos/` est ignoré par git.
2. `pnpm run cats` : redresse, supprime toutes les métadonnées (GPS compris)
   et génère les WebP dans `app/assets/cats/`.

### Image de partage, icône et logo

`python3 scripts/og-image.py` régénère `public/og-image.png`,
`public/apple-touch-icon.png` et le masque du logo utilisé par la page 404.
Les scripts Python demandent Python 3 et Pillow (sauf `cv.py`).

## Confidentialité

- L'adresse e-mail n'apparaît jamais en clair dans le code ni dans le HTML :
  elle est stockée en deux morceaux et assemblée dans le navigateur à la
  première interaction (`ProtectedEmail.vue`).
- Deux cookies fonctionnels seulement : langue (`i18n_redirected`) et thème
  (`c9-theme`). La mesure d'audience Vercel n'en dépose aucun.

## Déploiement

Hébergé sur Vercel, déployé automatiquement à chaque push sur `main` ;
les autres branches ont un déploiement de prévisualisation. Domaine :
`sinan.daroukh.fr` (DNS gérés par Vercel).

- Node 24 (`engines` dans `package.json` et runtime des fonctions dans
  `nuxt.config.ts`).
- Nuxt Content utilise le SQLite intégré à Node
  (`experimental.sqliteConnector: 'native'`) : aucun module natif à compiler
  au déploiement. La base est reconstruite dans `/tmp` au démarrage des
  fonctions.
- Analytics et Speed Insights s'activent dans les onglets correspondants du
  projet Vercel.

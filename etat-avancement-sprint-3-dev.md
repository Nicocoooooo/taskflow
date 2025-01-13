# Documentation de Développement - TaskFlow

## 1. Travail Effectué

### 1.1 Mise en Place de l'Infrastructure
- Configuration de la base de données Supabase
- Mise en place du projet React avec TypeScript
- Configuration de Tailwind CSS avec la charte graphique
- Configuration de l'environnement de développement
- Mise en place du routage avec react-router-dom

### 1.2 Développement des Composants Communs

#### Button Component
- Localisation: `/src/components/common/Button.tsx`
- Variantes : primary, secondary, danger, ghost
- Tailles : sm, md, lg
- États : normal, hover, active, disabled, loading
- Support de la largeur totale
- Dépendances : class-variance-authority, clsx, tailwind-merge

#### Modal Component
- Localisation: `/src/components/common/Modal.tsx`
- Overlay avec fond semi-transparent
- Fermeture au clic sur l'overlay
- En-tête personnalisable
- Gestion du contenu dynamique
- Support pour les formulaires

#### Autres Composants Communs
- Input.tsx : Champs de formulaire standardisés
- Card.tsx : Conteneur avec styles unifiés
- Badge.tsx : Étiquettes et indicateurs visuels

### 1.3 Système de Gestion des Tâches

#### API Tasks
- Localisation: `/src/features/tasks/api.ts`
- Fonctions implémentées et testées :
  - fetchTasks : Récupération des tâches avec relations (catégories, personnes)
  - fetchTaskById : Récupération d'une tâche spécifique
  - createTask : Création de tâche avec support complet des champs
  - updateTask : Mise à jour de tâche avec gestion optimiste des états
  - deleteTask : Suppression de tâche
  - fetchCategories : Gestion des catégories
  - fetchPeople : Gestion des personnes assignées

#### Composants de Tâches
1. TaskCard (`/src/components/tasks/TaskCard.tsx`)
   - Affichage des informations de la tâche
   - Indicateurs de priorité et d'importance
   - Gestion des dates et du temps estimé
   - Affichage des personnes assignées
   - Affichage des catégories avec couleurs
   - Support du drag & drop
   - Couleurs de fond selon le statut :
     - À faire : Jaune (bg-yellow-100)
     - En cours : Bleu (bg-blue-100)
     - Terminée : Vert (bg-emerald-100)

2. TaskForm (`/src/components/tasks/TaskForm.tsx`)
   - Création et édition de tâches
   - Support complet des catégories
   - Validation des champs
   - Support de tous les champs du cahier des charges
   - Mode édition avec pré-remplissage
   - Gestion des dates avec format ISO

### 1.4 Vues Principales

#### Dashboard
- Localisation: `/src/pages/dashboard/`
- Composants :
  - DashboardWidgets.tsx : Widgets et indicateurs
  - index.tsx : Layout et gestion de la page
- Fonctionnalités :
  - Vue d'ensemble des tâches du jour
  - Affichage des tâches en retard
  - Quick Add pour création rapide
  - Modal d'édition intégrée

#### Vue Liste
- Localisation: `/src/pages/tasks/ListView.tsx`
- Fonctionnalités implémentées :
  - Affichage de toutes les tâches en grille
  - Système de recherche en temps réel
  - Filtrage par catégorie
  - Création et édition de tâches via modal
  - Vue responsive (1/2/3 colonnes)

#### Vue Kanban
- Localisation: `/src/pages/tasks/KanbanView.tsx`
- Fonctionnalités implémentées :
  - Colonnes par statut (À faire, En cours, Terminé)
  - Drag & drop entre colonnes avec @hello-pangea/dnd
  - Mise à jour optimiste du statut
  - Filtrage par catégorie
  - Indicateurs visuels de drop zones
  - Compteurs de tâches par colonne
  - Animation lors du drag & drop
  - Gestion des erreurs avec rollback

### 1.5 Système de Filtres
- Composant KanbanFilters pour la vue Kanban
- Support du filtrage par catégorie
- Style cohérent avec la charte graphique
- Gestion du cas "Toutes les catégories"

## 2. Structure du Projet
## 2. Structure du Projet

### 2.1 Organisation des Dossiers et Fichiers
```
/
├── documentation/           # Documentation du projet
│   ├── cahier-charges.md
│   ├── charte-graphique.md
│   ├── documentation-base-de-donnee.md
│   ├── structure-code.md
│   ├── documentTechniqueTaskFlow.md
│   └── etat-avancement-sprint2-dev.md
│
└── src/                    # Code source
    ├── components/         # Composants réutilisables
    │   ├── common/        # Composants génériques
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Badge.tsx
    │   │   └── Modal.tsx
    │   ├── layouts/       # Composants de mise en page
    │   │   ├── MainLayout.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Header.tsx
    │   ├── tasks/        # Composants liés aux tâches
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskForm.tsx
    │   │   ├── TaskList.tsx
    │   │   └── TaskFilters.tsx
    │   ├── objectives/   # Composants liés aux objectifs
    │   │   ├── ObjectiveCard.tsx
    │   │   ├── ObjectiveForm.tsx
    │   │   └── ObjectiveProgress.tsx
    │   ├── habits/      # Composants liés aux habitudes
    │   │   ├── HabitCard.tsx
    │   │   ├── HabitForm.tsx
    │   │   └── HabitStreak.tsx
    │   └── stats/       # Composants liés aux statistiques
    │       ├── StatCard.tsx
    │       ├── StatChart.tsx
    │       └── ProductivityGraph.tsx
    │
    ├── features/        # Logique métier par fonctionnalité
    │   ├── tasks/
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── hooks.ts
    │   ├── objectives/
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── hooks.ts
    │   ├── habits/
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── hooks.ts
    │   └── stats/
    │       ├── api.ts
    │       ├── types.ts
    │       └── hooks.ts
    │
    ├── pages/          # Pages de l'application
    │   ├── dashboard/
    │   │   ├── index.tsx
    │   │   └── DashboardWidgets.tsx
    │   ├── tasks/
    │   │   ├── ListView.tsx
    │   │   ├── KanbanView.tsx
    │   │   ├── CalendarView.tsx
    │   │   ├── EisenhowerView.tsx
    │   │   └── DailyView.tsx
    │   ├── objectives/
    │   │   └── index.tsx
    │   ├── habits/
    │   │   └── index.tsx
    │   └── stats/
    │       └── index.tsx
    │
    ├── utils/          # Utilitaires
    │   ├── date.ts
    │   ├── color.ts
    │   └── storage.ts
    │
    ├── styles/         # Styles globaux
    │   └── globals.css
    │
    ├── types/          # Types TypeScript globaux
    │   └── index.ts
    │
    ├── lib/           # Configuration des bibliothèques
    │   ├── supabase.ts
    │   └── queryClient.ts
    │
    ├── context/       # Contextes React
    │   └── ThemeContext.tsx
    │
    ├── constants/     # Constantes de l'application
    │   └── index.ts
    │
    └── hooks/         # Hooks personnalisés globaux
        ├── useLocalStorage.ts
        └── useMediaQuery.ts

### 2.2 Fichiers de Configuration Racine
```
/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## 3. Points d'Attention

### 3.1 Bonnes Pratiques Appliquées
- Utilisation systématique de TypeScript
- Composants React modulaires
- Séparation des responsabilités (API, UI, logique)
- Styles Tailwind cohérents
- Gestion des états avec hooks personnalisés
- Feedback visuel pour les actions utilisateur
- Gestion optimiste des mises à jour
- Types stricts pour les interfaces

### 3.2 Points à Surveiller
- Performance des requêtes Supabase
- Gestion du cache (envisager React Query)
- Validation des formulaires
- Gestion des erreurs API
- Compatibilité mobile
- Tests unitaires à implémenter
- Gestion des types stricts pour le drag & drop

## 4. Prochaines Étapes

### 4.1 Priorités Immédiates
1. Améliorer la Vue Liste
   - Ajouter le tri par colonnes
   - Implémenter la pagination
   - Ajouter des filtres avancés

2. Développer la Vue Calendrier
   - Implémentation de base
   - Intégration avec les tâches
   - Navigation temporelle

3. Développer la Vue Matrice d'Eisenhower
   - Quadrants configurable
   - Drag & drop entre quadrants
   - Filtres spécifiques

### 4.2 Améliorations Futures
- Système de notifications
- Optimisation des performances
- Tests automatisés
- Documentation utilisateur
- Guide de développement

## 5. Environnement Technique

### 5.1 Dépendances Principales
```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.2",
  "tailwindcss": "^3.3.0",
  "@supabase/supabase-js": "^2.39.3",
  "@hello-pangea/dnd": "^16.5.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.469.0",
  "react-router-dom": "^7.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### 5.2 Scripts Disponibles
```bash
npm run dev      # Développement local
npm run build    # Build production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

## 6. Documents du Projet

### 6.1 Documentation Principale
- `/cahier-charges.md` : Spécifications fonctionnelles et techniques détaillées du projet
- `/charte-graphique.md` : Guide complet du design system, couleurs, typographie et composants
- `/documentation-base-de-donnee.md` : Structure des tables, relations et index de la base de données
- `/structure-code.md` : Organisation des dossiers et fichiers avec leurs responsabilités
- `/documentTechniqueTaskFlow.md` : Configuration technique (Supabase, GitHub, Vercel)
- `/etat-avancement-sprint2-dev.md` : État d'avancement du développement (ce document)

### 6.2 Fichiers de Configuration
- `.env` : Variables d'environnement (Supabase URL et clé API)
- `vercel.json` : Configuration du déploiement
- `tsconfig.json` : Configuration TypeScript
- `tailwind.config.js` : Configuration Tailwind CSS
- `package.json` : Dépendances et scripts npm

## 7. Ressources et Documentation
- Cahier des charges : `/cahier-charges.md`
- Charte graphique : `/charte-graphique.md`
- Documentation technique : `/documentTechniqueTaskFlow.md`
- Documentation Supabase : https://supabase.com/docs
- Documentation React : https://react.dev
- Documentation @hello-pangea/dnd : https://github.com/hello-pangea/dnd
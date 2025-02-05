# TaskFlow

Une application web personnelle de gestion des tâches et d'organisation, conçue pour maximiser la productivité avec une interface moderne et intuitive.

## ✨ Caractéristiques

- 📋 **Gestion complète des tâches** avec priorités, deadlines et catégories
- 📊 **Vues multiples** : Kanban, Liste, Calendrier, Matrice d'Eisenhower
- 🎯 **Système d'objectifs** avec suivi de progression
- 🔄 **Gestion des habitudes** avec système de streaks
- 📈 **Analyses et statistiques** détaillées
- 🔍 **Recherche et filtres** avancés
- 📱 **Interface responsive** et moderne

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/Nicocooooo/taskflow.git
cd taskflow
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

4. Configurez les variables d'environnement dans le fichier `.env` :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_supabase
```

5. Lancez l'application en mode développement :
```bash
npm run dev
```

## 🛠️ Technologies utilisées

- **Frontend** : React.js avec TypeScript
- **Styles** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Hébergement** : Vercel
- **Drag & Drop** : react-beautiful-dnd
- **Graphiques** : recharts

## 📚 Documentation

La documentation complète du projet est disponible dans les fichiers suivants :

- `cahier-charges.md` : Spécifications fonctionnelles détaillées
- `charte-graphique.md` : Guide du design system
- `documentation-base-de-donnee.md` : Structure de la base de données
- `structure-code.md` : Organisation du code source

## ⚙️ Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée une version de production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## 🔒 Sécurité

- Toutes les tables sont sécurisées avec Row Level Security (RLS)
- Les clés d'API sensibles doivent rester confidentielles
- L'authentification anonyme est activée pour l'accès public

## 📝 Notes

- L'application est conçue pour un usage personnel uniquement
- Les sauvegardes sont automatiques via Supabase
- Le déploiement est automatisé via Vercel à chaque push sur la branche main

## 🔧 Support

En cas de problèmes :
- Base de données : Accédez au dashboard Supabase
- Déploiement : Consultez le dashboard Vercel
- Code : Créez une issue sur GitHub
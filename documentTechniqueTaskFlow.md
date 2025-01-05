Documentation Technique TaskFlow - Infrastructure & Configuration
1. Base de Données (Supabase)
Configuration Supabase

URL du Projet : https://caqfsnsmydvkupaxgtsy.supabase.co
Clé API publique : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWZzbnNteWR2a3VwYXhndHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDE4MjIsImV4cCI6MjA1MTU3NzgyMn0.hkZ3Dai9S_mm4rOeu0Fv32GI3-RSuBz5BNYumrbpzMI
Base de données : PostgreSQL
Schéma principal : public

Accès à la Base de Données

Dashboard Supabase : https://app.supabase.com
Sélectionner le projet "TaskFlow"
Accès via l'interface "Table Editor" ou "SQL Editor"

Clés d'API

Les clés sont configurées dans /src/lib/supabase.ts
Ne jamais exposer la clé service_role dans le code front-end
La clé anon est utilisée pour les requêtes client

2. GitHub
Informations du Repository

URL : https://github.com/Nicocooooo/taskflow
Branche principale : main

Configuration Git Locale
bashCopygit config --global user.name "Nicocooooo"
git config --global user.email "nicolasantoine2003@gmail.com"
Workflow Git

Développement local :

bashCopygit add .
git commit -m "Description des changements"
git push origin main

Pour mettre à jour depuis GitHub :

bashCopygit pull origin main
3. Hébergement (Vercel)
Configuration du Projet

URL de Production : https://taskflow-pearl.vercel.app/
Framework : Vite + React
Variables d'Environnement :
CopyVITE_SUPABASE_URL=https://caqfsnsmydvkupaxgtsy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWZzbnNteWR2a3VwYXhndHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDE4MjIsImV4cCI6MjA1MTU3NzgyMn0.hkZ3Dai9S_mm4rOeu0Fv32GI3-RSuBz5BNYumrbpzMI


Déploiement

Déploiement automatique à chaque push sur main
Build Command : npm run build
Output Directory : dist

4. Développement Local
Installation
bashCopy# Cloner le repository
git clone https://github.com/Nicocooooo/taskflow.git

# Installer les dépendances
cd taskflow
npm install

# Créer le fichier .env local
touch .env
Configuration .env
envCopyVITE_SUPABASE_URL=https://caqfsnsmydvkupaxgtsy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWZzbnNteWR2a3VwYXhndHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDE4MjIsImV4cCI6MjA1MTU3NzgyMn0.hkZ3Dai9S_mm4rOeu0Fv32GI3-RSuBz5BNYumrbpzMI
Commandes de Développement
bashCopy# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
5. Bases de Données - Notes Importantes
Politiques de Sécurité

RLS (Row Level Security) activé sur toutes les tables
Authentification anonyme activée pour l'accès public
Politique par défaut : accès en lecture/écriture pour tous les utilisateurs

Index Principaux
sqlCopyidx_tasks_category sur tasks(category_id)
idx_tasks_status sur tasks(status)
idx_tasks_priority sur tasks(priority)
idx_tasks_due_date sur tasks(due_date)
idx_objectives_category sur objectives(category_id)
idx_habits_category sur habits(category_id)
idx_habit_logs_habit sur habit_logs(habit_id)
idx_productivity_logs_date sur productivity_logs(date)
6. Maintenance et Monitoring
Supabase

Vérifier régulièrement l'espace de stockage utilisé
Monitorer les performances des requêtes dans le dashboard
Sauvegardes automatiques activées

Vercel

Surveiller les logs de déploiement
Vérifier les métriques de performance
Configurations de build dans vercel.json

7. Contact et Support

Pour les problèmes de base de données : Accès au dashboard Supabase
Pour les problèmes de déploiement : Dashboard Vercel
Pour les problèmes de code : Issues GitHub
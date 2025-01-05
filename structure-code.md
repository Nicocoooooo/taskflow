Structure du Projet et Documentation des Fichiers
/src/components/
Common

Button.tsx : Composant bouton personnalisé avec différentes variantes (primaire, secondaire, danger)
Input.tsx : Champs de formulaire standardisés (text, number, date)
Card.tsx : Conteneur avec ombre et bordures arrondies selon la charte graphique
Badge.tsx : Étiquettes colorées pour les statuts et priorités
Modal.tsx : Fenêtre modale réutilisable pour les formulaires et confirmations

Layouts

MainLayout.tsx : Layout principal de l'application incluant sidebar et header
Sidebar.tsx : Barre de navigation latérale avec menu et sous-menus
Header.tsx : En-tête avec barre de recherche et menu utilisateur

Tasks

TaskCard.tsx : Carte individuelle pour afficher une tâche
TaskForm.tsx : Formulaire de création/édition de tâche
TaskList.tsx : Liste des tâches avec options de tri et filtrage
TaskFilters.tsx : Panneau de filtres pour les tâches

Objectives

ObjectiveCard.tsx : Affichage d'un objectif avec sa progression
ObjectiveForm.tsx : Formulaire pour objectifs et sous-objectifs
ObjectiveProgress.tsx : Barre et indicateurs de progression

Habits

HabitCard.tsx : Affichage d'une habitude avec son streak
HabitForm.tsx : Formulaire de création/édition d'habitude
HabitStreak.tsx : Visualisation du streak et des statistiques

Stats

StatCard.tsx : Carte pour afficher une statistique individuelle
StatChart.tsx : Graphiques réutilisables (ligne, barre, camembert)
ProductivityGraph.tsx : Graphique spécifique pour la productivité

/src/features/
Tasks

api.ts : Fonctions d'interaction avec Supabase pour les tâches
types.ts : Types TypeScript pour les tâches et leurs propriétés
hooks.ts : Hooks personnalisés pour la gestion des tâches (useTask, useTaskList)

Objectives

api.ts : API calls pour les objectifs
types.ts : Interface des objectifs et sous-objectifs
hooks.ts : Hooks pour la gestion des objectifs

Habits

api.ts : Fonctions pour gérer les habitudes dans Supabase
types.ts : Types pour les habitudes et leur suivi
hooks.ts : Hooks pour le tracking des habitudes

Stats

api.ts : Requêtes pour les statistiques et analyses
types.ts : Types pour les données statistiques
hooks.ts : Hooks pour calculer et formater les stats

/src/pages/
Dashboard

index.tsx : Page d'accueil avec vue d'ensemble
DashboardWidgets.tsx : Widgets configurables du dashboard

Tasks

ListView.tsx : Vue liste détaillée des tâches
KanbanView.tsx : Vue kanban avec drag & drop
CalendarView.tsx : Vue calendrier des tâches
EisenhowerView.tsx : Matrice d'Eisenhower
DailyView.tsx : Liste des tâches du jour

Objectives

index.tsx : Gestion des objectifs à court/moyen/long terme

Habits

index.tsx : Suivi et gestion des habitudes

Stats

index.tsx : Tableaux de bord analytiques et statistiques

/src/utils/

date.ts : Fonctions de manipulation des dates
color.ts : Gestion des couleurs et thèmes
storage.ts : Gestion du stockage local

/src/types/

index.ts : Types globaux de l'application

/src/lib/

supabase.ts : Configuration du client Supabase
queryClient.ts : Configuration de React Query

/src/context/

ThemeContext.tsx : Gestion du thème de l'application

/src/constants/

index.ts : Constantes globales (statuts, priorités, etc.)

/src/hooks/

useLocalStorage.ts : Hook pour la gestion du stockage local
useMediaQuery.ts : Hook pour la gestion du responsive

Notes importantes pour le développement

Conventions de nommage

Components : PascalCase
Hooks : camelCase commençant par "use"
Fichiers utilitaires : camelCase
Types/Interfaces : PascalCase avec préfixe I pour les interfaces


Gestion d'état

Utiliser React Query pour les données serveur
Context API pour l'état global (thème, préférences)
État local pour les composants isolés


Styles

Utiliser exclusivement Tailwind CSS
Suivre la charte graphique définie
Utiliser les classes utilitaires de base de Tailwind


Performance

Lazy loading pour les routes
Memoization des composants lourds
Optimisation des requêtes avec React Query


Sécurité

Validation des données côté client
Sanitization des entrées utilisateur
Respect des politiques RLS de Supabase

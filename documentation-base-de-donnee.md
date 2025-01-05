Documentation Base de Données TaskFlow
Vue d'ensemble
La base de données est conçue avec PostgreSQL via Supabase. Elle comprend 10 tables principales interconnectées pour gérer les tâches, catégories, objectifs, habitudes et les préférences utilisateur.
Structure Détaillée des Tables
1. categories
Table gérant la hiérarchie des catégories avec possibilité de sous-catégories infinies.
Champs :

id : SERIAL PRIMARY KEY
name : VARCHAR(100) NOT NULL
color : VARCHAR(7) NOT NULL - Format hexadécimal (#RRGGBB)
parent_id : INTEGER REFERENCES categories(id)
created_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()

2. tasks
Table centrale stockant toutes les tâches.
Champs :

id : SERIAL PRIMARY KEY
name : VARCHAR(200) NOT NULL
description : TEXT
due_date : TIMESTAMPTZ
estimated_time : INTEGER - En minutes
priority : VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
is_urgent : BOOLEAN NOT NULL DEFAULT false
is_important : BOOLEAN NOT NULL DEFAULT false
category_id : INTEGER REFERENCES categories(id)
status : VARCHAR(20) CHECK (status IN ('todo', 'in_progress', 'done'))
notes : TEXT
created_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()
completed_at : TIMESTAMPTZ

3. task_persons
Table associative pour les personnes concernées par les tâches.
Champs :

id : SERIAL PRIMARY KEY
task_id : INTEGER REFERENCES tasks(id)
person_name : VARCHAR(100) NOT NULL

4. objectives
Table pour la gestion des objectifs à long terme.
Champs :

id : SERIAL PRIMARY KEY
title : VARCHAR(200) NOT NULL
description : TEXT
due_date : TIMESTAMPTZ
category_id : INTEGER REFERENCES categories(id)
type : VARCHAR(20) CHECK (type IN ('short_term', 'medium_term', 'long_term'))
status : VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed'))
progress : INTEGER CHECK (progress BETWEEN 0 AND 100)
notes : TEXT
created_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()

5. objective_steps
Table pour les étapes détaillées des objectifs.
Champs :

id : SERIAL PRIMARY KEY
objective_id : INTEGER REFERENCES objectives(id)
title : VARCHAR(200) NOT NULL
description : TEXT
order_index : INTEGER NOT NULL
is_completed : BOOLEAN NOT NULL DEFAULT false
completed_at : TIMESTAMPTZ

6. objective_tasks
Table de liaison entre objectifs et tâches.
Champs :

objective_id : INTEGER REFERENCES objectives(id)
task_id : INTEGER REFERENCES tasks(id)
PRIMARY KEY (objective_id, task_id)

7. habits
Table pour le suivi des habitudes.
Champs :

id : SERIAL PRIMARY KEY
name : VARCHAR(200) NOT NULL
description : TEXT
frequency : JSONB NOT NULL - Stocke la configuration de fréquence
reminder_time : TIME
category_id : INTEGER REFERENCES categories(id)
current_streak : INTEGER NOT NULL DEFAULT 0
best_streak : INTEGER NOT NULL DEFAULT 0
created_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()

8. habit_logs
Table pour l'historique des habitudes.
Champs :

id : SERIAL PRIMARY KEY
habit_id : INTEGER REFERENCES habits(id)
completed_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()
skipped : BOOLEAN NOT NULL DEFAULT false
notes : TEXT

9. saved_views
Table pour les vues personnalisées.
Champs :

id : SERIAL PRIMARY KEY
name : VARCHAR(100) NOT NULL
type : VARCHAR(50) NOT NULL - 'list', 'kanban', etc.
filters : JSONB NOT NULL
is_default : BOOLEAN NOT NULL DEFAULT false
created_at : TIMESTAMPTZ NOT NULL DEFAULT NOW()

10. user_preferences
Table pour les préférences utilisateur.
Champs :

id : SERIAL PRIMARY KEY
notification_settings : JSONB NOT NULL
theme_preferences : JSONB NOT NULL
dashboard_layout : JSONB NOT NULL

11. productivity_logs
Table pour le suivi de la productivité.
Champs :

id : SERIAL PRIMARY KEY
date : DATE NOT NULL
tasks_completed : INTEGER NOT NULL DEFAULT 0
total_time_spent : INTEGER NOT NULL DEFAULT 0 - En minutes
notes : TEXT
metrics : JSONB - Stocke des métriques diverses

Index
Les index suivants ont été créés pour optimiser les performances :

idx_tasks_category sur tasks(category_id)
idx_tasks_status sur tasks(status)
idx_tasks_priority sur tasks(priority)
idx_tasks_due_date sur tasks(due_date)
idx_objectives_category sur objectives(category_id)
idx_habits_category sur habits(category_id)
idx_habit_logs_habit sur habit_logs(habit_id)
idx_productivity_logs_date sur productivity_logs(date)

Notes importantes

Les champs JSONB permettent une grande flexibilité pour les configurations complexes
Les contraintes CHECK assurent l'intégrité des données
Les relations sont toutes correctement indexées
Les timestamps utilisent TIMESTAMPTZ pour gérer les fuseaux horaires
Les clés étrangères assurent l'intégrité référentielle

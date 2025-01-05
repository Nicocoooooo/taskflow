# Charte Graphique - TaskFlow

## 1. Philosophie du Design
L'interface utilisateur suit une approche minimaliste et moderne, privilégiant :
- La clarté et la lisibilité
- Les espaces blancs généreux
- Les interactions subtiles et fluides
- Une hiérarchie visuelle claire

## 2. Couleurs

### 2.1 Couleurs Principales
- Violet principal: `#8B5CF6` (Pour les éléments d'action principaux et accents)
- Blanc: `#FFFFFF` (Fond des cartes et éléments principaux)
- Gris clair: `#F8FAFC` (Fond général de l'application)

### 2.2 Couleurs Secondaires
- Orange/Saumon: `#FB923C` (Notifications et alertes)
  - Fond clair: `#FFF7ED`
- Vert menthe: `#10B981` (Succès et validations)
  - Fond clair: `#ECFDF5`
- Violet clair: `#A78BFA` (Éléments interactifs secondaires)
  - Fond clair: `#F5F3FF`

### 2.3 Couleurs de Texte
- Texte principal: `#1F2937` (Gris très foncé)
- Texte secondaire: `#6B7280` (Gris moyen)
- Texte tertiaire: `#9CA3AF` (Gris clair)

### 2.4 Couleurs des États
- En attente: `#FCD34D` (Jaune)
- En cours: `#60A5FA` (Bleu)
- Terminé: `#10B981` (Vert)
- Urgent: `#EF4444` (Rouge)

## 3. Typographie

### 3.1 Police Principale
- Famille: Inter
- Poids utilisés:
  - Regular (400) pour le texte courant
  - Medium (500) pour les sous-titres
  - Semibold (600) pour les titres
  - Bold (700) pour les éléments d'emphase

### 3.2 Tailles de Texte
- Titre principal: 48px (3rem)
- Titres de section: 32px (2rem)
- Sous-titres: 24px (1.5rem)
- Texte courant: 16px (1rem)
- Texte secondaire: 14px (0.875rem)
- Petits textes: 12px (0.75rem)

## 4. Composants

### 4.1 Cartes
- Coins arrondis: 24px (rounded-3xl)
- Ombre portée légère: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- Padding interne: 24px
- Espacement entre les cartes: 16px

### 4.2 Boutons
- Coins arrondis: 16px (rounded-2xl)
- Padding: 12px 24px
- États:
  - Normal: Couleur principale
  - Hover: 10% plus foncé
  - Active: 20% plus foncé
  - Disabled: 50% d'opacité

### 4.3 Champs de Formulaire
- Coins arrondis: 12px (rounded-xl)
- Bordure: 1px solid #E5E7EB
- Focus: Bordure violette (#8B5CF6)
- Padding: 12px 16px
- Fond: Blanc

### 4.4 Navigation
- Menu principal:
  - Fond légèrement grisé (#F8FAFC)
  - Coins très arrondis (24px)
  - Icônes: 20px
  - Labels: 14px

### 4.5 Badges et États
- Coins très arrondis (9999px pour aspect pilule)
- Padding: 4px 12px
- Texte: 14px
- Utiliser des versions pastels des couleurs d'état

## 5. Espacement

### 5.1 Grille
- Padding de conteneur: 32px
- Gap entre les éléments majeurs: 24px
- Gap entre les éléments d'une liste: 16px
- Marges internes composants: 16px ou 24px

### 5.2 Breakpoints Responsive
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

## 6. Animations et Transitions

### 6.1 Transitions Générales
- Durée: 200ms
- Timing: ease-in-out
- Propriétés:
  - background-color
  - transform
  - opacity
  - box-shadow

### 6.2 Hover States
- Scale: 1.02 sur les cartes interactives
- Brightness: 1.05 sur les boutons
- Translation Y: -2px sur les éléments flottants

## 7. Iconographie
- Style: Outlined (lucide-react)
- Taille par défaut: 20px
- Taille navigation: 24px
- Épaisseur de trait: 2px
- Couleur: Hérite de la couleur du texte

## 8. Accessibilité
- Contraste minimum: 4.5:1 pour le texte normal
- Contraste minimum: 3:1 pour les grands textes
- Focus visible sur tous les éléments interactifs
- Taille minimum des zones tactiles: 44px x 44px

## 9. Design System Components
Tous les composants doivent utiliser les classes Tailwind correspondant aux spécifications ci-dessus. Éviter les styles personnalisés sauf si absolument nécessaire.
# Konforties

Konforties est une application qui permet d'évaluer objectivement le **confort d'un emploi** à partir d'un ensemble de critères notés, puis de traduire cette évaluation en un **score sur 100**. L'objectif est de pouvoir comparer plusieurs postes (emploi actuel, offres reçues, opportunités envisagées) sur une base commune et personnalisée.

## Le problème

Comparer deux offres d'emploi "à l'instinct" est difficile : salaire, télétravail, ambiance, charge de travail, avantages, trajet... chaque critère compte différemment selon la personne, et il n'existe pas d'outil simple pour objectiver ce ressenti global.

## Le concept

1. L'utilisateur répond à un **questionnaire structuré** (critères regroupés par catégories : rémunération, équilibre vie pro/perso, management, avantages, télétravail, sécurité de l'emploi, évolution de carrière, charge de travail, trajet/localisation, etc.).
2. Chaque critère est noté sur une échelle (ex. 1 à 5) et peut être **pondéré selon son importance personnelle** (tout le monde ne valorise pas le télétravail ou le salaire de la même façon).
3. Une formule agrège ces notes pondérées en un **score de confort sur 100**.
4. L'utilisateur peut nommer et sauvegarder plusieurs évaluations ("Mon poste actuel", "Offre Entreprise X", "Offre Entreprise Y") et les **comparer côte à côte**.

### Cas d'usage type

> Un employé répond à une série de ~10 questions sur son poste actuel et obtient un pourcentage de satisfaction. Il reçoit une offre d'emploi, répond au même questionnaire pour cette offre, et peut immédiatement comparer les deux scores (globaux et par catégorie) pour savoir objectivement si l'offre représente une amélioration.

## Portée du MVP

- Application web responsive uniquement (pas d'app mobile native pour la V1).
- Liste de critères de confort **prédéfinie**, regroupés par catégorie ; l'utilisateur peut ajuster le **poids d'importance** de chaque critère, mais pas encore créer ses propres critères.
- Calcul et affichage d'un score global /100 + détail par catégorie.
- Sauvegarde de plusieurs évaluations nommées, en **stockage local** (localStorage/IndexedDB) — aucun compte ni backend requis.
- Vue de comparaison entre 2+ évaluations (tableau + visualisation type radar chart).

### Hors MVP (v2+, à discuter)

- Comptes utilisateurs et synchronisation multi-appareil (backend).
- Critères et catégories entièrement personnalisables par l'utilisateur.
- Partage d'un résultat (lien, export PDF).
- Benchmark anonymisé par secteur/métier.
- Historique et suivi de l'évolution du confort dans le temps.
- Application mobile native.

## Stack technique

- **Frontend** : React + TypeScript (Next.js), Tailwind CSS.
- **Stockage MVP** : local (localStorage/IndexedDB), aucun backend.
- **Visualisation** : librairie de graphiques (ex. Recharts) pour le radar chart de comparaison.

## Statut

Direction validée pour le MVP (web only, sans backend, critères prédéfinis avec poids ajustables). Voir les [epics/issues sur GitHub](https://github.com/chainstrument/konforties/milestones) pour le détail.

## Développement

Projet Next.js (App Router) + TypeScript + Tailwind CSS, géré avec pnpm.

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Structure du projet

```
src/
  app/         # Routes et pages (Next.js App Router)
  components/  # Composants UI réutilisables
  lib/         # Logique métier : moteur de scoring, stockage local, etc.
  types/       # Types TypeScript partagés
  data/        # Données statiques (critères et catégories par défaut)
```

`components`, `lib`, `types` et `data` seront peuplés au fil des epics suivants (moteur de scoring, questionnaire, etc.).

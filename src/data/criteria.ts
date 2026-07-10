import type { Category, Criterion } from '@/types/scoring';

export const categories: Category[] = [
  { id: 'remuneration', label: 'Rémunération', defaultWeight: 1 },
  { id: 'work-life-balance', label: 'Équilibre vie pro/perso', defaultWeight: 1 },
  { id: 'management', label: 'Management', defaultWeight: 1 },
  { id: 'benefits', label: 'Avantages', defaultWeight: 1 },
  { id: 'remote-work', label: 'Télétravail', defaultWeight: 1 },
  { id: 'job-security', label: "Sécurité de l'emploi", defaultWeight: 1 },
  { id: 'career-growth', label: 'Évolution de carrière', defaultWeight: 1 },
  { id: 'workload', label: 'Charge de travail', defaultWeight: 1 },
  { id: 'commute', label: 'Trajet / localisation', defaultWeight: 1 },
];

export const criteria: Criterion[] = [
  {
    id: 'remuneration',
    categoryId: 'remuneration',
    label: 'Le salaire correspond à mes attentes.',
  },
  {
    id: 'work-life-balance',
    categoryId: 'work-life-balance',
    label: 'Je parviens à un bon équilibre entre ma vie professionnelle et personnelle.',
  },
  {
    id: 'management',
    categoryId: 'management',
    label: 'Mon management est à l’écoute et me soutient.',
  },
  {
    id: 'benefits',
    categoryId: 'benefits',
    label: 'Les avantages proposés (mutuelle, tickets restaurant, primes...) sont satisfaisants.',
  },
  {
    id: 'remote-work',
    categoryId: 'remote-work',
    label: 'Les possibilités de télétravail répondent à mes besoins.',
  },
  {
    id: 'job-security',
    categoryId: 'job-security',
    label: 'Je me sens en sécurité quant à la pérennité de mon poste.',
  },
  {
    id: 'career-growth',
    categoryId: 'career-growth',
    label: 'J’ai de bonnes perspectives d’évolution de carrière.',
  },
  {
    id: 'workload',
    categoryId: 'workload',
    label: 'Ma charge de travail est raisonnable et gérable.',
  },
  {
    id: 'commute',
    categoryId: 'commute',
    label: 'Le trajet ou la localisation du poste me convient.',
  },
];

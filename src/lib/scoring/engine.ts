import { RATING_MAX, RATING_MIN } from '@/types/scoring';
import type { Answer, Category, Criterion } from '@/types/scoring';

export interface CategoryScore {
  categoryId: string;
  score: number;
}

export interface ScoreResult {
  globalScore: number;
  categoryScores: CategoryScore[];
}

interface WeightedEntry {
  categoryId: string;
  value: number;
  weight: number;
}

function normalizeRating(rating: number): number {
  return ((rating - RATING_MIN) / (RATING_MAX - RATING_MIN)) * 100;
}

function weightedAverage(entries: { value: number; weight: number }[]): number {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0);
  return weightedSum / totalWeight;
}

/**
 * Calcule le score de confort (0-100) à partir des réponses à une évaluation.
 * Chaque réponse est pondérée par son propre poids si défini, sinon par le
 * poids par défaut de sa catégorie. Les catégories sans réponse sont omises
 * de `categoryScores`.
 */
export function computeScore(
  answers: Answer[],
  criteria: Criterion[],
  categories: Category[],
): ScoreResult {
  const criterionById = new Map(criteria.map((criterion) => [criterion.id, criterion]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const entries: WeightedEntry[] = answers.flatMap((answer) => {
    const criterion = criterionById.get(answer.criterionId);
    if (!criterion) return [];
    const category = categoryById.get(criterion.categoryId);
    const weight = answer.weight ?? category?.defaultWeight ?? 1;
    return [{ categoryId: criterion.categoryId, value: normalizeRating(answer.rating), weight }];
  });

  const globalScore = Math.round(weightedAverage(entries));

  const categoryScores: CategoryScore[] = categories.flatMap((category) => {
    const categoryEntries = entries.filter((entry) => entry.categoryId === category.id);
    if (categoryEntries.length === 0) return [];
    return [{ categoryId: category.id, score: Math.round(weightedAverage(categoryEntries)) }];
  });

  return { globalScore, categoryScores };
}

import { describe, expect, it } from 'vitest';

import type { Answer, Category, Criterion } from '@/types/scoring';

import { computeScore } from './engine';

const categories: Category[] = [
  { id: 'a', label: 'Catégorie A', defaultWeight: 1 },
  { id: 'b', label: 'Catégorie B', defaultWeight: 1 },
  { id: 'c', label: 'Catégorie C (jamais répondue)', defaultWeight: 1 },
];

const criteria: Criterion[] = [
  { id: 'c1', categoryId: 'a', label: 'Critère 1' },
  { id: 'c2', categoryId: 'a', label: 'Critère 2' },
  { id: 'c3', categoryId: 'b', label: 'Critère 3' },
  { id: 'c4', categoryId: 'c', label: 'Critère 4' },
];

describe('computeScore', () => {
  it('renvoie 100 quand toutes les notes sont au maximum', () => {
    const answers: Answer[] = [
      { criterionId: 'c1', rating: 5 },
      { criterionId: 'c2', rating: 5 },
      { criterionId: 'c3', rating: 5 },
    ];

    const result = computeScore(answers, criteria, categories);

    expect(result.globalScore).toBe(100);
    expect(result.categoryScores).toEqual([
      { categoryId: 'a', score: 100 },
      { categoryId: 'b', score: 100 },
    ]);
  });

  it('renvoie 0 quand toutes les notes sont au minimum', () => {
    const answers: Answer[] = [
      { criterionId: 'c1', rating: 1 },
      { criterionId: 'c2', rating: 1 },
      { criterionId: 'c3', rating: 1 },
    ];

    const result = computeScore(answers, criteria, categories);

    expect(result.globalScore).toBe(0);
  });

  it('moyenne les notes d’une même catégorie à poids égal', () => {
    const answers: Answer[] = [
      { criterionId: 'c1', rating: 5 }, // 100
      { criterionId: 'c2', rating: 1 }, // 0
      { criterionId: 'c3', rating: 5 }, // 100
    ];

    const result = computeScore(answers, criteria, categories);

    expect(result.categoryScores).toEqual([
      { categoryId: 'a', score: 50 },
      { categoryId: 'b', score: 100 },
    ]);
    expect(result.globalScore).toBe(67); // (100 + 0 + 100) / 3, arrondi
  });

  it('applique le poids de la réponse quand il surcharge le poids par défaut', () => {
    const answers: Answer[] = [
      { criterionId: 'c1', rating: 5, weight: 3 }, // 100, poids 3
      { criterionId: 'c2', rating: 1 }, // 0, poids par défaut 1
      { criterionId: 'c3', rating: 3 }, // 50, poids par défaut 1
    ];

    const result = computeScore(answers, criteria, categories);

    expect(result.categoryScores).toEqual([
      { categoryId: 'a', score: 75 }, // (100*3 + 0*1) / 4
      { categoryId: 'b', score: 50 },
    ]);
    expect(result.globalScore).toBe(70); // (100*3 + 0*1 + 50*1) / 5
  });

  it('omet du détail les catégories sans réponse', () => {
    const answers: Answer[] = [{ criterionId: 'c1', rating: 3 }];

    const result = computeScore(answers, criteria, categories);

    expect(result.categoryScores.map((c) => c.categoryId)).toEqual(['a']);
  });

  it('ignore silencieusement les réponses qui référencent un critère inconnu', () => {
    const answers: Answer[] = [
      { criterionId: 'c1', rating: 5 },
      { criterionId: 'unknown-criterion', rating: 1 },
    ];

    const result = computeScore(answers, criteria, categories);

    expect(result.globalScore).toBe(100);
  });

  it('renvoie un score de 0 et aucun détail par catégorie sans réponse', () => {
    const result = computeScore([], criteria, categories);

    expect(result).toEqual({ globalScore: 0, categoryScores: [] });
  });
});

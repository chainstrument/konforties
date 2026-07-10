import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Evaluation } from '@/types/scoring';

import { ComparisonTable } from './ComparisonTable';
import { ComparisonView } from './ComparisonView';
import { ScoreComparisonRadarChart } from './ScoreComparisonRadarChart';

const evaluations: Evaluation[] = [
  {
    id: 'a',
    name: 'Poste actuel',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    answers: [
      { criterionId: 'remuneration', rating: 4 }, // 75/100, gagne cette catégorie
      { criterionId: 'work-life-balance', rating: 2 }, // 25/100
    ],
  },
  {
    id: 'b',
    name: 'Offre X',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    answers: [
      { criterionId: 'remuneration', rating: 2 }, // 25/100
      { criterionId: 'work-life-balance', rating: 5 }, // 100/100, gagne cette catégorie
    ],
  },
  // b gagne le score global : (25+100)/2=63 contre (75+25)/2=50 pour a
];

describe('ScoreComparisonRadarChart SSR smoke test', () => {
  it('renders an overlay radar without throwing, one series per evaluation', () => {
    const html = renderToStaticMarkup(<ScoreComparisonRadarChart evaluations={evaluations} />);

    expect(html).toContain('recharts-responsive-container');
  });
});

describe('ComparisonTable', () => {
  it('highlights the best score per row (global + each answered category)', () => {
    const html = renderToStaticMarkup(<ComparisonTable evaluations={evaluations} />);

    expect(html).toContain('63/100');
    expect(html).toContain('50/100');

    const bestChoiceMarkers = html.match(/aria-label="Meilleur choix"/g) ?? [];
    // 1 pour le score global (b) + 1 pour rémunération (a) + 1 pour équilibre vie pro/perso (b)
    expect(bestChoiceMarkers).toHaveLength(3);
  });
});

describe('ComparisonView SSR smoke test', () => {
  it('renders its selection prompt without throwing (loading evaluations is client-only)', () => {
    const html = renderToStaticMarkup(<ComparisonView evaluationIds={['a', 'b']} />);

    expect(html).toContain('Sélectionnez au moins 2 évaluations');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Evaluation } from '@/types/scoring';

import { ComparisonView } from './ComparisonView';
import { ScoreComparisonRadarChart } from './ScoreComparisonRadarChart';

const evaluations: Evaluation[] = [
  {
    id: 'a',
    name: 'Poste actuel',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    answers: [
      { criterionId: 'remuneration', rating: 4 },
      { criterionId: 'work-life-balance', rating: 3 },
    ],
  },
  {
    id: 'b',
    name: 'Offre X',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    answers: [
      { criterionId: 'remuneration', rating: 5 },
      { criterionId: 'work-life-balance', rating: 2 },
    ],
  },
];

describe('ScoreComparisonRadarChart SSR smoke test', () => {
  it('renders an overlay radar without throwing, one series per evaluation', () => {
    const html = renderToStaticMarkup(<ScoreComparisonRadarChart evaluations={evaluations} />);

    expect(html).toContain('recharts-responsive-container');
  });
});

describe('ComparisonView SSR smoke test', () => {
  it('renders its selection prompt without throwing (loading evaluations is client-only)', () => {
    const html = renderToStaticMarkup(<ComparisonView evaluationIds={['a', 'b']} />);

    expect(html).toContain('Sélectionnez au moins 2 évaluations');
  });
});

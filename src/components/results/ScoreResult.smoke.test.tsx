import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Answer } from '@/types/scoring';

import { ScoreResult } from './ScoreResult';

describe('ScoreResult SSR smoke test', () => {
  it('renders without throwing, including the radar chart', () => {
    const answers: Answer[] = [
      { criterionId: 'remuneration', rating: 5 },
      { criterionId: 'work-life-balance', rating: 3 },
      { criterionId: 'management', rating: 4 },
      { criterionId: 'benefits', rating: 2 },
      { criterionId: 'remote-work', rating: 5 },
      { criterionId: 'job-security', rating: 3 },
      { criterionId: 'career-growth', rating: 1 },
      { criterionId: 'workload', rating: 4 },
      { criterionId: 'commute', rating: 5 },
    ];

    const html = renderToStaticMarkup(<ScoreResult answers={answers} />);

    expect(html).toContain('/ 100');
    expect(html).toContain('recharts-responsive-container');
  });
});

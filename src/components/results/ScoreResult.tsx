import { categories, criteria } from '@/data/criteria';
import { computeScore } from '@/lib/scoring/engine';
import type { Answer } from '@/types/scoring';

interface ScoreResultProps {
  answers: Answer[];
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Confort excellent';
  if (score >= 60) return 'Bon confort';
  if (score >= 40) return 'Confort moyen';
  return 'Confort faible';
}

export function ScoreResult({ answers }: ScoreResultProps) {
  const { globalScore } = computeScore(answers, criteria, categories);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-1 text-center">
      <p className="text-6xl font-bold tabular-nums">{globalScore}</p>
      <p className="text-zinc-500 dark:text-zinc-400">/ 100</p>
      <p className="mt-2 text-lg font-medium">{getScoreLabel(globalScore)}</p>
    </div>
  );
}

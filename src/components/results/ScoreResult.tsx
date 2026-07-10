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
  const { globalScore, categoryScores } = computeScore(answers, criteria, categories);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-6xl font-bold tabular-nums">{globalScore}</p>
        <p className="text-zinc-500 dark:text-zinc-400">/ 100</p>
        <p className="mt-2 text-lg font-medium">{getScoreLabel(globalScore)}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {categoryScores.map(({ categoryId, score }) => {
          const label = categories.find((c) => c.id === categoryId)?.label ?? categoryId;
          return (
            <div key={categoryId}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
                <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
                  {score}/100
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#b7d3f6] dark:bg-[#184f95]">
                <div
                  className="h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

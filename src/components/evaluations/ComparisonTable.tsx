import { categories, criteria } from '@/data/criteria';
import { computeScore } from '@/lib/scoring/engine';
import type { Evaluation } from '@/types/scoring';

interface ComparisonTableProps {
  evaluations: Evaluation[];
}

const BEST_CHOICE_CLASSES = 'bg-[#0ca30c]/10 text-[#0ca30c] dark:text-[#0ca30c]';

export function ComparisonTable({ evaluations }: ComparisonTableProps) {
  const results = evaluations.map((evaluation) => ({
    evaluation,
    ...computeScore(evaluation.answers, criteria, categories),
  }));

  const maxGlobalScore = Math.max(...results.map((r) => r.globalScore));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-3 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400"
            >
              Critère
            </th>
            {results.map(({ evaluation }) => (
              <th
                key={evaluation.id}
                scope="col"
                className="border-b border-zinc-200 px-3 py-2 text-left font-medium dark:border-zinc-800"
              >
                {evaluation.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            <td className="px-3 py-2 font-semibold">Score global</td>
            {results.map(({ evaluation, globalScore }) => {
              const isBest = globalScore === maxGlobalScore;
              return (
                <td
                  key={evaluation.id}
                  className={`px-3 py-2 font-semibold tabular-nums ${isBest ? BEST_CHOICE_CLASSES : ''}`}
                >
                  {globalScore}/100
                  {isBest && (
                    <span aria-label="Meilleur choix" className="ml-1">
                      ✓
                    </span>
                  )}
                </td>
              );
            })}
          </tr>
          {categories.map((category) => {
            const categoryValues = results.map(
              ({ categoryScores }) =>
                categoryScores.find((c) => c.categoryId === category.id)?.score,
            );
            const definedValues = categoryValues.filter((v): v is number => v !== undefined);
            const maxCategoryScore = definedValues.length > 0 ? Math.max(...definedValues) : null;

            return (
              <tr key={category.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{category.label}</td>
                {results.map(({ evaluation, categoryScores }) => {
                  const score = categoryScores.find((c) => c.categoryId === category.id)?.score;
                  const isBest = score !== undefined && score === maxCategoryScore;
                  return (
                    <td
                      key={evaluation.id}
                      className={`px-3 py-2 tabular-nums ${isBest ? `font-medium ${BEST_CHOICE_CLASSES}` : ''}`}
                    >
                      {score ?? '—'}
                      {isBest && (
                        <span aria-label="Meilleur choix" className="ml-1">
                          ✓
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

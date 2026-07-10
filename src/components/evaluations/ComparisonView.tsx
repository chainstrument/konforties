'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { categories, criteria } from '@/data/criteria';
import { listEvaluations } from '@/lib/evaluations/store';
import { computeScore } from '@/lib/scoring/engine';
import type { Evaluation } from '@/types/scoring';

import { ScoreComparisonRadarChart } from './ScoreComparisonRadarChart';

interface ComparisonViewProps {
  evaluationIds: string[];
}

export function ComparisonView({ evaluationIds }: ComparisonViewProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const all = listEvaluations();
    const found = evaluationIds
      .map((id) => all.find((e) => e.id === id))
      .filter((e): e is Evaluation => e !== undefined);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvaluations(found);
  }, [evaluationIds]);

  if (evaluations.length < 2) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Sélectionnez au moins 2 évaluations à comparer depuis{' '}
        <Link href="/evaluations" className="underline">
          la liste de vos évaluations
        </Link>
        .
      </p>
    );
  }

  const results = evaluations.map((evaluation) => ({
    evaluation,
    ...computeScore(evaluation.answers, criteria, categories),
  }));

  return (
    <div className="flex flex-col gap-8">
      <ScoreComparisonRadarChart evaluations={evaluations} />

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
              {results.map(({ evaluation, globalScore }) => (
                <td key={evaluation.id} className="px-3 py-2 font-semibold tabular-nums">
                  {globalScore}/100
                </td>
              ))}
            </tr>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{category.label}</td>
                {results.map(({ evaluation, categoryScores }) => {
                  const score = categoryScores.find((c) => c.categoryId === category.id)?.score;
                  return (
                    <td key={evaluation.id} className="px-3 py-2 tabular-nums">
                      {score ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

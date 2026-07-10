'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { categories, criteria } from '@/data/criteria';
import { listEvaluations } from '@/lib/evaluations/store';
import { computeScore } from '@/lib/scoring/engine';
import type { Evaluation } from '@/types/scoring';

export function EvaluationsList() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvaluations(listEvaluations());
  }, []);

  if (evaluations.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Aucune évaluation enregistrée pour l’instant.{' '}
        <Link href="/" className="underline">
          Commencer le questionnaire
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {evaluations.map((evaluation) => {
        const { globalScore } = computeScore(evaluation.answers, criteria, categories);
        return (
          <li
            key={evaluation.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <div>
              <p className="font-medium">{evaluation.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mise à jour le {new Date(evaluation.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {globalScore}
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">/100</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

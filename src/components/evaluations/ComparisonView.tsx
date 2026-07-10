'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { listEvaluations } from '@/lib/evaluations/store';
import type { Evaluation } from '@/types/scoring';

import { ComparisonTable } from './ComparisonTable';
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

  return (
    <div className="flex flex-col gap-8">
      <ScoreComparisonRadarChart evaluations={evaluations} />
      <ComparisonTable evaluations={evaluations} />
    </div>
  );
}

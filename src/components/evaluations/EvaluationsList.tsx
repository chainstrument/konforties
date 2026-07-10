'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { categories, criteria } from '@/data/criteria';
import {
  deleteEvaluation,
  duplicateEvaluation,
  listEvaluations,
  renameEvaluation,
} from '@/lib/evaluations/store';
import { computeScore } from '@/lib/scoring/engine';
import type { Evaluation } from '@/types/scoring';

export function EvaluationsList() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvaluations(listEvaluations());
  }, []);

  function refresh() {
    setEvaluations(listEvaluations());
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleRename(evaluation: Evaluation) {
    const name = window.prompt('Nouveau nom de l’évaluation', evaluation.name);
    if (!name || !name.trim()) return;
    renameEvaluation(evaluation.id, name.trim());
    refresh();
  }

  function handleDuplicate(evaluation: Evaluation) {
    duplicateEvaluation(evaluation.id);
    refresh();
  }

  function handleDelete(evaluation: Evaluation) {
    if (!window.confirm(`Supprimer « ${evaluation.name} » ?`)) return;
    deleteEvaluation(evaluation.id);
    refresh();
  }

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
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {evaluations.map((evaluation) => {
          const { globalScore } = computeScore(evaluation.answers, criteria, categories);
          return (
            <li
              key={evaluation.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(evaluation.id)}
                  onChange={() => toggleSelected(evaluation.id)}
                  aria-label={`Sélectionner ${evaluation.name} pour la comparaison`}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium">{evaluation.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Mise à jour le {new Date(evaluation.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold tabular-nums">
                  {globalScore}
                  <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">/100</span>
                </p>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => handleRename(evaluation)}
                    className="text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(evaluation)}
                    className="text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
                  >
                    Dupliquer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(evaluation)}
                    className="text-red-600 underline-offset-2 hover:underline dark:text-red-400"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {evaluations.length >= 2 && (
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800">
          <span className="text-zinc-600 dark:text-zinc-400">
            {selectedIds.length} évaluation{selectedIds.length > 1 ? 's' : ''} sélectionnée
            {selectedIds.length > 1 ? 's' : ''}
          </span>
          {selectedIds.length >= 2 ? (
            <Link
              href={`/evaluations/compare?ids=${selectedIds.join(',')}`}
              className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Comparer
            </Link>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-600">
              Sélectionnez au moins 2 évaluations
            </span>
          )}
        </div>
      )}
    </div>
  );
}

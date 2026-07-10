'use client';

import { useEffect, useState } from 'react';

import { categories, criteria } from '@/data/criteria';
import { clearDraft, loadDraft, saveDraft } from '@/lib/questionnaire/draft';
import { ScoreResult } from '@/components/results/ScoreResult';
import type { Answer, Rating } from '@/types/scoring';

interface StepAnswer {
  rating: Rating | null;
  weight: number;
}

const RATINGS: Rating[] = [1, 2, 3, 4, 5];

const DEFAULT_WEIGHT = 2;

const IMPORTANCE_LEVELS: { label: string; weight: number }[] = [
  { label: 'Peu important', weight: 1 },
  { label: 'Important', weight: 2 },
  { label: 'Très important', weight: 3 },
];

export function QuestionnaireForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StepAnswer>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage n'est disponible qu'après le montage côté client : on ne peut pas
    // lire le brouillon pendant le rendu initial (SSR) sans provoquer un mismatch
    // d'hydratation, donc on l'applique ici et on tolère le re-rendu que ça déclenche.
    const draft = loadDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIndex(Math.min(draft.stepIndex, criteria.length));
      setAnswers(draft.answers as Record<string, StepAnswer>);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft({ stepIndex, answers });
  }, [hydrated, stepIndex, answers]);

  const isComplete = stepIndex >= criteria.length;

  useEffect(() => {
    if (isComplete) clearDraft();
  }, [isComplete]);

  function restart() {
    clearDraft();
    setAnswers({});
    setStepIndex(0);
  }

  if (isComplete) {
    const finalAnswers: Answer[] = criteria.flatMap((criterion) => {
      const answer = answers[criterion.id];
      if (!answer?.rating) return [];
      return [{ criterionId: criterion.id, rating: answer.rating, weight: answer.weight }];
    });

    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Merci d’avoir répondu au questionnaire !</h1>
        <ScoreResult answers={finalAnswers} />
        <button
          type="button"
          onClick={restart}
          className="rounded-full border border-zinc-300 px-6 py-2 font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          Recommencer
        </button>
      </div>
    );
  }

  const criterion = criteria[stepIndex];
  const category = categories.find((c) => c.id === criterion.categoryId);
  const currentAnswer = answers[criterion.id];
  const currentRating = currentAnswer?.rating ?? null;
  const currentWeight = currentAnswer?.weight ?? DEFAULT_WEIGHT;

  function selectRating(rating: Rating) {
    setAnswers((prev) => ({
      ...prev,
      [criterion.id]: { rating, weight: prev[criterion.id]?.weight ?? DEFAULT_WEIGHT },
    }));
  }

  function selectWeight(weight: number) {
    setAnswers((prev) => ({
      ...prev,
      [criterion.id]: { rating: prev[criterion.id]?.rating ?? null, weight },
    }));
  }

  function goNext() {
    setStepIndex((i) => i + 1);
  }

  function goPrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Question {stepIndex + 1} / {criteria.length}
      </p>

      <div>
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {category?.label}
        </p>
        <h1 className="mt-2 text-xl font-semibold">{criterion.label}</h1>
      </div>

      <div className="flex justify-between gap-2">
        {RATINGS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => selectRating(rating)}
            aria-pressed={currentRating === rating}
            className={`flex h-12 w-12 items-center justify-center rounded-full border text-lg font-medium transition-colors ${
              currentRating === rating
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                : 'border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Quelle importance ce critère a-t-il pour vous ?
        </p>
        <div className="mt-2 flex gap-2">
          {IMPORTANCE_LEVELS.map((level) => (
            <button
              key={level.weight}
              type="button"
              onClick={() => selectWeight(level.weight)}
              aria-pressed={currentWeight === level.weight}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                currentWeight === level.weight
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                  : 'border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="rounded-full border border-zinc-300 px-6 py-2 font-medium text-zinc-700 transition-opacity disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={currentRating === null}
          className="rounded-full bg-zinc-900 px-6 py-2 font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

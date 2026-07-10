'use client';

import { useState } from 'react';

import { categories, criteria } from '@/data/criteria';
import type { Rating } from '@/types/scoring';

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

  const isComplete = stepIndex >= criteria.length;

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Merci d’avoir répondu au questionnaire !</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Le calcul et l’affichage de votre score arrivent dans une prochaine étape.
        </p>
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

      <button
        type="button"
        onClick={goNext}
        className="self-end rounded-full bg-zinc-900 px-6 py-2 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      >
        Suivant
      </button>
    </div>
  );
}

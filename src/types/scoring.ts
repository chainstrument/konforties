export const RATING_MIN = 1;
export const RATING_MAX = 5;

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Category {
  id: string;
  label: string;
  /** Poids par défaut de la catégorie dans le calcul du score, ajustable par l'utilisateur. */
  defaultWeight: number;
}

export interface Criterion {
  id: string;
  categoryId: string;
  label: string;
  description?: string;
}

export interface Answer {
  criterionId: string;
  rating: Rating;
  /** Surcharge le poids par défaut de la catégorie pour ce critère. */
  weight?: number;
}

export interface Evaluation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
}

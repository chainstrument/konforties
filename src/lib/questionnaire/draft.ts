export interface QuestionnaireDraftAnswer {
  rating: number | null;
  weight: number;
}

export interface QuestionnaireDraft {
  stepIndex: number;
  answers: Record<string, QuestionnaireDraftAnswer>;
  updatedAt: string;
}

const STORAGE_KEY = 'konforties:questionnaire-draft';

export function saveDraft(draft: Omit<QuestionnaireDraft, 'updatedAt'>): void {
  const payload: QuestionnaireDraft = { ...draft, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadDraft(): QuestionnaireDraft | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuestionnaireDraft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

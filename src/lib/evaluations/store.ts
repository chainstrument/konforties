import type { Answer, Evaluation } from '@/types/scoring';

const STORAGE_KEY = 'konforties:evaluations';

function readAll(): Evaluation[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Evaluation[];
  } catch {
    return [];
  }
}

function writeAll(evaluations: Evaluation[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
}

export function listEvaluations(): Evaluation[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveEvaluation(name: string, answers: Answer[]): Evaluation {
  const now = new Date().toISOString();
  const evaluation: Evaluation = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    answers,
  };
  writeAll([...readAll(), evaluation]);
  return evaluation;
}

export function renameEvaluation(id: string, name: string): void {
  const now = new Date().toISOString();
  writeAll(readAll().map((e) => (e.id === id ? { ...e, name, updatedAt: now } : e)));
}

export function duplicateEvaluation(id: string): Evaluation | undefined {
  const all = readAll();
  const original = all.find((e) => e.id === id);
  if (!original) return undefined;

  const now = new Date().toISOString();
  const copy: Evaluation = {
    ...original,
    id: crypto.randomUUID(),
    name: `${original.name} (copie)`,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...all, copy]);
  return copy;
}

export function deleteEvaluation(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
}

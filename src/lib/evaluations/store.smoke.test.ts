import { beforeEach, describe, expect, it } from 'vitest';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  clear() {
    this.store.clear();
  }
}

(globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
  localStorage: new MemoryStorage(),
};

const { deleteEvaluation, duplicateEvaluation, listEvaluations, renameEvaluation, saveEvaluation } =
  await import('@/lib/evaluations/store');

beforeEach(() => {
  (
    globalThis as unknown as { window: { localStorage: MemoryStorage } }
  ).window.localStorage.clear();
});

describe('evaluations store smoke test', () => {
  it('saves, lists, renames, duplicates and deletes', () => {
    const a = saveEvaluation('Poste actuel', [{ criterionId: 'remuneration', rating: 4 }]);
    const b = saveEvaluation('Offre X', [{ criterionId: 'remuneration', rating: 5 }]);

    expect(listEvaluations().map((e) => e.name)).toEqual(
      expect.arrayContaining(['Poste actuel', 'Offre X']),
    );

    renameEvaluation(a.id, 'Poste actuel (renommé)');
    expect(listEvaluations().find((e) => e.id === a.id)?.name).toBe('Poste actuel (renommé)');

    const dup = duplicateEvaluation(b.id);
    expect(dup?.name).toBe('Offre X (copie)');
    expect(listEvaluations()).toHaveLength(3);

    deleteEvaluation(b.id);
    expect(listEvaluations().find((e) => e.id === b.id)).toBeUndefined();
    expect(listEvaluations()).toHaveLength(2);
  });
});

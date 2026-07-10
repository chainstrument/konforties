import { EvaluationsList } from '@/components/evaluations/EvaluationsList';

export default function EvaluationsPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <h1 className="text-2xl font-semibold">Mes évaluations</h1>
        <EvaluationsList />
      </div>
    </main>
  );
}

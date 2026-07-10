import { ComparisonView } from '@/components/evaluations/ComparisonView';

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { ids } = await searchParams;
  const evaluationIds = ids ? ids.split(',').filter(Boolean) : [];

  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <h1 className="text-2xl font-semibold">Comparaison des évaluations</h1>
        <ComparisonView evaluationIds={evaluationIds} />
      </div>
    </main>
  );
}

import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <QuestionnaireForm />
    </main>
  );
}

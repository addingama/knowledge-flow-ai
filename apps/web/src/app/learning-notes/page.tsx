import { LearningNoteGenerator } from
  "@/components/learning-notes/learning-note-generator";

export default function LearningNotesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Knowledge Flow AI
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Learning Note Generator
          </h1>

          <p className="text-slate-600 dark:text-slate-400">
            Transform any learning topic into structured
            notes powered by AI.
          </p>
        </header>

        <LearningNoteGenerator />
      </div>
    </main>
  );
}
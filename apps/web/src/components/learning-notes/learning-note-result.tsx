import type { LearningNote } from "@repo/shared";

interface LearningNoteResultProps {
  note: LearningNote;
}

export function LearningNoteResult({
  note,
}: LearningNoteResultProps) {
  return (
    <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">
            {note.title}
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            {note.difficulty}
          </span>
        </div>

        <p className="leading-7 text-slate-600 dark:text-slate-300">
          {note.summary}
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">
          Key Concepts
        </h3>

        <div className="flex flex-wrap gap-2">
          {note.keyConcepts.map((concept: string, index: number) => (
            <span
              key={`${concept}-${index}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800"
            >
              {concept}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">
          Code Example
        </h3>

        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
          <code>{note.codeExample}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">
          Key Takeaways
        </h3>

        <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
          {note.takeaways.map((takeaway: string, index: number) => (
            <li key={index}>{takeaway}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">
          Next Actions
        </h3>

        <ol className="list-decimal space-y-2 pl-5 text-slate-600 dark:text-slate-300">
          {note.nextActions.map((action: string, index: number) => (
            <li key={index}>{action}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
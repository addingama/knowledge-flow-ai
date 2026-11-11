import { Chat } from "@/components/chat";


export default function ChatPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Knowledge Flow AI
          </h1>

          <p className="mt-2 text-slate-400">
            Streaming LLM Chat
          </p>
        </div>

        <Chat />
      </div>
    </main>
  );
}
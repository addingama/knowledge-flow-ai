"use client";

import { useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isStreaming) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const assistantId = crypto.randomUUID();

    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      },
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    setInput("");
    setIsStreaming(true);

    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((previous) =>
          previous.map((item) =>
            item.id === assistantId
              ? { ...item, content: item.content + chunk }
              : item,
          ),
        );
      }

      const remaining = decoder.decode();

      if (remaining) {
        setMessages((previous) =>
          previous.map((item) =>
            item.id === assistantId
              ? { ...item, content: item.content + remaining }
              : item,
          ),
        );
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      console.error("Chat streaming error:", error);

      setMessages((previous) =>
        previous.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                content: item.content
                  ? `${item.content}\n\n[Response interrupted]`
                  : "Unable to generate a response.",
              }
            : item,
        ),
      );
    } finally {
      await reader?.cancel().catch(() => {});
      controllerRef.current = null;
      setIsStreaming(false);
    }
  }

  function stopGeneration() {
    controllerRef.current?.abort();
  }

  console.log(input)

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-center text-slate-400">
            Ask anything to start a conversation.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-4 ${
              message.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-slate-800 text-slate-100"
            }`}
          >
            {message.content ||
              (isStreaming ? "Generating..." : "")}
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex gap-3 border-t border-slate-800 p-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
          maxLength={4000}
          disabled={isStreaming}
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stopGeneration}
            className="rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
import { ChatView } from "@/components/assistente/chat-view";

export default function AssistentePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Assistente</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Sua secretária: prioriza demandas, sugere horários e ajuda a
          redigir mensagens.
        </p>
      </div>
      <ChatView />
    </div>
  );
}

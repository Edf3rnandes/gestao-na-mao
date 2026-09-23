"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleHeart, Send } from "lucide-react";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

const SUGESTOES = [
  "O que eu não posso esquecer hoje?",
  "Me ajuda a priorizar minhas demandas de hoje",
  "Escreve uma mensagem de WhatsApp confirmando um horário",
  "Onde eu tenho tempo livre essa semana?",
];

export function ChatView() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [pending, setPending] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, pending]);

  async function enviar(conteudo: string) {
    const texto2 = conteudo.trim();
    if (!texto2 || pending) return;

    const novasMensagens: Mensagem[] = [
      ...mensagens,
      { role: "user", content: texto2 },
    ];
    setMensagens(novasMensagens);
    setTexto("");
    setErro(null);
    setPending(true);

    try {
      const resposta = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: novasMensagens }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.error ?? "Erro ao falar com a assistente.");
        return;
      }

      setMensagens((prev) => [
        ...prev,
        { role: "assistant", content: dados.resposta },
      ]);
    } catch {
      setErro("Não consegui conectar com a assistente. Tenta de novo.");
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    enviar(texto);
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex-1 overflow-y-auto p-4">
        {mensagens.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <MessageCircleHeart size={32} className="text-neutral-300 dark:text-neutral-700" />
            <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
              Pergunte sobre suas demandas, sua agenda, ou peça ajuda pra
              organizar o dia e redigir mensagens.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mensagens.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                digitando...
              </div>
            </div>
          )}
          {erro && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {erro}
              </div>
            </div>
          )}
        </div>
        <div ref={fimRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800"
      >
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar(texto);
            }
          }}
          rows={1}
          placeholder="Escreva pra sua assistente..."
          className="flex-1 resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={pending || !texto.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-900"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

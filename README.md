# Gestão na Mão

Sistema pessoal para acompanhar demandas (pessoais e empresariais), rotina
semanal e agenda do dia num único lugar — uma base tipo Trello, só que
integrada com planejamento diário.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) para dados e login
- dnd-kit para o drag-and-drop do quadro de demandas
- API da Anthropic (Claude) para a assistente de chat

## Rodando localmente

```bash
npm install
npm run dev
```

Crie um `.env.local` (veja `.env.example`) com a URL e a chave pública do
seu projeto Supabase, e uma `ANTHROPIC_API_KEY` (console.anthropic.com)
para a assistente de chat funcionar.

## Banco de dados

As tabelas (`demandas`, `rotina_semanal`, `eventos`, `treinos`,
`treino_exercicios`, `treino_sessoes`) vivem no schema `public` do projeto
Supabase e têm RLS habilitado: cada usuário só enxerga os próprios
registros (`auth.uid() = user_id`).

## O que já existe

- **Demandas**: quadro estilo Kanban (Backlog / Fazendo / Feito), com
  categoria (pessoal/empresarial), prioridade, vencimento e "próxima ação".
- **Planner**: visões Dia / Semana / Mês combinando rotina semanal fixa
  (trabalho, treino, alimentação...) com eventos pontuais. A visão do dia
  destaca os horários livres; a semana e o mês também mostram os
  vencimentos de demandas em cada data.
- **Visão do dia**: dashboard com o que está atrasado, o que vence hoje,
  o que está em andamento, a agenda do dia e um aviso quando hoje tem
  treino marcado na rotina/eventos.
- **Treino**: planos de treino com lista de exercícios (séries, repetições,
  carga, descanso) e histórico de sessões registradas.
- **Assistente**: chat (Claude, via API da Anthropic) com contexto ao vivo
  das demandas em aberto e da agenda do dia — ajuda a priorizar, sugerir
  horários e redigir mensagens. Precisa de `ANTHROPIC_API_KEY` configurada
  no servidor.

## Próximos passos sugeridos

- Dar memória de conversas à assistente (hoje o histórico do chat vive só
  na sessão do navegador).

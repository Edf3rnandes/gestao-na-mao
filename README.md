# Gestão na Mão

Sistema pessoal para acompanhar demandas (pessoais e empresariais), rotina
semanal e agenda do dia num único lugar — uma base tipo Trello, só que
integrada com planejamento diário.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) para dados e login
- dnd-kit para o drag-and-drop do quadro de demandas

## Rodando localmente

```bash
npm install
npm run dev
```

Crie um `.env.local` (veja `.env.example`) com a URL e a chave pública do
seu projeto Supabase.

## Banco de dados

As tabelas (`demandas`, `rotina_semanal`, `eventos`) vivem no schema
`public` do projeto Supabase e têm RLS habilitado: cada usuário só enxerga
os próprios registros (`auth.uid() = user_id`).

## O que já existe

- **Demandas**: quadro estilo Kanban (Backlog / Fazendo / Feito), com
  categoria (pessoal/empresarial), prioridade, vencimento e "próxima ação".
- **Planner**: visões Dia / Semana / Mês combinando rotina semanal fixa
  (trabalho, treino, alimentação...) com eventos pontuais. A visão do dia
  destaca os horários livres; a semana e o mês também mostram os
  vencimentos de demandas em cada data.
- **Visão do dia**: dashboard com o que está atrasado, o que vence hoje,
  o que está em andamento e a agenda do dia.

## Próximos passos sugeridos

- Planejamento de treinos (séries, cargas, progressão)
- Assistente/secretária integrada (chat) para sugerir prioridades e redigir
  mensagens a partir das demandas

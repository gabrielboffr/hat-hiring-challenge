# README_CANDIDATO

## Resumo

Implementacao do Challenge 03 com NestJS + Prisma para precificacao de propostas, incluindo validacao de margem, desconto em cascata por nivel de aprovador e historico de aprovacoes.

## Endpoints

- POST /propostas
- GET /propostas
- GET /propostas/:id
- POST /propostas/:id/aplicar-desconto
- GET /tabela-precos

## Regras de Negocio

- Margem < 40%: DENIED
- Margem entre 40% e 45%: PENDING
- Margem > 45%: APPROVED
- Desconto acumulado nao pode ultrapassar o limite do aprovador atual
- Todos os calculos monetarios usam Decimal

## Particularidades do Projeto

- Filtros mantidos em ingles por padrao de contrato da API: client, status, startDate, endDate
- Historico de aprovacao registrado por cargo (approverLevel), sem nome de usuario

## Dados de Seed

- Tabela de precos base
- Tabela de limites de desconto por cargo
- Profissionais demo para facilitar validacao no Swagger sem setup manual

## Testes

- Jest com testes unitarios em controller, service e repository
- Cenarios obrigatorios do challenge cobertos:
  - margem exatamente em 40%
  - desconto acima do limite
  - proposta com zero horas
- Cobertura (escopo de negocio): 84.48% de linhas

## Melhorias que podem ser feitas

- Reforcar validacoes de DTO (IsNumber, IsPositive, IsDateString, etc.)
- Adicionar auditoria nominal de aprovador (approverId/approverName), se exigido

## Como rodar

1. pnpm install
2. pnpm exec prisma migrate dev
3. pnpm exec prisma db seed
4. pnpm run start:dev
5. Swagger: http://localhost:3000/api

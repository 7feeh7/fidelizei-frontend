# React + Vite Boilerplate

Base para novos produtos: React 18, TypeScript, Vite, MUI 5, React Router 6, React Query 3, React Hook Form + Yup e Axios.
Já vem com login, recuperação de senha, rotas protegidas, layout com menu e uma página de exemplo (tabela com busca e exclusão).

## Começando

```bash
yarn
yarn dev
```

Em desenvolvimento o app roda com **mock** (`VITE_APP_MOCK_API=true` em `.env.development`): qualquer email válido e senha com 8+ caracteres entram.

## Personalização rápida — `src/app.config.ts`

| Opção              | Valores                                         | O que faz                                                                 |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------- |
| `name`             | texto                                           | Nome do produto (título da aba, textos)                                   |
| `logo.full`        | caminho em `public/`                            | Logo grande das telas de login                                            |
| `logo.compact`     | caminho em `public/`                            | Logo da barra superior                                                    |
| `auth.layout`      | `"split"` \| `"centered"`                       | `split`: logo de um lado, formulário do outro. `centered`: card no centro |
| `auth.formSide`    | `"right"` \| `"left"`                           | Lado do formulário no `split` (a logo fica no lado oposto)                |
| `menu.layout`      | `"vertical"` \| `"horizontal"`                  | Menu lateral ou na barra superior                                         |
| `menu.width`       | número (px)                                     | Largura do menu vertical                                                  |
| `content.maxWidth` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `false` | Largura máxima do conteúdo                                                |

No mobile (abaixo de `md`) o login `split` vira `centered` e os dois menus viram um drawer aberto pelo botão hambúrguer.

Uma tela pode fugir do padrão passando props: `<AuthContainer layout="centered">`.

## Outras personalizações

- **Cores**: `src/theme/colors.ts` (o tema MUI em `src/theme/themeConfig.ts` lê daqui).
- **Logos**: troque `public/logo.svg`, `public/logo-min.svg` e `public/favicon.svg`.
- **Itens do menu**: `src/routes/menu.tsx` (os mesmos itens servem para o menu vertical e o horizontal).
- **Nome do pacote**: `name` no `package.json` é usado como prefixo das chaves do `localStorage`.

## Criando uma página nova

1. Crie o componente em `src/pages/MinhaPagina.tsx`.
2. Adicione a rota em `src/routes/siteMap.ts` (`protected.minhaPagina: "/minha-pagina"`).
3. Registre em `src/routes/index.tsx`, dentro de `<Route element={<ProtectedMiddleware />}>`.
4. Se for aparecer no menu, adicione em `src/routes/menu.tsx`.

`src/pages/Example.tsx` serve de modelo (React Query, tabela, busca com debounce, diálogo de confirmação, snackbar).

## API e autenticação

- `src/services/api.ts`: instância Axios em `<VITE_APP_API_URL>` (em dev, `/api/` com proxy para a API). O token é enviado como `Authorization: Bearer`. Resposta `401` desloga o usuário.
- `src/services/auth.ts`: endpoints de login e senha (ajuste para a API do produto). O login espera `{ access_token, refresh_token?, user }` (`src/interfaces/auth.ts`).
- `src/services/mocks/`: respostas falsas usadas quando `VITE_APP_MOCK_API=true`.
- `src/contexts/AuthContext.tsx`: `useAuth()` expõe `user`, `isAuthenticated`, `signIn` e `signOut`.
- `src/middlewares/`: `ProtectedRoutes` exige login (e guarda a rota de origem); `UnProtectedRoutes` tira o usuário logado das telas de login.

## Variáveis de ambiente

| Variável            | Descrição                         |
| ------------------- | --------------------------------- |
| `VITE_APP_API_URL`  | URL base da API, com `/` no final |
| `VITE_APP_MOCK_API` | `true` para usar os mocks         |

Arquivos: `.env.development` (`yarn dev`), `.env.homolog` (`yarn build:homolog`), `.env.production` (`yarn build:prod`). Para sobrescrever na sua máquina sem commitar, crie `.env.development.local`. Modelo em `.env.example`.

## Documentação

- [Deploy na AWS (S3 + CloudFront)](docs/deploy.md)

## Scripts

| Script               | Descrição                               |
| -------------------- | --------------------------------------- |
| `yarn dev`           | Servidor de desenvolvimento             |
| `yarn typecheck`     | Checagem de tipos (`tsc`)               |
| `yarn lint`          | ESLint (falha com qualquer warning)     |
| `yarn build:homolog` | Typecheck + build com `.env.homolog`    |
| `yarn build:prod`    | Typecheck + build com `.env.production` |
| `yarn preview`       | Serve o build localmente                |

## Estrutura

```
src/
  app.config.ts      configuração central (layout, logos, nome)
  config.ts          variáveis de ambiente e chaves de storage
  components/        componentes reutilizáveis (forms, dialogs, tabelas, menu, toolbar)
  containers/        layouts (AuthContainer, AuthBox, ProtectedContainer, MainContainer)
  contexts/          AuthContext, SnackbarContext
  hooks/             useQueryParams, storage (localStorage)
  interfaces/        tipos compartilhados
  middlewares/       guardas de rota
  pages/             telas
  routes/            rotas, siteMap e itens do menu
  services/          api, serviços e mocks
  theme/             cores e tema MUI
  utils/             helpers
  validators/        schemas Yup
```

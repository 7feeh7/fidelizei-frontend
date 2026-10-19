# Deploy na AWS (S3 + CloudFront)

Produção serve os arquivos estáticos do build Vite em um **bucket S3 privado**, expostos na internet por **CloudFront** (HTTPS). A API continua na Lambda ([fidelize-api](https://github.com/7feeh7/fidelize-api)).

## Quem faz o quê

|                     | Terraform (manual, na sua máquina)       | GitHub Actions (automático, push na `main`)                |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Quando roda         | Ao criar a infra e quando ela mudar      | A cada push na `main`                                      |
| O que faz           | Cria/altera S3, CloudFront, IAM          | Lint, typecheck, build, sync no S3, invalidação CloudFront |
| Arquivos do site    | Só um `index.html` provisório na criação | **Sim** (`aws s3 sync` + `index.html`)                     |
| URL da API no build | Não                                      | **Sim** (vem de `.env.production` no repositório)          |

O Terraform ignora mudanças no `index.html` do bucket (`lifecycle.ignore_changes` em [`infra/main.tf`](../infra/main.tf)). Rodar `terraform apply` de novo **não** desfaz o que o GitHub publicou.

## Estrutura

```
infra/
├── bootstrap/               # roda uma vez: bucket S3 do state
├── main.tf                  # S3, CloudFront (OAC), IAM do GitHub
├── outputs.tf               # URL do site, bucket, distribution id, role
├── providers.tf             # conexão com a AWS (us-east-1)
├── versions.tf              # versões do Terraform e dos plugins
└── backend.tf               # onde o state fica guardado (S3)
```

## Pipeline ([`.github/workflows/pipeline.yml`](../.github/workflows/pipeline.yml))

1. **ci**: `yarn lint`, `yarn typecheck` (em push e PR)
2. **deploy** (só em push na `main`):
   1. `yarn build:prod` gera `dist/`
   2. login na AWS via OIDC (role `fidelizei-frontend-github-deploy`)
   3. `aws s3 sync` (assets com cache longo, sem `index.html`)
   4. `aws s3 cp` do `index.html` com `max-age=0`
   5. `aws cloudfront create-invalidation --paths "/*"`

A role do GitHub só pode listar/gravar/apagar objetos no bucket do site e invalidar cache desta distribution.

### Secrets e variables do GitHub

**Settings → Secrets and variables → Actions**:

| Tipo     | Nome                         | Valor                                            |
| -------- | ---------------------------- | ------------------------------------------------ |
| Secret   | `AWS_ROLE_ARN`               | output `github_deploy_role_arn` do Terraform     |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` | output `cloudfront_distribution_id` do Terraform |

## Comandos do dia a dia

Mudar a infra (CloudFront, bucket, permissões):

```bash
cd infra
terraform plan
terraform apply
```

Publicar o build manualmente, sem o GitHub:

```bash
yarn build:prod
aws s3 sync dist/ s3://fidelizei-frontend-7feeh7/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"
aws s3 cp dist/index.html s3://fidelizei-frontend-7feeh7/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html; charset=utf-8"
aws cloudfront create-invalidation --distribution-id SEU_ID --paths "/*"
```

## Desenvolvimento local

Nada muda:

1. `yarn dev` com `.env.development` (proxy `/api` para a API local).
2. `yarn build:prod` usa `.env.production` (`VITE_APP_API_URL` apontando para a API em produção).

## Build de produção

```bash
yarn build:prod
```

Saída: pasta `dist/` (HTML, JS e CSS com hash nos nomes dos arquivos).

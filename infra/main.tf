# Infraestrutura do frontend. Roda MANUALMENTE (terraform apply), só quando:
#   - for criar tudo pela primeira vez, ou
#   - for mudar a infra (CloudFront, bucket, permissões...).
# Os arquivos estáticos NÃO são publicados aqui: quem publica é o GitHub Actions a cada push na main.

locals {
  name = "fidelizei-frontend"

  site_bucket = "fidelizei-frontend-7feeh7"

  github_repo     = "7feeh7/fidelizei-frontend"
  github_owner_id = "20801260"
  github_repo_id  = "1422902811"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# ------------------------------------------------------------
# S3: arquivos estáticos (bucket privado)
# ------------------------------------------------------------

resource "aws_s3_bucket" "site" {
  bucket = local.site_bucket
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Usado só para CRIAR o objeto (a AWS precisa de algo no bucket).
# O GitHub Actions troca pelo build real; o Terraform não mexe depois.
resource "aws_s3_object" "placeholder_index" {
  bucket       = aws_s3_bucket.site.id
  key          = "index.html"
  content_type = "text/html; charset=utf-8"
  content      = <<-HTML
    <!doctype html>
    <html lang="pt-BR">
      <head><meta charset="UTF-8" /><title>Deploy pendente</title></head>
      <body><p>Deploy pendente</p></body>
    </html>
  HTML

  lifecycle {
    ignore_changes = [content, etag, source]
  }
}

# ------------------------------------------------------------
# CloudFront: HTTPS público + leitura do S3 via OAC
# ------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = local.name
  description                       = "OAC for ${local.name} S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.name
  default_root_object = "index.html"
  price_class         = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [aws_s3_bucket_public_access_block.site]
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontServicePrincipal"
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }
      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.site.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.site.arn
        }
      }
    }]
  })

  depends_on = [aws_s3_bucket_public_access_block.site]
}

# ------------------------------------------------------------
# Deploy pelo GitHub Actions (sem chave/senha, via OIDC)
# ------------------------------------------------------------

# Já existe na conta (criado pelo fidelize-api). Só referencia.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_deploy" {
  name = "${local.name}-github-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
        Action    = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = [
              "repo:${local.github_repo}:ref:refs/heads/main",
              "repo:7feeh7@${local.github_owner_id}/fidelizei-frontend@${local.github_repo_id}:ref:refs/heads/main",
            ]
          }
        }
      },
      {
        Effect    = "Allow"
        Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
        Action    = "sts:TagSession"
      },
    ]
  })
}

resource "aws_iam_role_policy" "github_deploy" {
  name = "publish-static-site"
  role = aws_iam_role.github_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
        ]
        Resource = aws_s3_bucket.site.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
        ]
        Resource = "${aws_s3_bucket.site.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
        ]
        Resource = aws_cloudfront_distribution.site.arn
      },
    ]
  })
}

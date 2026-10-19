# Bootstrap: roda UMA vez, na sua máquina, com usuário admin da AWS, antes do infra/.
# Cria o bucket S3 onde o Terraform do infra/ guarda o state.

locals {
  state_bucket = "fidelizei-frontend-tfstate-7feeh7"
}

resource "aws_s3_bucket" "state" {
  bucket = local.state_bucket
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

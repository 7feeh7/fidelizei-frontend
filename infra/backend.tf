terraform {
  backend "s3" {
    bucket       = "fidelizei-frontend-tfstate-7feeh7"
    key          = "fidelizei-frontend/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}

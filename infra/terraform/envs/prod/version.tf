terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  backend "s3" {
    bucket  = "d-hori-health-planet-client-tfstate"
    region  = "ap-northeast-1"
    key     = "prod/terraform.tfstate"
    encrypt = true
    profile = "hobby"
  }
}

module "web-s3" {
  source  = "../../modules/s3"
  service = var.service
  env     = var.env
}

module "cf" {
  source  = "../../modules/cf"
  service = var.service
  env     = var.env

  bucket_id                   = module.web-s3.id
  bucket_arn                  = module.web-s3.arn
  bucket_regional_domain_name = module.web-s3.bucket_regional_domain_name
}

module "lambda" {
  source  = "../../modules/lambda"
  service = var.service
  env     = var.env
}
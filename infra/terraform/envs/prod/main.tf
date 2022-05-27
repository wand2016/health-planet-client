module "web-s3" {
  source  = "../../modules/s3"
  service = var.service
  env     = var.env
}
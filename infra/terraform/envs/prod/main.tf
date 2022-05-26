module "layers-bucket" {
  source = "../../modules/layers-bucket"
  service = var.service
  env = var.env
}
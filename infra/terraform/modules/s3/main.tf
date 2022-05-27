locals {
  service       = "${var.service}-${var.env}"
  name          = "d-hori-${local.service}-web-s3"
  frontend_root = "../../../../frontend"
}

resource "aws_s3_bucket" "web" {
  bucket = local.name

  tags = {
    Service = local.service
    Name    = local.name
  }
}

resource "aws_s3_bucket_acl" "default" {
  bucket = aws_s3_bucket.web.id
  acl    = "private"
}

resource "aws_s3_bucket_object" "artifacts" {
  for_each = module.distribution_files.files

  bucket       = aws_s3_bucket.web.bucket
  key          = each.key
  content_type = each.value.content_type

  source = each.value.source_path

  etag = each.value.digests.md5
}

module "distribution_files" {
  source   = "registry.terraform.io/hashicorp/dir/template"
  base_dir = "${local.frontend_root}/dist"

  depends_on = [null_resource.build]
}

resource "null_resource" "build" {
  triggers = {
    check_value = timestamp()
  }

  provisioner "local-exec" {
    command = "yarn --cwd ${local.frontend_root} build"
  }
}
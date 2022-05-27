locals {
  service = "${var.service}-${var.env}"
  name = "d-hori-${local.service}-cf"
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "S3 can be accessed only via CF"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${var.bucket_arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = var.bucket_id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = var.bucket_regional_domain_name
    origin_id   = var.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    target_origin_id       = var.bucket_regional_domain_name
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  comment             = "CF"
  default_root_object = "index.html" # for history API SPA Routing
  enabled             = true
  price_class         = "PriceClass_200"
  wait_for_deployment = false # これを設定しないと、完全に使用できるようになる（＝ステータスがDeploymentになる）まで処理が終わらなくなる

  tags = {
    Service: local.service
    Name: local.name
  }
}

resource "null_resource" "invalidation" {
  triggers = {
    src_hash = data.archive_file.dist.output_sha
    check_value = timestamp()
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --profile hobby --distribution-id $DISTRIBUTION_ID --path '/*'"

    environment = {
      DISTRIBUTION_ID = aws_cloudfront_distribution.s3_distribution.id
    }
  }
}

data "archive_file" "dist" {
  type        = "zip"
  source_dir  = "../../../../frontend/dist"
  output_path = "./tmp/src.zip"
}
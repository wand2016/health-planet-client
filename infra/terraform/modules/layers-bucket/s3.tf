resource "aws_s3_bucket" "layers" {
  bucket = "d-hori-${var.service}-${var.env}-layers"

  tags = {
    Service = var.service
    Name    = "${var.service}-${var.env}-layers"
  }
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.layers.id
  acl    = "private"
}

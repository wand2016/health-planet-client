locals {
  service               = "${var.service}-${var.env}"
  name                  = "d-hori-${local.service}-backend"
  backend_root          = "../../../../backend"
  backend_libs_lockfile = "${local.backend_root}/yarn.lock"
  backend_libs_root     = "./tmp/backend/libs"
  backend_libs_nodejs   = "${local.backend_libs_root}/nodejs"
}

resource "null_resource" "prepare_libs" {
  triggers = {
    check_value = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOF
      mkdir -p ${local.backend_libs_nodejs} ; \
      cp ${local.backend_root}/package.json ${local.backend_libs_nodejs} && \
      cp ${local.backend_root}/yarn.lock ${local.backend_libs_nodejs} && \
      yarn --cwd ${local.backend_libs_nodejs} install --immutable --production=true
    EOF
  }
}

data "archive_file" "libs" {
  depends_on  = [null_resource.prepare_libs]
  type        = "zip"
  source_dir  = local.backend_libs_root
  output_path = "./tmp/backend/node_modules-${filebase64sha256(local.backend_libs_lockfile)}.zip"

  excludes = ["src", "dist", ".env", "yarn.lock"]
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = data.archive_file.libs.output_path
  layer_name = "${local.name}-node-modules-layer"

  compatible_runtimes = [var.runtime]
}

resource "null_resource" "build" {
  triggers = {
    check_value = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOF
      yarn --cwd ${local.backend_root} install --immutable && \
      yarn --cwd ${local.backend_root} build
    EOF
  }
}

data "archive_file" "app" {
  depends_on  = [null_resource.build]
  type        = "zip"
  source_dir  = "${local.backend_root}/dist"
  output_path = "./tmp/backend/app.zip"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${local.name}-lambda-iam-role"

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "lambda.amazonaws.com"
          },
          "Effect" : "Allow",
          "Sid" : ""
        }
      ]
    }
  )
}

resource "aws_lambda_function" "app" {
  filename      = data.archive_file.app.output_path
  function_name = "${local.name}-lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "handler.main"
  timeout       = 3
  runtime       = var.runtime
  layers        = [aws_lambda_layer_version.lambda_layer.arn]

  tags = {
    Service : local.service
    Name : local.name
  }
}

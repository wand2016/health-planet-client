output "lambda_version" {
  value = aws_lambda_function.app.version
}

output "lambda_layer_version" {
  value = aws_lambda_layer_version.lambda_layer.version
}
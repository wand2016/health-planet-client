const serverlessExpress = require("@vendia/serverless-express");
const { app } = require("backend");

module.exports.main = serverlessExpress({ app });

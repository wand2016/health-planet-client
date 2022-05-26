import serverlessExpress from "@vendia/serverless-express";
import { app } from "./src";

export const main = serverlessExpress({ app });

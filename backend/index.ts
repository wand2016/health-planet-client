require("dotenv").config();
import express from "express";
import { AuthorizationCode } from "simple-oauth2";

const app = express();
app.use(express.json());

app.get("/auth", (req, res) => {
  const client = new AuthorizationCode({
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: process.env.OAUTH_HOST,
    },
  });

  const uri = client.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: "innerscan",
  });

  res.redirect(uri);
});

type TokenRequestBody = {
  code: string;
};

app.post<any, any, any, TokenRequestBody>("/token", async (req, res) => {
  const client = new AuthorizationCode({
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: process.env.OAUTH_HOST,
    },
  });

  const accessToken = await client.getToken({
    code: req.body.code, // from request
    redirect_uri: process.env.REDIRECT_URI,
    scope: "innerscan",
  });

  res.json(accessToken);
});

app.listen(3001);

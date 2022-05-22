require("dotenv").config();
import express from "express";
import { AuthorizationCode } from "simple-oauth2";

const app = express();

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

app.listen(3001);

require("dotenv").config();
import express from "express";
import { AuthorizationCode } from "simple-oauth2";
import cors from "cors";

import axiosInstance from "./src/api";

const app = express();
app.use(cors());
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

  try {
    const accessToken = await client.getToken(
      {
        code: req.body.code, // from request
        redirect_uri: process.env.REDIRECT_URI,
        scope: "innerscan",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      } as any,
      {
        json: true,
      }
    );

    res.json(accessToken.token);
  } catch (e) {
    console.error(e);
  }
});

app.get("/status/innerscan.json", async (req, res) => {
  try {
    const { data } = await axiosInstance.get("/status/innerscan.json", {
      params: req.query,
    });

    res.json(data);
  } catch (e) {
    console.error(e);
  }
});

app.listen(3001);

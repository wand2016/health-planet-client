/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly OAUTH_HOST: string;
    readonly CLIENT_ID: string;
    readonly CLIENT_SECRET: string;
    readonly REDIRECT_URI: string;
  }
}

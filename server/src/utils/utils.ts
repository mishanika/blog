import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Users } from "../types";

const SECRET = "VERYSECRETSECRET";

export type Tokens = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

export type Payload = {
  id: number;
  username: string;
  exp: number;
};

export const makeTokens = (username: string, id: number) => {
  let accessToken: string | undefined = jwt.sign(
    { id: id, username: username, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    SECRET,
    { algorithm: "HS256" }
  );
  let refreshToken: string | undefined = jwt.sign(
    { id: id, username: username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 30 },
    SECRET,
    { algorithm: "HS256" }
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};

export const verify = (token: string | undefined) => {
  if (token) {
    const tokenVerify = jwt.verify(token, SECRET);
    const tokenDecode = jwt.decode(token) as Payload;
    // console.log("verify", tokenVerify);
    // console.log("decode", tokenDecode);
    if (tokenDecode) {
      return tokenDecode.exp > Date.now() / 1000 && tokenVerify;
    }
  }
};

export const decode = (accessToken: string) => {
  const tokenDecode = jwt.decode(accessToken) as Payload;
  return tokenDecode;
};

export const writeFile = (path: string, data: any) => {
  return new Promise((resolve) => {
    fs.writeFile(path, data, resolve);
  });
};

export const readFile = async (path: string) => {
  return new Promise((resolve) => {
    fs.readFile(path, "utf-8", (err, data) => {
      resolve(data);
    });
  });
};
// export const refresh = (accessToken: string, refreshToken: string) => {
//   const tokenVerify = jwt.verify(accessToken, SECRET);
//   const tokenDecode = jwt.decode(accessToken) as Payload;
//   const db = fs.readFileSync("src/database/database.json", "utf8");

// };

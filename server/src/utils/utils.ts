import { Comment, Comments } from "./../types";
import fs from "fs";
import jwt, { TokenExpiredError } from "jsonwebtoken";
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

export const verify = async (token: string | undefined) => {
  try {
    if (token) {
      const tokenVerify = jwt.verify(token, SECRET);
      const tokenDecode = jwt.decode(token) as Payload;

      if (tokenDecode) {
        console.log("try", tokenDecode.exp > Date.now() / 1000);
        return tokenDecode.exp > Date.now() / 1000;
      }
    }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      if (token) {
        const tokenDecode = jwt.decode(token) as Payload;
        const db = (await readFile("src/database/database.json")) as string;
        let data: Users = JSON.parse(db);
        const userId: number = data.users.findIndex((user) => user.id === tokenDecode.id);
        const refreshToken = data.users[userId].refreshToken;
        let refreshTokenDecode;
        if (refreshToken) {
          refreshTokenDecode = jwt.decode(refreshToken) as Payload;
          if (refreshTokenDecode.exp < Date.now() / 1000) {
            return false;
          }
        }

        const tokens = makeTokens(tokenDecode.username, tokenDecode.id);

        data.users[userId].accessToken = tokens.accessToken;
        data.users[userId].refreshToken = tokens.refreshToken;

        await writeFile("src/database/database.json", JSON.stringify(data));

        return true;
      }
    }

    return false;
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

export const addComment = (id: number, comments: Comment[], comment: Comment) => {
  for (const com of comments) {
    if (com.id === id) {
      com.replies.push(comment);

      return;
    } else if (com.replies.length) {
      addComment(id, com.replies, comment);
    }
  }
};

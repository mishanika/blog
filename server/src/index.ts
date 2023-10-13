import cors from "cors";
import fs from "fs";
import crypto from "crypto";
import express, { Request, Response } from "express";
import multer from "multer";
import { AuthBody, EditBody, LoginBody, ProfileBody, ProfileInfo, RegisterBody, User, Users } from "./types";
import { Payload, Tokens, decode, makeTokens, readFile, verify, writeFile } from "./utils/utils";

const app = express();
const port = 3030;
const corsOptions = {
  origin: "http://localhost:3000",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/");
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomUUID());
  },
});
const upload = multer({
  storage: storage,
});

app.use(express.static("photos"));
app.use(express.json());
app.use(cors(corsOptions));

app.post("/register", async (req: Request, res: Response) => {
  const { username, password, repeatedPassword }: RegisterBody = req.body;
  const db = (await readFile("src/database/database.json")) as string;
  let data: Users = JSON.parse(db);

  const user: User | undefined = data.users.find((user) => user.username === username);
  //check password

  if (!user) {
    data.users.push({
      id: data.users.length,
      photo: "",
      username: username,
      password: password,
      name: "",
      status: "",
      description: "",
      accessToken: "",
      refreshToken: "",
    });
    await writeFile("src/database/database.json", JSON.stringify(data));
    res.status(200).send("Registered");

    return;
  }
  res.status(400).send("There is a user with such username");
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password }: LoginBody = req.body;
  const db = (await readFile("src/database/database.json")) as string;
  let data: Users = JSON.parse(db);

  const userId: number = data.users.findIndex((user) => user.username === username && user.password === password);

  if (userId !== -1) {
    const { accessToken, refreshToken }: Tokens = makeTokens(data.users[userId].username, data.users[userId].id);

    data.users[userId].accessToken = accessToken;
    data.users[userId].refreshToken = refreshToken;
    await writeFile("src/database/database.json", JSON.stringify(data));
    res.status(200).json({ accessToken: accessToken });

    return;
  }
  res.status(400).send("Wrong credentials");
});

app.post("/auth", async (req: Request, res: Response) => {
  try {
    const { accessToken }: AuthBody = req.body;
    const db = (await readFile("src/database/database.json")) as string;
    //console.log(db);
    let data: Users = JSON.parse(db);

    const payload = decode(accessToken);

    const userId: number = data.users.findIndex((user) => user.id === payload.id);

    const isAccessVerified = verify(accessToken);
    const isRefreshVerified = verify(data.users[userId].refreshToken);

    if (isAccessVerified && isRefreshVerified) {
      const { accessToken, refreshToken }: Tokens = makeTokens(payload.username, payload.id);

      data.users[userId].accessToken = accessToken;
      data.users[userId].refreshToken = refreshToken;
      await writeFile("src/database/database.json", JSON.stringify(data));

      res.status(200).json({ auth: true, accessToken: accessToken });

      return;
    }
    res.status(400).send("Refresh token is not valid");
  } catch (err) {
    const { accessToken }: AuthBody = req.body;
    const tokenDecode = decode(accessToken) as Payload;
    const tokens = makeTokens(tokenDecode.username, tokenDecode.id);
    const db = (await readFile("src/database/database.json")) as string;

    let data: Users = JSON.parse(db);
    const userId: number = data.users.findIndex((user) => user.id === tokenDecode.id);

    data.users[userId].accessToken = tokens.accessToken;
    data.users[userId].refreshToken = tokens.refreshToken;

    await writeFile("src/database/database.json", JSON.stringify(data));
    //console.log("catch end ----------");
    res.status(200).json({ auth: true, accessToken: accessToken });
  }
});

app.post("/profile", async (req: Request, res: Response) => {
  try {
    const { username, token }: ProfileBody = req.body;
    let db = (await readFile("src/database/database.json")) as string;
    // console.log("--------------------");
    console.log(db);

    let data: Users = JSON.parse(db);
    const decodedToken = decode(token);

    const userId: number = data.users.findIndex((user) => user.username === username);
    console.log(userId);
    console.log(data.users[userId].username);
    if (userId !== -1) {
      const user: ProfileInfo = {
        username: data.users[userId].username,
        name: data.users[userId].name,
        status: data.users[userId].status,
        description: data.users[userId].description,
        myUsername: decodedToken.username,
      };

      res.status(200).json({ ...user });

      return;
    } else {
      res.status(400).send("No such a user");
    }
  } catch (err) {
    // console.log(err);
    res.status(500).send("Server Error");
  }
});
//make every readfile promise
app.post("/edit", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { username, name, status, description, oldUsername }: EditBody = req.body;
    const db = (await readFile("src/database/database.json")) as string;
    let data: Users = JSON.parse(db);

    const userId: number = data.users.findIndex((user) => user.username === oldUsername);
    const secondUserId: number = data.users.findIndex((user) => user.username === username);

    if (userId !== -1 && secondUserId === -1) {
      data.users[userId].photo = req.file ? req.file.filename : data.users[userId].photo;
      data.users[userId].username = username && username.length ? username : data.users[userId].username;
      data.users[userId].name = name && name.length ? name : data.users[userId].name;
      data.users[userId].status = status && status.length ? status : data.users[userId].status;
      data.users[userId].description = description && description.length ? description : data.users[userId].description;
      await writeFile("src/database/database.json", JSON.stringify(data));
      res.status(200).json({ ...data.users[userId] });

      return;
    }
    res.status(500).send("This username is taken");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

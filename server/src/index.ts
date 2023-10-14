import cors from "cors";
import crypto from "crypto";
import express, { Request, Response } from "express";
import multer from "multer";
import {
  AuthBody,
  CommentBody,
  Data,
  EditBody,
  LoginBody,
  PostBody,
  ProfileBody,
  ProfileInfo,
  RegisterBody,
  User,
  Users,
} from "./types";
import { Payload, Tokens, decode, addComment, makeTokens, readFile, verify, writeFile } from "./utils/utils";

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
  const { username, password }: RegisterBody = req.body;
  const db = (await readFile("src/database/database.json")) as string;
  let data: Users = JSON.parse(db);

  const user: User | undefined = data.users.find((user) => user.username === username);

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
    res.status(200).json({ accessToken: accessToken, username: data.users[userId].username });

    return;
  }
  res.status(400).send("Wrong credentials");
});

app.post("/auth", async (req: Request, res: Response) => {
  try {
    const { accessToken }: AuthBody = req.body;
    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      res.status(200).json({ auth: true, accessToken: accessToken });

      return;
    }
    res.status(400).json({ auth: false, accessToken: "accessToken" });
  } catch (err) {}
});

app.post("/profile", async (req: Request, res: Response) => {
  try {
    const { username, token }: ProfileBody = req.body;
    let db = (await readFile("src/database/database.json")) as string;

    let data: Users = JSON.parse(db);
    const decodedToken = decode(token);

    const userId: number = data.users.findIndex((user) => user.username === username);
    if (userId !== -1) {
      const user: ProfileInfo = {
        photo: data.users[userId].photo,
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
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/edit", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { username, name, status, description, oldUsername, accessToken }: EditBody = req.body;
    const db = (await readFile("src/database/database.json")) as string;
    let data: Users = JSON.parse(db);

    const userId: number = data.users.findIndex((user) => user.username === oldUsername);
    const secondUserId: number = data.users.findIndex((user) => user.username === username);
    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified && (username === oldUsername || (userId !== -1 && secondUserId === -1))) {
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

app.post("/createPost", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { text, title, accessToken }: PostBody = req.body;
    const db = (await readFile("src/database/database.json")) as string;
    let data: Data = JSON.parse(db);

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      const payload: Payload = decode(accessToken);
      const userId: number = data.users.findIndex((user) => user.username === payload.username);
      const img = req.file ? req.file.filename : "";
      const post = {
        id: data.posts.length,
        title: title,
        text: text,
        image: img,
        publisherPhoto: data.users[userId].photo,
        publisherUsername: data.users[userId].username,
        comments: [],
        commentsCounter: 0,
      };
      data.posts.push(post);
      await writeFile("src/database/database.json", JSON.stringify(data));
      res.status(200).json({ auth: true, accessToken: accessToken, post: post });
      return;
    }

    res.status(400).json({ auth: false, accessToken: "accessToken" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  try {
    const db = (await readFile("src/database/database.json")) as string;
    let data: Data = JSON.parse(db);

    res.status(200).json({ posts: [...data.posts] });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/createComment", async (req: Request, res: Response) => {
  try {
    const { text, accessToken, postId, commentReplyId }: CommentBody = req.body;
    const db = (await readFile("src/database/database.json")) as string;
    let data: Data = JSON.parse(db);

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      const postIdInner = data.posts.findIndex((post) => post.id === postId);
      const payload: Payload = decode(accessToken);
      const userId = data.users.findIndex((user) => user.username === payload.username);

      const comment = {
        id: data.posts[postIdInner].commentsCounter,
        publisherPhoto: data.users[userId].photo,
        publisherUsername: payload.username,
        text: text,
        replies: [],
      };

      if (commentReplyId === null) {
        data.posts[postIdInner].comments.push(comment);
      } else {
        addComment(commentReplyId, data.posts[postIdInner].comments, comment);
      }
      data.posts[postIdInner].commentsCounter += 1;

      await writeFile("src/database/database.json", JSON.stringify(data));
      res.status(200).json({ auth: true, accessToken: data.users[userId].accessToken, post: data.posts[postIdInner] });
      return;
    }

    res.status(400).json({ auth: false, accessToken: "accessToken" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

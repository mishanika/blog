import { bucket, database } from "../firebase/firebase";
import { CommentBody, Data, Post, User } from "../types";
import { v4 as uuid } from "uuid";
import {
  Payload,
  Tokens,
  addComment,
  decode,
  makeTokens,
  readFile,
  unlinkFile,
  verify,
  writeFile,
} from "../utils/utils";

class PostService {
  createPost = async (
    text: string,
    title: string,
    accessToken: string,
    file: Express.Multer.File | undefined
  ): Promise<{
    isPostCreated: boolean;
    accessToken: string | undefined;
    post: Post | {};
  }> => {
    const postsRef = database.collection("posts");
    const usersRef = database.collection("users");

    const payload: Payload = decode(accessToken);

    const user = (await usersRef.where("username", "==", payload.username).get()).docs.map((user) =>
      user.data()
    ) as User[];

    // const db = (await readFile("src/database/database.json")) as string;
    // let data: Data = JSON.parse(db);

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      let photoURL;

      if (file) {
        const photoPath = `${process.cwd()}/photos/${file.filename}`;

        const fileUploadOptions = {
          destination: `postPhoto/${file?.filename}`,
          metadata: {
            contentType: file?.mimetype,
          },
        };

        await bucket.upload(photoPath, fileUploadOptions);

        const photoFile = await bucket.getFiles({ prefix: `postPhoto/${file?.filename}` });
        photoURL = await photoFile[0][0]
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((data) => data[0]);
        console.log(photoURL);

        unlinkFile(photoPath);
      }

      const id = uuid();
      const post = {
        id: id,
        title: title ? title : "",
        text: text ? text : "",
        image: photoURL,
        publisherPhoto: user[0].photo,
        publisherUsername: user[0].username,
        comments: [],
        commentsCounter: 0,
      };
      console.log(post);
      postsRef.doc(id).set(post);

      // const payload: Payload = decode(accessToken);
      // const userId: number = data.users.findIndex((user) => user.username === payload.username);
      // const img = file ? file.filename : "";
      // const post = {
      //   id: data.posts.length,
      //   title: title,
      //   text: text,
      //   image: img,
      //   publisherPhoto: data.users[userId].photo,
      //   publisherUsername: data.users[userId].username,
      //   comments: [],
      //   commentsCounter: 0,
      // };
      // data.posts.push(post);
      // await writeFile("src/database/database.json", JSON.stringify(data));

      return { isPostCreated: true, accessToken: user[0].accessToken, post: { ...post } };
    }
    return { isPostCreated: false, accessToken: "", post: {} };
  };

  getPosts = async () => {
    const postsRef = database.collection("posts");
    const posts = (await postsRef.get()).docs.map((post) => post.data());

    // const db = (await readFile("src/database/database.json")) as string;
    // let data: Data = JSON.parse(db);

    return posts;
  };

  createComment = async ({
    text,
    accessToken,
    postId,
    commentReplyId,
  }: CommentBody): Promise<{
    isPostCreated: boolean;
    accessToken: string | undefined;
    post: Post | {};
  }> => {
    // const db = (await readFile("src/database/database.json")) as string;
    // let data: Data = JSON.parse(db);
    const postsRef = database.collection("posts");
    const usersRef = database.collection("users");

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      const payload: Payload = decode(accessToken);
      const post = (await postsRef.where("id", "==", postId).get()).docs.map((post) => post.data()) as Post[];
      //const postIdInner = data.posts.findIndex((post) => post.id === postId);
      const user = (await usersRef.where("username", "==", payload.username).get()).docs.map((user) =>
        user.data()
      ) as User[];
      //const userId = data.users.findIndex((user) => user.username === payload.username);

      const comment = {
        id: post[0].commentsCounter,
        publisherPhoto: user[0].photo,
        publisherUsername: user[0].username,
        text: text,
        replies: [],
      };

      if (commentReplyId === null) {
        post[0].comments.push(comment);
      } else {
        addComment(commentReplyId, post[0].comments, comment);
      }
      post[0].commentsCounter += 1;

      await postsRef.doc(post[0].id).set({ ...post[0] });

      //await writeFile("src/database/database.json", JSON.stringify(data));

      return { isPostCreated: true, accessToken: user[0].accessToken, post: { ...post[0] } };
    }
    return { isPostCreated: false, accessToken: "", post: {} };
  };
}

export default PostService;

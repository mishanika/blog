import { bucket, database } from "../firebase/firebase";
import { CommentBody, Post, PostBody, User } from "../types";
import { v4 as uuid } from "uuid";
import { Payload, addComment, decode, unlinkFile, uploadFile, verify } from "../utils/utils";
import path from "path";

class PostService {
  // createPost = async (
  //   text: string,
  //   title: string,
  //   accessToken: string,
  //   file: Express.Multer.File | undefined
  // ): Promise<{
  //   isPostCreated: boolean;
  //   accessToken: string | undefined;
  //   post: Post | {};
  // }> => {
  //   const postsRef = database.collection("posts");
  //   const usersRef = database.collection("users");

  //   const payload: Payload = decode(accessToken);

  //   const user = (await usersRef.where("username", "==", payload.username).get()).docs.map((user) =>
  //     user.data()
  //   ) as User[];

  //   const isAccessVerified = await verify(accessToken);

  //   if (isAccessVerified) {
  //     let photoURL = "";

  //     if (file) {
  //       const photoPath = `${process.cwd()}/photos/${file.filename}`;

  //       const fileUploadOptions = {
  //         destination: `postPhoto/${file?.filename}`,
  //         metadata: {
  //           contentType: file?.mimetype,
  //         },
  //       };

  //       await bucket.upload(photoPath, fileUploadOptions);

  //       const photoFile = await bucket.getFiles({ prefix: `postPhoto/${file?.filename}` });
  //       photoURL = await photoFile[0][0]
  //         .getSignedUrl({
  //           action: "read",
  //           expires: "03-09-2491",
  //         })
  //         .then((data) => data[0]);
  //       console.log(photoURL);

  //       unlinkFile(photoPath);
  //     }

  //     const id = uuid();
  //     const post = {
  //       id: id,
  //       title: title ? title : "",
  //       text: text ? text : "",
  //       image: photoURL,
  //       publisherPhoto: user[0].photo,
  //       publisherUsername: user[0].username,
  //       comments: [],
  //       commentsCounter: 0,
  //     };
  //     console.log(post);
  //     postsRef.doc(id).set(post);

  //     return { isPostCreated: true, accessToken: user[0].accessToken, post: { ...post } };
  //   }
  //   return { isPostCreated: false, accessToken: "", post: {} };
  // };

  createPost = async ({
    title,
    elements,
    accessToken,
    date,
  }: PostBody): Promise<{
    isPostCreated: boolean;
    accessToken: string | undefined;
    postId: string;
  }> => {
    const elems = [...elements];
    const postsRef = database.collection("posts");
    const usersRef = database.collection("users");

    const isAccessVerified = await verify(accessToken);

    console.log(isAccessVerified);
    if (isAccessVerified) {
      const payload: Payload = decode(accessToken);
      const user = (await usersRef.where("username", "==", payload.username).get()).docs.map((user) =>
        user.data()
      ) as User[];

      const imgElements = elems.filter((item) => item.element === "img");
      console.log(imgElements);

      for (let i = 0; i < imgElements.length; i++) {
        let base64Image = imgElements[i].value.split(";base64,").pop();
        const name = `${uuid()}.${imgElements[i].value.split(";base64,")[0].split("/")[1]}`;
        const fileUploadOptions = {
          destination: `postPhoto/${name}`,
        };

        await uploadFile(name, base64Image || "");

        await bucket.upload(`${path.join(process.cwd(), "public", "photos", name)}`, fileUploadOptions);

        const photoFile = await bucket.getFiles({ prefix: `postPhoto/${name}` });
        imgElements[i].value = await photoFile[0][0]
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((data) => data[0]);

        await unlinkFile(`${path.join(process.cwd(), "public", "photos", name)}`);
      }

      console.log(elems);

      const id = uuid();
      const post = {
        id: id,
        title: title,
        elements: [...elems],
        publisherPhoto: user[0].photo,
        publisherUsername: user[0].username,
        comments: [],
        commentsCounter: 0,
        date: date,
      };

      postsRef.doc(id).set(post);

      return { isPostCreated: true, accessToken: user[0].accessToken, postId: id };
    }

    return { isPostCreated: false, accessToken: "", postId: "" };
  };

  getPosts = async () => {
    const postsRef = database.collection("posts");
    const posts = (await postsRef.get()).docs.map((post) => post.data());

    return posts;
  };

  getPost = async (id: string) => {
    const postsRef = database.collection("posts");
    const post = (await postsRef.doc(id).get()).data();

    return { ...post };
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
    const postsRef = database.collection("posts");
    const usersRef = database.collection("users");

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      const payload: Payload = decode(accessToken);
      const post = (await postsRef.where("id", "==", postId).get()).docs.map((post) => post.data()) as Post[];

      const user = (await usersRef.where("username", "==", payload.username).get()).docs.map((user) =>
        user.data()
      ) as User[];

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

      return { isPostCreated: true, accessToken: user[0].accessToken, post: { ...post[0] } };
    }
    return { isPostCreated: false, accessToken: "", post: {} };
  };
}

export default PostService;

import { CommentBody, Data, Post } from "../types";
import { Payload, Tokens, addComment, decode, makeTokens, readFile, verify, writeFile } from "../utils/utils";

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
    const db = (await readFile("src/database/database.json")) as string;
    let data: Data = JSON.parse(db);

    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified) {
      const payload: Payload = decode(accessToken);
      const userId: number = data.users.findIndex((user) => user.username === payload.username);
      const img = file ? file.filename : "";
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

      return { isPostCreated: true, accessToken: data.users[userId].accessToken, post: { ...post } };
    }
    return { isPostCreated: false, accessToken: "", post: {} };
  };

  getPosts = async () => {
    const db = (await readFile("src/database/database.json")) as string;
    let data: Data = JSON.parse(db);

    return data.posts;
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

      return { isPostCreated: true, accessToken: data.users[userId].accessToken, post: { ...data.posts[postIdInner] } };
    }
    return { isPostCreated: false, accessToken: "", post: {} };
  };
}

export default PostService;

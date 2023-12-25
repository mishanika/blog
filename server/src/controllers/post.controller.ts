import { Request, Response } from "express";
import PostService from "../services/post.service";
import { CommentBody, PostBody } from "../types";
import { readFile } from "../utils/utils";

class PostController {
  postService: PostService;
  constructor(postService: PostService) {
    this.postService = postService;
  }

  createPost = async (req: Request, res: Response) => {
    try {
      const { text, title, accessToken }: PostBody = req.body;
      const postCreated = await this.postService.createPost(text, title, accessToken, req.file);
      if (postCreated.isPostCreated) {
        res.status(200).json({ auth: true, accessToken: accessToken, post: postCreated.post });
        return;
      }

      res.status(400).json({ auth: false, accessToken: "" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getPosts();

      res.status(200).json({ posts: [...posts] });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  createComment = async (req: Request, res: Response) => {
    try {
      //const { text, accessToken, postId, commentReplyId }: CommentBody = req.body;
      const commentCreated = await this.postService.createComment(req.body);
      if (commentCreated.isPostCreated) {
        res.status(200).json({ auth: true, accessToken: commentCreated.accessToken, post: commentCreated.post });
        return;
      }

      res.status(400).json({ auth: false, accessToken: "accessToken" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };
}

export default PostController;

import { Request, Response } from "express";
import PostService from "../services/post.service";

class PostController {
  postService: PostService;
  constructor(postService: PostService) {
    this.postService = postService;
  }

  createPost = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      console.log("========");
      const postCreated = await this.postService.createPost(req.body);
      if (postCreated.isPostCreated) {
        res.status(200).json({ auth: true, accessToken: postCreated.accessToken, postId: postCreated.postId });
        return;
      }

      res.status(400).json({ auth: false, accessToken: "" });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  };

  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getPosts();

      res.status(200).json({ posts: [...posts] });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const post = await this.postService.getPost(id);

      res.status(200).json({ post: { ...post } });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  createComment = async (req: Request, res: Response) => {
    try {
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

  searchPosts = async (req: Request, res: Response) => {
    try {
      const { searchText } = req.body;
      const posts = await this.postService.searchPosts(searchText);

      res.status(200).json({ posts: [...posts] });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };
}

export default PostController;

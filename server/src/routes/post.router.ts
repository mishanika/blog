import express from "express";
import { upload } from "../modules/multer.module";
import PostController from "../controllers/post.controller";

class PostRouter {
  postController: PostController;

  constructor(userController: PostController) {
    this.postController = userController;
  }

  getRouter() {
    const router = express.Router();
    router.route("/create").post(this.postController.createPost);
    router.route("/").get(this.postController.getPosts);
    router.route("/:id").get(this.postController.getPost);
    router.route("/createComment").post(this.postController.createComment);
    router.route("/search").post(this.postController.searchPosts);

    return router;
  }
}

export default PostRouter;

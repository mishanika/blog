import PostService from "../services/post.service";
import PostController from "../controllers/post.controller";
import PostRouter from "../routes/post.router";

const postService = new PostService();
const postController = new PostController(postService);
const postRouter = new PostRouter(postController);

export const postModule = {
  service: postService,
  controller: postController,
  router: postRouter.getRouter(),
};

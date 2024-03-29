import express from "express";
import UserController from "../controllers/user.controller";
import { upload } from "../modules/multer.module";

class UserRouter {
  userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  getRouter() {
    const router = express.Router();
    router.route("/register").post(this.userController.registerUser);
    router.route("/login").post(this.userController.loginUser);
    router.route("/auth").post(this.userController.authUser);
    router.route("/profile").post(this.userController.getUserProfile);
    router.route("/edit").post(this.userController.editProfile);
    router.route("/posts/created/:accessToken/:part").get(this.userController.getCreatedPosts);
    router.route("/posts/liked/:accessToken/:part").get(this.userController.getLikedPosts);
    return router;
  }
}

export default UserRouter;

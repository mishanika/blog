import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import UserRouter from "../routes/user.router";

const userService = new UserService();
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

export const userModule = {
  service: userService,
  controller: userController,
  router: userRouter.getRouter(),
};

import express from "express";
import { userModule } from "../modules/user.module";
import { postModule } from "../modules/post.module";

const router = express.Router();

router.use("/user", userModule.router);
router.use("/post", postModule.router);

export default router;

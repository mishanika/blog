import { AuthBody, EditBody, LoginBody, ProfileBody, RegisterBody } from "../types";
import { Request, Response } from "express";
import UserService from "../services/user.service";
import { verify } from "../utils/utils";

class UserController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const { username, password }: RegisterBody = req.body;
      const isRegistered = await this.userService.registerUser(username, password);
      if (isRegistered) {
        res.status(200).send("Registered");
      } else {
        res.status(400).send("There is a user with such username");
      }
    } catch (err) {
      res.status(400).send("There is a user with such username");
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { username, password }: LoginBody = req.body;
      const payload = await this.userService.loginUser(username, password);
      if (payload.isLogin) {
        res.status(200).json({ accessToken: payload.accessToken, username: payload.username });
      } else {
        res.status(400).send("Wrong credentials");
      }
    } catch (err) {
      res.status(400).send("Wrong credentials");
    }
  };

  authUser = async (req: Request, res: Response) => {
    try {
      const { accessToken }: AuthBody = req.body;
      const isAccessVerified = await verify(accessToken);

      if (isAccessVerified) {
        res.status(200).json({ auth: true, accessToken: accessToken });

        return;
      }
      res.status(400).json({ auth: false, accessToken: "accessToken" });
    } catch (err) {}
  };

  getUserProfile = async (req: Request, res: Response) => {
    try {
      const { username, token }: ProfileBody = req.body;
      const isUser = await this.userService.getUserProfile(username, token);

      if (isUser && typeof isUser !== "boolean") {
        res.status(200).json({ ...isUser });

        return;
      } else {
        res.status(400).send("No such a user");
      }
      res.status(400).json({ auth: false, accessToken: "accessToken" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  editProfile = async (req: Request, res: Response) => {
    try {
      const { username, name, status, description, oldUsername, accessToken, photo }: EditBody = req.body;

      const editedUser = await this.userService.editProfile(
        username,
        name,
        status,
        description,
        oldUsername,
        accessToken,
        photo
      );

      if (editedUser.isUserEdited) {
        res.status(200).json({ ...editedUser.user });
      } else {
        res.status(400).send("This username is taken");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  getCreatedPosts = async (req: Request, res: Response) => {
    try {
      const { accessToken, part } = req.params;

      const posts = await this.userService.getCreatedPosts(accessToken, part);

      if (!posts?.error) {
        res.status(200).json({ ...posts });

        return;
      } else {
        res.status(posts.code).send(posts.error);
        return;
      }

      res.status(400).json({ auth: false, accessToken: "accessToken" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };

  getLikedPosts = async (req: Request, res: Response) => {
    try {
      const { accessToken, part } = req.params;

      const posts = await this.userService.getLikedPosts(accessToken, part);

      if (!posts?.error) {
        res.status(200).json({ ...posts });

        return;
      } else {
        res.status(posts.code).send(posts.error);
        return;
      }
      res.status(400).json({ auth: false, accessToken: "accessToken" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  };
}

export default UserController;

import { Tokens, decode, makeTokens, readFile, unlinkFile, verify, writeFile } from "../utils/utils";
import { Post, ProfileInfo, User } from "../types";
import { bucket, database } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import process from "process";
import path from "path";
class UserService {
  registerUser = async (username: string, password: string): Promise<boolean> => {
    const usersRef = database.collection("users");
    const existedUser = (await usersRef.where("username", "==", username).get()).size;

    if (!existedUser) {
      const id = uuid();
      usersRef.doc(id).set({
        id: id,
        photo: "",
        username: username,
        password: password,
        name: "",
        status: "",
        description: "",
        accessToken: "",
        refreshToken: "",
        likedPosts: [],
        createdPosts: [],
      });

      return true;
    }

    return false;
  };

  loginUser = async (
    username: string,
    password: string
  ): Promise<{ isLogin: boolean; accessToken: string; username: string }> => {
    const usersRef = database.collection("users");
    const user = (await usersRef.where("username", "==", username).get()).docs.map((data) => data.data()) as User[];

    if (user[0].password === password) {
      const { accessToken, refreshToken }: Tokens = makeTokens(user[0].username, user[0].id);

      user[0].accessToken = accessToken;
      user[0].refreshToken = refreshToken;

      usersRef.doc(user[0].id).set({
        ...user[0],
      });

      return { isLogin: true, accessToken: accessToken, username: user[0].username };
    }
    return { isLogin: false, accessToken: "", username: "" };
  };

  getUserProfile = async (username: string, token: string): Promise<ProfileInfo | boolean> => {
    const decodedToken = decode(token);
    const usersRef = database.collection("users");
    const user = (await usersRef.where("username", "==", username).get()).docs[0].data() as unknown as User;

    if (user) {
      const userInfo: ProfileInfo = {
        photo: user.photo,
        username: user.username,
        name: user.name,
        status: user.status,
        description: user.description,
        myUsername: decodedToken.username,
      };

      return { ...userInfo };
    }
    return false;
  };

  editProfile = async (
    username: string,
    name: string,
    status: string,
    description: string,
    oldUsername: string,
    accessToken: string,
    photo: string
  ): Promise<{ user: User | {}; isUserEdited: boolean }> => {
    const decodedToken = decode(accessToken);
    const usersRef = database.collection("users");
    const user = (await usersRef.doc(decodedToken.id).get()).data() as unknown as User;
    const secondUser = (await usersRef.where("username", "==", username).get()).docs.map((data) =>
      data.data()
    )[0] as User;

    const isAccessVerified = await verify(accessToken);

    if ((isAccessVerified && username === oldUsername) || (user && secondUser)) {
      if (photo.length) {
        if (user.photo.length) {
          const url = user.photo;
          const regex = /\/([^/?]+)\?/;

          await bucket.deleteFiles({
            prefix: `userPhoto/${url.match(regex)![1]}`,
          });
        }

        const photoFile = await bucket.getFiles({ prefix: `userPhoto/${photo}` });
        const photoURL = await photoFile[0][0]
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((data) => data[0]);
        console.log(photoURL);

        user.photo = photoURL;
      }

      user.username = username && username.length ? username : user.username;
      user.name = name && name.length ? name : user.name;
      user.status = status && status.length ? status : user.status;
      user.description = description && description.length ? description : user.description;
      user.photo = user.photo ? user.photo : "";

      console.log(user);

      await database.collection("users").doc(user.id).update(user);

      return { isUserEdited: true, user: { ...user, refreshToken: "" } };
    }
    return { isUserEdited: false, user: {} };
  };

  getCreatedPosts = async (accessToken: string, part: string) => {
    const payload = decode(accessToken);
    const usersRef = database.collection("users");
    const postsRef = database.collection("posts");
    const user = (await usersRef.doc(payload.id).get()).data() as User;

    if (user) {
      if (Math.ceil(user.likedPosts.length / 6) < parseInt(part)) {
        return { error: "No more posts", code: 400 };
      }
      const min =
        user.createdPosts.length - 6 * parseInt(part) <= 0 ? 0 : user.createdPosts.length - 6 * parseInt(part);
      let max = 0;
      if (min + 5 > user.createdPosts.length - 6 * parseInt(part)) {
        max = user.createdPosts.length - 6 * (parseInt(part) - 1);
      } else if (min + 5 >= user.createdPosts.length) {
        max = user.createdPosts.length;
      } else {
        max = min + 5;
      }
      console.log(user.likedPosts.length, "----------length----------");
      console.log(min, "----------min----------");
      console.log(max, "----------max----------");

      const posts = (await Promise.all(
        user.createdPosts.splice(min, max).map(async (id, index) => (await postsRef.doc(id).get()).data())
      )) as Post[];

      return { posts: [...posts].reverse() };
    }
    return { error: "No such a user", code: 400 };
  };

  getLikedPosts = async (accessToken: string, part: string) => {
    const payload = decode(accessToken);
    const usersRef = database.collection("users");
    const postsRef = database.collection("posts");
    const user = (await usersRef.doc(payload.id).get()).data() as User;

    if (user) {
      if (Math.ceil(user.likedPosts.length / 6) < parseInt(part)) {
        return { error: "No more posts", code: 400 };
      }
      console.log(user.likedPosts, "----------liked----------");
      const min = user.likedPosts.length - 6 * parseInt(part) <= 0 ? 0 : user.likedPosts.length - 6 * parseInt(part);
      let max = 0;
      if (min + 5 > user.createdPosts.length - 6 * parseInt(part)) {
        max = user.createdPosts.length - 6 * (parseInt(part) - 1);
      } else if (min + 5 >= user.createdPosts.length) {
        max = user.createdPosts.length;
      } else {
        max = min + 5;
      }
      console.log(user.likedPosts.length, "----------length----------");
      console.log(min, "----------min----------");
      console.log(max, "----------max----------");
      // console.log(user.likedPosts.splice(min, max), "----------вырезка----------");

      const posts = (await Promise.all(
        user.likedPosts.splice(min, max).map(async (id, index) => (await postsRef.doc(id).get()).data())
      )) as Post[];

      return { posts: [...posts].reverse() };
    }
    return { error: "No such a user", code: 400 };
  };
}

export default UserService;

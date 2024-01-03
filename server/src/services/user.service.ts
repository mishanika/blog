import { Tokens, decode, makeTokens, readFile, unlinkFile, verify, writeFile } from "../utils/utils";
import { ProfileInfo, User } from "../types";
import { bucket, database } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import process from "process";
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
    file: Express.Multer.File | undefined
  ): Promise<{ user: User | {}; isUserEdited: boolean }> => {
    const decodedToken = decode(accessToken);
    const usersRef = database.collection("users");
    const user = (await usersRef.doc(decodedToken.id).get()).data() as unknown as User;
    const secondUser = (await usersRef.where("username", "==", username).get()).docs.map((data) =>
      data.data()
    )[0] as User;

    const isAccessVerified = await verify(accessToken);

    if ((isAccessVerified && username === oldUsername) || (user && secondUser)) {
      const photoPath = `${process.cwd()}/photos/${file?.filename}`;

      if (file) {
        const fileUploadOptions = {
          destination: `userPhoto/${file?.filename}`,
          metadata: {
            contentType: file?.mimetype,
          },
        };
        if (user.photo.length) {
          const url = user.photo;
          const regex = /\/([^/?]+)\?/;

          await bucket.deleteFiles({
            prefix: `userPhoto/${url.match(regex)![1]}`,
          });
        }

        await bucket.upload(photoPath, fileUploadOptions);

        const photoFile = await bucket.getFiles({ prefix: `userPhoto/${file?.filename}` });
        const photoURL = await photoFile[0][0]
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((data) => data[0]);
        console.log(photoURL);

        user.photo = photoURL;
        unlinkFile(photoPath);
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
}

export default UserService;

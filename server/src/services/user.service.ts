import { Tokens, decode, makeTokens, readFile, verify, writeFile } from "../utils/utils";
import { ProfileInfo, User, Users } from "../types";

class UserService {
  registerUser = async (username: string, password: string): Promise<boolean> => {
    const db = (await readFile("src/database/database.json")) as string;
    let data: Users = JSON.parse(db);

    const user: User | undefined = data.users.find((user) => user.username === username);

    if (!user) {
      data.users.push({
        id: data.users.length,
        photo: "",
        username: username,
        password: password,
        name: "",
        status: "",
        description: "",
        accessToken: "",
        refreshToken: "",
      });
      await writeFile("src/database/database.json", JSON.stringify(data));

      return true;
    }

    return false;
  };

  loginUser = async (
    username: string,
    password: string
  ): Promise<{ isLogin: boolean; accessToken: string; username: string }> => {
    const db = (await readFile("src/database/database.json")) as string;
    let data: Users = JSON.parse(db);

    const userId: number = data.users.findIndex((user) => user.username === username && user.password === password);

    if (userId !== -1) {
      const { accessToken, refreshToken }: Tokens = makeTokens(data.users[userId].username, data.users[userId].id);

      data.users[userId].accessToken = accessToken;
      data.users[userId].refreshToken = refreshToken;
      await writeFile("src/database/database.json", JSON.stringify(data));

      return { isLogin: true, accessToken: accessToken, username: data.users[userId].username };
    }
    return { isLogin: false, accessToken: "", username: "" };
  };

  getUserProfile = async (username: string, token: string): Promise<ProfileInfo | boolean> => {
    let db = (await readFile("src/database/database.json")) as string;

    let data: Users = JSON.parse(db);
    const decodedToken = decode(token);

    const userId: number = data.users.findIndex((user) => user.username === username);
    if (userId !== -1) {
      const user: ProfileInfo = {
        photo: data.users[userId].photo,
        username: data.users[userId].username,
        name: data.users[userId].name,
        status: data.users[userId].status,
        description: data.users[userId].description,
        myUsername: decodedToken.username,
      };
      return { ...user };
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
    const db = (await readFile("src/database/database.json")) as string;
    let data: Users = JSON.parse(db);

    const userId: number = data.users.findIndex((user) => user.username === oldUsername);
    const secondUserId: number = data.users.findIndex((user) => user.username === username);
    const isAccessVerified = await verify(accessToken);

    if (isAccessVerified && (username === oldUsername || (userId !== -1 && secondUserId === -1))) {
      data.users[userId].photo = file ? file.filename : data.users[userId].photo;
      data.users[userId].username = username && username.length ? username : data.users[userId].username;
      data.users[userId].name = name && name.length ? name : data.users[userId].name;
      data.users[userId].status = status && status.length ? status : data.users[userId].status;
      data.users[userId].description = description && description.length ? description : data.users[userId].description;
      await writeFile("src/database/database.json", JSON.stringify(data));

      return { isUserEdited: true, user: { ...data.users[userId], refreshToken: "" } };
    }
    return { isUserEdited: false, user: {} };
  };
}

export default UserService;

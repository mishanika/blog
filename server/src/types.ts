export type User = {
  id: number;
  photo: string;
  username: string;
  password: string;
  name: string;
  status: string;
  description: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
};
export type Users = {
  users: User[];
};
export type RegisterBody = {
  username: string;
  password: string;
  repeatedPassword: string;
};
export type LoginBody = {
  username: string;
  password: string;
};
export type AuthBody = {
  accessToken: string;
};
export type ProfileBody = {
  username: string;
  token: string;
};
export type ProfileInfo = {
  username: string;
  name: string;
  status: string;
  description: string;
  myUsername: string;
};
export type EditBody = {
  username: string;
  name: string;
  status: string;
  description: string;
  oldUsername: string;
};

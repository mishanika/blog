import { WebSocket } from "ws";

export type Data = {
  users: User[];
  posts: Post[];
};

export type User = {
  id: string;
  photo: string;
  username: string;
  password: string;
  name: string;
  status: string;
  description: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
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
  photo: string;
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
  accessToken: string;
};

export type Post = {
  id: string;
  title: string;
  image: string;
  text: string;
  publisherPhoto: string;
  publisherUsername: string;
  comments: Comment[];
  commentsCounter: number;
};

export type PostBody = {
  title: string;
  elements: PostElement[];
  accessToken: string;
  date: number;
};

export type Comment = {
  id: number;
  publisherPhoto: string;
  publisherUsername: string;
  text: string;
  replies: Comment[];
};

export type CommentBody = {
  commentReplyId: number | null;
  text: string;
  accessToken: string;
  postId: number;
};

export type PostElement = {
  element: string;
  value: string;
};

export type SocketUser = {
  userSocket: WebSocket;
  id: string;
};

export type PostRooms = {
  [postId: string]: SocketUser[];
};

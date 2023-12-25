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
  id: number;
  title: string;
  image: string;
  text: string;
  publisherPhoto: string;
  publisherUsername: string;
  comments: Comment[];
  commentsCounter: number;
};
export type Posts = {
  posts: Post[];
};
export type PostBody = {
  text: string;
  title: string;
  accessToken: string;
};
export type Comment = {
  id: number;
  publisherPhoto: string;
  publisherUsername: string;
  text: string;
  replies: Comment[];
};
export type Comments = {
  comments: Comment[];
};
export type CommentBody = {
  commentReplyId: number | null;
  text: string;
  accessToken: string;
  postId: number;
};

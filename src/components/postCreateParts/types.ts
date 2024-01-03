import { PostElement } from "../../pages/createPost/CreatePost";

export type Props = {
  value: string;
  isActive: boolean;
  index: number;
  elements: PostElement[];
  onClick: () => void;
  setElements: React.Dispatch<React.SetStateAction<PostElement[]>>;
};

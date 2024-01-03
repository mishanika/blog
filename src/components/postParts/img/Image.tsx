import "./Image.scss";
import { Props } from "../types";

const Image: React.FC<Props> = ({ value }) => {
  return <img src={value} className="image" />;
};

export default Image;

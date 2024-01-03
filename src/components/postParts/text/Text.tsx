import "./Text.scss";
import { Props } from "../types";

const Text: React.FC<Props> = ({ value }) => {
  return (
    <span className="text-settings span-block">
      {value.split("\n").map((item) => (
        <p>{item}</p>
      ))}
    </span>
  );
};

export default Text;

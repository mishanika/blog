import "./H3.scss";
import { Props } from "../types";

const H3: React.FC<Props> = ({ value }) => {
  return (
    <h3 className="text-settings">
      {value.split("\n").map((item) => (
        <p>{item}</p>
      ))}
    </h3>
  );
};

export default H3;

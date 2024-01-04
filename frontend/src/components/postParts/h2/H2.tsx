import "./H2.scss";
import { Props } from "../types";

const H2: React.FC<Props> = ({ value }) => {
  return (
    <h2 className="text-settings">
      {value.split("\n").map((item) => (
        <p>{item}</p>
      ))}
    </h2>
  );
};

export default H2;

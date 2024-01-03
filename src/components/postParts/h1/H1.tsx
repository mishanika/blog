import "./H1.scss";
import { Props } from "../types";

const H1: React.FC<Props> = ({ value }) => {
  return <h1 className="text-settings">{value}</h1>;
};

export default H1;

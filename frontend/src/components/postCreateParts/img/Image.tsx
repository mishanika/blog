import { PropsWithChildren, useEffect, useState } from "react";
import "./Image.scss";
import { Props } from "../types";
import { decode } from "base64-arraybuffer";

const Image: React.FC<PropsWithChildren & Props> = ({ index, elements, setElements }) => {
  const [isImgPasted, setIsImgPasted] = useState(false);
  const [src, setSrc] = useState("");

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const base64 = await toBase64(file);

      if (typeof base64 === "string") {
        //base54 to ArrayBuffer
        //const buffer = decode(base64);
        //const decoder = new TextDecoder();

        //ArrayBuffer to string
        //const str = decoder.decode(buffer);
        elements[index].value = base64;
        // console.log(elements[index].value);

        // console.log(file.size);
        // console.log(new Blob([base64]).size);
        // console.log(await new Blob([base64]).arrayBuffer());
        // console.log(new Blob([base64]).stream());
        // console.log(await new Blob([base64]).text());

        setSrc(URL.createObjectURL(file));
        setIsImgPasted(true);
        setElements((prev) => [...prev]);
      }
    }
  };

  return isImgPasted ? (
    <img src={src} className="image" />
  ) : (
    <div className="file-input">
      <input type="file" className="img-change" onChange={(e) => handleChange(e)} multiple={false} />
      <span>Click to choose image</span>
    </div>
  );
};

export default Image;

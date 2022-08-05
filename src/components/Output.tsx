import { useState, useEffect } from "react";
import { tempInputs } from "./TableContents";

function Output() {
  const tempInputsToText = (tempInputs: { [inputName: string]: string }) => {
    let temp: string[] = [];
    return temp.toString();
  };
  const [text, setText] = useState("변환에 실패하였습니다");
  useEffect(() => {}, []);
  // setText(a);
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(event.target.value);
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

import { useState, useEffect } from "react";
import { cellValueList } from "./TableContents";

export default function Output() {
  const cellValueToText = (cellValueList: string[][]) => {
    let temp: string[] = [];
    for (let i = 0; i < cellValueList.length; i++) {
      temp.push(...cellValueList[i]);
    }
    return temp.toString();
  };
  const a = cellValueToText(cellValueList);
  const [text, setText] = useState("변환에 실패하였습니다");
  useEffect(() => {
    console.log("Out", cellValueList);
    setText(cellValueToText(cellValueList));
  }, []);
  // setText(a);
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(event.target.value);
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}

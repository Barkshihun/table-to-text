import { useState } from "react";
import { cellValueList } from "./TableContents";

function Output() {
  const cellValueToText = (cellValueList: string[][]) => {
    let temp: string[] = [];
    for (let i = 0; i < cellValueList.length; i++) {
      temp.push(...cellValueList[i]);
    }
    return temp.toString();
  };
  cellValueToText(cellValueList);
  const [text, setText] = useState(cellValueToText(cellValueList));
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(event.target.value);
  console.log(cellValueList[1][1]);
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}

export default Output;

import { useState, useEffect } from "react";
import { golbalRows, globalCols } from "./Table";
import { globalInputs } from "./TableContents";

function Output() {
  const [text, setText] = useState("변환에 실패하였습니다");
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setText(event.target.value);
  };
  const globalInputsToText = (globalInputs: {
    [inputName: string]: string;
  }) => {
    let temp: string[] = [];
    return temp.toString();
  };
  // console.log("globalInputs", globalInputs);
  const getLongestTextPerCol = (globalInputs: tableInputObj) => {
    let longestTextPerCol: number[] = [];
    for (const coord in globalInputs) {
      const col = parseInt(coord.split(",")[1]);
      const textLength = globalInputs[coord].length;
      if (!longestTextPerCol[col] || longestTextPerCol[col] < textLength) {
        longestTextPerCol[col] = textLength;
      }
    }
    return longestTextPerCol;
  };
  const longestTextPerCol = getLongestTextPerCol(globalInputs);
  console.log("longestTextPerCol", longestTextPerCol);
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

import { useState, useEffect } from "react";
import { globalInputs } from "./TableContents";

function Output() {
  const [text, setText] = useState("변환에 실패하였습니다");
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setText(event.target.value);
  };
  /*
  if (!globalInputs) {
    console.log("실패");
  }
  const tempInputsToText = (tempInputs: { [inputName: string]: string }) => {
    let temp: string[] = [];
    return temp.toString();
  };
  // console.log("tempInputs", tempInputs);
  const getTableList = () => {
    let tableList: string[][] = [];
    let indexRow = 0;
    let sameColList = [];
    for (const key in tempInputs) {
      const row = parseInt(key.split(",")[0]);
      const col = parseInt(key.split(",")[1]);
      if (indexRow !== row) {
        tableList.push(sameColList);
        sameColList = [];

        sameColList.push(tempInputs[key]);
        indexRow = row;
        continue;
      }
      sameColList.push(tempInputs[key]);
    }
    tableList.push(sameColList);
    return tableList;
  };
  const getLongestTextPerCol = (tableList: string[][]) => {
    const longestTextPerCol = [];
    for (let i = 0; i < tableList.length; i++) {
      const colTextLength = [];
      for (let j = 0; j < tableList[i].length; j++) {
        colTextLength.push(tableList[i][j].length);
      }
      longestTextPerCol.push(Math.max(...colTextLength));
    }
    return longestTextPerCol;
  };
  const tableList = getTableList();
  const longestTextPerCol = getLongestTextPerCol(tableList);
  // console.log(longestTextPerCol, tableList);
*/
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

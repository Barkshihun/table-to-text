import { useState, useEffect } from "react";
import { golbalRows, globalCols, globalInputs } from "./Table";
// col이 가로 row가 세로
function Output() {
  const [text, setText] = useState("변환에 실패하였습니다");
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setText(event.target.value);
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
  const getTableList = (globalInputs: tableInputObj) => {
    let tableList = new Array(golbalRows);
    for (let i = 0; i < tableList.length; i++) {
      tableList[i] = new Array(globalCols);
    }
    for (let coord in globalInputs) {
      const row = parseInt(coord.split(",")[0]);
      const col = parseInt(coord.split(",")[1]);
      tableList[row][col] = globalInputs[coord];
    }
    return tableList;
  };
  const tableList = getTableList(globalInputs);
  const longestTextPerCol = getLongestTextPerCol(globalInputs);
  const globalInputsToText = (tableList: string[][]) => {
    let tempList: string[] = [];
    for (let i = 0; i < tableList.length; i++) {
      for (let j = 0; j < tableList[i].length; j++) {
        tempList.push(tableList[i][j]);
      }
      tempList.push("\n");
    }
    tempList.pop;
    return tempList.join("");
  };
  useEffect(() => {
    setText(globalInputsToText(tableList));
  }, []);
  console.log(
    "longestTextPerCol",
    longestTextPerCol,
    "globalInputs",
    globalInputs,
    "globalInputsToText(globalInputs)",
    globalInputsToText(tableList)
  );
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;
/*
    let temp = [];
    for (let row = 0; row < tableList.length; row++) {
      for (let col = 0; col < tableList[row].length; col++) {
        temp.push(tableList[row][col]);
      }
      temp.push("\n");
    }
    temp.pop();
    return temp.join("");
*/

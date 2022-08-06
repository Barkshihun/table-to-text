import { useState, useEffect } from "react";
import { tempInputs } from "./TableContents";

function Output() {
  const tempInputsToText = (tempInputs: { [inputName: string]: string }) => {
    let temp: string[] = [];
    return temp.toString();
  };

  const getTableList = () => {
    let tableList: string[][] = [];
    let indexRow = 0;
    let sameRowList = [];
    for (const key in tempInputs) {
      const row = parseInt(key.split(",")[0]);
      const col = parseInt(key.split(",")[1]);
      if (indexRow !== row) {
        tableList.push(sameRowList);
        sameRowList = [];

        sameRowList.push(tempInputs[key]);
        indexRow = row;
        continue;
      }
      sameRowList.push(tempInputs[key]);
    }
    tableList.push(sameRowList);
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
  console.log(longestTextPerCol, tableList);

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

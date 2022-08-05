import { useState, useEffect } from "react";
import { tempInputs } from "./TableContents";

function Output() {
  const tempInputsToText = (tempInputs: { [inputName: string]: string }) => {
    let temp: string[] = [];
    return temp.toString();
  };
  const getLongestText = () => {
    let lengthList = [];
    for (const key in tempInputs) {
      lengthList.push(tempInputs[key].length);
    }
    return Math.max(...lengthList);
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
  const longestText = getLongestText();
  const tableList = getTableList();
  console.log(longestText, tableList);

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

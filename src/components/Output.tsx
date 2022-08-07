import { useState, useEffect } from "react";
import { golbalRows, globalCols, globalInputs } from "./Table";
// col이 가로 row가 세로
function Output() {
  const [text, setText] = useState("변환에 실패하였습니다");
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  // console.log("globalInputs", globalInputs);
  const computeLength = (str: string) => {
    let textLength = 0;
    // 2
    const isCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
    const isThick = /[@]/g;
    //1
    const isEng = /[a-z|A-Z]/g;
    const isElse = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|@]/g;
    //
    let cjkList = str.match(isCJK);
    let thickList = str.match(isThick);
    let engList = str.match(isEng);
    let elseList = str.match(isElse);
    if (cjkList) {
      textLength = textLength + cjkList.length * 2;
    }
    if (thickList) {
      textLength = textLength + thickList.length * 2;
    }
    if (engList) {
      textLength = textLength + engList.length;
    }
    if (elseList) {
      textLength = textLength + elseList.length;
    }
    return textLength;
  };
  const getLongestTextPerCol = (globalInputs: tableInputObj) => {
    let longestTextPerCol: number[] = [];
    for (const coord in globalInputs) {
      const col = parseInt(coord.split(",")[1]);
      const textLength = computeLength(globalInputs[coord]);
      // console.log(
      //   "globalInputs[coord]",
      //   globalInputs[coord],
      //   "computeLength(globalInputs[coord])",
      //   computeLength(globalInputs[coord])
      // );
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
  const longestTextPerColList = getLongestTextPerCol(globalInputs);
  const globalInputsToText = (tableList: string[][]) => {
    let textList: string[] = [];
    for (let row = 0; row < golbalRows; row++) {
      for (let col = 0; col < globalCols; col++) {
        let text = tableList[row][col];
        if (text) {
          const textLength = computeLength(text);
          if (textLength < longestTextPerColList[col]) {
            const gap = longestTextPerColList[col] - computeLength(text);
            text = `${text}${" ".repeat(gap)}`;
          }
        } else {
          text = `${" ".repeat(longestTextPerColList[col])}`;
        }
        textList.push(`${text} | `);
      }
      textList.push("\n");
    }
    textList.pop;
    return textList.join("");
  };
  useEffect(() => {
    setText(globalInputsToText(tableList));
  }, []);
  // console.log(
  //   "longestTextPerColList",
  //   longestTextPerColList,
  //   "globalInputs",
  //   globalInputs,
  //   "globalInputsToText(globalInputs)",
  //   globalInputsToText(tableList)
  // );
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

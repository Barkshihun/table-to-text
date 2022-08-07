import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
// col이 가로 row가 세로
const isVerticalLine = true;
const isHorizontalLine = true;
const isBorder = true;
function Output() {
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
  const getLongestTextPerCol = (globalTableList: string[][]) => {
    let longestTextPerCol: number[] = [];

    for (let col = 0; col < cols; col++) {
      let tempList = [];
      for (let row = 0; row < rows; row++) {
        tempList.push(computeLength(globalTableList[row][col]));
      }
      longestTextPerCol.push(Math.max(...tempList));
    }

    return longestTextPerCol;
  };
  const longestTextPerColList = getLongestTextPerCol(globalTableList);
  const totalWidth =
    longestTextPerColList.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    ) +
    cols * 3;
  console.log(totalWidth);
  const globalTableListToText = (tableList: string[][]) => {
    let textList: string[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
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
        isVerticalLine
          ? textList.push(`${text} | `)
          : textList.push(`${text}   `);
      }
      isHorizontalLine
        ? textList.push(`\n${"=".repeat(totalWidth)}\n`)
        : textList.push("\n");
    }
    textList.pop;
    return textList.join("");
  };
  const [text, setText] = useState(globalTableListToText(globalTableList));

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // console.log("longestTextPerColList", longestTextPerColList);
  return (
    <>
      <textarea cols={30} rows={10} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

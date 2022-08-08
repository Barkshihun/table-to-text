import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
import "../scss/Output.scss";

const HORIZONTAL_CHAR = "-";
const VERTICAL_CHAR = "|";

const thickChars = ["@", "\u25A0-\u25FF"];
function Output({ isVerticalLine, isHorizontalLine }: { isVerticalLine: boolean; isHorizontalLine: boolean }) {
  // 정규표현식 시작
  // +20로 계산  +2
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  // +10로 계산  +1
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(`[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join("|")}]`, "g");
  // 정규표현식 끝

  const computeLength = (str: string) => {
    let textLength = 0;
    const cjkList = str.match(regCJK);
    const thickList = str.match(regThick);
    const engList = str.match(regEng);
    const elseList = str.match(regElse);
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
  const getLongestTextPerCol = () => {
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
  const longestTextPerColList = getLongestTextPerCol();
  const computeText = (row: number, col: number): string => {
    let text = globalTableList[row][col];
    if (text) {
      const textLength = computeLength(text);
      if (textLength < longestTextPerColList[col]) {
        const gap = longestTextPerColList[col] - computeLength(text);
        text = `${text}${" ".repeat(gap)}`;
      }
    } else {
      text = `${" ".repeat(longestTextPerColList[col])}`;
    }
    return text;
  };
  //
  const endOfRowIndex = rows - 1;
  const endOfColIndex = cols - 1;
  const getHorizontalLineWidth = () => {
    let textList: string[] = [];
    const row = 0;
    for (let col = 0; col < cols; col++) {
      let text = computeText(row, col);
      if (col === 0) {
        // col의 시작인가?
        text = `${" ".repeat(2)}${text}`;
      }
      if (isVerticalLine) {
        // 세로선이 있는가?
        if (col === endOfColIndex) {
          // col의 끝인가?
          textList.push(`${text}${" ".repeat(2)}`);
        } else {
          textList.push(`${text}${" ".repeat(2)}${VERTICAL_CHAR}${" ".repeat(2)}`);
        }
        continue;
      }
      textList.push(`${text}${" ".repeat(2)}`);
    }
    return computeLength(textList.join(""));
  };
  const horizontalLineWidth = getHorizontalLineWidth();
  //
  const globalTableListToText = () => {
    let textList: string[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let text = computeText(row, col);
        if (col === 0) {
          // col의 시작인가?
          text = `${" ".repeat(2)}${text}`;
        }
        if (isVerticalLine) {
          // 세로선이 있는가?
          if (col === endOfColIndex) {
            // col의 끝인가?
            textList.push(`${text}${" ".repeat(2)}`);
          } else {
            textList.push(`${text}${" ".repeat(2)}${VERTICAL_CHAR}${" ".repeat(2)}`);
          }
          continue;
        }
        textList.push(`${text}${" ".repeat(2)}`);
      }
      if (row === endOfRowIndex && isHorizontalLine) {
        // row의 마지막에서 가로선이 있다면 그리지 말고 넘겨라
        continue;
      }
      if (isHorizontalLine) {
        // 가로선을 그려야 하는가?
        textList.push(`\n${HORIZONTAL_CHAR.repeat(horizontalLineWidth)}\n`);
        continue;
      }
      textList.push("\n");
    }
    return textList.join("");
  };
  const [text, setText] = useState(globalTableListToText());

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  useEffect(() => {
    setText(globalTableListToText());
  }, [isVerticalLine, isHorizontalLine]);
  return (
    <>
      <textarea cols={60} rows={15} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

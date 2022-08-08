import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
import "../scss/Output.scss";

const HORIZONTAL_CHAR = "-";
const VERTICAL_CHAR = "|";
const HORIZONTAL_BORDER_CHAR = "#"; // ■
const VERTICAL_BORDER_CHAR = "#";

const thickChars = ["@", "\u25A0-\u25FF"];
const thinChars = ["-"];
const bitThickChars = [""];
function Output({ isVerticalLine, isHorizontalLine, isBorder }: { isVerticalLine: boolean; isHorizontalLine: boolean; isBorder: boolean }) {
  // 정규표현식 시작
  // +20로 계산  +2
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  // +5로 계산  +0.5 (1보다 작은 글자)
  const regThin = new RegExp(`[${thinChars.join("|")}]`, "g");
  // +15로 계산 +15
  const regBitThick = new RegExp(`[${bitThickChars.join("|")}]`, "g");
  // +10로 계산  +1
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(`[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join("|")}|${thinChars.join("|")}|${bitThickChars.join("|")}]`, "g");
  // 정규표현식 끝

  const computeLength = (str: string) => {
    let textLength = 0;
    const cjkList = str.match(regCJK);
    const thickList = str.match(regThick);
    const engList = str.match(regEng);
    const thinList = str.match(regThin);
    const bitThickList = str.match(regBitThick);
    const elseList = str.match(regElse);
    if (cjkList) {
      textLength = textLength + cjkList.length * 20;
    }
    if (thickList) {
      textLength = textLength + thickList.length * 20;
    }
    if (engList) {
      textLength = textLength + engList.length * 10;
    }
    if (elseList) {
      textLength = textLength + elseList.length * 10;
    }
    if (bitThickList) {
      textLength = textLength + bitThickList.length * 15;
    }
    if (thinList) {
      textLength = textLength + thinList.length * 5;
    }
    textLength = Math.round(textLength / 10);
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
  const computeWidth = (str: string): number => {
    let tableWidth = 0;
    const isCJK = regCJK.test(str);
    const isThick = regThick.test(str);
    const isThin = regThin.test(str);
    const isBitThick = regBitThick.test(str);
    tableWidth = longestTextPerColList.reduce((previousValue, currentValue) => previousValue + currentValue, 0) + cols * 3;
    if (isThin) {
      tableWidth = Math.round(tableWidth / 0.5);
    }
    if (isBitThick) {
      tableWidth = Math.round(tableWidth / 1.5);
    }
    if (isCJK || isThick) {
      tableWidth = tableWidth + Math.round(tableWidth / 2);
    }
    return tableWidth;
  };
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
  const horizontalLineWidth = computeWidth(HORIZONTAL_CHAR);
  computeWidth("");
  const borderLineWidth = computeWidth(HORIZONTAL_BORDER_CHAR);
  //
  // console.log("horizontalLineWidth", horizontalLineWidth, "borderLineWidth", borderLineWidth);
  const endOfRowIndex = rows - 1;
  const endOfColIndex = cols - 1;
  const globalTableListToText = () => {
    let textList: string[] = [];
    if (isBorder) {
      textList.push(`${HORIZONTAL_BORDER_CHAR.repeat(borderLineWidth)}\n`);
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let text = computeText(row, col);
        if (col === 0) {
          // col의 시작인가?
          if (isBorder) {
            text = `${VERTICAL_BORDER_CHAR}${" ".repeat(2)}${text}`;
          } else {
            text = `${" ".repeat(2)}${text}`;
          }
        }
        if (col === endOfColIndex && isBorder) {
          // col의 끝이며 테두리를 그려야 하는가?
          textList.push(`${text}${" ".repeat(2)}${VERTICAL_BORDER_CHAR}`);
          continue;
        }
        if (isVerticalLine) {
          // 세로선이 있는가?
          if (col === endOfColIndex) {
            // col의 끝인가?
            textList.push(`${text}`);
            continue;
          }
          textList.push(`${text}${" ".repeat(2)}${VERTICAL_CHAR}${" ".repeat(2)}`);
          continue;
        }
        textList.push(`${text}${" ".repeat(2)}`);
      }
      if (row === endOfRowIndex) {
        // row의 마지막에서
        if (isBorder) {
          // 테두리가 있다면
          textList.push(`\n${HORIZONTAL_BORDER_CHAR.repeat(borderLineWidth)}`);
          continue;
        }
        if (isHorizontalLine) {
          // 가로선이 있다면 그리지 말고 넘겨라
          continue;
        }
      }
      if (isHorizontalLine) {
        // 가로선을 그려야 하는가?
        let horizontalLine;
        if (isBorder) {
          horizontalLine = `\n${VERTICAL_BORDER_CHAR}${HORIZONTAL_CHAR.repeat(horizontalLineWidth)}${VERTICAL_BORDER_CHAR}\n`;
        } else {
          horizontalLine = `\n${HORIZONTAL_CHAR.repeat(horizontalLineWidth)}\n`;
        }
        textList.push(horizontalLine);
        continue;
      }
      textList.push("\n");
    }
    // console.log(textList);
    return textList.join("");
  };
  const [text, setText] = useState(globalTableListToText());

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  useEffect(() => {
    setText(globalTableListToText());
  }, [isVerticalLine, isHorizontalLine, isBorder]);
  return (
    <>
      <textarea cols={60} rows={15} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

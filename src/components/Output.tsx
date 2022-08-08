import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
import "../scss/Output.scss";

const HORIZONTAL_CHAR = "-";
const VERTICAL_CHAR = "|";
const HORIZONTAL_BORDER_CHAR = "#"; // ■
const VERTICAL_BORDER_CHAR = "#";

const thickChars: string[] = ["@", "\u25A0-\u25FF"];
function Output({
  isVerticalLine,
  isHorizontalLine,
  isBorder,
}: {
  isVerticalLine: boolean;
  isHorizontalLine: boolean;
  isBorder: boolean;
}) {
  // 정규표현식 시작
  // +2로 계산
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  //1로 계산
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(
    `[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join(
      "|"
    )}]`,
    "g"
  );
  // 정규표현식 끝

  const computeLength = (str: string) => {
    let textLength = 0;
    let cjkList = str.match(regCJK);
    let thickList = str.match(regThick);
    let engList = str.match(regEng);
    let elseList = str.match(regElse);
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
  const computeWidth = (str: string): number => {
    const isCJK = regCJK.test(str);
    const isThick = regThick.test(str);
    const tableWidth =
      longestTextPerColList.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ) +
      cols * 3;
    if (isCJK || isThick) {
      return Math.round(tableWidth / 2);
    } else {
      return tableWidth;
    }
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
  // 12
  const horizontalLineWidth = computeWidth(HORIZONTAL_CHAR);
  computeWidth("");
  const borderLineWidth = computeWidth(HORIZONTAL_BORDER_CHAR);
  const globalTableListToText = () => {
    let textList: string[] = [];
    if (isBorder) {
      textList.push(`${HORIZONTAL_BORDER_CHAR.repeat(borderLineWidth + 1)}\n`);
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let text = computeText(row, col);
        if (isBorder && col === 0) {
          text = `${VERTICAL_BORDER_CHAR} ${text}`;
        }
        if (col === cols - 1) {
          if (isBorder) {
            textList.push(`${text} ${VERTICAL_BORDER_CHAR}`);
            continue;
          }
          textList.push(`${text}`);
          continue;
        }
        if (isVerticalLine) {
          textList.push(`${text} ${VERTICAL_CHAR} `);
          continue;
        }
        textList.push(`${text}   `);
      }
      if (row === rows - 1) {
        if (isBorder) {
          textList.push(
            `\n${HORIZONTAL_BORDER_CHAR.repeat(borderLineWidth + 1)}`
          );
          continue;
        }
        if (isHorizontalLine) {
          continue;
        }
      }
      if (isHorizontalLine) {
        if (isBorder) {
          textList.push(
            `\n${VERTICAL_BORDER_CHAR}${HORIZONTAL_CHAR.repeat(
              horizontalLineWidth - 1
            )}${VERTICAL_BORDER_CHAR}\n`
          );
          continue;
        }
        textList.push(`\n${HORIZONTAL_CHAR.repeat(horizontalLineWidth - 2)}\n`);
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
  }, [isVerticalLine, isHorizontalLine, isBorder]);
  return (
    <>
      <textarea cols={60} rows={15} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
const HORIZONTAL_CHAR = "-";
const VERTICAL_CHAR = "|";
const HORIZONTAL_BORDER_CHAR = "#";
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
  const computeLength = (str: string) => {
    let textLength = 0;
    // 정규표현식 시작
    // +2로 계산
    const isCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
    const isThick = new RegExp(`[${thickChars.join("|")}]`, "g");
    //1로 계산
    const isEng = /[a-z|A-Z]/g;
    const isElse = new RegExp(
      `[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join(
        "|"
      )}]`,
      "g"
    );
    // 정규표현식 끝
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
  const totalWidth =
    longestTextPerColList.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    ) +
    cols * 3 -
    2;
  // console.log(totalWidth);
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
  const globalTableListToText = (tableList: string[][]) => {
    console.log("변환 시작");
    let textList: string[] = [];
    isBorder
      ? textList.push(`${HORIZONTAL_BORDER_CHAR.repeat(totalWidth + 2)}\n`)
      : null;
    for (let row = 0; row < rows; row++) {
      // isBorder ? textList.push(`${VERTICAL_BORDER_CHAR} `) : null;
      for (let col = 0; col < cols; col++) {
        let text = computeText(row, col);
        if (isVerticalLine) {
          if (col === cols - 1) {
            isBorder
              ? textList.push(`${text} ${VERTICAL_BORDER_CHAR}`)
              : textList.push(`${text}   `);
            continue;
          }
          textList.push(`${text} ${VERTICAL_CHAR} `);
        } else {
          textList.push(`${text}   `);
        }
      }
      // isBorder ? textList.push(` ${HORIZONTAL_CHAR}`) : null;
      if (isHorizontalLine) {
        if (row === rows - 1) {
          isBorder
            ? textList.push(
                `\n${HORIZONTAL_BORDER_CHAR.repeat(totalWidth + 2)}`
              )
            : null;

          continue;
        }
        isBorder
          ? textList.push(
              `\n${HORIZONTAL_CHAR.repeat(totalWidth)}${VERTICAL_BORDER_CHAR}`
            )
          : textList.push(`\n${HORIZONTAL_CHAR.repeat(totalWidth)}`);
      } else {
        textList.push("\n");
      }
      textList.push("\n");
    }
    console.log("변환 끝");
    return textList.join("");
  };
  const [text, setText] = useState(globalTableListToText(globalTableList));

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // console.log("longestTextPerColList", longestTextPerColList);
  console.log("연산 끝");
  return (
    <>
      <textarea cols={60} rows={15} value={text} onChange={onChange}></textarea>
    </>
  );
}
export default Output;

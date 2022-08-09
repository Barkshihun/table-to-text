import { useState, useEffect } from "react";
import { rows, cols, globalTableList } from "./Table";
import "../scss/Output.scss";

const thickChars = ["@", "\u25A0-\u25FF"];
function Output() {
  const [space, setSpace] = useState(" ");

  // 정규표현식 시작
  // +20로 계산  +2
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  // +10로 계산  +1
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(`[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join("|")}]`, "g");
  // 정규표현식 끝

  const spaceInTable = space === " " ? `${space.repeat(2)}` : `${space.repeat(1)}`;
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
  const getLongestComputedLengthPerCol = () => {
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
  const longestTextPerColList = getLongestComputedLengthPerCol();
  const computeText = (row: number, col: number): string => {
    let text = globalTableList[row][col];
    if (text) {
      const textLength = computeLength(text);
      if (textLength < longestTextPerColList[col]) {
        let gap = longestTextPerColList[col] - computeLength(text);
        if (space === "\u3000") {
          gap = Math.round(gap / 2);
        }
        text = `${text}${space.repeat(gap)}`;
      }
    } else {
      if (space === "\u3000") {
        text = `${space.repeat(Math.round(longestTextPerColList[col] / 2))}`;
      } else {
        text = `${space.repeat(longestTextPerColList[col])}`;
      }
    }
    return text;
  };
  const globalTableListToText = () => {
    let textList: string[] = [];
    const endOfRowIndex = rows - 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let text = computeText(row, col);
        if (col === 0) {
          // col의 시작인가?
          text = `${spaceInTable}${text}`;
        }
        textList.push(`${text}${spaceInTable}`);
      }
      if (row === endOfRowIndex) {
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
  const onChangeSpaceClick = () => {
    setSpace((currentSpace) => {
      switch (currentSpace) {
        case " ":
          return "\u3000";
        case "\u3000":
          return " ";
        default:
          return " ";
      }
    });
  };
  useEffect(() => {
    setText(globalTableListToText());
  }, [space]);
  const changeSpaceBtnText = space === " " ? "반각 띄어쓰기\nU+0020\n| |" : "전각 띄어쓰기\nU+3000\n|　|";
  return (
    <div className="output-container">
      <input type="button" value={changeSpaceBtnText} onClick={onChangeSpaceClick} className="transform-btn space-change-btn" />
      <textarea cols={60} rows={15} value={text} onChange={onChange}></textarea>
    </div>
  );
}
export default Output;

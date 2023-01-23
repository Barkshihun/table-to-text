import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Swal from "sweetalert2";
import "../scss/Output.scss";

let globalSpace: " " | "\u3000" = " ";
function Output() {
  const cols = useSelector((state: RootState) => state.table.colsForTransform);
  const rows = useSelector((state: RootState) => state.table.rowsForTransform);
  const tableList = useSelector((state: RootState) => state.table.tableListForTransform);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const changeSpaceBtnRef = useRef<HTMLInputElement>(null);
  console.table(tableList);
  console.log("로그다!", cols, rows);

  // 정규표현식 시작
  // +20로 계산  +2
  const thickChars = ["@", "\u25A0-\u25FF"];
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  // +10로 계산  +1
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(`[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join("|")}]`, "g");
  // 정규표현식 끝

  const spaceInTable = globalSpace === " " ? `${globalSpace.repeat(2)}` : `${globalSpace.repeat(1)}`;
  const computeLength = (str: string) => {
    let textLength = 0;
    if (!str) {
      return 0;
    }
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
        tempList.push(computeLength(tableList[row][col]));
      }
      longestTextPerCol.push(Math.max(...tempList));
    }

    return longestTextPerCol;
  };
  const longestTextPerColList = getLongestComputedLengthPerCol();
  const computeText = (row: number, col: number): string => {
    let text = tableList[row][col];
    if (text) {
      const textLength = computeLength(text);
      if (textLength < longestTextPerColList[col]) {
        let gap = longestTextPerColList[col] - computeLength(text);
        if (globalSpace === "\u3000") {
          gap = Math.round(gap / 2);
        }
        text = `${text}${globalSpace.repeat(gap)}`;
      }
    } else {
      if (globalSpace === "\u3000") {
        text = `${globalSpace.repeat(Math.round(longestTextPerColList[col] / 2))}`;
      } else {
        text = `${globalSpace.repeat(longestTextPerColList[col])}`;
      }
    }
    return text;
  };
  const tableListToText = () => {
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
  const getHorizontalWidth = () => {
    let textList: string[] = [];
    const row = 0;
    for (let col = 0; col < cols; col++) {
      let text = computeText(row, col);
      if (col === 0) {
        text = `${" ".repeat(2)}${text}`;
      }
      textList.push(`${text}${" ".repeat(2)}`);
    }
    return textList.join("").length;
  };
  const onChangeSpaceClick = () => {
    const findSpaces = new RegExp(`${globalSpace}`, "g");
    const textarea = textareaRef.current as HTMLTextAreaElement;
    const changeSpaceBtn = changeSpaceBtnRef.current as HTMLInputElement;
    if (globalSpace === " ") {
      textarea.value = textarea.value.replace(findSpaces, "\u3000");
      changeSpaceBtn.value = "전각 띄어쓰기\nU+3000\n|\u3000|";
      globalSpace = "\u3000";
    } else {
      textarea.value = textarea.value.replace(findSpaces, " ");
      changeSpaceBtn.value = "반각 띄어쓰기\nU+0020\n| |";
      globalSpace = " ";
    }
  };
  const onCopy = () => {
    const text = textareaRef.current?.value as string;
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: "복사 성공",
      timer: 1000,
      position: "top",
      padding: "1em 1em 2.5em",
      showConfirmButton: false,
      icon: "success",
    });
  };

  console.count("렌더");
  return (
    <main className={"output-container"}>
      <div className={"btn-container--textarea-left"}>
        <input className="btn btn--textarea-left" type={"button"} onClick={onCopy} value={"COPY"} />
        <input
          className="btn btn--textarea-left"
          type={"button"}
          ref={changeSpaceBtnRef}
          value={globalSpace === " " ? "반각 띄어쓰기\nU+0020\n| |" : "전각 띄어쓰기\nU+3000\n|\u3000|"}
          onClick={onChangeSpaceClick}
        />
      </div>
      <textarea className="malgun-gothic" ref={textareaRef} defaultValue={tableListToText()} style={{ height: `${rows + 3}em`, width: `${getHorizontalWidth()}em` }} spellCheck={false}></textarea>
    </main>
  );
}

export default Output;

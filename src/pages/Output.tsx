import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Swal from "sweetalert2";

let prevSpace: " " | "\u3000" = " ";
function Output() {
  const cols = useSelector((state: RootState) => state.table.colsForTransform);
  const rows = useSelector((state: RootState) => state.table.rowsForTransform);
  const tableList = useSelector((state: RootState) => state.table.tableListForTransform);
  const preRef = useRef<HTMLPreElement>(null);
  const [space, setSpace] = useState(prevSpace);

  // 정규표현식 시작
  // +20로 계산  +2
  const thickChars = ["@", "\u25A0-\u25FF"];
  const regCJK = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥]/g;
  const regThick = new RegExp(`[${thickChars.join("|")}]`, "g");
  // +10로 계산  +1
  const regEng = /[a-z|A-Z]/g;
  const regElse = new RegExp(`[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|ぁ-ゔ|ァ-ヴー|々〆〤|一-龥|a-z|A-Z|${thickChars.join("|")}]`, "g");
  // 정규표현식 끝

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
  const tableListToText = () => {
    let textList: string[] = [];
    const spaceInTable = space === " " ? `${space.repeat(2)}` : `${space.repeat(1)}`;
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
  const onChangeSpaceClick = () => {
    setSpace((currentSpace) => {
      switch (currentSpace) {
        case " ":
          prevSpace = "\u3000";
          return "\u3000";
        case "\u3000":
          prevSpace = " ";
          return " ";
      }
    });
  };
  const onCopy = () => {
    const text = preRef.current?.innerText as string;
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
  const onInput = (event: React.ChangeEvent<HTMLPreElement>) => {
    if (event.target.innerText === "") {
      event.target.innerHTML = "<p><br/></p>";
    }
  };
  const onPaste = (event: React.ClipboardEvent<HTMLPreElement>) => {
    event.preventDefault();
    const clipboardText = event.clipboardData.getData("text/plain").replace(/\r/g, "");
    const clipboardTextLength = clipboardText.length;
    const selection = getSelection() as Selection;
    selection.deleteFromDocument();
    let target = event.target as HTMLParagraphElement;
    if (target.nodeName === "BR") {
      target = target.parentNode as HTMLParagraphElement;
      target.innerHTML = clipboardText;
      const textNode = target.childNodes[0];
      selection.setBaseAndExtent(textNode, clipboardTextLength, textNode, clipboardTextLength);
      return;
    }
    const textNode = target.childNodes[0];
    const textContent = textNode.textContent as string;
    const focusOffset = selection.focusOffset;
    const outputText = textContent.slice(0, focusOffset) + clipboardText + textContent.slice(focusOffset);
    textNode.textContent = outputText;
    const outputFocusOffset = focusOffset + clipboardTextLength;
    selection.setBaseAndExtent(textNode, outputFocusOffset, textNode, outputFocusOffset);
  };

  return (
    <main className={"output-container"}>
      <div className={"sub-btn-container"}>
        <input className="btn btn--emphasize sub-btn-container__btn sub-btn-container__btn--output" type={"button"} onClick={onCopy} value={"COPY"} />
        <input
          className="btn btn--emphasize sub-btn-container__btn sub-btn-container__btn--output"
          type={"button"}
          value={space === " " ? "반각 띄어쓰기\nU+0020\n| |" : "전각 띄어쓰기\nU+3000\n|\u3000|"}
          onClick={onChangeSpaceClick}
        />
      </div>
      <div className="output-container__pre-container">
        <pre contentEditable className="malgun-gothic output-container__pre" ref={preRef} onInput={onInput} onPaste={onPaste} spellCheck={false} suppressContentEditableWarning={true}>
          <p>{tableListToText()}</p>
        </pre>
      </div>
    </main>
  );
}

export default Output;

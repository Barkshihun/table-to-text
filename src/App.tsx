import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import "./scss/App.scss";

let rows = 2;
let cols = 2;
let globalTableList: string[][] = [];
const thickChars = ["@", "\u25A0-\u25FF"];
function App() {
  const [isTable, setIsTable] = useState(true);

  // Table
  function Table() {
    const makeTableList = () => {
      let tableList = new Array(rows);
      for (let row = 0; row < rows; row++) {
        tableList[row] = new Array(cols);
        for (let col = 0; col < cols; col++) {
          if (globalTableList[row]) {
            tableList[row][col] = globalTableList[row][col] ? globalTableList[row][col] : `${row}`;
          } else {
            tableList[row][col] = `${row}`;
          }
        }
      }
      return tableList;
    };
    const [tableList, setTableList] = useState(makeTableList());
    // 클릭 이벤트 시작
    const controlPlus = (target: "rows" | "cols") => {
      if (rows === 0) {
        rows = 1;
        cols = 1;
        setTableList(makeTableList());
        return;
      }
      switch (target) {
        case "rows":
          rows++;
          setTableList(makeTableList());
          break;
        case "cols":
          cols++;
          setTableList(makeTableList());
          break;
      }
    };
    const controlMinus = (target: "rows" | "cols") => {
      if ((target === "rows" && rows <= 1) || (target === "cols" && cols <= 1)) {
        rows = 0;
        cols = 0;
        globalTableList = [];
        setTableList([]);
        return;
      }
      switch (target) {
        case "rows":
          rows--;
          setTableList(makeTableList());
          break;
        case "cols":
          cols--;
          setTableList(makeTableList());
          break;
      }
    };
    const onRowPlus = () => controlPlus("rows");
    const onRowMinus = () => controlMinus("rows");
    const onColPlus = () => controlPlus("cols");
    const onColMinus = () => controlMinus("cols");
    const getLongestTextPerCol = () => {
      let longestTextPerCol: number[] = [];

      for (let col = 0; col < cols; col++) {
        let tempList = [];
        for (let row = 0; row < rows; row++) {
          tempList.push(tableList[row][col].length);
        }
        longestTextPerCol.push(Math.max(...tempList));
      }

      return longestTextPerCol;
    };
    let longestTextPerCol = getLongestTextPerCol();
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.dataset.row && event.target.dataset.col) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        globalTableList[row][col] = event.target.value;
        if (longestTextPerCol[col] < event.target.value.length) {
          longestTextPerCol[col] = event.target.value.length;
        }
        setTableList([...globalTableList]);
      }
    };
    // 클릭 이벤트 끝
    const setTableContents = () => {
      const trList = [];
      for (let row = 0; row < rows; row++) {
        const tdList = [];
        for (let col = 0; col < cols; col++) {
          tdList.push(
            <td key={`r${row}c${col}`}>
              <div>
                <input name={`${row},${col}`} value={tableList[row][col]} placeholder={"입력"} onChange={onChange} data-row={row} data-col={col} style={{ width: `${longestTextPerCol[col]}em` }} />
              </div>
            </td>
          );
        }
        trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
      }
      return trList;
    };
    globalTableList = tableList;
    return (
      <>
        <div className="table-container">
          <table>
            <tbody>{setTableContents()}</tbody>
          </table>

          <div className="row-btns">
            <button onClick={onRowPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={onRowMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <div className="col-btns">
            <button onClick={onColPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={onColMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
      </>
    );
  }
  //

  // Output
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
      return computeLength(textList.join("")) + 4;
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
    const onCopy = (event: any) => {
      navigator.clipboard.writeText(text);
      alert("복사완료");
    };
    useEffect(() => {
      setText(globalTableListToText());
    }, [space]);
    const changeSpaceBtnText = space === " " ? "반각 띄어쓰기\nU+0020\n| |" : "전각 띄어쓰기\nU+3000\n|　|";
    return (
      <div className="output-container">
        <div className="output-container__btn-container">
          <button onClick={onCopy} className="btn-margin">
            COPY
          </button>
          <input type="button" value={changeSpaceBtnText} onClick={onChangeSpaceClick} className="transform-btn space-change-btn" />
        </div>
        <textarea cols={getHorizontalWidth()} rows={rows + 1} value={text} onChange={onChange}></textarea>
      </div>
    );
  }
  //

  const onTranform = () => {
    setIsTable((currentIsTable) => {
      if (currentIsTable) {
      } else {
      }
      return !currentIsTable;
    });
  };
  return (
    <>
      <header>
        <button onClick={onTranform} className={"transform-btn btn-margin"}>
          {isTable ? "텍스트로 변환" : "표로 가기"}
        </button>
      </header>
      <main>{isTable ? <Table /> : <Output />}</main>
    </>
  );
}

export default App;

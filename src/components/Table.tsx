import { useState, useEffect } from "react";
import Output from "./Output";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let globalTableList: string[][] = [];
function Table({ isTable }: { isTable: boolean }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);

  const makeTableList = (): string[][] => {
    console.log("makeTableList!!!!!!");
    let tempTableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tempTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (globalTableList[row]) {
          tempTableList[row][col] = globalTableList[row][col] ? globalTableList[row][col] : `a`;
        } else {
          tempTableList[row][col] = `a`;
        }
      }
    }
    // console.log("rows", rows, "cols", cols, "tableList", tableList);
    return tempTableList;
  };
  let emptyTableList = makeTableList();
  console.log("makeTableList", makeTableList());
  const [tableList, setTableList] = useState(emptyTableList);
  // 클릭 이벤트 시작
  console.log("tableList", tableList, "rows", rows, "cols", cols);
  const controlPlus = (target: "rows" | "cols") => {
    if (rows === 0) {
      setRows(1);
      setCols(1);
      setTableList(makeTableList());
      return;
    }
    switch (target) {
      case "rows":
        setRows((prevRow) => ++prevRow);
        setTableList(makeTableList());
        break;
      case "cols":
        console.log("늘림 시작");
        setCols((prevCol) => ++prevCol);
        console.log("늘림 끝");
        setTableList(makeTableList());
        break;
    }
  };
  const controlMinus = (target: "rows" | "cols") => {
    if ((target === "rows" && rows <= 1) || (target === "cols" && cols <= 1)) {
      setRows(0);
      setCols(0);
      globalTableList = [];
      setTableList([]);
      return;
    }
    switch (target) {
      case "rows":
        setRows((prevRow) => --prevRow);
        setTableList(makeTableList());
        break;
      case "cols":
        setCols((prevCol) => --prevCol);
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
              <input
                type="text"
                name={`${row},${col}`}
                value={tableList[row][col]}
                placeholder={"입력"}
                onChange={onChange}
                data-row={row}
                data-col={col}
                style={{ width: `${longestTextPerCol[col] + 2}em` }}
              />
            </div>
          </td>
        );
      }
      trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
    }
    return trList;
  };
  useEffect(() => {
    console.log("ROW COL 바뀜");
    setTableList(emptyTableList);
    return console.log("ROW COL 바뀜");
  }, [rows, cols]);
  globalTableList = tableList;
  if (!isTable) {
    return <Output rows={rows} cols={cols} globalTableList={globalTableList} />;
  }
  return (
    <>
      <div className="table-container">
        <div className="table-container__btn-row">
          <div className="table-container__size">
            <span>
              {cols}x{rows}
            </span>
          </div>
          <div className="table-container__col-btns">
            <button onClick={onColPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={onColMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
        <div className="table-container__table-row">
          <div className="table-container__row-btns">
            <button onClick={onRowPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={onRowMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <div className="table-container__table-wrapper">
            <table>
              <tbody>{setTableContents()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default Table;

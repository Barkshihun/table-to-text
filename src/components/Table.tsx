import { useState, useEffect } from "react";
import Output from "./Output";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let globalTableList: string[][] = [];
function Table({ isTable }: { isTable: boolean }) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(4);
  const makeTableList = () => {
    let tableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (globalTableList[row]) {
          tableList[row][col] = globalTableList[row][col] ? globalTableList[row][col] : `a`;
        } else {
          tableList[row][col] = `a`;
        }
      }
    }
    return tableList;
  };
  const [tableList, setTableList] = useState(makeTableList());
  globalTableList = tableList;
  // 클릭 이벤트 시작
  const controlPlus = (target: "rows" | "cols") => {
    if (rows === 0) {
      setRows(1);
      setCols(1);
      return;
    }
    switch (target) {
      case "rows":
        setRows((prevRow) => ++prevRow);
        break;
      case "cols":
        setCols((prevCol) => ++prevCol);
        break;
    }
  };
  const controlMinus = (target: "rows" | "cols") => {
    if ((target === "rows" && rows <= 1) || (target === "cols" && cols <= 1)) {
      setRows(0);
      setCols(0);
      globalTableList = [];
      return;
    }
    switch (target) {
      case "rows":
        setRows((prevRow) => --prevRow);
        break;
      case "cols":
        setCols((prevCol) => --prevCol);
        break;
    }
  };
  const onRowPlus = () => controlPlus("rows");
  const onRowMinus = () => controlMinus("rows");
  const onColPlus = () => controlPlus("cols");
  const onColMinus = () => controlMinus("cols");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      globalTableList[row][col] = event.target.value;
      setTableList([...globalTableList]);
    }
  };
  // 클릭 이벤트 끝

  const setTableContents = () => {
    const trList = [];
    const rows = tableList.length;
    const cols = tableList[0].length;
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      for (let col = 0; col < cols; col++) {
        const length = tableList[row][col].length;
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div>
              <input name={`${row},${col}`} value={tableList[row][col]} placeholder={"입력"} onChange={onChange} data-row={row} data-col={col} style={{ width: `${length + 1}em` }} />
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
    setTableList(makeTableList());
  }, [rows, cols]);
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

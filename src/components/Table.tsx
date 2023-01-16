import { useState, useEffect } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Output from "./Output";
import "../scss/Table.scss";

export let globalTableList: string[][] = [];
function Table({ isTable, tableRef }: { isTable: boolean; tableRef: React.RefObject<HTMLTableElement> }) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(4);
  const makeTableList = (): string[][] => {
    let tableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (globalTableList) {
          if (globalTableList[row]) {
            tableList[row][col] = globalTableList[row][col] ? globalTableList[row][col] : ``;
            continue;
          }
        }
        tableList[row][col] = ``;
      }
    }
    return tableList;
  };
  const [tableList, setTableList] = useState(makeTableList());
  //   console.log(globalTableList, "tableList", tableList);
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
    const cols = tableList[0] ? tableList[0].length : 0;
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      for (let col = 0; col < cols; col++) {
        const length = tableList[row][col].length;
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div>
              <input name={`${row},${col}`} value={tableList[row][col]} onChange={onChange} data-row={row} data-col={col} style={{ width: `${length + 1}em` }} spellCheck={false} />
            </div>
          </td>
        );
      }
      trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
    }
    return trList;
  };
  useEffect(() => {
    setTableList(makeTableList());
  }, [rows, cols]);
  if (!isTable) {
    return <Output rows={rows} cols={cols} globalTableList={globalTableList} />;
  }
  return (
    <>
      <div className={"table-container"}>
        <div className={"table-container__btn-row"}>
          <div className={"table-container__size"}>
            <span>
              {cols}x{rows}
            </span>
          </div>
          <div className={"table-container__col-btns"}>
            <button className="btn" onClick={onColPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn" onClick={onColMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
        <div className={"table-container__table-row"}>
          <div className={"table-container__row-btns"}>
            <button className="btn" onClick={onRowPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn" onClick={onRowMinus}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <div className={"table-container__table-wrapper"}>
            <table ref={tableRef} className="malgun-gothic">
              <tbody>{setTableContents()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default Table;

import { useState } from "react";
import "../scss/Table.scss";

export let rows = 2;
export let cols = 2;
export let globalTableList: string[][] = [];
function Table() {
  const makeTableList = () => {
    let tableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (globalTableList[row]) {
          tableList[row][col] = globalTableList[row][col] ? globalTableList[row][col] : "";
          continue;
        }
        tableList[row][col] = "";
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
              <input
                name={`${row},${col}`}
                value={tableList[row][col]}
                placeholder={`r${row}c${col}`}
                onChange={onChange}
                data-row={row}
                data-col={col}
                style={{ width: `${longestTextPerCol[col]}em` }}
              />
            </div>
          </td>
        );
      }
      trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
    }
    return trList;
  };
  globalTableList = tableList;
  // console.log("globalTableList", globalTableList);
  return (
    <>
      <div className=".table-container">
        <table>
          <tbody>{setTableContents()}</tbody>
        </table>
      </div>
      <div className="row-btns">
        <button onClick={onRowPlus}>➕</button>
        <button onClick={onRowMinus}>➖</button>
      </div>
      <div className="col-btns">
        <button onClick={onColPlus}>➕</button>
        <button onClick={onColMinus}>➖</button>
      </div>
    </>
  );
}
export default Table;

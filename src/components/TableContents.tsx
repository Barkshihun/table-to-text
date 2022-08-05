import { useState } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// tr이 행, td가 열
export let cellValueList: string[][] = [];
export function TableContents({ rows, cols }: { rows: number; cols: number }) {
  cellValueList = [];
  console.log("T", cellValueList);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row: number = parseInt(event.target.dataset.row);
      const col: number = parseInt(event.target.dataset.col);
      console.log(cellValueList[row][col], "와");
    }
  };
  const trList = [];
  for (let row = 0; row < rows; row++) {
    const tdList = [];
    cellValueList[row] = [];
    for (let col = 0; col < cols; col++) {
      const value = `내용${row} ${col}`;
      cellValueList[row][col] = value;
      tdList.push(
        <td key={`row${row}col${col}`}>
          <div>
            <input
              value={value}
              onChange={onChange}
              id={`row${row}col${col}`}
              data-row={row}
              data-col={col}
            ></input>
          </div>
        </td>
      );
    }
    trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
  }
  console.log("T", cellValueList);
  return <tbody>{trList}</tbody>;
}

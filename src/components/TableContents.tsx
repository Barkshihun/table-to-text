import { useState } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// tr이 행, td가 열
function TableContents({ rows, cols }: { rows: number; cols: number }) {
  const trList = [];
  for (let i = 0; i < rows; i++) {
    const tdList = [];
    for (let j = 0; j < cols; j++) {
      tdList.push(
        <td key={`${j}${i}`}>
          <div>
            <input value={`내용${j} ${i}`}></input>
          </div>
        </td>
      );
    }
    trList.push(<tr key={`${i}`}>{tdList.map((item, index) => item)}</tr>);
  }
  return <tbody>{trList}</tbody>;
}

export default TableContents;

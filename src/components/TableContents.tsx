import { useState } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TableContents({ rows, cols }: { rows: number; cols: number }) {
  const trList = [];
  for (let i = 0; i < cols; i++) {
    let tdList = [];
    for (let j = 0; j < rows; j++) {
      tdList.push(
        <td key={`${j}${i}`}>
          내용{j} {i}
        </td>
      );
    }
    trList.push(<tr key={`${i}`}>{tdList.map((item, index) => item)}</tr>);
    console.log(trList);
  }
  return trList;
}

export default TableContents;

import { useState, useEffect } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// tr이 행, td가 열
export let cellValueList: string[][] = [];
export function TableContents({ rows, cols }: { rows: number; cols: number }) {
  // console.log("T", cellValueList);

  const [inputs, setInputs]: [
    inputs: { [inputName: string]: string },
    setInputs: React.Dispatch<React.SetStateAction<{}>>
  ] = useState({});
  cellValueList = [];
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row: number = parseInt(event.target.dataset.row);
      const col: number = parseInt(event.target.dataset.col);
      setInputs({ ...inputs, [event.target.name]: event.target.value });
      cellValueList[row][col] = event.target.value;
    }
  };
  const trList = [];
  for (let row = 0; row < rows; row++) {
    const tdList = [];
    cellValueList[row] = [];
    for (let col = 0; col < cols; col++) {
      const inputName = `r${row}c${col}`;
      tdList.push(
        <td key={`row${row}col${col}`}>
          <div>
            <input
              name={`r${row}c${col}`}
              value={inputs[inputName] || ""}
              placeholder={`내용${row} ${col}`}
              onChange={onChange}
              id={`row${row}col${col}`}
              data-row={row}
              data-col={col}
            />
          </div>
        </td>
      );
    }
    trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
  }
  // console.log("네임", nameObj);
  // console.log("T", cellValueList);
  return (
    <>
      <tbody>{trList}</tbody>
    </>
  );
}

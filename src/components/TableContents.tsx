import { useState, useEffect } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// tr이 행, td가 열
let modifiedValue: string;
let modifiedName: string;
export let tempInputs: { [inputName: string]: string } = {};
export function TableContents({ rows, cols }: { rows: number; cols: number }) {
  const [inputs, setInputs]: [
    inputs: { [inputName: string]: string },
    setInputs: React.Dispatch<React.SetStateAction<{}>>
  ] = useState({ ...tempInputs });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row: number = parseInt(event.target.dataset.row);
      const col: number = parseInt(event.target.dataset.col);
      modifiedValue = event.target.value;
      modifiedName = event.target.name;
      setInputs({ ...inputs, [event.target.name]: modifiedValue });
    }
  };
  const trList = [];
  for (let row = 0; row < rows; row++) {
    const tdList = [];
    for (let col = 0; col < cols; col++) {
      const inputName = `${row},${col}`;
      const testValue = `내용 ${row} ${col}`;
      tempInputs[inputName] = testValue;
      tdList.push(
        <td key={`r${row}c${col}`}>
          <div>
            <input
              name={`${row},${col}`}
              value={inputs[inputName] || testValue}
              placeholder={"우"}
              onChange={onChange}
              data-row={row}
              data-col={col}
            />
          </div>
        </td>
      );
    }
    trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
  }
  if (modifiedName && modifiedValue) {
    tempInputs = { ...tempInputs, [modifiedName]: modifiedValue };
  }
  return (
    <>
      <tbody>{trList}</tbody>
    </>
  );
}

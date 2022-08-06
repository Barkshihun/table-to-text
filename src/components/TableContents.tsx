import { useState, useEffect } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// tr이 행, td가 열
export let globalInputs: { [inputName: string]: string } = {};
export function TableContents({ rows, cols }: { rows: number; cols: number }) {
  const initInputs = () => {
    let inputs: { [inputName: string]: string } = {};
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const inputName = `${row},${col}`;
        inputs[inputName] = globalInputs[inputName]
          ? globalInputs[inputName]
          : "";
      }
    }
    return inputs;
  };
  const [inputs, setInputs]: [
    inputs: { [inputName: string]: string },
    setInputs: React.Dispatch<React.SetStateAction<{}>>
  ] = useState({ ...initInputs() });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modifiedValue = event.target.value;
    const modifiedName = event.target.name;
    globalInputs[modifiedName] = modifiedValue;
    setInputs({ ...inputs, [modifiedName]: modifiedValue });
  };

  const trList = [];
  for (let row = 0; row < rows; row++) {
    const tdList = [];
    for (let col = 0; col < cols; col++) {
      const inputName = `${row},${col}`;
      tdList.push(
        <td key={`r${row}c${col}`}>
          <div>
            <input
              name={`${row},${col}`}
              value={inputs[inputName] || ""}
              placeholder={`r${row}c${col}`}
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
  globalInputs = inputs;
  console.log("inputs", inputs, "globalInputs", globalInputs);
  return (
    <>
      <tbody>{trList}</tbody>
    </>
  );
}

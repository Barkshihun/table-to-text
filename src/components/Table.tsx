import { useState } from "react";
import "../scss/Table.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export let golbalRows: number;
export let globalCols: number;
export let globalInputs: tableInputObj = {};
function Table() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const initInputs = () => {
    let inputs: tableInputObj = {};
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const coord = `${row},${col}`;
        inputs[coord] = globalInputs[coord] ? globalInputs[coord] : "";
      }
    }
    return inputs;
  };
  const [inputs, setInputs]: [
    inputs: tableInputObj,
    setInputs: React.Dispatch<React.SetStateAction<{}>>
  ] = useState({ ...initInputs() });
  const controlPlus = (target: "rows" | "cols") => {
    if (rows === 0) {
      setRows(1);
      setCols(1);
      return;
    }
    target === "rows"
      ? setRows((current) => ++current)
      : setCols((current) => ++current);
  };
  const controlMinus = (target: "rows" | "cols") => {
    if ((target === "rows" && rows <= 1) || (target === "cols" && cols <= 1)) {
      setRows(0);
      setCols(0);
      setInputs({});
      globalInputs = {};
      return;
    }
    target === "rows"
      ? setRows((current) => --current)
      : setCols((current) => --current);
  };
  const onRowPlus = () => controlPlus("rows");
  const onRowMinus = () => controlMinus("rows");
  const onColPlus = () => controlPlus("cols");
  const onColMinus = () => controlMinus("cols");

  //

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modifiedValue = event.target.value;
    const modifiedName = event.target.name;
    globalInputs[modifiedName] = modifiedValue;
    setInputs({ ...inputs, [modifiedName]: modifiedValue });
  };
  const setTableContents = () => {
    const trList = [];
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      for (let col = 0; col < cols; col++) {
        const coord = `${row},${col}`;
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div>
              <input
                name={`${row},${col}`}
                value={inputs[coord] || ""}
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
    return trList;
  };
  globalInputs = inputs;
  golbalRows = rows;
  globalCols = cols;
  return (
    <>
      <div>
        <button onClick={onRowPlus}>ROW ➕</button>
        <button onClick={onRowMinus}>ROW ➖</button>
      </div>
      <div>
        <button onClick={onColPlus}>COLUMN ➕</button>
        <button onClick={onColMinus}>COLUMN ➖</button>
      </div>
      <table>
        <tbody>{setTableContents()}</tbody>
      </table>
    </>
  );
}

export default Table;

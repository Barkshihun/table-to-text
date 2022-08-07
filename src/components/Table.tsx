import { useState } from "react";
import "../scss/Table.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export let golbalRows = 2;
export let globalCols = 2;
export let globalInputs: tableInputObj = {};
function Table() {
  const [rows, setRows] = useState(golbalRows);
  const [cols, setCols] = useState(globalCols);
  const makeInputObj = () => {
    console.log("init");
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
  ] = useState(makeInputObj());
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
  let tempInputs: tableInputObj = {};
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = `${row},${col}`;
      if (!inputs[coord]) {
        tempInputs[coord] = "";
      } else {
        tempInputs[coord] = inputs[coord];
      }
    }
  }
  globalInputs = tempInputs;
  golbalRows = rows;
  globalCols = cols;
  console.log(
    "✔globalInputs",
    globalInputs,
    "golbalRows",
    golbalRows,
    "globalCols",
    globalCols
  );
  return (
    <>
      <div>
        <button onClick={onRowPlus}>세로 ➕</button>
        <button onClick={onRowMinus}>세로 ➖</button>
      </div>
      <div>
        <button onClick={onColPlus}>가로 ➕</button>
        <button onClick={onColMinus}>가로 ➖</button>
      </div>
      <table>
        <tbody>{setTableContents()}</tbody>
      </table>
    </>
  );
}

export default Table;

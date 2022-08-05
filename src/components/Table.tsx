import { useState } from "react";
import "../scss/Table.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableContents } from "./TableContents";

let previousRows = 2;
let previousCols = 2;
function Table() {
  const [rows, setRows] = useState(previousRows);
  const [cols, setCols] = useState(previousCols);
  const onRowPlus = () => setRows(++previousRows);
  const onRowMinus = () => setRows(--previousRows);
  const onColPlus = () => setCols(++previousCols);
  const onColMinus = () => setCols(--previousCols);
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
        <TableContents rows={rows} cols={cols} />
      </table>
    </>
  );
}

export default Table;

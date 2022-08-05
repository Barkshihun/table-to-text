import { useState } from "react";
import "../scss/Desktop.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableContents from "./TableContents";

function Desktop() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const onRowPlus = () => setRows((currentRow) => ++currentRow);
  const onRowMinus = () => setRows((currentRow) => --currentRow);
  const onColPlus = () => setCols((currentCol) => ++currentCol);
  const onColMinus = () => setCols((currentCol) => --currentCol);
  return (
    <main>
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
    </main>
  );
}

export default Desktop;

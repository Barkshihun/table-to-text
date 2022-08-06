import { useState } from "react";
import "../scss/Table.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableContents } from "./TableContents";
import { createPortal } from "react-dom";

export let golbalRows = 2;
export let globalCols = 2;

function Table() {
  const [rows, setRows] = useState(golbalRows);
  const [cols, setCols] = useState(globalCols);
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
        <TableContents rows={rows} cols={cols} />
      </table>
    </>
  );
}

export default Table;

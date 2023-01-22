import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, setShowTableSizeModal, setTableList, editTableList } from "../store/tableSlice";
import { RootState } from "../store/store";
import TableSizeModal from "./TableSizeModal";
import "../scss/Modal.scss";
import "../scss/Table.scss";

function Table({ tableRef }: { tableRef: React.RefObject<HTMLTableElement> }) {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.cols);
  const rows = useSelector((state: RootState) => state.table.rows);
  const showTableSizeModal = useSelector((state: RootState) => state.table.showTableSizeModal);
  const contentEditableDivsRef = useRef<HTMLDivElement[][]>([]);

  // 이벤트 시작
  const onPlus = (target: "row" | "col") => {
    if (rows === 0) {
      dispatch(setOne());
      return;
    }
    switch (target) {
      case "row":
        dispatch(setRows(rows + 1));
        break;
      case "col":
        dispatch(setCols(cols + 1));
        break;
    }
  };
  const onMinus = (target: "row" | "col") => {
    if ((target === "row" && rows <= 1) || (target === "col" && cols <= 1)) {
      dispatch(setZero());
      return;
    }
    switch (target) {
      case "row":
        dispatch(setRows(rows - 1));
        break;
      case "col":
        dispatch(setCols(cols - 1));
        break;
    }
  };
  const onTableContentInput = (event: React.ChangeEvent<HTMLDivElement>) => {
    let row: string | number;
    let col: string | number;
    row = event.target.dataset.row as string;
    col = event.target.dataset.col as string;
    row = parseInt(row);
    col = parseInt(col);
  };
  const onResetContents = () => {};
  const onChangeTableSize = () => {
    dispatch(setShowTableSizeModal(true));
  };
  const onArrowKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      if (event.shiftKey === true && event.ctrlKey === true) {
        if (event.key === "ArrowLeft" && col !== 0) {
          event.preventDefault();
          const focusElem = contentEditableDivsRef.current[row][col - 1] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowRight" && col !== cols - 1) {
          event.preventDefault();
          const focusElem = contentEditableDivsRef.current[row][col + 1] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowUp" && row !== 0) {
          event.preventDefault();
          const focusElem = contentEditableDivsRef.current[row - 1][col] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowDown" && row !== rows - 1) {
          event.preventDefault();
          const focusElem = contentEditableDivsRef.current[row + 1][col] as HTMLInputElement;
          focusElem.focus();
        }
      }
    }
  };
  // 이벤트 끝

  const setTableContents = () => {
    const trList = [];
    contentEditableDivsRef.current = new Array(rows);
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      contentEditableDivsRef.current[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div className="contentEditable-div-container">
              <div
                className="contentEditable-div-container__div"
                contentEditable
                ref={(elem) => {
                  if (elem) {
                    contentEditableDivsRef.current[row][col] = elem;
                  }
                }}
                onInput={onTableContentInput}
                onKeyDown={onArrowKeyDown}
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
  // console.table(contentEditableDivsRef.current);
  console.log("렌더링");
  return (
    <>
      {showTableSizeModal && <TableSizeModal />}
      <main className={"table-system-wrapper"}>
        <div className={"top-container"}>
          <div className="btn btn--delete">
            <FontAwesomeIcon icon={faTrash} onClick={onResetContents} />
          </div>
          <button className="btn btn--size-indicator" onClick={onChangeTableSize}>
            {cols}x{rows}
          </button>
          <div className={"btn-container--top"}>
            <button className="btn" onClick={() => onPlus("col")}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn" onClick={() => onMinus("col")}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
        <div className={"bottom-container"}>
          <div className={"btn-container--table-left"}>
            <button className="btn" onClick={() => onPlus("row")}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn" onClick={() => onMinus("row")}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
          <div className={"table-container"}>
            <table className="malgun-gothic" ref={tableRef}>
              <tbody>{setTableContents()}</tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
export default Table;

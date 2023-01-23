import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, setShowTableSizeModal } from "../store/tableSlice";
import { RootState } from "../store/store";
import TableSizeModal from "./TableSizeModal";
import "../scss/Modal.scss";
import "../scss/Table.scss";

function Table({ tableContainerRef, contentEditableDivsRef }: { tableContainerRef: React.RefObject<HTMLDivElement>; contentEditableDivsRef: React.MutableRefObject<HTMLDivElement[][]> }) {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.cols);
  const rows = useSelector((state: RootState) => state.table.rows);
  const lastCol = cols - 1;
  const lastRow = rows - 1;
  const showTableSizeModal = useSelector((state: RootState) => state.table.showTableSizeModal);
  const tableList = useSelector((state: RootState) => state.table.tableList);

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
  const onResetContents = () => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        contentEditableDivsRef.current[row][col].innerText = "";
      }
    }
  };
  const onChangeTableSize = () => {
    dispatch(setShowTableSizeModal(true));
  };
  const focusCaretAtEnd = (elem: HTMLDivElement, select?: boolean) => {
    const selection = window.getSelection() as Selection;
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(elem);
    if (!select) {
      range.collapse(false);
    }
    selection.addRange(range);
  };
  const controlShiftTab = (col: number, row: number) => {
    let focusElem: HTMLDivElement;
    if (col === 0) {
      if (row === 0) {
        focusElem = contentEditableDivsRef.current[lastRow][lastCol];
      } else {
        focusElem = contentEditableDivsRef.current[row - 1][lastCol];
      }
    } else {
      focusElem = contentEditableDivsRef.current[row][col - 1];
    }
    focusCaretAtEnd(focusElem, true);
  };
  const controlTab = (col: number, row: number) => {
    let focusElem: HTMLDivElement;
    if (col === lastCol) {
      if (row === lastRow) {
        focusElem = contentEditableDivsRef.current[0][0];
      } else {
        focusElem = contentEditableDivsRef.current[row + 1][0];
      }
    } else {
      focusElem = contentEditableDivsRef.current[row][col + 1];
    }
    focusCaretAtEnd(focusElem, true);
  };
  const onArrowKeyOrTabDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let row: string | number;
    let col: string | number;
    row = event.target.dataset.row as string;
    col = event.target.dataset.col as string;
    row = parseInt(row);
    col = parseInt(col);
    if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey === true) {
        controlShiftTab(col, row);
      } else {
        controlTab(col, row);
      }
      return;
    }
    if (event.shiftKey === true && event.ctrlKey === true) {
      if (event.key === "ArrowLeft" && col !== 0) {
        event.preventDefault();
        const focusElem = contentEditableDivsRef.current[row][col - 1] as HTMLDivElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowRight" && col !== lastCol) {
        event.preventDefault();
        const focusElem = contentEditableDivsRef.current[row][col + 1] as HTMLDivElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowUp" && row !== 0) {
        event.preventDefault();
        const focusElem = contentEditableDivsRef.current[row - 1][col] as HTMLDivElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowDown" && row !== lastRow) {
        event.preventDefault();
        const focusElem = contentEditableDivsRef.current[row + 1][col] as HTMLDivElement;
        focusCaretAtEnd(focusElem);
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
                ref={(elem: HTMLDivElement) => {
                  if (elem) {
                    if (tableList[row]) {
                      if (tableList[row][col]) {
                        elem.innerText = tableList[row][col];
                      }
                    }
                    contentEditableDivsRef.current[row][col] = elem;
                  }
                }}
                onInput={onTableContentInput}
                onKeyDown={onArrowKeyOrTabDown}
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

  return (
    <>
      {showTableSizeModal && <TableSizeModal />}
      <main className={"table-system-wrapper"}>
        <div className={"top-container"}>
          <div className="btn btn--delete" onClick={onResetContents}>
            <FontAwesomeIcon icon={faTrash} />
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
          <div className={"table-container"} ref={tableContainerRef}>
            <table className="malgun-gothic">
              <tbody>{setTableContents()}</tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
export default Table;

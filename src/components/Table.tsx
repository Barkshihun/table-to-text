import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, resetTableList } from "../store/tableSlice";
import { setShowTableSizeModal } from "../store/componentRenderSlice";
import { RootState } from "../store/store";
import TableSizeModal from "./TableSizeModal";
import "../scss/Modal.scss";
import "../scss/Table.scss";

function Table({ tableContainerRef, contentEditablePresRef }: { tableContainerRef: React.RefObject<HTMLDivElement>; contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const lastCol = cols - 1;
  const lastRow = rows - 1;
  const isShowTableSizeModal = useSelector((state: RootState) => state.componentRender.isShowTableSizeModal);
  const tableList = useSelector((state: RootState) => state.table.originTableList);

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
  const onTableContentInput = (event: React.ChangeEvent<HTMLPreElement>) => {
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
        contentEditablePresRef.current[row][col].innerText = "";
      }
    }
  };
  const onChangeTableSize = () => {
    dispatch(setShowTableSizeModal(true));
  };
  const focusCaretAtEnd = (elem: HTMLPreElement, select?: boolean) => {
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
    let focusElem: HTMLPreElement;
    if (col === 0) {
      if (row === 0) {
        focusElem = contentEditablePresRef.current[lastRow][lastCol];
      } else {
        focusElem = contentEditablePresRef.current[row - 1][lastCol];
      }
    } else {
      focusElem = contentEditablePresRef.current[row][col - 1];
    }
    focusCaretAtEnd(focusElem, true);
  };
  const controlTab = (col: number, row: number) => {
    let focusElem: HTMLPreElement;
    if (col === lastCol) {
      if (row === lastRow) {
        focusElem = contentEditablePresRef.current[0][0];
      } else {
        focusElem = contentEditablePresRef.current[row + 1][0];
      }
    } else {
      focusElem = contentEditablePresRef.current[row][col + 1];
    }
    focusCaretAtEnd(focusElem, true);
  };
  const onArrowKeyOrTabDown = (event: React.KeyboardEvent<HTMLPreElement>) => {
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
        const focusElem = contentEditablePresRef.current[row][col - 1] as HTMLPreElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowRight" && col !== lastCol) {
        event.preventDefault();
        const focusElem = contentEditablePresRef.current[row][col + 1] as HTMLPreElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowUp" && row !== 0) {
        event.preventDefault();
        const focusElem = contentEditablePresRef.current[row - 1][col] as HTMLPreElement;
        focusCaretAtEnd(focusElem);
      }
      if (event.key === "ArrowDown" && row !== lastRow) {
        event.preventDefault();
        const focusElem = contentEditablePresRef.current[row + 1][col] as HTMLPreElement;
        focusCaretAtEnd(focusElem);
      }
    }
  };
  // 이벤트 끝

  const setTableContents = () => {
    const trList = [];
    contentEditablePresRef.current = new Array(rows);
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      contentEditablePresRef.current[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div className="contentEditable-div-container">
              <pre
                className="contentEditable-div-container__div"
                contentEditable
                ref={(elem: HTMLPreElement) => {
                  if (elem) {
                    if (tableList[row]) {
                      elem.innerText = tableList[row][col];
                    }
                    contentEditablePresRef.current[row][col] = elem;
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
  useEffect(() => {
    if (tableList[0]) {
      dispatch(resetTableList());
    }
  }, [tableList]);
  console.count("렌더링");
  return (
    <>
      {isShowTableSizeModal && <TableSizeModal />}
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
          <div className={"table-container--padding"}>
            <div className={"table-container"} ref={tableContainerRef}>
              <table className="malgun-gothic">
                <tbody>{setTableContents()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default Table;

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, resetTableList, setFocusCell } from "../store/tableSlice";
import { showAddRowOrColModal, setDisplayTableSizeModal } from "../store/componentRenderSlice";
import { ActionName, ShortcutsObj } from "../types/shortcutTypes";
import { ITEM_NAME, defaultShortcutsObj } from "../shortcutConsts";
import { RootState } from "../store/store";
import TableSizeModal from "../modals/TableSizeModal";
import "../scss/Modal.scss";
import "../scss/Table.scss";
import AddRowOrColModal from "../modals/AddRowOrColModal";

function Table({ tableContainerRef, contentEditablePresRef }: { tableContainerRef: React.RefObject<HTMLDivElement>; contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const lastCol = cols - 1;
  const lastRow = rows - 1;
  const isShowTableSizeModal = useSelector((state: RootState) => state.componentRender.isShowTableSizeModal);
  const isShowAddRowOrColModal = useSelector((state: RootState) => state.componentRender.isShowAddRowOrColModal);
  const tableList = useSelector((state: RootState) => state.table.originTableList);
  const focusCell = useSelector((state: RootState) => state.table.focusCell);

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
  const onResetContents = () => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        contentEditablePresRef.current[row][col].innerText = "";
      }
    }
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
  const shortcutActions = {
    moveToNextCell: (col: number, row: number) => {
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
    },
    moveToPrevCell: (col: number, row: number) => {
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
    },
    moveCell: (col: number, row: number, direction: "up" | "down" | "left" | "right") => {
      let focusRow = row;
      let focusCol = col;
      switch (direction) {
        case "up":
          if (row !== 0) {
            focusRow = row - 1;
          }
          break;
        case "down":
          if (row !== lastRow) {
            focusRow = row + 1;
          }
          break;
        case "left":
          if (col !== 0) {
            focusCol = col - 1;
          }
          break;
        case "right":
          if (col !== lastCol) {
            focusCol = col + 1;
          }
          break;
      }
      const focusElem = contentEditablePresRef.current[focusRow][focusCol] as HTMLPreElement;
      focusCaretAtEnd(focusElem);
    },
    addRowOrCol: (col: number, row: number) => {
      dispatch(setFocusCell({ col, row }));
      dispatch(showAddRowOrColModal());
    },
  };
  const onCheckShortcut = (event: React.KeyboardEvent<HTMLPreElement>) => {
    let row: string | number;
    let col: string | number;
    row = event.target.dataset.row as string;
    col = event.target.dataset.col as string;
    row = parseInt(row);
    col = parseInt(col);
    const itemString = localStorage.getItem(ITEM_NAME);
    let shortcutsObj: ShortcutsObj;
    if (itemString) {
      const itemObj: ShortcutsObj = JSON.parse(itemString);
      shortcutsObj = itemObj;
    } else {
      shortcutsObj = defaultShortcutsObj;
    }
    let correspondingActionName: ActionName | undefined;
    for (const key in shortcutsObj) {
      const actionName = key as ActionName;
      const { ctrlKey: shortcutObjCtrlKey, shiftKey: shortcutObjShiftKey, altKey: shortcutObjAltKey, code: shortcutObjCode, isAbled } = shortcutsObj[actionName];
      if (event.ctrlKey === shortcutObjCtrlKey && event.shiftKey === shortcutObjShiftKey && event.altKey === shortcutObjAltKey && event.code === shortcutObjCode && isAbled) {
        correspondingActionName = actionName;
        break;
      }
    }
    if (!correspondingActionName) {
      if (event.code === "Tab" || (event.code === "Tab" && event.shiftKey === true)) {
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
    switch (correspondingActionName) {
      case "moveToNextCell":
        shortcutActions.moveToNextCell(col, row);
        return;
      case "moveToPrevCell":
        shortcutActions.moveToPrevCell(col, row);
        return;
      case "moveToUpCell":
        shortcutActions.moveCell(col, row, "up");
        return;
      case "moveToDownCell":
        shortcutActions.moveCell(col, row, "down");
        return;
      case "moveToLeftCell":
        shortcutActions.moveCell(col, row, "left");
        return;
      case "moveToRightCell":
        shortcutActions.moveCell(col, row, "right");
        return;
      case "addRowOrCol":
        shortcutActions.addRowOrCol(col, row);
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
                      elem.innerText = tableList[row][col] ? tableList[row][col] : "";
                    }
                    contentEditablePresRef.current[row][col] = elem;
                  }
                }}
                onKeyDown={onCheckShortcut}
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
  useEffect(() => {
    if (!isShowAddRowOrColModal) {
      const col = focusCell.col;
      const row = focusCell.row;
      if (contentEditablePresRef.current[row]) {
        if (contentEditablePresRef.current[row][col]) {
          contentEditablePresRef.current[row][col].focus();
          return;
        }
      }
      contentEditablePresRef.current[0][0];
    }
  }, [isShowAddRowOrColModal]);
  console.count("Table렌더링");
  return (
    <>
      {isShowAddRowOrColModal && <AddRowOrColModal contentEditablePresRef={contentEditablePresRef} />}
      {isShowTableSizeModal && <TableSizeModal />}
      <main className={"table-system-wrapper"}>
        <div className={"top-container"}>
          <div className="btn btn--delete" onClick={onResetContents}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
          <button
            className="btn btn--size-indicator"
            onClick={() => {
              dispatch(setDisplayTableSizeModal(true));
            }}
          >
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

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, resetTableList, setFocusCell } from "../store/tableSlice";
import { showEditRowOrColModal, setDisplayTableSizeModal } from "../store/componentRenderSlice";
import { ActionName, ShortcutsObj } from "../types/shortcutTypes";
import { ITEM_NAME, defaultShortcutsObj } from "../shortcutConsts";
import { RootState } from "../store/store";
import { transFormPreToText } from "../utils";
import TableSizeModal from "../modals/TableSizeModal";
import EditRowOrColModal from "../modals/EditRowOrColModal";

function Table({ tableContainerRef, contentEditablePresRef }: { tableContainerRef: React.RefObject<HTMLDivElement>; contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const lastCol = cols - 1;
  const lastRow = rows - 1;
  const isShowTableSizeModal = useSelector((state: RootState) => state.componentRender.isShowTableSizeModal);
  const isShowEditRowOrColModal = useSelector((state: RootState) => state.componentRender.isShowAddRowOrColModal);
  const tableList = useSelector((state: RootState) => state.table.originTableList);
  const focusCell = useSelector((state: RootState) => state.table.focusCell);
  const isAutoFocusRef = useRef(false);
  const SET_TIMEOUT_TIME = 5;

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
        contentEditablePresRef.current[row][col].innerHTML = "<p><br/></p>";
      }
    }
  };
  const focusCaretAtEnd = (elem: HTMLPreElement, isCollapsed = true) => {
    const childNodesLength = elem.childNodes.length;
    const lastParagraphNode = elem.childNodes[childNodesLength - 1];
    const lastTextNode = lastParagraphNode.childNodes[0];
    const selection = getSelection() as Selection;
    selection.removeAllRanges();
    const lastTextContent = lastTextNode.textContent as string;
    switch (isCollapsed) {
      case true:
        selection.setBaseAndExtent(lastTextNode, lastTextContent.length, lastTextNode, lastTextContent.length);
        break;
      case false:
        const firstParagraphNode = elem.childNodes[0];
        const firstTextNode = firstParagraphNode.childNodes[0];
        selection.setBaseAndExtent(firstTextNode, 0, lastTextNode, lastTextContent.length);
        break;
    }
  };
  const shortcutActions = {
    moveToNextCell: (col: number, row: number, isProcess: boolean) => {
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
      if (isProcess) {
        const preText = transFormPreToText(focusElem);
        focusElem.focus();
        setTimeout(() => {
          focusElem.innerHTML = `<p>${preText ? preText : "<br>"}</p>`;
          focusCaretAtEnd(focusElem, false);
        }, SET_TIMEOUT_TIME);
      } else {
        focusCaretAtEnd(focusElem, false);
      }
    },
    moveToPrevCell: (col: number, row: number, isProcess: boolean) => {
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
      if (isProcess) {
        const preText = transFormPreToText(focusElem);
        focusElem.focus();
        setTimeout(() => {
          focusElem.innerHTML = `<p>${preText ? preText : "<br>"}</p>`;
          focusCaretAtEnd(focusElem, false);
        }, SET_TIMEOUT_TIME);
      } else {
        focusCaretAtEnd(focusElem, false);
      }
    },
    moveCell: (col: number, row: number, isProcess: boolean, direction: "up" | "down" | "left" | "right") => {
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
      if (isProcess) {
        const preText = transFormPreToText(focusElem);
        focusElem.focus();
        setTimeout(() => {
          focusElem.innerHTML = `<p>${preText ? preText : "<br>"}</p>`;
          focusCaretAtEnd(focusElem);
        }, SET_TIMEOUT_TIME);
      } else {
        focusCaretAtEnd(focusElem);
      }
    },
    editRowOrCol: (col: number, row: number, isProcess: boolean, mode: "add" | "remove") => {
      const selection = getSelection() as Selection;
      const anchorOffset = selection.anchorOffset;
      const anchorNode = selection.anchorNode;
      const focusOffset = selection.focusOffset;
      const focusNode = selection.focusNode;
      const anchorParentNode = anchorNode?.parentNode as HTMLParagraphElement;
      const focusParentNode = focusNode?.parentNode as HTMLParagraphElement;
      const elem = contentEditablePresRef.current[row][col] as HTMLPreElement;
      let anchorParagraphIndex = 0;
      let focusParagraphIndex = 0;
      if (focusParentNode.nodeName !== "PRE") {
        const childNodes = elem.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i] === anchorParentNode) {
            anchorParagraphIndex = i;
          }
          if (childNodes[i] === focusParentNode) {
            focusParagraphIndex = i;
            break;
          }
        }
      }
      if (isProcess) {
        const paragraphNode = elem.childNodes[focusParagraphIndex];
        const preText = transFormPreToText(elem);
        elem.innerHTML = `<p>${preText ? preText : "<br>"}</p>`;
        if (paragraphNode.childNodes[0].nodeName === "BR") {
          elem.blur();
        } else {
          selection.removeAllRanges();
        }
        setTimeout(() => {
          isAutoFocusRef.current = true;
          dispatch(setFocusCell({ col, row, anchorOffset, focusOffset, anchorParagraphIndex, focusParagraphIndex }));
          dispatch(showEditRowOrColModal(mode));
        }, SET_TIMEOUT_TIME);
      } else {
        isAutoFocusRef.current = true;
        dispatch(setFocusCell({ col, row, anchorOffset, focusOffset, anchorParagraphIndex, focusParagraphIndex }));
        dispatch(showEditRowOrColModal(mode));
      }
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
    const isProcess = event.key === "Process" ? true : false;
    switch (correspondingActionName) {
      case "moveToNextCell":
        shortcutActions.moveToNextCell(col, row, isProcess);
        return;
      case "moveToPrevCell":
        shortcutActions.moveToPrevCell(col, row, isProcess);
        return;
      case "moveToUpCell":
        shortcutActions.moveCell(col, row, isProcess, "up");
        return;
      case "moveToDownCell":
        shortcutActions.moveCell(col, row, isProcess, "down");
        return;
      case "moveToLeftCell":
        shortcutActions.moveCell(col, row, isProcess, "left");
        return;
      case "moveToRightCell":
        shortcutActions.moveCell(col, row, isProcess, "right");
        return;
      case "addRowOrCol":
        shortcutActions.editRowOrCol(col, row, isProcess, "add");
        return;
      case "removeRowOrCol":
        shortcutActions.editRowOrCol(col, row, isProcess, "remove");
        return;
    }
  };
  const onInput = (event: React.ChangeEvent<HTMLPreElement>) => {
    if (event.target.innerText === "") {
      event.target.innerHTML = "<p><br></p>";
    }
  };
  const onPaste = (event: React.ClipboardEvent<HTMLPreElement>) => {
    event.preventDefault();
    const clipboardText = event.clipboardData.getData("text/plain").replace(/\r/g, "");
    const clipboardTextLength = clipboardText.length;
    const selection = getSelection() as Selection;
    selection.deleteFromDocument();
    let target = event.target as HTMLParagraphElement;
    if (target.nodeName === "BR") {
      target = target.parentNode as HTMLParagraphElement;
      target.innerHTML = clipboardText;
      const textNode = target.childNodes[0];
      selection.setBaseAndExtent(textNode, clipboardTextLength, textNode, clipboardTextLength);
      return;
    }
    const textNode = target.childNodes[0];
    const textContent = textNode.textContent as string;
    const focusOffset = selection.focusOffset;
    const outputText = textContent.slice(0, focusOffset) + clipboardText + textContent.slice(focusOffset);
    textNode.textContent = outputText;
    const outputFocusOffset = focusOffset + clipboardTextLength;
    selection.setBaseAndExtent(textNode, outputFocusOffset, textNode, outputFocusOffset);
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
                      elem.innerHTML = `<p>${tableList[row][col] ? tableList[row][col] : "<br>"}</p>`;
                    }
                    contentEditablePresRef.current[row][col] = elem;
                  }
                }}
                onKeyDown={onCheckShortcut}
                onInput={onInput}
                onPaste={onPaste}
                data-row={row}
                data-col={col}
                suppressContentEditableWarning={true}
              >
                <p>
                  <br />
                </p>
              </pre>
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
    if (!isShowEditRowOrColModal && isAutoFocusRef.current) {
      const col = focusCell.col;
      const row = focusCell.row;
      const focusParagraphIndex = focusCell.focusParagraphIndex;
      const anchorParagraphIndex = focusCell.anchorParagraphIndex;
      const contentEditablePre = contentEditablePresRef.current[row][col];
      const focusParagraphNode = contentEditablePre.childNodes[focusParagraphIndex] as HTMLParagraphElement;
      if (!focusParagraphNode.childNodes[0]) {
        contentEditablePre.focus();
        isAutoFocusRef.current = false;
        return;
      }
      const focusTextNode = focusParagraphNode.childNodes[0];
      if (focusTextNode.nodeName === "BR") {
        contentEditablePre.focus();
        isAutoFocusRef.current = false;
        return;
      }
      const selection = getSelection() as Selection;
      selection.removeAllRanges();
      const anchorParagraphNode = contentEditablePre.childNodes[anchorParagraphIndex] as HTMLParagraphElement;
      const anchorTextNode = anchorParagraphNode.childNodes[0];
      selection.setBaseAndExtent(anchorTextNode, focusCell.anchorOffset, focusTextNode, focusCell.focusOffset);
      isAutoFocusRef.current = false;
    }
  }, [isShowEditRowOrColModal]);

  return (
    <>
      {isShowEditRowOrColModal && <EditRowOrColModal contentEditablePresRef={contentEditablePresRef} />}
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
            <span>
              {cols}x{rows}
            </span>
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

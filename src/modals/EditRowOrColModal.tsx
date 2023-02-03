import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddRowOrColCheckBoxObj, RemoveRowOrColCheckBoxObj, NoYesBtns } from "../types/addRowOrColModalTypes";
import { hideEditRowOrColModal } from "../store/componentRenderSlice";
import AddRowOrColCheckBox from "../components/EditRowOrColCheckBox";
import { RootState } from "../store/store";
import { setFocusCell, setTableList } from "../store/tableSlice";
import Swal from "sweetalert2";

function EditRowOrColModal({ contentEditablePresRef }: { contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.componentRender.editRowOrColMode) as "add" | "remove";
  const defaultAddCheckIndex = useSelector((state: RootState) => state.componentRender.defaultAddCheckIndex);
  const defaultRemoveCheckIndex = useSelector((state: RootState) => state.componentRender.defaultRemoveCheckIndex);
  let defaultCheckIndex: number;
  let defaultEditRowOrColCheckBoxObjList: AddRowOrColCheckBoxObj[] | RemoveRowOrColCheckBoxObj[];
  switch (mode) {
    case "add":
      defaultEditRowOrColCheckBoxObjList = [
        {
          text: "셀을 오른쪽으로 밀기",
        },
        {
          text: "셀을 왼쪽으로 밀기",
        },
        {
          text: "셀을 위로 밀기",
        },
        {
          text: "셀을 아래로 밀기",
        },
        {
          text: "위쪽 행 전체",
        },
        {
          text: "아래쪽 행 전체",
        },
        {
          text: "왼쪽 열 전체",
        },
        {
          text: "오른쪽 열 전체",
        },
      ];
      defaultCheckIndex = defaultAddCheckIndex;
      break;
    case "remove":
      defaultEditRowOrColCheckBoxObjList = [
        {
          text: "셀을 왼쪽으로 밀기",
        },
        {
          text: "셀을 위로 밀기",
        },
        {
          text: "위쪽 행 전체",
        },
        {
          text: "아래쪽 행 전체",
        },
        {
          text: "왼쪽 열 전체",
        },
        {
          text: "오른쪽 열 전체",
        },
      ];
      defaultCheckIndex = defaultRemoveCheckIndex;
      break;
  }
  const editRowOrColCheckBoxObjListRef = useRef<AddRowOrColCheckBoxObj[] | RemoveRowOrColCheckBoxObj[]>(defaultEditRowOrColCheckBoxObjList);
  const checkIndexRef = useRef<number>(defaultCheckIndex);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const noYesBtnsRef = useRef<NoYesBtns | { currentBtn: "yes" }>({ currentBtn: "yes" });
  const maxCheckIndex = mode === "add" ? 7 : 5;
  const focusCell = useSelector((state: RootState) => state.table.focusCell);
  const lastRow = rows - 1;
  const lastCol = cols - 1;

  const checkIndexToActionName = (checkIndex: number) => {
    switch (mode) {
      case "add":
        switch (checkIndex) {
          case 0:
            return "addMoveToCellRight";
          case 1:
            return "addMoveToCellLeft";
          case 2:
            return "addMoveToCellUp";
          case 3:
            return "addMoveToCellDown";
          case 4:
            return "addUpRow";
          case 5:
            return "addDownRow";
          case 6:
            return "addLeftCol";
          case 7:
            return "addRightCol";
        }
        break;
      case "remove":
        switch (checkIndex) {
          case 0:
            return "removeMoveToCellLeft";
          case 1:
            return "removeMoveToCellUp";
          case 2:
            return "removeUpRow";
          case 3:
            return "removeDownRow";
          case 4:
            return "removeLeftCol";
          case 5:
            return "removeRightCol";
        }
        break;
    }
  };
  const editRowOrCol = (checkIndex: number) => {
    let tableList = transformToTableList(contentEditablePresRef.current);
    const actionName = checkIndexToActionName(checkIndex);
    const focusColList = [];
    switch (actionName) {
      case "addMoveToCellRight":
        tableList[focusCell.row].splice(focusCell.col, 0, "");
        if (tableList[focusCell.row][lastCol + 1]) {
          dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        } else {
          tableList[focusCell.row].pop();
          dispatch(setTableList({ cols, rows, tableList }));
        }
        return;
      case "addMoveToCellLeft":
        tableList[focusCell.row].splice(focusCell.col + 1, 0, "");
        if (tableList[focusCell.row][0]) {
          for (let row = 0; row < tableList.length; row++) {
            if (row !== focusCell.row) {
              tableList[row].unshift("");
            }
          }
          dispatch(setTableList({ cols: cols + 1, rows, tableList }));
          dispatch(setFocusCell({ col: focusCell.col + 1, row: focusCell.row, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        } else {
          tableList[focusCell.row].shift();
          dispatch(setTableList({ cols: cols, rows, tableList }));
        }
        return;
      case "addMoveToCellUp":
        for (let row = 0; row < tableList.length; row++) {
          if (row === focusCell.row) {
            focusColList.push(tableList[row][focusCell.col]);
            focusColList.push("");
            continue;
          }
          focusColList.push(tableList[row][focusCell.col]);
        }
        if (tableList[0][focusCell.col]) {
          tableList.unshift(new Array(cols));
          for (let row = 0; row < tableList.length; row++) {
            tableList[row][focusCell.col] = focusColList[row];
          }
          dispatch(setTableList({ cols, rows: rows + 1, tableList }));
          dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row + 1, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        } else {
          focusColList.shift();
          for (let row = 0; row < tableList.length; row++) {
            tableList[row][focusCell.col] = focusColList[row];
          }
          dispatch(setTableList({ cols, rows, tableList }));
        }
        return;
      case "addMoveToCellDown":
        for (let row = 0; row < tableList.length; row++) {
          if (row === focusCell.row) {
            focusColList.push("");
            focusColList.push(tableList[row][focusCell.col]);
            continue;
          }
          focusColList.push(tableList[row][focusCell.col]);
        }
        if (tableList[lastRow][focusCell.col]) {
          for (let row = 0; row < tableList.length; row++) {
            tableList[row][focusCell.col] = focusColList[row];
          }
          tableList.push(new Array(cols));
          tableList[lastRow + 1][focusCell.col] = focusColList[lastRow + 1];
          dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        } else {
          focusColList.pop();
          for (let row = 0; row < tableList.length; row++) {
            tableList[row][focusCell.col] = focusColList[row];
          }
          dispatch(setTableList({ cols, rows, tableList }));
        }
        return;
      case "addUpRow":
        tableList.splice(focusCell.row, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row + 1, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        return;
      case "addDownRow":
        tableList.splice(focusCell.row + 1, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        return;
      case "addLeftCol":
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col + 1, row: focusCell.row, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        return;
      case "addRightCol":
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col + 1, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        return;
      case "removeMoveToCellLeft":
        tableList[focusCell.row].splice(focusCell.col, 1);
        dispatch(setTableList({ cols, rows, tableList }));
        return;
      case "removeMoveToCellUp":
        for (let row = 0; row < tableList.length; row++) {
          if (row === focusCell.row) {
            continue;
          }
          focusColList.push(tableList[row][focusCell.col]);
        }
        for (let row = 0; row < tableList.length; row++) {
          tableList[row][focusCell.col] = focusColList[row];
        }
        dispatch(setTableList({ cols, rows, tableList }));
        return;
      case "removeUpRow":
        if (focusCell.row === 0) {
          Swal.fire({
            icon: "error",
            title: "지울 수 있는 행이 없습니다",
            position: "top",
            timer: 1000,
            showConfirmButton: false,
          });
          return;
        }
        tableList.splice(focusCell.row - 1, 1);
        dispatch(setTableList({ cols, rows: rows - 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row - 1, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        return;
      case "removeDownRow":
        if (focusCell.row === rows - 1) {
          Swal.fire({
            icon: "error",
            title: "지울 수 있는 행이 없습니다",
            position: "top",
            timer: 1000,
            showConfirmButton: false,
          });
          return;
        }
        tableList.splice(focusCell.row + 1, 1);
        dispatch(setTableList({ cols, rows: rows - 1, tableList }));
        return;
      case "removeLeftCol":
        if (focusCell.col === 0) {
          Swal.fire({
            icon: "error",
            title: "지울 수 있는 열이 없습니다",
            position: "top",
            timer: 1000,
            showConfirmButton: false,
          });
          return;
        }
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col - 1, 1);
        }
        dispatch(setTableList({ cols: cols - 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col - 1, row: focusCell.row, anchorOffset: focusCell.anchorOffset, focusOffset: focusCell.focusOffset }));
        return;
      case "removeRightCol":
        if (focusCell.col === cols - 1) {
          Swal.fire({
            icon: "error",
            title: "지울 수 있는 열이 없습니다",
            position: "top",
            timer: 1000,
            showConfirmButton: false,
          });
          return;
        }
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col + 1, 1);
        }
        dispatch(setTableList({ cols: cols - 1, rows, tableList }));
        return;
    }
  };
  const transformToTableList = (contentEditablePres: HTMLPreElement[][]) => {
    let tempTableList: string[][] = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tempTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        tempTableList[row][col] = contentEditablePres[row][col].innerText;
      }
    }
    return tempTableList;
  };
  const arrowKeyControl = (key: "ArrowUp" | "ArrowDown") => {
    const editRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current;
    const prevCheckIndex = checkIndexRef.current;
    const editRowOrColCheckBoxObj = editRowOrColCheckBoxObjList[prevCheckIndex];
    const { checkboxElem: prevCheckboxElem } = editRowOrColCheckBoxObj;
    let nextCheckIndex = 0;
    if (key === "ArrowUp") {
      nextCheckIndex = prevCheckIndex !== 0 ? prevCheckIndex - 1 : maxCheckIndex;
    } else {
      nextCheckIndex = prevCheckIndex === maxCheckIndex ? 0 : prevCheckIndex + 1;
    }
    const nextEditRowOrColCheckBoxObj = editRowOrColCheckBoxObjList[nextCheckIndex];
    const { labelElem: nextLabelElem, checkboxElem: nextCheckboxElem } = nextEditRowOrColCheckBoxObj;
    if (prevCheckboxElem && nextLabelElem && nextCheckboxElem) {
      prevCheckboxElem.checked = false;
      nextCheckboxElem.checked = true;
      nextLabelElem.focus();
    }
    checkIndexRef.current = nextCheckIndex;
  };
  const windowKeyDownHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        dispatch(hideEditRowOrColModal({ checkIndex: checkIndexRef.current, mode }));
        return;
      case "Tab":
        event.preventDefault();
        const noYesBtns = noYesBtnsRef.current as NoYesBtns;
        if (noYesBtns.currentBtn === "yes") {
          noYesBtns.yesBtn.focus();
          noYesBtns.currentBtn = "no";
        } else {
          noYesBtns.noBtn.focus();
          noYesBtns.currentBtn = "yes";
        }
        return;
      case "Enter":
        if ((event.target as HTMLElement).id === "noBtn") {
          return;
        }
        event.preventDefault();
        editRowOrCol(checkIndexRef.current);
        dispatch(hideEditRowOrColModal({ checkIndex: checkIndexRef.current, mode }));
        return;
      case "ArrowUp":
        event.preventDefault();
        arrowKeyControl("ArrowUp");
        return;
      case "ArrowDown":
        event.preventDefault();
        arrowKeyControl("ArrowDown");
        return;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", windowKeyDownHandler);
    document.body.classList.add("no-scroll");
    const checkIndex = checkIndexRef.current;
    const editRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current;
    const labelElem = editRowOrColCheckBoxObjList[checkIndex].labelElem;
    if (labelElem) {
      labelElem.focus();
    }
    return () => {
      window.removeEventListener("keydown", windowKeyDownHandler);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const renderCheckBoxes = () => {
    const checkBoxesArr = [];
    const editRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current;
    for (let i = 0; i < editRowOrColCheckBoxObjList.length; i++) {
      const checkboxIndex = checkIndexRef.current;
      const focused = i === checkboxIndex ? true : false;
      checkBoxesArr.push(<AddRowOrColCheckBox key={i} addRowOrColCheckBoxObjList={editRowOrColCheckBoxObjList} checkIndexRef={checkIndexRef} index={i} focused={focused} />);
    }
    return checkBoxesArr;
  };
  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(hideEditRowOrColModal({ checkIndex: checkIndexRef.current, mode }));
        }
      }}
    >
      <div className="modal__content modal__content--edit">
        <h1 className="modal__title">{mode === "add" ? "삽입" : "삭제"}</h1>
        {renderCheckBoxes()}
        <div className="modal__no-yes-btn-container modal__no-yes-btn-container--edit">
          <button
            id="noBtn"
            className="btn btn--modal btn--no btn--edit-modal"
            role="button"
            ref={(elem) => {
              if (elem) {
                const noYesBtnsRefCurrent = noYesBtnsRef.current as NoYesBtns;
                noYesBtnsRefCurrent.noBtn = elem;
              }
            }}
            onClick={() => {
              dispatch(hideEditRowOrColModal({ checkIndex: checkIndexRef.current, mode }));
            }}
          >
            취소
          </button>
          <button
            className="btn btn--modal btn--yes btn--edit-modal"
            ref={(elem) => {
              if (elem) {
                const noYesBtnsRefCurrent = noYesBtnsRef.current as NoYesBtns;
                noYesBtnsRefCurrent.yesBtn = elem;
              }
            }}
            onClick={() => {
              editRowOrCol(checkIndexRef.current);
              dispatch(hideEditRowOrColModal({ checkIndex: checkIndexRef.current, mode }));
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditRowOrColModal;

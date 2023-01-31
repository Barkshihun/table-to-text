import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddRowOrColCheckBoxObj, NoYesBtns, RemoveRowOrColCheckBoxObj } from "../types/addRowOrColModalTypes";
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
  const editRowOrColCheckBoxObjListRef = useRef<any>();
  const checkIndexRef = useRef<any>();
  switch (mode) {
    case "add":
      editRowOrColCheckBoxObjListRef.current = [
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
      checkIndexRef.current = defaultAddCheckIndex;
      break;
    case "remove":
      editRowOrColCheckBoxObjListRef.current = [
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
      checkIndexRef.current = defaultRemoveCheckIndex;
      break;
  }
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const noYesBtnsRef = useRef<NoYesBtns | { currentBtn: "yes" }>({ currentBtn: "yes" });
  const maxCheckIndex = 3;
  const focusCell = useSelector((state: RootState) => state.table.focusCell);

  const checkIndexToActionName = (checkIndex: number) => {
    switch (mode) {
      case "add":
        switch (checkIndex) {
          case 0:
            return "addUpRow";
          case 1:
            return "addDownRow";
          case 2:
            return "addLeftCol";
          case 3:
            return "addRightCol";
        }
        break;
      case "remove":
        switch (checkIndex) {
          case 0:
            return "removeUpRow";
          case 1:
            return "removeDownRow";
          case 2:
            return "removeLeftCol";
          case 3:
            return "removeRightCol";
        }
        break;
    }
  };
  const editRowOrCol = (checkIndex: number) => {
    const tableList = transformToTableList(contentEditablePresRef.current);
    const actionName = checkIndexToActionName(checkIndex);
    switch (actionName) {
      case "addUpRow":
        tableList.splice(focusCell.row, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row + 1 }));
        break;
      case "addDownRow":
        tableList.splice(focusCell.row + 1, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
      case "addLeftCol":
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col + 1, row: focusCell.row }));
        break;
      case "addRightCol":
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col + 1, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
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
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row - 1 }));
        break;
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
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
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
        dispatch(setFocusCell({ col: focusCell.col - 1, row: focusCell.row }));
        break;
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
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
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
    const addRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current;
    const prevCheckIndex = checkIndexRef.current;
    const addRowOrColCheckBoxObj = addRowOrColCheckBoxObjList[prevCheckIndex];
    const { checkboxElem: prevCheckboxElem } = addRowOrColCheckBoxObj;
    let nextCheckIndex = 0;
    if (key === "ArrowUp") {
      nextCheckIndex = prevCheckIndex !== 0 ? prevCheckIndex - 1 : maxCheckIndex;
    } else {
      nextCheckIndex = prevCheckIndex === maxCheckIndex ? 0 : prevCheckIndex + 1;
    }
    const nextAddRowOrColCheckBoxObj = addRowOrColCheckBoxObjList[nextCheckIndex];
    const { labelElem: nextLabelElem, checkboxElem: nextCheckboxElem } = nextAddRowOrColCheckBoxObj;
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
    const addRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current as AddRowOrColCheckBoxObj[];
    const labelElem = addRowOrColCheckBoxObjList[checkIndex].labelElem;
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
    const addRowOrColCheckBoxObjList = editRowOrColCheckBoxObjListRef.current as AddRowOrColCheckBoxObj[];
    for (let i = 0; i < addRowOrColCheckBoxObjList.length; i++) {
      const checkboxIndex = checkIndexRef.current;
      const focused = i === checkboxIndex ? true : false;
      checkBoxesArr.push(<AddRowOrColCheckBox key={i} addRowOrColCheckBoxObjList={addRowOrColCheckBoxObjList} checkIndexRef={checkIndexRef} index={i} focused={focused} />);
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
      <div className="modal__content modal__content--config-shortcut">
        <h1>{mode === "add" ? "삽입" : "삭제"}</h1>
        {renderCheckBoxes()}
        <div className="config-shortcut-btn-container">
          <button
            className="btn btn--modal btn--no"
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
            className="btn btn--modal btn--yes"
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

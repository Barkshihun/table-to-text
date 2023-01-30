import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddRowOrColCheckBoxObj, NoYesBtns } from "../types/addRowOrColModalTypes";
import { hideAddRowOrColModal } from "../store/componentRenderSlice";
import AddRowOrColCheckBox from "../components/AddRowOrColCheckBox";
import { RootState } from "../store/store";
import { setFocusCell, setTableList } from "../store/tableSlice";

function AddRowOrColModal({ contentEditablePresRef }: { contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const addRowOrColCheckBoxObjListRef = useRef<AddRowOrColCheckBoxObj[]>([
    {
      text: "위쪽 행 추가",
    },
    {
      text: "아래쪽 행 추가",
    },
    {
      text: "왼쪽 열 추가",
    },
    {
      text: "오른쪽 열 추가",
    },
  ]);
  const defaultCheckIndex = useSelector((state: RootState) => state.componentRender.defaultCheckIndex);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const checkIndexRef = useRef(defaultCheckIndex);
  const noYesBtnsRef = useRef<NoYesBtns | { currentBtn: "yes" }>({ currentBtn: "yes" });
  const maxCheckIndex = 3;
  const focusCell = useSelector((state: RootState) => state.table.focusCell);

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
  const AddRowOrCol = (checkIndex: number) => {
    const tableList = transformToTableList(contentEditablePresRef.current);
    switch (checkIndex) {
      case 0:
        tableList.splice(focusCell.row, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row + 1 }));
        break;
      case 1:
        tableList.splice(focusCell.row + 1, 0, new Array(cols));
        dispatch(setTableList({ cols, rows: rows + 1, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
      case 2:
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col + 1, row: focusCell.row }));
        break;
      case 3:
        for (let row = 0; row < tableList.length; row++) {
          tableList[row].splice(focusCell.col + 1, 0, "");
        }
        dispatch(setTableList({ cols: cols + 1, rows, tableList }));
        dispatch(setFocusCell({ col: focusCell.col, row: focusCell.row }));
        break;
    }
  };
  const arrowKeyControl = (key: "ArrowUp" | "ArrowDown") => {
    const addRowOrColCheckBoxObjList = addRowOrColCheckBoxObjListRef.current;
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
        dispatch(hideAddRowOrColModal(checkIndexRef.current));
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
        AddRowOrCol(checkIndexRef.current);
        dispatch(hideAddRowOrColModal(checkIndexRef.current));
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
    const addRowOrColCheckBoxObjList = addRowOrColCheckBoxObjListRef.current as AddRowOrColCheckBoxObj[];
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
    const addRowOrColCheckBoxObjList = addRowOrColCheckBoxObjListRef.current as AddRowOrColCheckBoxObj[];
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
          dispatch(hideAddRowOrColModal(checkIndexRef.current));
        }
      }}
    >
      <div className="modal__content modal__content--config-shortcut">
        <h1>행 또는 열 추가</h1>
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
              dispatch(hideAddRowOrColModal(checkIndexRef.current));
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
              AddRowOrCol(checkIndexRef.current);
              dispatch(hideAddRowOrColModal(checkIndexRef.current));
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddRowOrColModal;

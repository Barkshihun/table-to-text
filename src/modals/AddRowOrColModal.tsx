import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddRowOrColCheckBoxObj, NoYesBtns } from "../types/addRowOrColModalTypes";
import { hideAddRowOrColModal } from "../store/componentRenderSlice";
import AddRowOrColCheckBox from "../components/AddRowOrColCheckBox";
import { RootState } from "../store/store";

function AddRowOrColModal() {
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
  const checkIndexRef = useRef(defaultCheckIndex);
  const noYesBtnsRef = useRef<NoYesBtns | { currentBtn: "yes" }>({ currentBtn: "yes" });
  const maxCheckIndex = 3;

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
          hideAddRowOrColModal(checkIndexRef.current);
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
              hideAddRowOrColModal(checkIndexRef.current);
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
              hideAddRowOrColModal(checkIndexRef.current);
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

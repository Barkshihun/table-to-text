import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { LabelsRefCurrent, defaultCheckBoxes, DefaultCheckBoxesKey, CheckBoxesRefCurrent } from "../addRowOrColModalTypeAndConst";
import { setShowAddRowOrColModal } from "../store/componentRenderSlice";
import AddRowOrColCheckBox from "./AddRowOrColCheckBox";

function AddRowOrColModal() {
  const dispatch = useDispatch();
  const labelsRef = useRef<LabelsRefCurrent | {}>({});
  const checkBoxRef = useRef<CheckBoxesRefCurrent | {}>({});

  const onEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch(setShowAddRowOrColModal(false));
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", onEsc);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const renderCheckBoxes = () => {
    const checkBoxesArr = [];
    for (const key in defaultCheckBoxes) {
      const defaultCheckBoxesKey = key as DefaultCheckBoxesKey;
      const { text, checked } = defaultCheckBoxes[defaultCheckBoxesKey];
      checkBoxesArr.push(<AddRowOrColCheckBox labelsRef={labelsRef} text={text} checked={checked} defaultCheckBoxesKey={defaultCheckBoxesKey} checkBoxRef={checkBoxRef} />);
    }
    return checkBoxesArr;
  };
  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(setShowAddRowOrColModal(false));
        }
      }}
    >
      <div className="modal__content modal__content--config-shortcut">
        <h1>행 또는 열 추가</h1>
        {renderCheckBoxes()}
        <div className="config-shortcut-btn-container">
          <button
            className="btn btn--modal btn--no"
            onClick={() => {
              dispatch(setShowAddRowOrColModal(false));
            }}
          >
            취소
          </button>
          <button
            className="btn btn--modal btn--yes"
            onClick={() => {
              dispatch(setShowAddRowOrColModal(false));
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

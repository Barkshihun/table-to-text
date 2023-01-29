import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setShowAddRowOrColModal } from "../store/componentRenderSlice";

function AddRowOrColModal() {
  const dispatch = useDispatch();
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
        <div>
          <input type="checkbox" />
          <span>위쪽 행 추가</span>
        </div>
        <div>
          <input type="checkbox" />
          <span>아래쪽 행 추가</span>
        </div>
        <div>
          <input type="checkbox" />
          <span>왼쪽 열 추가</span>
        </div>
        <div>
          <input type="checkbox" />
          <span>오른쪽 열 추가</span>
        </div>
        <div className="config-shortcut-btn-container">
          <button
            className="btn btn--modal btn--yes"
            onClick={() => {
              dispatch(setShowAddRowOrColModal(false));
            }}
          >
            취소
          </button>
          <button className="btn btn--modal btn--yes">확인</button>
        </div>
      </div>
    </div>
  );
}
export default AddRowOrColModal;

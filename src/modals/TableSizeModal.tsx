import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setDisplayTableSizeModal } from "../store/componentRenderSlice";
import { setCols, setRows } from "../store/tableSlice";

function TableSizeModal() {
  const dispatch = useDispatch();
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const colsInputRef = useRef<HTMLInputElement>(null);
  const rowsInputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const onEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch(setDisplayTableSizeModal(false));
    }
  };
  const onTableSizeConfig = (event: React.FormEvent) => {
    event.preventDefault();
    const colsInput = colsInputRef.current as HTMLInputElement;
    const rowsInput = rowsInputRef.current as HTMLInputElement;
    const inputtedCols = parseInt(colsInput.value);
    const inputtedRows = parseInt(rowsInput.value);
    dispatch(setCols(inputtedCols));
    dispatch(setRows(inputtedRows));
    dispatch(setDisplayTableSizeModal(false));
  };
  useEffect(() => {
    window.addEventListener("keydown", onEsc);
    document.body.classList.add("no-scroll");
    colsInputRef.current?.select();
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
          dispatch(setDisplayTableSizeModal(false));
        }
      }}
    >
      <div className="modal__content">
        <form className="modal__table-size-wrapper" onSubmit={onTableSizeConfig}>
          <div className="modal__table-size-input-container">
            <input
              className="modal__input modal__input--table-size"
              type="number"
              min={1}
              step={1}
              ref={colsInputRef}
              defaultValue={cols}
              onKeyDown={(event) => {
                if (event.key === "Tab" && event.shiftKey === true) {
                  event.preventDefault();
                  btnRef.current?.focus();
                }
              }}
            />
            <span>x</span>
            <input className="modal__input modal__input--table-size" type="number" min={1} step={1} ref={rowsInputRef} defaultValue={rows} />
          </div>
          <button
            className="btn btn--modal btn--yes"
            ref={btnRef}
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                if (event.shiftKey === true) {
                  rowsInputRef.current?.focus();
                  return;
                }
                colsInputRef.current?.focus();
              }
            }}
          >
            설정
          </button>
        </form>
      </div>
    </div>
  );
}
export default TableSizeModal;

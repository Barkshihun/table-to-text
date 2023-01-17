import React, { useRef, useEffect } from "react";

function TableSizeModal({
  cols,
  rows,
  setCols,
  setRows,
  setShowTableSizeModal,
}: {
  cols: number;
  rows: number;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  setShowTableSizeModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const colsInputRef = useRef<HTMLInputElement>(null);
  const rowsInputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const onEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setShowTableSizeModal(false);
    }
  };
  const onTableSizeConfig = (event: React.FormEvent) => {
    event.preventDefault();
    const colsInput = colsInputRef.current as HTMLInputElement;
    const rowssInput = rowsInputRef.current as HTMLInputElement;
    const cols = parseInt(colsInput.value);
    const rows = parseInt(rowssInput.value);
    setCols(cols);
    setRows(rows);
    setShowTableSizeModal(false);
  };
  useEffect(() => {
    window.addEventListener("keydown", onEsc);
    colsInputRef.current?.select();
    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, []);
  return (
    <div
      className="modal"
      onClick={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          setShowTableSizeModal(false);
        }
      }}
    >
      <div className="modal__content">
        <form className="modal__table-size-wrapper" onSubmit={onTableSizeConfig}>
          <div className="modal__input-container">
            <input
              className="modal__input"
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
            <input className="modal__input" type="number" min={1} step={1} ref={rowsInputRef} defaultValue={rows} />
          </div>
          <button
            className="btn btn--table-size-config"
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

function TableSizeModal({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__table-size-wrapper">
          <div className="modal__input-container">
            <input className="modal__input" type="number" value={cols} />
            <span>x</span>
            <input className="modal__input" type="number" value={rows} />
          </div>
          <button className="btn btn--table-size">설정</button>
        </div>
      </div>
    </div>
  );
}
export default TableSizeModal;

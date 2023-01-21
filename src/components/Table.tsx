import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCols, setRows, setZero, setOne, setShowTableSizeModal, setTableList, editTableList } from "../store/tableSlice";
import { RootState } from "../store/store";
import TableSizeModal from "./TableSizeModal";
import "../scss/Modal.scss";
import "../scss/Table.scss";

function Table({ tableRef }: { tableRef: React.RefObject<HTMLTableElement> }) {
  const dispatch = useDispatch();
  const tableList = useSelector((state: RootState) => state.table.tableList);
  const cols = useSelector((state: RootState) => state.table.cols);
  const rows = useSelector((state: RootState) => state.table.rows);
  const showTableSizeModal = useSelector((state: RootState) => state.table.showTableSizeModal);
  const makeTableList = (empty: boolean): string[][] => {
    let tempTableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tempTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (tableList[row]) {
          if (tableList[row][col] && empty === false) {
            tempTableList[row][col] = tableList[row][col];
            continue;
          }
        }
        tempTableList[row][col] = "";
      }
    }
    return tempTableList;
  };
  const tableInputsRef = useRef<any>({});

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
  const onTableContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      dispatch(editTableList({ row, col, value: event.target.value }));
    }
  };
  const onResetContents = () => {
    dispatch(setTableList(makeTableList(true)));
  };
  const onChangeTableSize = () => {
    dispatch(setShowTableSizeModal(true));
  };
  const onArrowKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.target.dataset.row && event.target.dataset.col) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      if (event.shiftKey === true && event.ctrlKey === true) {
        if (event.key === "ArrowLeft" && col !== 0) {
          event.preventDefault();
          const focusElem = tableInputsRef.current[`${row},${col - 1}`] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowRight" && col !== cols - 1) {
          event.preventDefault();
          const focusElem = tableInputsRef.current[`${row},${col + 1}`] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowUp" && row !== 0) {
          event.preventDefault();
          const focusElem = tableInputsRef.current[`${row - 1},${col}`] as HTMLInputElement;
          focusElem.focus();
        }
        if (event.key === "ArrowDown" && row !== rows - 1) {
          event.preventDefault();
          const focusElem = tableInputsRef.current[`${row + 1},${col}`] as HTMLInputElement;
          focusElem.focus();
        }
      }
    }
  };
  // 이벤트 끝

  const setTableContents = () => {
    const trList = [];
    const rows = tableList.length;
    const cols = tableList[0] ? tableList[0].length : 0;
    for (let row = 0; row < rows; row++) {
      const tdList = [];
      for (let col = 0; col < cols; col++) {
        tdList.push(
          <td key={`r${row}c${col}`}>
            <div className="contentEditable-div-container">
              <div
                className="contentEditable-div-container__div"
                contentEditable
                ref={(elem: HTMLInputElement) => {
                  let tableInput = tableInputsRef.current as any;
                  tableInput[`${row},${col}`] = elem;
                }}
                onChange={onTableContentChange}
                onKeyDown={onArrowKeyDown}
                data-row={row}
                data-col={col}
              />
            </div>
          </td>
        );
      }
      trList.push(<tr key={`row${row}`}>{tdList.map((td) => td)}</tr>);
    }
    let tempTableInputs: { [coord: string]: HTMLInputElement } = {};
    for (const coord in tableInputsRef.current) {
      const input = tableInputsRef.current[coord] as HTMLInputElement;
      if (input) {
        tempTableInputs[coord] = input;
      }
    }
    tableInputsRef.current = tempTableInputs;
    return trList;
  };
  useEffect(() => {
    dispatch(setTableList(makeTableList(false)));
  }, [rows, cols]);
  return (
    <>
      {showTableSizeModal && <TableSizeModal />}
      <main className={"table-system-wrapper"}>
        <div className={"top-container"}>
          <div className="btn btn--delete">
            <FontAwesomeIcon icon={faTrash} onClick={onResetContents} />
          </div>
          <button className="btn btn--size-indicator" onClick={onChangeTableSize}>
            {cols}x{rows}
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
          <div className={"table-container"}>
            <table className="malgun-gothic" ref={tableRef}>
              <tbody>{setTableContents()}</tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
export default Table;

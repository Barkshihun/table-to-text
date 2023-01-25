import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { setIsHome } from "./store/componentRenderSlice";
import { setTableListForTransform } from "./store/tableSlice";
import { RootState } from "./store/store";
import Output from "./pages/Output";
import Home from "./pages/Home";
import "./scss/App.scss";
import "./scss/Btn.scss";

function App() {
  const isHome = useSelector((state: RootState) => state.componentRender.isHome);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const dispatch = useDispatch();
  const contentEditablePresRef = useRef<HTMLPreElement[][]>([]);

  const transformToOriginTableList = (contentEditablePres: HTMLPreElement[][]) => {
    let originTableList: string[][] = new Array(rows);
    for (let row = 0; row < rows; row++) {
      originTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        originTableList[row][col] = contentEditablePres[row][col].innerText;
      }
    }
    return originTableList;
  };
  const transformToTableListForTransform = (contentEditablePres: HTMLPreElement[][]) => {
    let tableListForTransform: string[][] = new Array(rows);
    let tableListRows = rows;
    let contentEditablePresRow = 0;
    let tableListRow;
    for (tableListRow = 0; tableListRow < tableListRows; tableListRow++) {
      tableListForTransform[tableListRow] = new Array(cols);
      let verticalLongestRowLength = 1;
      for (let col = 0; col < cols; col++) {
        const text = contentEditablePres[contentEditablePresRow][col].innerText;
        const verticalRowLength = text.split("\n").length;
        if (verticalRowLength > verticalLongestRowLength) {
          verticalLongestRowLength = verticalRowLength;
        }
      }
      for (let i = 1; i < verticalLongestRowLength; i++) {
        tableListForTransform.splice(tableListRow + i, 0, new Array());
      }
      for (let col = 0; col < cols; col++) {
        const text: string | string[] = contentEditablePres[contentEditablePresRow][col].innerText.split("\n");
        for (let i = 0; i < text.length; i++) {
          tableListForTransform[tableListRow + i][col] = text[i];
        }
      }
      const diff = verticalLongestRowLength - 1;
      tableListRow += diff;
      tableListRows += diff;
      contentEditablePresRow++;
    }
    return { colsForTransform: cols, rowsForTransform: tableListRow, tableListForTransform };
  };
  return (
    <>
      <header>
        <button
          className="btn btn--main-tranform btn--emphasize"
          onClick={() => {
            if (isHome) {
              const { colsForTransform, rowsForTransform, tableListForTransform } = transformToTableListForTransform(contentEditablePresRef.current);
              const originTableList = transformToOriginTableList(contentEditablePresRef.current);
              dispatch(setTableListForTransform({ colsForTransform, rowsForTransform, tableListForTransform, originTableList }));
            }
            dispatch(setIsHome(!isHome));
          }}
          type={"button"}
        >
          {isHome === true ? "텍스트로 변환" : "표로 가기"}
        </button>
      </header>
      {isHome === true ? <Home contentEditablePresRef={contentEditablePresRef} /> : <Output />}
    </>
  );
}

export default App;

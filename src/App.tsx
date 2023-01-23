import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { setIsHome } from "./store/renderedPageSlice";
import { setTableList } from "./store/tableSlice";
import { RootState } from "./store/store";
import Output from "./pages/Output";
import Home from "./pages/Home";
import "./scss/App.scss";
import "./scss/Btn.scss";

function App() {
  const isHome = useSelector((state: RootState) => state.renderedPage.isHome);
  const cols = useSelector((state: RootState) => state.table.cols);
  const rows = useSelector((state: RootState) => state.table.rows);
  const dispatch = useDispatch();
  const contentEditablePresRef = useRef<HTMLPreElement[][]>([]);

  const transformToTableList = (contentEditablePres: HTMLPreElement[][]) => {
    let tempTableList: string[][] = new Array(rows);
    let tableListRows = rows;
    let contentEditablePresRow = 0;
    for (let tableListRow = 0; tableListRow < tableListRows; tableListRow++) {
      tempTableList[tableListRow] = new Array(cols);
      let verticalLongestRowLength = 1;
      for (let col = 0; col < cols; col++) {
        console.log("tableListRow", tableListRow, "contentEditableDivsRow", contentEditablePresRow);
        const text = contentEditablePres[contentEditablePresRow][col].innerText;
        const verticalRowLength = text.split("\n").length;
        if (verticalRowLength > verticalLongestRowLength) {
          verticalLongestRowLength = verticalRowLength;
        }
      }
      for (let i = 1; i < verticalLongestRowLength; i++) {
        tempTableList.splice(tableListRow + i, 0, new Array());
      }
      for (let col = 0; col < cols; col++) {
        const text: string | string[] = contentEditablePres[contentEditablePresRow][col].innerText.split("\n");
        for (let i = 0; i < text.length; i++) {
          tempTableList[tableListRow + i][col] = text[i];
        }
      }
      const diff = verticalLongestRowLength - 1;
      tableListRow += diff;
      tableListRows += diff;
      contentEditablePresRow++;
    }
    return tempTableList;
  };
  return (
    <>
      <header>
        <button
          className="btn btn--main-tranform btn--transform"
          onClick={() => {
            console.table(transformToTableList(contentEditablePresRef.current));
            if (isHome) {
              dispatch(setTableList(transformToTableList(contentEditablePresRef.current)));
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

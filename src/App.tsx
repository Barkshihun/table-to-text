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
  const contentEditableDivsRef = useRef<HTMLDivElement[][]>([]);

  const transformToTableList = (contentEditableDivs: HTMLDivElement[][]) => {
    let tempTableList = new Array(rows);
    for (let row = 0; row < rows; row++) {
      tempTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        tempTableList[row][col] = contentEditableDivs[row][col].innerText;
      }
    }
    return tempTableList;
  };
  return (
    <>
      <header>
        <button
          className="btn btn--main-tranform btn--transform"
          onClick={() => {
            if (isHome) {
              dispatch(setTableList(transformToTableList(contentEditableDivsRef.current)));
            }
            dispatch(setIsHome(!isHome));
          }}
          type={"button"}
        >
          {isHome === true ? "텍스트로 변환" : "표로 가기"}
        </button>
      </header>
      {isHome === true ? <Home contentEditableDivsRef={contentEditableDivsRef} /> : <Output />}
    </>
  );
}

export default App;

import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { setIsHome, setDisplayConfigShortcutModal } from "./store/componentRenderSlice";
import { setTableListForTransform } from "./store/tableSlice";
import { RootState } from "./store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faQuestion } from "@fortawesome/free-solid-svg-icons";
import ConfigShortcutModal from "./modals/ConfigShortcutModal";
import Output from "./pages/Output";
import Home from "./pages/Home";
import "./scss/Btn.scss";
import "./scss/App.scss";
import "./scss/Modal.scss";
import "./scss/Home.scss";
import "./scss/Table.scss";
import "./scss/Output.scss";

function App() {
  const isHome = useSelector((state: RootState) => state.componentRender.isHome);
  const isShowConfigShortcutModal = useSelector((state: RootState) => state.componentRender.isShowConfigShortcutModal);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const dispatch = useDispatch();
  const contentEditablePresRef = useRef<HTMLPreElement[][]>([]);

  const transFormPreToText = (pre: HTMLPreElement) => {
    let text = "";
    const length = pre.childNodes.length;
    if (length === 1) {
      text = pre.childNodes[0].textContent as string;
    } else {
      for (let i = 0; i < length - 1; i++) {
        const tempText = pre.childNodes[i].textContent as string;
        text += tempText + "\n";
      }
      text += pre.childNodes[length - 1].textContent as string;
    }
    return text;
  };
  const transformToOriginTableList = (contentEditablePres: HTMLPreElement[][]) => {
    let originTableList: string[][] = new Array(rows);
    for (let row = 0; row < rows; row++) {
      originTableList[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        originTableList[row][col] = transFormPreToText(contentEditablePres[row][col]);
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
        const text = transFormPreToText(contentEditablePres[contentEditablePresRow][col]);
        const verticalRowLength = text.split("\n").length;
        if (verticalRowLength > verticalLongestRowLength) {
          verticalLongestRowLength = verticalRowLength;
        }
      }
      for (let i = 1; i < verticalLongestRowLength; i++) {
        tableListForTransform.splice(tableListRow + i, 0, new Array());
      }
      for (let col = 0; col < cols; col++) {
        const text: string | string[] = transFormPreToText(contentEditablePres[contentEditablePresRow][col]).split("\n");
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
      {isShowConfigShortcutModal && <ConfigShortcutModal />}
      <header className="relative-header">
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
        <div className="sub-icon-container">
          <div
            className="config-icon"
            onClick={() => {
              dispatch(setDisplayConfigShortcutModal(true));
            }}
          >
            <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="toolTip">
            <FontAwesomeIcon icon={faQuestion} />
            <div className="toolTip__text">글자마다 크기가 다 다르기 때문에 변환이 잘 안 될 수 있습니다</div>
          </div>
        </div>
      </header>
      {isHome === true ? <Home contentEditablePresRef={contentEditablePresRef} /> : <Output />}
    </>
  );
}

export default App;

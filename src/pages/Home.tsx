import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { importCsv } from "../store/tableSlice";
import LoadingModal from "../components/LoadingModal";
import Table from "../components/Table";
import "../scss/Home.scss";

function Home({ contentEditableDivsRef }: { contentEditableDivsRef: React.MutableRefObject<HTMLDivElement[][]> }) {
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const cols = useSelector((state: RootState) => state.table.cols);
  const rows = useSelector((state: RootState) => state.table.rows);

  const transformToCsvData = (contentEditableDivs: HTMLDivElement[][]) => {
    const lastCol = cols - 1;
    let tempCsvData = "";
    for (let row = 0; row < rows; row++) {
      let rowCsvData = "";
      for (let col = 0; col < cols; col++) {
        let text = contentEditableDivs[row][col].innerText;
        let lastTextIndex = text.length - 1;
        if (text[0] === "\n") {
          text = text.substring(1);
          lastTextIndex = text.length - 1;
        }
        if (text[lastTextIndex] === "\n") {
          text = text.substring(0, lastTextIndex);
        }
        text = text.replace(/\n\n/g, "\n");
        if (text.includes('"')) {
          rowCsvData += `"${text.replace(/"/g, '""')}"`;
        } else if (text.includes(",") || text.includes("\n")) {
          rowCsvData += `"${text}"`;
        } else {
          rowCsvData += text;
        }
        if (col !== lastCol) {
          rowCsvData += ",";
        }
      }
      rowCsvData += "\n";
      tempCsvData += rowCsvData;
    }
    return tempCsvData;
  };
  const onImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const csvFile = event.target.files[0];
      if (csvFile.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onloadend = () => {
          let rawData = reader.result as string;
          rawData = rawData.replace(/\r/g, "");
          console.log("들어옴");
          let rawDataList = rawData.split("\n");
          let rawDataTableList: string[][] = [];
          const rows = rawDataList.length;
          for (let i = 0; i < rows; i++) {
            rawDataTableList[i] = rawDataList[i].split(",");
          }
          const cols = rawDataTableList[0].length;
          event.target.value = "";
          console.table(rawDataTableList);
          console.log("cols", cols, "rows", rows);
          dispatch(importCsv({ rows, cols, rawDataTableList }));
          console.log("끝이다");
        };
      }
    }
  };
  const onTransformToCsv = () => {
    const csvData = transformToCsvData(contentEditableDivsRef.current);
    const aTag = document.createElement("a");
    aTag.href = `data:text/plain;charset=utf-8,\ufeff${encodeURIComponent(csvData)}`;
    aTag.download = "표.csv";
    aTag.click();
  };
  const onTransformToPng = async () => {
    setShowLoading(true);
    const tableNode = tableContainerRef.current as HTMLDivElement;
    tableNode.style.paddingRight = "0";
    const scale = 3;
    const dataUrl = await domtoimage.toPng(tableNode, {
      width: tableNode.clientWidth * scale,
      height: tableNode.clientHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      },
    });
    tableNode.style.paddingRight = "30px";
    const aTag = document.createElement("a");
    aTag.download = "표.png";
    aTag.href = dataUrl;
    aTag.click();
    setShowLoading(false);
  };
  return (
    <>
      {showLoading && <LoadingModal />}
      <div className="sub-btn-container">
        <label className="btn sub-btn-container__btn btn--transform" htmlFor="importCsv">
          csv 불러오기
          <input type={"file"} id="importCsv" className="input--file" accept=".csv" onChange={onImportCsv}></input>
        </label>
        <button className="btn sub-btn-container__btn btn--transform" onClick={onTransformToCsv}>
          csv로 변환
        </button>
        <button className="btn sub-btn-container__btn btn--transform" onClick={onTransformToPng}>
          png로 변환
        </button>
      </div>
      <Table tableContainerRef={tableContainerRef} contentEditableDivsRef={contentEditableDivsRef} />
    </>
  );
}
export default Home;

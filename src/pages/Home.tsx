import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { importCsv } from "../store/tableSlice";
import LoadingModal from "../components/LoadingModal";
import Table from "../components/Table";

function Home() {
  const dispatch = useDispatch();
  const tableList = useSelector((state: RootState) => state.table.tableList);
  const [showLoading, setShowLoading] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

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
          console.table(rawDataTableList);
          console.log("cols", cols, "rows", rows);
          dispatch(importCsv({ rows, cols, rawDataTableList }));
          console.log("끝이다");
        };
      }
    }
  };
  const onTransformToCsv = () => {
    let csv: any = [];
    for (let i = 0; i < tableList.length; i++) {
      const row = [...tableList[i]];
      for (let j = 0; j < row.length; j++) {
        if (row[j].includes('"')) {
          row[j] = `"${row[j].replace(/"/g, '""')}"`;
        } else if (row[j].includes(",")) {
          row[j] = `"${row[j]}"`;
        }
      }
      csv.push(row);
    }
    csv = csv.join("\n");
    const aTag = document.createElement("a");
    aTag.href = `data:text/plain;charset=utf-8,\ufeff${encodeURIComponent(csv)}`;
    aTag.download = "표.csv";
    aTag.click();
  };
  const onTransformToPng = async () => {
    setShowLoading(true);
    const tableNode = tableRef.current as HTMLTableElement;
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
    tableNode.style.paddingRight = "10%";
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
      <Table tableRef={tableRef} />
    </>
  );
}
export default Home;

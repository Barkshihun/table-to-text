import React, { useState, useRef } from "react";
import domtoimage from "dom-to-image";
import Table, { globalTableList } from "./components/Table";
import LoadingModal from "./components/LoadingModal";
import "./scss/App.scss";

function App() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isTable, setIsTable] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const onTranformToTxt = () => {
    setIsTable((currentIsTable) => {
      if (currentIsTable) {
      } else {
      }
      return !currentIsTable;
    });
  };
  const onImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const csvFile = event.target.files[0];
      if (csvFile.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onloadend = () => {
          const result = reader.result;
          console.log(result);
        };
      }
    }
  };
  const onTransFormToCsv = () => {
    let csv: any = [];
    for (let i = 0; i < globalTableList.length; i++) {
      const row = [...globalTableList[i]];
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
  const onTransFormToPng = async () => {
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
    setShowLoading(false);
    aTag.click();
  };
  return (
    <>
      {showLoading && <LoadingModal />}
      <header>
        <button className="btn btn--main-tranform btn--transform" onClick={onTranformToTxt} type={"button"}>
          {isTable ? "텍스트로 변환" : "표로 가기"}
        </button>
        {isTable && (
          <div className="sub-btn-container">
            <label className="btn sub-btn-container__btn btn--transform" htmlFor="importCsv">
              csv 불러오기
              <input type={"file"} id="importCsv" className="input--file" accept=".csv" onChange={onImportCsv}></input>
            </label>
            <button className="btn sub-btn-container__btn btn--transform" onClick={onTransFormToCsv}>
              csv로 변환
            </button>
            <button className="btn sub-btn-container__btn btn--transform" onClick={onTransFormToPng}>
              png로 변환
            </button>
          </div>
        )}
      </header>
      <main>
        <Table isTable={isTable} tableRef={tableRef} />
      </main>
    </>
  );
}

export default App;

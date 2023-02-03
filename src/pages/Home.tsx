import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import chardet from "chardet";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setZero, setTableList } from "../store/tableSlice";
import { showDownloadModal, setDownloadModalText } from "../store/componentRenderSlice";
import DownloadModal from "../modals/DownloadModal";
import TransformingModal from "../modals/TransformingModal";
import Table from "../components/Table";

function Home({ contentEditablePresRef }: { contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const [showTransformingModal, setShowTransformingModal] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const isShowDownloadModal = useSelector((state: RootState) => state.componentRender.isShowDownloadModal);

  const transFormQuotation = (text: string) => {
    if (text[0] === '"' && text[text.length - 1] === '"') {
      text = text.slice(1, -1);
    }
    text = text.replace(/""/g, '"');
    return text;
  };
  const onImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const FileList = event.target.files as FileList;
    const csvFile = FileList[0];
    event.target.value = "";
    if (!csvFile) {
      return;
    }
    if (csvFile.type !== "text/csv") {
      Swal.fire({
        icon: "error",
        title: "csv 파일만\n불러올 수 있습니다",
        position: "top",
      });
      return;
    }
    const readerForEncoding = new FileReader();
    const readerForText = new FileReader();
    readerForEncoding.readAsArrayBuffer(csvFile);
    readerForEncoding.onload = () => {
      let csvDataArrayBuffer = readerForEncoding.result as ArrayBuffer;
      const csvDataUint8Array = new Uint8Array(csvDataArrayBuffer);
      const encoding = chardet.detect(csvDataUint8Array);
      if (!encoding) {
        Swal.fire({
          icon: "error",
          title: "파일의 인코딩을 알 수 없습니다",
          position: "top",
        });
        return;
      }
      readerForText.readAsText(csvFile, encoding);
    };
    readerForText.onload = () => {
      let csvTextData = readerForText.result as string;
      csvTextData = csvTextData.replace(/\r/g, "");
      if (csvTextData === "" || csvTextData === "\n") {
        dispatch(setZero());
        return;
      }
      let isInQuotation = false;
      let startIndex = 0;
      const tableList: string[][] = [[]];
      let rawDataTableListRow = 0;
      for (let i = 0; i < csvTextData.length; i++) {
        switch (csvTextData[i]) {
          case '"':
            if (isInQuotation) {
              isInQuotation = false;
            } else {
              isInQuotation = true;
            }
            break;
          case ",":
            if (!isInQuotation) {
              let text = csvTextData.substring(startIndex, i);
              text = transFormQuotation(text);
              tableList[rawDataTableListRow].push(text);
              startIndex = i + 1;
            }
            break;
          case "\n":
            if (!isInQuotation) {
              let text = csvTextData.substring(startIndex, i);
              text = transFormQuotation(text);
              tableList[rawDataTableListRow].push(text);
              tableList.push([]);
              startIndex = i + 1;
              rawDataTableListRow++;
            }
            break;
          default:
            break;
        }
        if (i === csvTextData.length - 1 && !(csvTextData[i] === "\n")) {
          let text = csvTextData.substring(startIndex, i + 1);
          text = transFormQuotation(text);
          tableList[rawDataTableListRow].push(text);
        }
      }
      if (tableList[tableList.length - 1].length === 0) {
        tableList.pop();
      }
      const rows = tableList.length;
      const cols = tableList[0].length;
      dispatch(setTableList({ cols, rows, tableList }));
      if (csvFile.name[0] !== ".") {
        const fileName = csvFile.name.slice(0, -4);
        dispatch(setDownloadModalText(fileName));
      } else {
        dispatch(setDownloadModalText(""));
      }
    };
  };
  const transformToCsvData = (contentEditablePres: HTMLPreElement[][]) => {
    const lastCol = cols - 1;
    let tempCsvData = "";
    for (let row = 0; row < rows; row++) {
      let rowCsvData = "";
      for (let col = 0; col < cols; col++) {
        const text = contentEditablePres[row][col].innerText;
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
  const onDownloadToCsv = (fileName: string) => {
    const csvData = transformToCsvData(contentEditablePresRef.current);
    const aTag = document.createElement("a");
    aTag.href = `data:text/plain;charset=utf-8,\ufeff${encodeURIComponent(csvData)}`;
    aTag.download = `${fileName}.csv`;
    aTag.click();
  };
  const onDownloadToPng = async (fileName: string) => {
    setShowTransformingModal(true);
    const tableNode = tableContainerRef.current as HTMLDivElement;
    const scale = 3;
    const dataUrl = await toPng(tableNode, {
      width: tableNode.clientWidth * scale,
      height: tableNode.clientHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      },
    });
    const aTag = document.createElement("a");
    aTag.download = `${fileName}.png`;
    aTag.href = dataUrl;
    aTag.click();
    setShowTransformingModal(false);
  };

  return (
    <>
      {isShowDownloadModal && <DownloadModal onDownloadToCsv={onDownloadToCsv} onDownloadToPng={onDownloadToPng} />}
      {showTransformingModal && <TransformingModal />}
      <div className="sub-btn-container">
        <label className="btn sub-btn-container__btn btn--emphasize" htmlFor="importCsv">
          <span className="importCsv__text">csv 불러오기</span>
          <input type={"file"} id="importCsv" className="input--file" accept=".csv" onChange={onImportCsv}></input>
        </label>
        <button
          className="btn sub-btn-container__btn btn--emphasize"
          onClick={() => {
            dispatch(showDownloadModal("csv"));
          }}
        >
          csv로 다운
        </button>
        <button
          className="btn sub-btn-container__btn btn--emphasize"
          onClick={() => {
            dispatch(showDownloadModal("png"));
          }}
        >
          png로 다운
        </button>
      </div>
      <Table tableContainerRef={tableContainerRef} contentEditablePresRef={contentEditablePresRef} />
    </>
  );
}
export default Home;

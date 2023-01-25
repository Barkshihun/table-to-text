import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import chardet from "chardet";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setZero, importCsv } from "../store/tableSlice";
import { showDownloadModal } from "../store/componentRenderSlice";
import DownloadModal from "../components/DownloadModal";
import TransformingModal from "../components/TransformingModal";
import Table from "../components/Table";
import "../scss/Home.scss";

function Home({ contentEditablePresRef }: { contentEditablePresRef: React.MutableRefObject<HTMLPreElement[][]> }) {
  const dispatch = useDispatch();
  const [showTransformingModal, setShowTransformingModal] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const cols = useSelector((state: RootState) => state.table.originCols);
  const rows = useSelector((state: RootState) => state.table.originRows);
  const isShowDownloadModal = useSelector((state: RootState) => state.componentRender.isShowDownloadModal);
  const downloadModalText = useSelector((state: RootState) => state.componentRender.downloadModalText);

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
  const onImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const FileList = event.target.files as FileList;
    const csvFile = FileList[0];
    if (!csvFile) {
      return;
    }
    if (csvFile.type === "text/csv") {
      const readerForEncoding = new FileReader();
      readerForEncoding.readAsArrayBuffer(csvFile);
      let encoding;
      readerForEncoding.onloadend = () => {
        let csvDataArrayBuffer = readerForEncoding.result as ArrayBuffer;
        const csvDataUint8Array = new Uint8Array(csvDataArrayBuffer);
        encoding = chardet.detect(csvDataUint8Array);
        if (!encoding) {
          Swal.fire({
            icon: "error",
            title: "파일의 인코딩을 알 수 없습니다",
            position: "top",
          });
          return;
        }
        const readerForText = new FileReader();
        readerForText.readAsText(csvFile, encoding);
        readerForText.onload = () => {
          let csvTextData = readerForText.result as string;
          csvTextData = csvTextData.replace(/\r/g, "");
          if (csvTextData === "" || csvTextData === "\n") {
            dispatch(setZero());
            return;
          }
          let isInQuotation = false;
          let startIndex = 0;
          const rawDataTableList: string[][] = [[]];
          let rawDataTableListRow = 0;
          const transFormQuotation = (text: string) => {
            if (text[0] === '"' && text[text.length - 1] === '"') {
              text = text.slice(1, -1);
            }
            text = text.replace(/""/g, '"');
            return text;
          };
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
                  rawDataTableList[rawDataTableListRow].push(text);
                  startIndex = i + 1;
                }
                break;
              case "\n":
                if (!isInQuotation) {
                  let text = csvTextData.substring(startIndex, i);
                  text = transFormQuotation(text);
                  rawDataTableList[rawDataTableListRow].push(text);
                  rawDataTableList.push([]);
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
              rawDataTableList[rawDataTableListRow].push(text);
            }
          }
          if (rawDataTableList[rawDataTableList.length - 1].length === 0) {
            rawDataTableList.pop();
          }
          const rows = rawDataTableList.length;
          const cols = rawDataTableList[0].length;
          dispatch(importCsv({ cols, rows, rawDataTableList }));
          event.target.value = "";
        };
      };
    } else {
      Swal.fire({
        icon: "error",
        title: "csv 파일만 불러올 수 있습니다",
        position: "top",
      });
    }
  };
  const onDownloadToCsv = (name: string) => {
    const csvData = transformToCsvData(contentEditablePresRef.current);
    const aTag = document.createElement("a");
    aTag.href = `data:text/plain;charset=utf-8,\ufeff${encodeURIComponent(csvData)}`;
    aTag.download = `${name}.csv`;
    aTag.click();
  };
  const onDownloadToPng = async (name: string) => {
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
    aTag.download = `${name}.png`;
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
          csv 불러오기
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

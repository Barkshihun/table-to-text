import { useState, useRef } from "react";
import domtoimage from "dom-to-image";
import Table from "./components/Table";
import "./scss/App.scss";

function App() {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [isTable, setIsTable] = useState(true);
  const onTranform = () => {
    setIsTable((currentIsTable) => {
      if (currentIsTable) {
      } else {
      }
      return !currentIsTable;
    });
  };
  const transFormToPng = async () => {
    const tableNode = tbodyRef.current as HTMLTableSectionElement;
    const dataUrl = await domtoimage.toPng(tableNode);
    const aTag = document.createElement("a");
    aTag.download = "표.png";
    aTag.href = dataUrl;
    aTag.click();
  };
  return (
    <>
      <header>
        <button onClick={onTranform} type={"button"}>
          {isTable ? "텍스트로 변환" : "표로 가기"}
        </button>
        {isTable && (
          <div>
            <button onClick={transFormToPng}>png로 변환</button>
            <button>csv로 변환</button>
          </div>
        )}
      </header>
      <main>
        <Table isTable={isTable} tbodyRef={tbodyRef} />
      </main>
    </>
  );
}

export default App;

import { useState, useEffect } from "react";
import Table from "./components/Table";
import "./scss/App.scss";

function App() {
  const [isTable, setIsTable] = useState(true);
  const onTranform = () => {
    setIsTable((currentIsTable) => {
      if (currentIsTable) {
      } else {
      }
      return !currentIsTable;
    });
  };
  return (
    <>
      <header>
        <button onClick={onTranform} className={"transform-btn btn-margin"}>
          {isTable ? "텍스트로 변환" : "표로 가기"}
        </button>
      </header>
      <main>
        <Table isTable={isTable} />
      </main>
    </>
  );
}

export default App;

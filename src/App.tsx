import { useState } from "react";
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
        <button onClick={onTranform} type={"button"}>
          {isTable ? "텍스트로 변환" : "표로 가기"}
        </button>
        {isTable && (
          <div>
            <button>png로 변환</button>
            <button>csv로 변환</button>
          </div>
        )}
      </header>
      <main>
        <Table isTable={isTable} />
      </main>
    </>
  );
}

export default App;

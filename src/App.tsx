import { useState } from "react";
import Output from "./components/Output";
import Table from "./components/Table";
import "./scss/App.scss";

function App() {
  const [isTable, setIsTable] = useState(true);
  const onTranform = () => {
    setIsTable((currentIsTable) => !currentIsTable);
  };

  return (
    <main>
      <button onClick={onTranform} className={"transform-btn"}>
        {isTable ? "텍스트로 변환" : "표로 가기"}
      </button>
      {isTable ? <Table /> : <Output />}
    </main>
  );
}

export default App;

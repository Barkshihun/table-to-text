import { useState, useEffect } from "react";
import Output from "../components/Output";
import Table from "../components/Table";

function Desktop() {
  const [isTable, setIsTable] = useState(true);
  const onTranform = () => {
    setIsTable((currentIsTable) => !currentIsTable);
  };
  return (
    <main>
      <button onClick={onTranform}>
        {isTable ? "텍스트로 변환" : "표로 가기"}
      </button>
      {isTable ? <Table /> : <Output />}
    </main>
  );
}

export default Desktop;
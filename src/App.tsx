import { useState } from "react";
import Output from "./components/Output";
import Table from "./components/Table";

function App() {
  const [isTable, setIsTable] = useState(true);
  const [space, setSpace] = useState(" ");
  const onTranform = () => {
    setIsTable((currentIsTable) => !currentIsTable);
  };
  const onChangeSpaceClick = () => {
    setSpace((currentSpace) => {
      switch (currentSpace) {
        case " ":
          return "\u3000";
        case "\u3000":
          return " ";
        default:
          return " ";
      }
    });
  };
  return (
    <main>
      <button onClick={onChangeSpaceClick}>{space === " " ? "반각 띄어쓰기" : "전각 띄어쓰기"}</button>
      <button onClick={onTranform} className={"transform-btn"}>
        {isTable ? "텍스트로 변환" : "표로 가기"}
      </button>
      {isTable ? <Table /> : <Output space={space} />}
    </main>
  );
}

export default App;

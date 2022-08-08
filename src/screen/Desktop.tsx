import { useState, useEffect } from "react";
import Output from "../components/Output";
import Table from "../components/Table";
import "../scss/Desktop.scss";

function Desktop() {
  const [isTable, setIsTable] = useState(true);
  const [isVerticalLine, setVerticalLine] = useState(true);
  const [isHorizontalLine, setHorizontalLine] = useState(true);
  const onTranform = () => {
    setIsTable((currentIsTable) => !currentIsTable);
  };
  const onVerticalLine = () => {
    setVerticalLine((currentBorder) => !currentBorder);
  };
  const onHorizontalLine = () => {
    setHorizontalLine((currentBorder) => !currentBorder);
  };
  return (
    <main>
      <button onClick={onVerticalLine}>{isVerticalLine ? "세로선 ✔" : "세로선 ❌"}</button>
      <button onClick={onHorizontalLine}>{isHorizontalLine ? "가로선 ✔" : "가로선 ❌"}</button>
      <button onClick={onTranform} className={"transform-btn"}>
        {isTable ? "텍스트로 변환" : "표로 가기"}
      </button>
      {isTable ? <Table /> : <Output isVerticalLine={isVerticalLine} isHorizontalLine={isHorizontalLine} />}
    </main>
  );
}

export default Desktop;

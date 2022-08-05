import { useState } from "react";
import Output from "./Output";
import Table from "./Table";

function Desktop() {
  const [isTransform, setIsTransform] = useState(false);
  const onTranform = () => {
    setIsTransform((currentIsTransForm) => !currentIsTransForm);
  };
  return (
    <main>
      <button onClick={onTranform}>
        {isTransform ? "표로 가기" : "텍스트로 변환"}
      </button>
      {isTransform ? <Output /> : <Table />}
    </main>
  );
}

export default Desktop;

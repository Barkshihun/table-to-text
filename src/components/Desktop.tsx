import { useState } from "react";
import "../scss/Desktop.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableContents from "./TableContents";

function Desktop() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const onPlus = () => {};
  const onMinus = () => {};
  return (
    <main>
      <table>
        <tbody>
          {TableContents({ rows, cols }).map((item, index) => item)}
        </tbody>
      </table>
    </main>
  );
}

export default Desktop;

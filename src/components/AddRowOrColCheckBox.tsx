import { AddRowOrColCheckBoxObj } from "../types/addRowOrColModalTypes";

function AddRowOrColCheckBox({
  addRowOrColCheckBoxObjList,
  checkIndexRef,
  index,
  focused,
}: {
  addRowOrColCheckBoxObjList: AddRowOrColCheckBoxObj[];
  checkIndexRef: React.MutableRefObject<number>;
  index: number;
  focused: boolean;
}) {
  const addRowOrColCheckBoxObj = addRowOrColCheckBoxObjList[index];
  const { text } = addRowOrColCheckBoxObj;
  const onCheckboxCheck = () => {
    const { checkboxElem } = addRowOrColCheckBoxObj;
    if (checkboxElem) {
      checkboxElem.checked = true;
    }
    const prevCheckIndex = checkIndexRef.current;
    if (prevCheckIndex === index) {
      return;
    }
    const prevAddRowOrColCheckBoxObj = addRowOrColCheckBoxObjList[prevCheckIndex];
    const { checkboxElem: prevCheckboxElem } = prevAddRowOrColCheckBoxObj;
    if (prevCheckboxElem) {
      prevCheckboxElem.checked = false;
      checkIndexRef.current = index;
    }
  };
  return (
    <label
      onMouseDown={onCheckboxCheck}
      tabIndex={0}
      ref={(elem) => {
        if (elem) {
          addRowOrColCheckBoxObj.labelElem = elem;
        }
      }}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      <input
        type="checkbox"
        defaultChecked={focused}
        ref={(elem) => {
          if (elem) {
            addRowOrColCheckBoxObj.checkboxElem = elem;
          }
        }}
      />
      {text}
    </label>
  );
}
export default AddRowOrColCheckBox;

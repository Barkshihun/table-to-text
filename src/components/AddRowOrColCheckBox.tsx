import { LabelsRefCurrent, DefaultCheckBoxesKey, DefaultCheckBoxesText, CheckBoxesRefCurrent } from "../addRowOrColModalTypeAndConst";

function AddRowOrColCheckBox({
  labelsRef,
  checkBoxRef,
  text,
  checked,
  defaultCheckBoxesKey,
}: {
  labelsRef: React.MutableRefObject<{} | LabelsRefCurrent>;
  checkBoxRef: React.MutableRefObject<{} | CheckBoxesRefCurrent>;
  text: DefaultCheckBoxesText;
  checked: boolean;
  defaultCheckBoxesKey: DefaultCheckBoxesKey;
}) {
  return (
    <label
      tabIndex={0}
      ref={(elem) => {
        if (elem) {
          const labelsRefCurrent = labelsRef.current as LabelsRefCurrent;
          labelsRefCurrent[defaultCheckBoxesKey];
        }
      }}
    >
      <input
        type="checkbox"
        defaultChecked={checked}
        ref={(elem) => {
          if (elem) {
            const checkBoxRefCurrent = checkBoxRef.current as LabelsRefCurrent;
            checkBoxRefCurrent[defaultCheckBoxesKey];
          }
        }}
      />
      {text}
    </label>
  );
}
export default AddRowOrColCheckBox;

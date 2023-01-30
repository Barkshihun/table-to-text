const defaultCheckBoxes = {
  addUpRow: {
    text: "위쪽 행 추가",
    checked: true,
  },
  addDownRow: {
    text: "아래쪽 행 추가",
    checked: false,
  },
  addLeftCol: {
    text: "왼쪽 열 추가",
    checked: false,
  },
  addRightCol: {
    text: "오른쪽 열 추가",
    checked: false,
  },
} as const;
type DefaultCheckBoxesKey = keyof typeof defaultCheckBoxes;
type DefaultCheckBoxesText = typeof defaultCheckBoxes[DefaultCheckBoxesKey]["text"];
type LabelsRefCurrent = {
  [defaultCheckBoxesKey in DefaultCheckBoxesKey]: { text: DefaultCheckBoxesText; checked: boolean };
};
type CheckBoxesRefCurrent = {
  [defaultCheckBoxesKey in DefaultCheckBoxesKey]: HTMLInputElement;
};
export { defaultCheckBoxes };
export type { DefaultCheckBoxesKey, DefaultCheckBoxesText, LabelsRefCurrent, CheckBoxesRefCurrent };

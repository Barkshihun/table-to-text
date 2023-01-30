type AddRowOrColCheckBoxObj = { text: AddRowOrColCheckBoxObjText; labelElem?: HTMLLabelElement; checkboxElem?: HTMLInputElement };
type AddRowOrColCheckBoxObjText = "위쪽 행 추가" | "아래쪽 행 추가" | "왼쪽 열 추가" | "오른쪽 열 추가";
type NoYesBtns = {
  noBtn: HTMLButtonElement;
  yesBtn: HTMLButtonElement;
  currentBtn: "no" | "yes";
};
export type { AddRowOrColCheckBoxObj, NoYesBtns };

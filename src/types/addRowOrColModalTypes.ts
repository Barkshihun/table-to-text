type AddRowOrColCheckBoxObj = { text: string; labelElem?: HTMLLabelElement; checkboxElem?: HTMLInputElement };
type RemoveRowOrColCheckBoxObj = { text: string; labelElem?: HTMLLabelElement; checkboxElem?: HTMLInputElement };
type NoYesBtns = {
  noBtn: HTMLButtonElement;
  yesBtn: HTMLButtonElement;
  currentBtn: "no" | "yes";
};
export type { AddRowOrColCheckBoxObj, RemoveRowOrColCheckBoxObj, NoYesBtns };

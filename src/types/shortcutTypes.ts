import { ACTION_NAME } from "../shortcutConsts";

interface SingleShortcutObj {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  code: string;
  isAbled: boolean;
}
type ShortcutsObj = {
  [actionName in ActionName]: SingleShortcutObj;
};
type ActionName = typeof ACTION_NAME[keyof typeof ACTION_NAME];
type ConfigKey = { state: false } | { state: true; target: HTMLButtonElement; actionName: ActionName };
type SetConfigKey = {
  (state: false): void;
  (state: true, target: HTMLButtonElement, actionName: ActionName): void;
};
type SingleConfigShortcutDivElems = { [actionName in ActionName]: { checkBoxElem?: HTMLInputElement; btnElem?: HTMLButtonElement } };

export type { SingleShortcutObj, ActionName, ConfigKey, SetConfigKey, SingleConfigShortcutDivElems, ShortcutsObj };

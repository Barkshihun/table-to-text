const ACTION_NAME = {
  MOVE_TO_NEXT_CELL: "moveToNextCell",
  MOVE_TO_PREV_CELL: "moveToPrevCell",
  MOVE_TO_UP_CELL: "moveToUpCell",
  MOVE_TO_DOWN_CELL: "moveToDownCell",
  MOVE_TO_LEFT_CELL: "moveToLeftCell",
  MOVE_TO_RIGHT_CELL: "moveToRightCell",
  ADD_ROW_OR_COL: "addRowOrCol",
  REMOVE_ROW_OR_COL: "removeRowOrCol",
} as const;
const ITEM_NAME = "shortcutsObj" as const;
interface EventCodeObj {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  code: string;
}
type ActionName = typeof ACTION_NAME[keyof typeof ACTION_NAME];
type ConfigKey = { state: false } | { state: true; target: HTMLButtonElement; actionName: ActionName; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; code: string };
type SetConfigKey = {
  (state: false): void;
  (state: true, target: HTMLButtonElement, actionName: ActionName): void;
};
export { ACTION_NAME, ITEM_NAME };
export type { EventCodeObj, ActionName, ConfigKey, SetConfigKey };

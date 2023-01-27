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
type ACTION_NAME_KEYS = keyof typeof ACTION_NAME;
type ACTION_NAME_VALUES = typeof ACTION_NAME[ACTION_NAME_KEYS];
type ConfigingKeyType = { state: false } | { state: true; target: HTMLButtonElement; actionName: ACTION_NAME_VALUES; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; code: string };
type SetIsConfigKeyType = {
  (state: false): void;
  (state: true, target: HTMLButtonElement, actionName: ACTION_NAME_VALUES): void;
};
export { ACTION_NAME, ITEM_NAME };
export type { EventCodeObj, ACTION_NAME_KEYS, ACTION_NAME_VALUES, ConfigingKeyType, SetIsConfigKeyType };

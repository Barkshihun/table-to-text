import { ShortcutsObj } from "./types/shortcutTypes";

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
const defaultShortcutsObj: ShortcutsObj = {
  moveToNextCell: {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    code: "Tab",
    isAbled: true,
  },
  moveToPrevCell: {
    ctrlKey: false,
    shiftKey: true,
    altKey: false,
    code: "Tab",
    isAbled: true,
  },
  moveToUpCell: {
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    code: "ArrowUp",
    isAbled: true,
  },
  moveToDownCell: {
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    code: "ArrowDown",
    isAbled: true,
  },
  moveToLeftCell: {
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    code: "ArrowLeft",
    isAbled: true,
  },
  moveToRightCell: {
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    code: "ArrowRight",
    isAbled: true,
  },
  addRowOrCol: {
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    code: "Equal",
    isAbled: true,
  },
  removeRowOrCol: {
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    code: "Minus",
    isAbled: true,
  },
} as const;
export { ACTION_NAME, ITEM_NAME, defaultShortcutsObj };

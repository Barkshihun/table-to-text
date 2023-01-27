import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  [action: string]: {
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    code: string;
  };
}

const initialState: initialState = {
  cellMoveNext: {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    code: "Tab",
  },
  cellMovePrevious: {
    altKey: false,
    ctrlKey: false,
    shiftKey: true,
    code: "Tab",
  },
  cellMoveUp: {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    code: "ArrowUp",
  },
  cellMoveDown: {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    code: "ArrowDown",
  },
  cellMoveLeft: {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    code: "ArrowLeft",
  },
  cellMoveRight: {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    code: "ArrowRight",
  },
};

const shortcutSlice = createSlice({
  name: "shortcut",
  initialState,
  reducers: {},
});

export const {} = shortcutSlice.actions;
export default shortcutSlice;

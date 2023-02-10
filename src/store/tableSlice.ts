import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  originCols: number;
  originRows: number;
  originTableList: string[][];
  colsForTransform: number;
  rowsForTransform: number;
  tableListForTransform: string[][];
  focusCell: { col: number; row: number; anchorOffset: number; focusOffset: number; anchorParagraphIndex: number; focusParagraphIndex: number };
}

const initialState: initialState = {
  originCols: 3,
  originRows: 4,
  originTableList: [],
  colsForTransform: 3,
  rowsForTransform: 4,
  tableListForTransform: [],
  focusCell: { col: 0, row: 0, anchorOffset: 0, focusOffset: 0, anchorParagraphIndex: 0, focusParagraphIndex: 0 },
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setCols: (state, { payload }: { payload: number }) => {
      state.originCols = payload;
    },
    setRows: (state, { payload }: { payload: number }) => {
      state.originRows = payload;
    },
    setZero: (state) => {
      state.originCols = 0;
      state.originRows = 0;
      state.originTableList = [];
    },
    setOne: (state) => {
      state.originCols = 1;
      state.originRows = 1;
    },
    setTableListForTransform: (
      state,
      {
        payload: { colsForTransform, rowsForTransform, tableListForTransform, originTableList },
      }: { payload: { colsForTransform: number; rowsForTransform: number; tableListForTransform: string[][]; originTableList: string[][] } }
    ) => {
      state.colsForTransform = colsForTransform;
      state.rowsForTransform = rowsForTransform;
      state.tableListForTransform = tableListForTransform;
      state.originTableList = originTableList;
    },
    resetTableList: (state) => {
      state.originTableList = [];
    },
    setTableList: (state, { payload: { cols, rows, tableList } }: { payload: { cols: number; rows: number; tableList: string[][] } }) => {
      state.originCols = cols;
      state.originRows = rows;
      state.originTableList = tableList;
    },
    setFocusCell: (
      state,
      {
        payload: { col, row, anchorOffset, focusOffset, anchorParagraphIndex = 0, focusParagraphIndex = 0 },
      }: { payload: { col: number; row: number; anchorOffset: number; focusOffset: number; anchorParagraphIndex?: number; focusParagraphIndex?: number } }
    ) => {
      state.focusCell = { col, row, anchorOffset, focusOffset, anchorParagraphIndex, focusParagraphIndex };
    },
  },
});

export const { setCols, setRows, setZero, setOne, setTableListForTransform, resetTableList, setTableList, setFocusCell } = tableSlice.actions;
export default tableSlice;

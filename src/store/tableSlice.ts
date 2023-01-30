import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  originCols: number;
  originRows: number;
  originTableList: string[][];
  colsForTransform: number;
  rowsForTransform: number;
  tableListForTransform: string[][];
}

const initialState: initialState = {
  originCols: 3,
  originRows: 4,
  originTableList: [],
  colsForTransform: 3,
  rowsForTransform: 4,
  tableListForTransform: [],
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
  },
});

export const { setCols, setRows, setZero, setOne, setTableListForTransform, resetTableList, setTableList } = tableSlice.actions;
export default tableSlice;

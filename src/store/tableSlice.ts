import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  showTableSizeModal: boolean;
  originCols: number;
  originRows: number;
  originTableList: string[][];
  colsForTransform: number;
  rowsForTransform: number;
  tableListForTransform: string[][];
}

const initialState: initialState = {
  showTableSizeModal: false,
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
    setCols: (state, action) => {
      state.originCols = action.payload;
    },
    setRows: (state, action) => {
      state.originRows = action.payload;
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
    setShowTableSizeModal: (state, action) => {
      state.showTableSizeModal = action.payload;
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
    importCsv: (state, { payload: { cols, rows, rawDataTableList } }: { payload: { cols: number; rows: number; rawDataTableList: string[][] } }) => {
      state.originCols = cols;
      state.originRows = rows;
      state.originTableList = rawDataTableList;
    },
  },
});

export const { setCols, setRows, setZero, setOne, setShowTableSizeModal, setTableListForTransform, resetTableList, importCsv } = tableSlice.actions;
export default tableSlice;

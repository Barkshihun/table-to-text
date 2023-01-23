import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  cols: number;
  rows: number;
  showTableSizeModal: boolean;
  tableList: string[][];
}

const initialState: initialState = {
  cols: 3,
  rows: 4,
  showTableSizeModal: false,
  tableList: [],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setCols: (state, action) => {
      state.cols = action.payload;
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    setZero: (state) => {
      state.cols = 0;
      state.rows = 0;
      state.tableList = [];
    },
    setOne: (state) => {
      state.cols = 1;
      state.rows = 1;
    },
    setShowTableSizeModal: (state, action) => {
      state.showTableSizeModal = action.payload;
    },
    setTableList: (state, action) => {
      state.tableList = action.payload;
    },
    resetTableList: (state) => {
      state.tableList = [];
    },
    importCsv: (state, { payload: { rows, cols, rawDataTableList } }: { payload: { rows: number; cols: number; rawDataTableList: string[][] } }) => {
      state.rows = rows;
      state.cols = cols;
      state.tableList = rawDataTableList;
    },
  },
});

export const { setCols, setRows, setZero, setOne, setShowTableSizeModal, setTableList, resetTableList, importCsv } = tableSlice.actions;
export default tableSlice;

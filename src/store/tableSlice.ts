import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cols: 3,
  rows: 4,
  showTableSizeModal: false,
  tableList: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
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
    editTableList: (state, { payload: { row, col, value } }) => {
      state.tableList[row][col] = value;
    },
  },
});

export const { setCols, setRows, setZero, setOne, setShowTableSizeModal, setTableList, editTableList } = tableSlice.actions;
export default tableSlice;

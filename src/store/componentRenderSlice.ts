import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isHome: true,
  showTableSizeModal: false,
};

const componentRenderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setIsHome: (state, action) => {
      state.isHome = action.payload;
    },
    setShowTableSizeModal: (state, action) => {
      state.showTableSizeModal = action.payload;
    },
  },
});

export const { setIsHome, setShowTableSizeModal } = componentRenderSlice.actions;
export default componentRenderSlice;

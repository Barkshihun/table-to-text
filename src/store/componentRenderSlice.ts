import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isHome: true,
  showTableSizeModal: false,
};

const componentRenderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setIsHome: (state, { payload }: { payload: boolean }) => {
      state.isHome = payload;
    },
    setShowTableSizeModal: (state, { payload }: { payload: boolean }) => {
      state.showTableSizeModal = payload;
    },
  },
});

export const { setIsHome, setShowTableSizeModal } = componentRenderSlice.actions;
export default componentRenderSlice;

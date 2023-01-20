import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isHome: true,
};

const renderedPageSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setIsHome: (state, action) => {
      state.isHome = action.payload;
    },
  },
});

export const { setIsHome } = renderedPageSlice.actions;
export default renderedPageSlice;

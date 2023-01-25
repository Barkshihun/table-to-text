import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isHome: true,
};

const componentRenderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setIsHome: (state, action) => {
      state.isHome = action.payload;
    },
  },
});

export const { setIsHome } = componentRenderSlice.actions;
export default componentRenderSlice;

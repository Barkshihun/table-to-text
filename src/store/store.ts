import { configureStore } from "@reduxjs/toolkit";
import componentRenderSlice from "./componentRenderSlice";
import tableSlice from "./tableSlice";

const store = configureStore({
  reducer: { table: tableSlice.reducer, componentRender: componentRenderSlice.reducer },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

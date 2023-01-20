import { configureStore } from "@reduxjs/toolkit";
import renderedPageSlice from "./renderedPageSlice";
import tableSlice from "./tableSlice";

const store = configureStore({
  reducer: { table: tableSlice.reducer, renderedPage: renderedPageSlice.reducer },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

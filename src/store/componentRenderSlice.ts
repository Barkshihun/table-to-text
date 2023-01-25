import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  downloadModalExtension: "",
};
const componentRenderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setIsHome: (state, { payload }: { payload: boolean }) => {
      state.isHome = payload;
    },
    setShowTableSizeModal: (state, { payload }: { payload: boolean }) => {
      state.isShowTableSizeModal = payload;
    },
    showDownloadModal: (state, { payload }: { payload: string }) => {
      state.isShowDownloadModal = true;
      state.downloadModalExtension = payload;
    },
    hideDownloadModal: (state) => {
      state.isShowDownloadModal = false;
    },
  },
});

export const { setIsHome, setShowTableSizeModal, showDownloadModal, hideDownloadModal } = componentRenderSlice.actions;
export default componentRenderSlice;

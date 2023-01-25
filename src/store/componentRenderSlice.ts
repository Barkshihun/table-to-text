import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isHome: boolean;
  isShowTableSizeModal: boolean;
  isShowDownloadModal: boolean;
  downloadModalExtension: "csv" | "png" | null;
  downloadModalText: string;
}

const initialState: initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  downloadModalExtension: null,
  downloadModalText: "",
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
    showDownloadModal: (state, { payload }: { payload: "csv" | "png" }) => {
      state.isShowDownloadModal = true;
      state.downloadModalExtension = payload;
    },
    hideDownloadModal: (state) => {
      state.isShowDownloadModal = false;
    },
    setDownloadModalText: (state, { payload }: { payload: string }) => {
      state.downloadModalText = payload;
    },
  },
});

export const { setIsHome, setShowTableSizeModal, showDownloadModal, hideDownloadModal, setDownloadModalText } = componentRenderSlice.actions;
export default componentRenderSlice;

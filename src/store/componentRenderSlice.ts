import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isHome: boolean;
  isShowTableSizeModal: boolean;
  isShowDownloadModal: boolean;
  isShowConfigShortcutModal: boolean;
  downloadModalExtension: "csv" | "png" | undefined;
  downloadModalText: string;
}

const initialState: initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  isShowConfigShortcutModal: false,
  downloadModalExtension: undefined,
  downloadModalText: "",
};

const componentRenderSlice = createSlice({
  name: "componentRender",
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
    showConfigShortcutModal: (state) => {
      state.isShowConfigShortcutModal = true;
    },
    hideConfigShortcutModal: (state) => {
      state.isShowConfigShortcutModal = false;
    },
  },
});

export const { setIsHome, setShowTableSizeModal, showDownloadModal, hideDownloadModal, setDownloadModalText, showConfigShortcutModal, hideConfigShortcutModal } = componentRenderSlice.actions;
export default componentRenderSlice;

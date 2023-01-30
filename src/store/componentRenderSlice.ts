import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isHome: boolean;
  isShowTableSizeModal: boolean;
  isShowDownloadModal: boolean;
  isShowConfigShortcutModal: boolean;
  isShowAddRowOrColModal: boolean;
  downloadModalExtension: "csv" | "png" | undefined;
  downloadModalText: string;
}

const initialState: initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  isShowConfigShortcutModal: false,
  isShowAddRowOrColModal: false,
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
    setDisplayTableSizeModal: (state, { payload }: { payload: boolean }) => {
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
    setDisplayConfigShortcutModal: (state, { payload }: { payload: boolean }) => {
      state.isShowConfigShortcutModal = payload;
    },
    setDisplayAddRowOrColModal: (state, { payload }: { payload: boolean }) => {
      state.isShowAddRowOrColModal = payload;
    },
  },
});

export const { setIsHome, setDisplayTableSizeModal, showDownloadModal, hideDownloadModal, setDownloadModalText, setDisplayConfigShortcutModal, setDisplayAddRowOrColModal } =
  componentRenderSlice.actions;
export default componentRenderSlice;

import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isHome: boolean;
  isShowTableSizeModal: boolean;
  isShowDownloadModal: boolean;
  isShowConfigShortcutModal: boolean;
  isShowAddRowOrColModal: boolean;
  downloadModalExtension: "csv" | "png" | undefined;
  downloadModalText: string;
  defaultCheckIndex: number;
}

const initialState: initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  isShowConfigShortcutModal: false,
  isShowAddRowOrColModal: false,
  downloadModalExtension: undefined,
  downloadModalText: "",
  defaultCheckIndex: 0,
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
    showAddRowOrColModal: (state) => {
      state.isShowAddRowOrColModal = true;
    },
    hideAddRowOrColModal: (state, { payload }: { payload: number }) => {
      state.isShowAddRowOrColModal = false;
      state.defaultCheckIndex = payload;
    },
  },
});

export const { setIsHome, setDisplayTableSizeModal, showDownloadModal, hideDownloadModal, setDownloadModalText, setDisplayConfigShortcutModal, showAddRowOrColModal, hideAddRowOrColModal } =
  componentRenderSlice.actions;
export default componentRenderSlice;

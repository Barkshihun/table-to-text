import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isHome: boolean;
  isShowTableSizeModal: boolean;
  isShowDownloadModal: boolean;
  isShowConfigShortcutModal: boolean;
  isShowAddRowOrColModal: boolean;
  downloadModalExtension: "csv" | "png" | undefined;
  downloadModalText: string;
  defaultAddCheckIndex: number;
  defaultRemoveCheckIndex: number;
  editRowOrColMode: "add" | "remove" | undefined;
}

const initialState: initialState = {
  isHome: true,
  isShowTableSizeModal: false,
  isShowDownloadModal: false,
  isShowConfigShortcutModal: false,
  isShowAddRowOrColModal: false,
  downloadModalExtension: undefined,
  downloadModalText: "",
  defaultAddCheckIndex: 0,
  defaultRemoveCheckIndex: 0,
  editRowOrColMode: undefined,
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
    showEditRowOrColModal: (state, { payload }: { payload: "add" | "remove" }) => {
      state.editRowOrColMode = payload;
      state.isShowAddRowOrColModal = true;
    },
    hideEditRowOrColModal: (state, { payload }: { payload: { checkIndex: number; mode: "add" | "remove" } }) => {
      state.isShowAddRowOrColModal = false;
      switch (payload.mode) {
        case "add":
          state.defaultAddCheckIndex = payload.checkIndex;
          break;
        case "remove":
          state.defaultRemoveCheckIndex = payload.checkIndex;
          break;
      }
    },
  },
});

export const { setIsHome, setDisplayTableSizeModal, showDownloadModal, hideDownloadModal, setDownloadModalText, setDisplayConfigShortcutModal, showEditRowOrColModal, hideEditRowOrColModal } =
  componentRenderSlice.actions;
export default componentRenderSlice;

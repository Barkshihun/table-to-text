import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { hideDownloadModal, setDownloadModalText } from "../store/componentRenderSlice";

function DownloadModal({ onDownloadToCsv, onDownloadToPng }: { onDownloadToCsv: (fileName: string) => void; onDownloadToPng: (fileName: string) => Promise<void> }) {
  const dispatch = useDispatch();
  const extension = useSelector((state: RootState) => state.componentRender.downloadModalExtension);
  const downloadModalText = useSelector((state: RootState) => state.componentRender.downloadModalText);
  const inputRef = useRef<HTMLInputElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(hideDownloadModal());
    const fileName = downloadModalText ? downloadModalText : "표";
    switch (extension) {
      case "csv":
        onDownloadToCsv(fileName);
        break;
      case "png":
        onDownloadToPng(fileName);
        break;
      default:
        break;
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDownloadModalText(`${event.target.value}`));
  };
  const onEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch(hideDownloadModal());
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    window.addEventListener("keydown", onEsc);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.classList.remove("no-scroll");
    };
  }, []);
  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(hideDownloadModal());
        }
      }}
    >
      <div className="modal__content">
        <div className="modal__download-wrapper">
          <h1 className="modal__download-question">다운로드 하시겠습니까?</h1>
          <h2 className="malgun-gothic modal__file-name-indicator">
            파일명: {downloadModalText ? downloadModalText : "표"}.{extension}
          </h2>
          <form className="modal__download-form-wrapper" onSubmit={onSave}>
            <input
              className="modal__input malgun-gothic modal__input--download"
              ref={inputRef}
              placeholder="파일명을 입력해주세요"
              value={downloadModalText}
              onChange={onChange}
              onKeyDown={(event) => {
                if (event.key === "Tab" && event.shiftKey === true) {
                  event.preventDefault();
                  yesBtnRef.current?.focus();
                }
              }}
            />
            <div className="modal__no-yes-btn-container">
              <button
                className="btn btn--modal btn--download-modal btn--no"
                ref={noBtnRef}
                type="button"
                onClick={() => {
                  dispatch(hideDownloadModal());
                }}
              >
                아니요
              </button>
              <button
                className="btn btn--modal btn--download-modal btn--yes"
                ref={yesBtnRef}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    if (event.shiftKey === true) {
                      noBtnRef.current?.focus();
                      return;
                    }
                    inputRef.current?.focus();
                  }
                }}
              >
                네
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default DownloadModal;

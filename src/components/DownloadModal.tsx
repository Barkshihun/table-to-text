import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { hideDownloadModal, setDownloadModalText } from "../store/componentRenderSlice";

function DownloadModal({ onDownloadToCsv, onDownloadToPng }: { onDownloadToCsv: (name: string) => void; onDownloadToPng: (name: string) => Promise<void> }) {
  const dispatch = useDispatch();
  const extension = useSelector((state: RootState) => state.componentRender.downloadModalExtension);
  const downloadModalText = useSelector((state: RootState) => state.componentRender.downloadModalText);
  const inputRef = useRef<HTMLInputElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(hideDownloadModal());
    const name = downloadModalText ? downloadModalText : "표";
    switch (extension) {
      case "csv":
        onDownloadToCsv(name);
        break;
      case "png":
        onDownloadToPng(name);
        break;
      default:
        break;
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDownloadModalText(event.target.value));
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
        <h1>다운로드 하시겠습니까?</h1>
        <span>
          {downloadModalText ? downloadModalText : "표"}.{extension}
        </span>
        <form className="modal__table-size-wrapper" onSubmit={onSave}>
          <input
            className="modal__input"
            ref={inputRef}
            value={downloadModalText}
            onChange={onChange}
            onKeyDown={(event) => {
              if (event.key === "Tab" && event.shiftKey === true) {
                event.preventDefault();
                yesBtnRef.current?.focus();
              }
            }}
          />
          <div className="modal__btn-container">
            <button
              className="btn btn--table-size-config"
              ref={noBtnRef}
              type="button"
              onClick={() => {
                dispatch(hideDownloadModal());
              }}
            >
              아니요
            </button>
            <button
              className="btn btn--table-size-config"
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
  );
}
export default DownloadModal;

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { hideDownloadModal } from "../store/componentRenderSlice";

function DownloadModal() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(text);
    // dispatch(hideDownloadModal());
  };
  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
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
      onClick={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(hideDownloadModal());
        }
      }}
    >
      <div className="modal__content">
        <form className="modal__table-size-wrapper" onSubmit={onSave}>
          <input
            className="modal__input"
            type="number"
            min={1}
            step={1}
            ref={inputRef}
            // value={text}
            onChange={onInput}
            onKeyDown={(event) => {
              if (event.key === "Tab" && event.shiftKey === true) {
                event.preventDefault();
                yesBtnRef.current?.focus();
              }
            }}
          />
          <button className="btn btn--table-size-config" ref={noBtnRef}>
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
        </form>
      </div>
    </div>
  );
}
export default DownloadModal;

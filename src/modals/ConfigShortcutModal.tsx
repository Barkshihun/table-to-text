import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { SingleConfigShortcutDivElems, ActionName, ConfigKey, SetConfigKey, SingleShortcutObj, ShortcutsObj, PrevKey } from "../types/shortcutTypes";
import { ITEM_NAME, defaultShortcutsObj } from "../shortcutConsts";
import { setDisplayConfigShortcutModal } from "../store/componentRenderSlice";
import SingleConfigShortcutDiv from "../components/SingleConfigShortcutDiv";

function ConfigShortcutModal() {
  const dispatch = useDispatch();
  const [reset, setReset] = useState(false);
  const singleConfigShortcutDivElemsRef = useRef<SingleConfigShortcutDivElems | {}>({});
  const selectAllBtnRef = useRef<HTMLInputElement>(null);
  const configKeyRef = useRef<ConfigKey>({ state: false });
  const prevKeyRef = useRef<PrevKey>({});
  const shortcutsObjRef = useRef<ShortcutsObj>();
  let isSelectAll = true;

  const setConfigKey: SetConfigKey = (state: any, target?: any, actionName?: any) => {
    configKeyRef.current = { state, target, actionName };
  };
  const shortcutStringfy = (ctrlKey: boolean, shiftKey: boolean, altKey: boolean, code: string) => {
    const keyList = [];
    if (ctrlKey) {
      keyList.push("ControlLeft");
    }
    if (shiftKey) {
      keyList.push("ShiftLeft");
    }
    if (altKey) {
      keyList.push("AltLeft");
    }
    if (!(code === "ControlLeft" || code === "ShiftLeft" || code === "AltLeft")) {
      keyList.push(code);
    }
    const shortcutString = keyList.join(" + ");
    return shortcutString;
  };
  const getKoreanActionName = (actionName: ActionName) => {
    switch (actionName) {
      case "moveToNextCell":
        return "다음 셀로 이동";
      case "moveToPrevCell":
        return "이전 셀로 이동";
      case "moveToUpCell":
        return "위쪽 셀로 이동";
      case "moveToDownCell":
        return "아래쪽 셀로 이동";
      case "moveToLeftCell":
        return "왼쪽 셀로 이동";
      case "moveToRightCell":
        return "오른쪽 셀로 이동";
      case "addRowOrCol":
        return "삽입";
      case "removeRowOrCol":
        return "삭제";
    }
  };
  const setPrevKeys = (ctrlKey: boolean | undefined, shiftKey: boolean | undefined, altKey: boolean | undefined, code: string | undefined) => {
    prevKeyRef.current.prevCtrlKey = ctrlKey;
    prevKeyRef.current.prevShiftKey = shiftKey;
    prevKeyRef.current.prevAltKey = altKey;
    prevKeyRef.current.prevCode = code;
  };
  const getOverlapActionName = (newActionName: ActionName, newCtrlKey: boolean, newShiftKey: boolean, newAltKey: boolean, newCode: string) => {
    let actionName: ActionName;
    const shortcutsObj = shortcutsObjRef.current as ShortcutsObj;
    for (actionName in shortcutsObj) {
      const { ctrlKey: shortcutObjCtrlKey, shiftKey: shortcutObjShiftKey, altKey: shortcutObjAltKey, code: shortcutObjCode } = shortcutsObj[actionName];
      if (newActionName !== actionName && newCtrlKey === shortcutObjCtrlKey && newShiftKey === shortcutObjShiftKey && newAltKey === shortcutObjAltKey && newCode === shortcutObjCode) {
        return actionName;
      }
    }
  };

  const keydownAtWindowHandler = (event: KeyboardEvent) => {
    if (configKeyRef.current.state) {
      if (event.code === "AltRight") {
        return;
      }
      event.preventDefault();
      const { ctrlKey, shiftKey, altKey, code } = event;
      const { prevCtrlKey, prevShiftKey, prevAltKey, prevCode } = prevKeyRef.current;
      if (ctrlKey === prevCtrlKey && shiftKey === prevShiftKey && altKey === prevAltKey && code === prevCode) {
        return;
      }
      setPrevKeys(ctrlKey, shiftKey, altKey, code);
      const target = configKeyRef.current.target as HTMLButtonElement;
      target.innerText = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch(setDisplayConfigShortcutModal(false));
    }
  };
  const keyUpAtWindowHandler = (event: KeyboardEvent) => {
    if (!configKeyRef.current.state || event.ctrlKey || event.shiftKey || event.altKey || event.code === "AltRight") {
      return;
    }
    const ctrlKey = prevKeyRef.current.prevCtrlKey as boolean;
    const shiftKey = prevKeyRef.current.prevShiftKey as boolean;
    const altKey = prevKeyRef.current.prevAltKey as boolean;
    const code = prevKeyRef.current.prevCode as string;
    const { actionName, target } = configKeyRef.current;
    const overlapActionName = getOverlapActionName(actionName, ctrlKey, shiftKey, altKey, code);
    const shortcutsObj = shortcutsObjRef.current as ShortcutsObj;
    if (overlapActionName) {
      setPrevKeys(undefined, undefined, undefined, undefined);
      setConfigKey(false);
      const { ctrlKey: orignCtrlKey, shiftKey: orignShiftKey, altKey: orignAltKey, code: orignCode } = shortcutsObj[actionName];
      target.innerText = shortcutStringfy(orignCtrlKey, orignShiftKey, orignAltKey, orignCode);
      Swal.fire({
        icon: "error",
        title: `'${shortcutStringfy(ctrlKey, shiftKey, altKey, code)}'은\n'${getKoreanActionName(overlapActionName)}'에\n이미 할당된 단축키입니다`,
        position: "top",
        customClass: "swal-min-width",
      });
      return;
    }
    const singleConfigShortcutDivElems = singleConfigShortcutDivElemsRef.current as SingleConfigShortcutDivElems;
    const isAbled = singleConfigShortcutDivElems[actionName].checkBoxElem?.checked as boolean;
    const singleShortcutObj: SingleShortcutObj = {
      ctrlKey,
      shiftKey,
      altKey,
      code,
      isAbled,
    };
    shortcutsObj[actionName] = singleShortcutObj;
    target.blur();
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
    setPrevKeys(undefined, undefined, undefined, undefined);
    setConfigKey(false);
  };
  const onCheckEvent = (actionName: ActionName, checked: boolean) => {
    const shortcutsObj = shortcutsObjRef.current as ShortcutsObj;
    shortcutsObj[actionName].isAbled = checked;
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
    const selectAllBtn = selectAllBtnRef.current as HTMLInputElement;
    for (const key in shortcutsObj) {
      const actionName = key as ActionName;
      const { isAbled } = shortcutsObj[actionName];
      if (!isAbled) {
        selectAllBtn.checked = false;
        return;
      }
    }
    selectAllBtn.checked = true;
  };
  const onSelectAll = () => {
    const singleConfigShortcutDivElems = singleConfigShortcutDivElemsRef.current as SingleConfigShortcutDivElems;
    const shortcutsObj = shortcutsObjRef.current as ShortcutsObj;
    const selectAllBtn = selectAllBtnRef.current as HTMLInputElement;
    for (const key in singleConfigShortcutDivElems) {
      const actionName = key as ActionName;
      const checkboxElem = singleConfigShortcutDivElems[actionName].checkBoxElem as HTMLInputElement;
      checkboxElem.checked = selectAllBtn.checked;
      shortcutsObj[actionName].isAbled = selectAllBtn.checked;
    }
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
  };
  const onReset = () => {
    localStorage.removeItem(ITEM_NAME);
    const selectAllBtn = selectAllBtnRef.current as HTMLInputElement;
    selectAllBtn.checked = true;
    setReset((reset) => !reset);
  };
  const renderSingleConfigShortcutDivs = (reset: boolean) => {
    const itemString = localStorage.getItem(ITEM_NAME);
    if (itemString) {
      const itemObj: ShortcutsObj = JSON.parse(itemString);
      shortcutsObjRef.current = itemObj;
    } else {
      shortcutsObjRef.current = JSON.parse(JSON.stringify(defaultShortcutsObj));
    }
    const divsArr = [];
    const shortcutsObj = shortcutsObjRef.current as ShortcutsObj;
    for (const key in shortcutsObj) {
      const actionName = key as ActionName;
      const { ctrlKey, shiftKey, altKey, code, isAbled } = shortcutsObj[actionName];
      const shortcutString = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      const koreanActionName = getKoreanActionName(actionName);
      if (isSelectAll) {
        isSelectAll = isAbled;
      }
      divsArr.push(
        <SingleConfigShortcutDiv
          key={`${reset}${actionName}`}
          singleConfigShortcutDivElemsRef={singleConfigShortcutDivElemsRef}
          koreanActionName={koreanActionName}
          setConfigKey={setConfigKey}
          actionName={actionName}
          shortcutString={shortcutString}
          isAbled={isAbled}
          onCheckEvent={onCheckEvent}
        />
      );
    }
    return divsArr;
  };
  useEffect(() => {
    window.addEventListener("keydown", keydownAtWindowHandler);
    window.addEventListener("keyup", keyUpAtWindowHandler);
    document.body.classList.add("no-scroll");
    const selectAllBtn = selectAllBtnRef.current as HTMLInputElement;
    selectAllBtn.checked = isSelectAll;
    return () => {
      window.removeEventListener("keydown", keydownAtWindowHandler);
      window.removeEventListener("keyup", keyUpAtWindowHandler);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(setDisplayConfigShortcutModal(false));
        }
      }}
    >
      <div className="modal__content modal__content--config">
        <h1 className="modal__title">단축키 설정</h1>
        <div className="modal__shortcut-container">
          <label className="modal__checkbox-container modal__checkbox-container--shortcut">
            <input className="modal__checkbox" type="checkbox" onChange={onSelectAll} ref={selectAllBtnRef} />
            <span className="modal__checkbox-text">전체 선택</span>
          </label>
          <button className="btn btn--no btn--reset" onClick={onReset}>
            초기화
          </button>
        </div>
        {reset ? renderSingleConfigShortcutDivs(reset) : renderSingleConfigShortcutDivs(reset)}
        <div className="modal__config-shortcut-btn-container">
          <button
            className="btn btn--modal btn--yes"
            onClick={() => {
              dispatch(setDisplayConfigShortcutModal(false));
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfigShortcutModal;

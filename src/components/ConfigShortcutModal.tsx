import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ITEM_NAME, LocalStorageObj, defaultShortcutsObj, ActionName, ConfigKey, SetConfigKey, ConfigBtnsRefCurrent, ConfigCheckBoxesRefCurrent } from "../shortcutTypeAndConst";
import { hideConfigShortcutModal } from "../store/componentRenderSlice";
import ConfigShortcutModalBtn from "./ConfigShortcutModalBtn";

function ConfigShortcutModal() {
  const dispatch = useDispatch();
  const configBtnsRef: React.MutableRefObject<ConfigBtnsRefCurrent | {}> = useRef({});
  const configCheckBoxesRef: React.MutableRefObject<ConfigCheckBoxesRefCurrent | {}> = useRef({});

  let shortcutsObj: {
    [actionName in ActionName]: LocalStorageObj;
  };
  let configKey: ConfigKey = { state: false };
  let prevCtrlKey: boolean | undefined;
  let prevShiftKey: boolean | undefined;
  let prevAltKey: boolean | undefined;
  let prevCode: string | undefined;

  const setConfigKey: SetConfigKey = (state: any, target?: any, actionName?: any) => {
    configKey = { state, target, actionName };
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
        return "행 또는 열 추가";
      case "removeRowOrCol":
        return "행 또는 열 제거";
    }
  };
  const setPrevKeys = (ctrlKey: boolean | undefined, shiftKey: boolean | undefined, altKey: boolean | undefined, code: string | undefined) => {
    prevCtrlKey = ctrlKey;
    prevShiftKey = shiftKey;
    prevAltKey = altKey;
    prevCode = code;
  };
  const checkOverlap = (newActionName: ActionName, newCtrlKey: boolean, newShiftKey: boolean, newAltKey: boolean, newCode: string) => {
    let actionName: ActionName;
    for (actionName in shortcutsObj) {
      const { ctrlKey: shortcutObjCtrlKey, shiftKey: shortcutObjShiftKey, altKey: shortcutObjAltKey, code: shortcutObjCode } = shortcutsObj[actionName];
      if (newActionName !== actionName && newCtrlKey === shortcutObjCtrlKey && newShiftKey === shortcutObjShiftKey && newAltKey === shortcutObjAltKey && newCode === shortcutObjCode) {
        return true;
      }
    }
    return false;
  };

  const keydownAtWindowHandler = (event: KeyboardEvent) => {
    if (configKey.state) {
      event.preventDefault();
      const { ctrlKey, shiftKey, altKey, code } = event;
      if (ctrlKey === prevCtrlKey && shiftKey === prevShiftKey && altKey === prevAltKey && code === prevCode) {
        return;
      }
      setPrevKeys(ctrlKey, shiftKey, altKey, code);
      const target = configKey.target as HTMLButtonElement;
      target.innerText = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      configKey.ctrlKey = ctrlKey;
      configKey.shiftKey = shiftKey;
      configKey.altKey = altKey;
      configKey.code = code;
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch(hideConfigShortcutModal());
    }
  };
  const keyUpAtWindowHandler = (event: KeyboardEvent) => {
    if (!configKey.state || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const { actionName, target, ctrlKey, shiftKey, altKey, code } = configKey;
    if (checkOverlap(actionName, ctrlKey, shiftKey, altKey, code)) {
      setPrevKeys(undefined, undefined, undefined, undefined);
      setConfigKey(false);
      const { ctrlKey: orignCtrlKey, shiftKey: orignShiftKey, altKey: orignAltKey, code: orignCode } = shortcutsObj[actionName];
      target.innerText = shortcutStringfy(orignCtrlKey, orignShiftKey, orignAltKey, orignCode);
      alert("키가 겹쳐요");
      return;
    }
    const configCheckBoxesRefCurrent = configCheckBoxesRef.current as ConfigCheckBoxesRefCurrent;
    const isAbled = configCheckBoxesRefCurrent[actionName].checked;
    const localStorageObj: LocalStorageObj = {
      ctrlKey,
      shiftKey,
      altKey,
      code,
      isAbled,
    };
    shortcutsObj[actionName] = localStorageObj;
    target.blur();
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
    setPrevKeys(undefined, undefined, undefined, undefined);
    setConfigKey(false);
  };
  const onCheckboxEvent = (actionName: ActionName, checked: boolean) => {
    shortcutsObj[actionName].isAbled = checked;
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
  };

  const renderBtns = () => {
    const itemString = localStorage.getItem(ITEM_NAME);
    if (itemString) {
      const itemObj: {
        [actionName in ActionName]: LocalStorageObj;
      } = JSON.parse(itemString);
      shortcutsObj = itemObj;
    } else {
      shortcutsObj = { ...defaultShortcutsObj };
    }
    const btnsArr = [];
    for (const key in shortcutsObj) {
      const actionName = key as ActionName;
      const { ctrlKey, shiftKey, altKey, code, isAbled } = shortcutsObj[actionName];
      const shortcutString = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      const koreanActionName = getKoreanActionName(actionName);
      btnsArr.push(
        <ConfigShortcutModalBtn
          key={actionName}
          configBtnsRef={configBtnsRef}
          configCheckBoxesValueRef={configCheckBoxesRef}
          koreanActionName={koreanActionName}
          setConfigKey={setConfigKey}
          actionName={actionName}
          shortcutString={shortcutString}
          isAbled={isAbled}
          onCheckboxEvent={onCheckboxEvent}
        />
      );
    }
    return btnsArr;
  };

  useEffect(() => {
    window.addEventListener("keydown", keydownAtWindowHandler);
    window.addEventListener("keyup", keyUpAtWindowHandler);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", keydownAtWindowHandler);
      window.removeEventListener("keyup", keyUpAtWindowHandler);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  console.count("모달렌더");
  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
          dispatch(hideConfigShortcutModal());
        }
      }}
    >
      <div className="modal__content modal__content--config-shortcut">
        <h1>단축키 설정</h1>
        <div>
          <input type="checkbox" defaultChecked />
          <span>전체 선택</span>
          <button
            onClick={() => {
              localStorage.removeItem(ITEM_NAME);
              const configBtnsRefCurrent = configBtnsRef.current as ConfigBtnsRefCurrent;
              const configCheckBoxesRefCurrent = configCheckBoxesRef.current as ConfigCheckBoxesRefCurrent;
              for (const key in configBtnsRef.current) {
                const actionName = key as ActionName;
                const { ctrlKey, shiftKey, altKey, code } = defaultShortcutsObj[actionName];
                const defaultShortcutString = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
                const btn = configBtnsRefCurrent[actionName];
                const checkbox = configCheckBoxesRefCurrent[actionName];
                btn.innerText = defaultShortcutString;
                checkbox.checked = true;
              }
            }}
          >
            초기화
          </button>
        </div>
        {renderBtns()}
        <div className="config-shortcut-btn-container">
          <button
            className="btn btn--modal btn--yes"
            onClick={() => {
              dispatch(hideConfigShortcutModal());
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

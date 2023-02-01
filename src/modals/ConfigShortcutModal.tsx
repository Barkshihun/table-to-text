import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { SingleConfigShortcutDivElems, ActionName, ConfigKey, SetConfigKey, SingleShortcutObj, ShortcutsObj } from "../types/shortcutTypes";
import { ITEM_NAME, defaultShortcutsObj } from "../shortcutConsts";
import { setDisplayConfigShortcutModal } from "../store/componentRenderSlice";
import SingleConfigShortcutDiv from "../components/SingleConfigShortcutDiv";

function ConfigShortcutModal() {
  const dispatch = useDispatch();
  const singleConfigShortcutDivElemsRef = useRef<SingleConfigShortcutDivElems | {}>({});

  let shortcutsObj: {
    [actionName in ActionName]: SingleShortcutObj;
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
        return "삽입";
      case "removeRowOrCol":
        return "삭제";
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
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch(setDisplayConfigShortcutModal(false));
    }
  };
  const keyUpAtWindowHandler = (event: KeyboardEvent) => {
    if (!configKey.state || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const ctrlKey = prevCtrlKey as boolean;
    const shiftKey = prevShiftKey as boolean;
    const altKey = prevAltKey as boolean;
    const code = prevCode as string;
    const { actionName, target } = configKey;
    const isOverlap = checkOverlap(actionName, ctrlKey, shiftKey, altKey, code);
    if (code === "AltRight" || isOverlap) {
      setPrevKeys(undefined, undefined, undefined, undefined);
      setConfigKey(false);
      const { ctrlKey: orignCtrlKey, shiftKey: orignShiftKey, altKey: orignAltKey, code: orignCode } = shortcutsObj[actionName];
      target.innerText = shortcutStringfy(orignCtrlKey, orignShiftKey, orignAltKey, orignCode);
      if (code === "AltRight") {
        Swal.fire({
          icon: "error",
          title: "오른쪽 alt키는 단축키로 사용하실 수 없습니다",
          position: "top",
        });
        return;
      }
      if (isOverlap) {
        alert("키가 겹쳐요");
        return;
      }
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
  const onCheckboxEvent = (actionName: ActionName, checked: boolean) => {
    shortcutsObj[actionName].isAbled = checked;
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
  };
  const onSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const singleConfigShortcutDivElems = singleConfigShortcutDivElemsRef.current as SingleConfigShortcutDivElems;
    for (const key in singleConfigShortcutDivElems) {
      const actionName = key as ActionName;
      const checkboxElem = singleConfigShortcutDivElems[actionName].checkBoxElem as HTMLInputElement;
      checkboxElem.checked = event.target.checked ? true : false;
      shortcutsObj[actionName].isAbled = event.target.checked ? true : false;
    }
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
  };
  const onReset = () => {
    shortcutsObj = { ...defaultShortcutsObj };
    localStorage.removeItem(ITEM_NAME);
    const singleConfigShortcutDivElems = singleConfigShortcutDivElemsRef.current as SingleConfigShortcutDivElems;
    for (const key in singleConfigShortcutDivElems) {
      const actionName = key as ActionName;
      const { ctrlKey, shiftKey, altKey, code } = defaultShortcutsObj[actionName];
      const defaultShortcutString = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      const btnElem = singleConfigShortcutDivElems[actionName].btnElem as HTMLButtonElement;
      const checkboxElem = singleConfigShortcutDivElems[actionName] as HTMLInputElement;
      btnElem.innerText = defaultShortcutString;
      checkboxElem.checked = true;
    }
  };

  const renderConfigShortcutCheckBoxes = () => {
    const itemString = localStorage.getItem(ITEM_NAME);
    if (itemString) {
      const itemObj: ShortcutsObj = JSON.parse(itemString);
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
        <SingleConfigShortcutDiv
          key={actionName}
          singleConfigShortcutDivElemsRef={singleConfigShortcutDivElemsRef}
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
          dispatch(setDisplayConfigShortcutModal(false));
        }
      }}
    >
      <div className="modal__content modal__content--config-shortcut">
        <h1>단축키 설정</h1>
        <div>
          <input type="checkbox" onChange={onSelectAll} />
          <span>전체 선택</span>
          <button onClick={onReset}>초기화</button>
        </div>
        {renderConfigShortcutCheckBoxes()}
        <div className="config-shortcut-btn-container">
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

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ITEM_NAME, EventCodeObj, ACTION_NAME_VALUES, ConfigingKeyType, SetIsConfigKeyType } from "../shortcutTypeAndConst";
import { hideConfigShortcutModal } from "../store/componentRenderSlice";
import ConfigShortcutModalBtn from "./ConfigShortcutModalBtn";

function ConfigShortcutModal() {
  const dispatch = useDispatch();

  const defaultShortcutsObj: {
    [actionName in ACTION_NAME_VALUES]: EventCodeObj;
  } = {
    moveToNextCell: {
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      code: "Tab",
    },
    moveToPrevCell: {
      ctrlKey: false,
      shiftKey: true,
      altKey: false,
      code: "Tab",
    },
    moveToUpCell: {
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      code: "ArrowUp",
    },
    moveToDownCell: {
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      code: "ArrowDown",
    },
    moveToLeftCell: {
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      code: "ArrowLeft",
    },
    moveToRightCell: {
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      code: "ArrowRight",
    },
    addRowOrCol: {
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      code: "Equal",
    },
    removeRowOrCol: {
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      code: "Minus",
    },
  } as const;
  let shortcutsObj: {
    [actionName in ACTION_NAME_VALUES]: EventCodeObj;
  };

  let configingKey: ConfigingKeyType = { state: false };
  const setIsConfigKey: SetIsConfigKeyType = (state: any, target?: any, actionName?: any) => {
    configingKey = { state, target, actionName };
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
  const getKoreanActionName = (actionNameValue: ACTION_NAME_VALUES) => {
    switch (actionNameValue) {
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

  let prevCtrlKey: boolean | undefined;
  let prevShiftKey: boolean | undefined;
  let prevAltKey: boolean | undefined;
  let prevCode: string | undefined;
  const setPrevKeys = (ctrlKey: boolean | undefined, shiftKey: boolean | undefined, altKey: boolean | undefined, code: string | undefined) => {
    prevCtrlKey = ctrlKey;
    prevShiftKey = shiftKey;
    prevAltKey = altKey;
    prevCode = code;
  };
  const keydownAtWindowHandler = (event: KeyboardEvent) => {
    if (configingKey.state) {
      event.preventDefault();
      const { ctrlKey, shiftKey, altKey, code } = event;
      if (ctrlKey === prevCtrlKey && shiftKey === prevShiftKey && altKey === prevAltKey && code === prevCode) {
        return;
      }
      setPrevKeys(ctrlKey, shiftKey, altKey, code);
      const target = configingKey.target as HTMLButtonElement;
      target.innerText = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      configingKey.ctrlKey = ctrlKey;
      configingKey.shiftKey = shiftKey;
      configingKey.altKey = altKey;
      configingKey.code = code;
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch(hideConfigShortcutModal());
    }
  };
  const keyUpAtWindowHandler = (event: KeyboardEvent) => {
    if (!configingKey.state || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const { ctrlKey, shiftKey, altKey, code } = configingKey;
    const actionName = configingKey.actionName;
    const eventCodeObj: EventCodeObj = {
      ctrlKey,
      shiftKey,
      altKey,
      code,
    };
    shortcutsObj[actionName] = eventCodeObj;
    const target = configingKey.target as HTMLButtonElement;
    target.blur();
    setIsConfigKey(false);
    setPrevKeys(undefined, undefined, undefined, undefined);
    const shortcutsObjString = JSON.stringify(shortcutsObj);
    localStorage.setItem(ITEM_NAME, shortcutsObjString);
  };

  const renderBtns = () => {
    const itemString = localStorage.getItem(ITEM_NAME);
    if (itemString) {
      const itemObj: {
        [actionName in ACTION_NAME_VALUES]: EventCodeObj;
      } = JSON.parse(itemString);
      shortcutsObj = itemObj;
    } else {
      shortcutsObj = defaultShortcutsObj;
    }
    const btnsArr = [];
    let actionNameValue: ACTION_NAME_VALUES;
    for (actionNameValue in shortcutsObj) {
      const { ctrlKey, shiftKey, altKey, code } = shortcutsObj[actionNameValue];
      const shortcutString = shortcutStringfy(ctrlKey, shiftKey, altKey, code);
      const koreanActionName = getKoreanActionName(actionNameValue);
      btnsArr.push(
        <ConfigShortcutModalBtn key={actionNameValue} koreanActionName={koreanActionName} setIsConfigKey={setIsConfigKey} actionNameValue={actionNameValue} shortcutString={shortcutString} />
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
          <button>초기화</button>
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

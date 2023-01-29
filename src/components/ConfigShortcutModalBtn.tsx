import { SetConfigKey, ActionName, ConfigBtnsRefCurrent, ConfigCheckBoxesRefCurrent } from "../shortcutTypeAndConst";

function ConfigShortcutModalBtn({
  configCheckBoxesValueRef,
  configBtnsRef,
  koreanActionName,
  setConfigKey,
  actionName,
  shortcutString,
  isAbled,
  onCheckboxEvent,
}: {
  configCheckBoxesValueRef: React.MutableRefObject<{} | ConfigCheckBoxesRefCurrent>;
  configBtnsRef: React.MutableRefObject<{} | ConfigBtnsRefCurrent>;
  koreanActionName: string;
  setConfigKey: SetConfigKey;
  actionName: ActionName;
  shortcutString: string;
  isAbled: boolean;
  onCheckboxEvent: (actionName: ActionName, checked: boolean) => void;
}) {
  return (
    <div>
      <input
        type="checkbox"
        defaultChecked={isAbled}
        ref={(elem) => {
          const checkbox = elem as HTMLInputElement;
          if (checkbox) {
            const configCheckBoxesValueRefCurrent = configCheckBoxesValueRef.current as ConfigCheckBoxesRefCurrent;
            configCheckBoxesValueRefCurrent[actionName] = checkbox;
          }
        }}
        onChange={(elem) => {
          const checked = elem.target.checked;
          onCheckboxEvent(actionName, checked);
        }}
      />
      <span>{koreanActionName}</span>
      <button
        ref={(elem) => {
          const btn = elem as HTMLButtonElement;
          const configBtnsRefCurrent = configBtnsRef.current as ConfigBtnsRefCurrent;
          configBtnsRefCurrent[actionName] = btn;
        }}
        onClick={(elem) => {
          const btn = elem.target as HTMLButtonElement;
          btn.innerText = "키 입력중";
          setConfigKey(true, btn, actionName);
        }}
      >
        {shortcutString}
      </button>
    </div>
  );
}
export default ConfigShortcutModalBtn;

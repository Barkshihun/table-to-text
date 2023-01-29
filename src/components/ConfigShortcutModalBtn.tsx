import { SetConfigKey, ActionName, ConfigBtnsRefCurrent, ConfigCheckBoxesRefCurrent } from "../shortcutTypeAndConst";

function ConfigShortcutModalBtn({
  configCheckBoxesRef,
  configBtnsRef,
  koreanActionName,
  setConfigKey,
  actionName,
  shortcutString,
}: {
  configCheckBoxesRef: React.MutableRefObject<{} | ConfigCheckBoxesRefCurrent>;
  configBtnsRef: React.MutableRefObject<{} | ConfigBtnsRefCurrent>;
  koreanActionName: string;
  setConfigKey: SetConfigKey;
  actionName: ActionName;
  shortcutString: string;
}) {
  return (
    <div>
      <input
        type="checkbox"
        defaultChecked
        ref={(elem) => {
          const checkbox = elem as HTMLInputElement;
          const configCheckBoxesRefCurrent = configCheckBoxesRef.current as ConfigCheckBoxesRefCurrent;
          configCheckBoxesRefCurrent[actionName] = checkbox;
        }}
        onChange={() => {
          console.log("AAA");
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

import { SetConfigKey, ActionName, ConfigBtnsRefCurrent } from "../shortcutTypeAndConst";

function ConfigShortcutModalBtn({
  configBtnsRef,
  koreanActionName,
  setConfigKey,
  actionName,
  shortcutString,
}: {
  configBtnsRef: React.MutableRefObject<{} | ConfigBtnsRefCurrent>;
  koreanActionName: string;
  setConfigKey: SetConfigKey;
  actionName: ActionName;
  shortcutString: string;
}) {
  const configBtnsRefCurrent = configBtnsRef.current as ConfigBtnsRefCurrent;
  configBtnsRefCurrent[actionName] = { checkbox: undefined, btn: undefined };
  return (
    <div>
      <input
        type="checkbox"
        defaultChecked
        ref={(elem) => {
          const checkbox = elem as HTMLInputElement;
          configBtnsRefCurrent[actionName].checkbox = checkbox;
        }}
        onChange={() => {
          console.log("AAA");
        }}
      />
      <span>{koreanActionName}</span>
      <button
        ref={(elem) => {
          const btn = elem as HTMLButtonElement;
          configBtnsRefCurrent[actionName].btn = btn;
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

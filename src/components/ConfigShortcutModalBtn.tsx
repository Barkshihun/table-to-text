import { SetConfigKey, ActionName } from "../shortcutTypeAndConst";

function ConfigShortcutModalBtn({
  koreanActionName,
  setConfigKey,
  actionName,
  shortcutString,
}: {
  koreanActionName: string;
  setConfigKey: SetConfigKey;
  actionName: ActionName;
  shortcutString: string;
}) {
  return (
    <div>
      <input type="checkbox" defaultChecked />
      <span>{koreanActionName}</span>
      <button
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

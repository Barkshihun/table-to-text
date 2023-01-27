import { SetIsConfigKeyType, ACTION_NAME_VALUES } from "../shortcutTypeAndConst";

function ConfigShortcutModalBtn({
  koreanActionName,
  setIsConfigKey,
  actionNameValue,
  shortcutString,
}: {
  koreanActionName: string;
  setIsConfigKey: SetIsConfigKeyType;
  actionNameValue: ACTION_NAME_VALUES;
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
          setIsConfigKey(true, btn, actionNameValue);
        }}
      >
        {shortcutString}
      </button>
    </div>
  );
}
export default ConfigShortcutModalBtn;

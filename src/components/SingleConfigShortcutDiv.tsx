import { SetConfigKey, ActionName, SingleConfigShortcutDivElems } from "../types/shortcutTypes";

function SingleConfigShortcutDiv({
  singleConfigShortcutDivElemsRef,
  koreanActionName,
  setConfigKey,
  actionName,
  shortcutString,
  isAbled,
  onCheckEvent,
}: {
  singleConfigShortcutDivElemsRef: React.MutableRefObject<SingleConfigShortcutDivElems | {}>;
  koreanActionName: string;
  setConfigKey: SetConfigKey;
  actionName: ActionName;
  shortcutString: string;
  isAbled: boolean;
  onCheckEvent: (actionName: ActionName, checked: boolean) => void;
}) {
  const singleConfigShortcutDivElems = singleConfigShortcutDivElemsRef.current as SingleConfigShortcutDivElems;
  singleConfigShortcutDivElems[actionName] = {};
  return (
    <div>
      <label className="">
        <input
          type="checkbox"
          defaultChecked={isAbled}
          ref={(elem) => {
            if (elem) {
              singleConfigShortcutDivElems[actionName].checkBoxElem = elem;
            }
          }}
          onChange={(elem) => {
            const checked = elem.target.checked;
            onCheckEvent(actionName, checked);
          }}
        />
        {koreanActionName}
      </label>
      <button
        ref={(elem) => {
          if (elem) {
            singleConfigShortcutDivElems[actionName].btnElem = elem;
          }
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
export default SingleConfigShortcutDiv;

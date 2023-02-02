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
    <div className="modal__shortcut-container">
      <label className="modal__checkbox-container modal__checkbox-container--shortcut">
        <input
          className="modal__checkbox"
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
        <span className="modal__checkbox-text">{koreanActionName}</span>
      </label>
      <button
        className="btn btn-shortcut"
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

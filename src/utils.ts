const transFormPreToText = (pre: HTMLPreElement) => {
  let text = "";
  const length = pre.childNodes.length;
  if (length === 1) {
    text = pre.childNodes[0].textContent as string;
  } else {
    for (let i = 0; i < length - 1; i++) {
      const tempText = pre.childNodes[i].textContent as string;
      text += tempText + "\n";
    }
    text += pre.childNodes[length - 1].textContent ? pre.childNodes[length - 1].textContent : " ";
  }
  return text;
};
export { transFormPreToText };

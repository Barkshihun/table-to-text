import { useEffect } from "react";

function TransformingModal() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  return (
    <div className="modal">
      <div className="modal__content">
        <h1>변환 중...</h1>
      </div>
    </div>
  );
}
export default TransformingModal;

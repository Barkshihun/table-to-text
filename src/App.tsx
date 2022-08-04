import { useState } from "react";
import Desktop from "./components/Desktop";
import Mobile from "./components/Mobile";

function App() {
  const MOBILE_HEIGHT: number = 1000;
  const MOBILE_WIDTH: number = 500;
  let isMobile: Boolean = false;
  if (outerHeight <= MOBILE_HEIGHT && outerWidth <= MOBILE_WIDTH) {
    isMobile = true;
  }
  alert(`${outerHeight}와 ${outerWidth}`);
  return <>{isMobile ? <Mobile /> : <Desktop />}</>;
}

export default App;

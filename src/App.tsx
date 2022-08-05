import { useState } from "react";
import Desktop from "./components/Desktop";
import Mobile from "./components/Mobile";
import "./scss/App.scss";

function App() {
  const MOBILE_HEIGHT: number = 1000;
  const MOBILE_WIDTH: number = 500;
  let isMobile: Boolean = false;
  if (outerHeight <= MOBILE_HEIGHT && outerWidth <= MOBILE_WIDTH) {
    isMobile = true;
  }
  return <>{isMobile ? <Mobile /> : <Desktop />}</>;
}

export default App;

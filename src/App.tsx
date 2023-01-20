import { useSelector, useDispatch } from "react-redux";
import { setIsHome } from "./store/renderedPageSlice";
import { RootState } from "./store/store";
import Output from "./pages/Output";
import Home from "./pages/Home";
import "./scss/App.scss";

function App() {
  const isHome = useSelector((state: RootState) => state.renderedPage.isHome);
  const dispatch = useDispatch();
  return (
    <>
      {" "}
      <header>
        <button
          className="btn btn--main-tranform btn--transform"
          onClick={() => {
            dispatch(setIsHome(!isHome));
          }}
          type={"button"}
        >
          {isHome === true ? "텍스트로 변환" : "표로 가기"}
        </button>
      </header>
      {isHome === true ? <Home /> : <Output />}
    </>
  );
}

export default App;

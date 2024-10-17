import { Route, Routes } from "react-router-dom";
import "./App.css";
import CubeContainer from "./components/cube/CubeContainer";
import XrCubeContainer from "./components/xr-cube/XrCubeContainer";
import XrHitCubeContainer from "./components/xr-hit-cube/XrHitCubeContainer";
import XrHitModelContainer from "./components/xr-hit-model/XrHitModelContainer";

function App() {
  return (
    <Routes>
      <Route path="/ThreeJSTest" element={<XrHitModelContainer />} />
      <Route path="/ThreeJSTest/cube" element={<CubeContainer />} />
      <Route path="/ThreeJSTest/xr-cube" element={<XrCubeContainer />} />
      <Route path="/ThreeJSTest/xr-hit-cube" element={<XrHitCubeContainer />} />
      <Route path="/ThreeJSTest/xr-hit-model" element={<XrHitModelContainer />} />
    </Routes>
  );
}

export default App;

import { Route, Routes, } from "react-router-dom";
import Navigation from "./components/Navigation";
import Settings from "./pages/Settings";


function App() {
  return (
    <div className="h-full w-full">
      <Navigation />
      <div className="pt-12">
        <Routes>
          {/* <Route path="/" element={<Viewer />} /> */}
          <Route path="/settings" element={<Settings/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

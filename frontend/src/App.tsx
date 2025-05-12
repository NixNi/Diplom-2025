import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Settings from "./pages/Settings";
import Connect from "./pages/Connect";
import Working from "./pages/Working";
import AddModel from "./pages/AddModel";
import EditModel from "./pages/EditModel";

function App() {
  return (
    <div className="h-full w-full">
      <Navigation />
      <div className="pt-12">
        <Routes>
          <Route path="/" element={<Working />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/addModel" element={<AddModel />} />
          <Route path="/editModel" element={<EditModel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

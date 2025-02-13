import { Route, Routes } from "react-router-dom";
import "./App.css";
import Explore from "./components/api.tsx";
import Header from "./components/Header.tsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </>
  );
}

export default App;

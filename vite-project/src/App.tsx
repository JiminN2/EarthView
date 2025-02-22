import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import Header from "./components/Header.tsx";
import Explore from "./components/NasaToday.tsx";

function App() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <Routes>
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

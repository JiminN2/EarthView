import { Route, Routes, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import styles from "./App.module.css";
import Header from "./components/Header.tsx";
import Explore from "./components/NasaToday.tsx";
import Introduction from "./components/Introduction.tsx";

type Track = {
  label: string;
  file: string;
};

function App() {
  const navigate = useNavigate();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tracks = useMemo<Track[]>(
    () => [
      { label: "Track 1 — Introduction", file: "introduction" },
      { label: "Track 2 — Orbit", file: "orbit" },
      { label: "Track 3 — Atmosphere", file: "atmosphere" },
      { label: "Track 4 — Oceans", file: "oceans" },
      { label: "Track 5 — Surface", file: "surface" },
    ],
    []
  );

  const activeTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;
  const hasNextTrack = currentTrackIndex !== null && currentTrackIndex + 1 < tracks.length;



  const handleTrackPlay = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    navigate("/introduction");
  };

  const handleTogglePlay = () => {
    if (!activeTrack) return;
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex === null || currentTrackIndex + 1 >= tracks.length) return;
    setCurrentTrackIndex(currentTrackIndex + 1);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      <Header onTrackPlay={handleTrackPlay} />
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome: A Journey Through Time and Space</h1>
        <Routes>
          <Route path="/" element={<Introduction activeTrack={activeTrack}
                isPlaying={isPlaying}
                hasNextTrack={hasNextTrack}
                onTogglePlay={handleTogglePlay}
                onNextTrack={handleNextTrack}
                onTrackEnd={handleTrackEnd}/>} />  {/* 기본 화면: 타이틀만 보임 */}
          <Route
            path="/introduction"
            element={
              <Introduction
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                hasNextTrack={hasNextTrack}
                onTogglePlay={handleTogglePlay}
                onNextTrack={handleNextTrack}
                onTrackEnd={handleTrackEnd}
              />
            }
  />
  <Route path="/explore" element={<Explore />} />
</Routes>
      </div>
    </div>
  );
}

export default App;

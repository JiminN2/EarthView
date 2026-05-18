import { useNavigate } from "react-router-dom";
import styles from "./TracklistSidebar.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onPlay: (index: number) => void;
};

const tracks = [
  { label: "Track 1 — Introduction", file: "introduction" },
  { label: "Track 2 — Orbit", file: "orbit" },
  { label: "Track 3 — Atmosphere", file: "atmosphere" },
  { label: "Track 4 — Oceans", file: "oceans" },
  { label: "Track 5 — Surface", file: "surface" },
];

export default function TracklistSidebar({ isOpen, onClose, onPlay }: Props) {
  const navigate = useNavigate();

  const handlePlay = (index: number) => {
    onPlay(index);
    onClose();
    navigate("/introduction");
  };

  return (
    <>
      <div
        className={isOpen ? `${styles.overlay} ${styles.show}` : styles.overlay}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        id="tracklist-sidebar"
        className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}
        aria-hidden={!isOpen}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className={styles.title}>Tracklist</h2>
        <div className={styles.content}>
          <ul>
            {tracks.map((track, index) => (
              <li key={track.label} className={styles.trackItem}>
                <span>{track.label}</span>
                <button
                  className={styles.playButton}
                  type="button"
                  aria-label={`Play ${track.label}`}
                  onClick={() => handlePlay(index)}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

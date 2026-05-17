import styles from "./TracklistSidebar.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TracklistSidebar({ isOpen, onClose }: Props) {
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
            {[
              "Track 1 — Introduction",
              "Track 2 — Orbit",
              "Track 3 — Atmosphere",
              "Track 4 — Oceans",
              "Track 5 — Surface",
            ].map((track) => (
              <li key={track} className={styles.trackItem}>
                <span>{track}</span>
                <button className={styles.playButton} type="button" aria-label={`Play ${track}`}>
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

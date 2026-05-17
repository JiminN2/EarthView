import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./header.module.css";
import TracklistSidebar from "./TracklistSidebar.tsx";

export default function Header() {
  const [tracklistOpen, setTracklistOpen] = useState(false);

  return (
    <div className={styles.header}>
      <div className={styles.contents}>
        <h1>
          <Link to="/">Earth Project</Link>
        </h1>
        <nav className={styles.navigation}>
          <ul>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>News&Events</li>
            <li>
              <button
                className={styles.trackButton}
                onClick={() => setTracklistOpen(true)}
                aria-expanded={tracklistOpen}
                aria-controls="tracklist-sidebar"
              >
                Tracklist
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <TracklistSidebar isOpen={tracklistOpen} onClose={() => setTracklistOpen(false)} />
    </div>
  );
}

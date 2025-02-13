import { Link } from "react-router-dom";
import styles from "./header.module.css";

export default function Header() {
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
          </ul>
        </nav>
      </div>
    </div>
  );
}

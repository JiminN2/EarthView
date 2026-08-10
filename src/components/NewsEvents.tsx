import ThreeTestBox from "./threetestbox";
import styles from "./NewsEvents.module.css";

export default function NewsEvents() {
  return (
    <main className={styles.newsEvents}>
        <h2>News and Events</h2>
        <ThreeTestBox  />
        <p>Stay updated with the latest news and events related to space exploration.</p>
     
    </main>
    
  );
}
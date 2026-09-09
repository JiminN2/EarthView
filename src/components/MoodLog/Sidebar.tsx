import styles from "./Sidebar.module.css";
import MoodSelector from "./MoodSelector.tsx";

type SidebarProps = {
  selectedNode: string | null;
};

export default function Sidebar({ selectedNode }: SidebarProps) {
  if (!selectedNode) return null;

  return (
    <aside className={styles.sidebar}>
      
      <div className={styles.sidebarContainer}>
        <p>Selected Node: {selectedNode}</p>
        <MoodSelector />
        <h2>Explore why you might be feeling this way</h2>
        <textarea className={styles.textarea} placeholder="Write your journal entry here..." />
        <button type="button" className={styles.submitButton}>
        Submit
      </button>

     </div>
     
    </aside>
  );
}
  

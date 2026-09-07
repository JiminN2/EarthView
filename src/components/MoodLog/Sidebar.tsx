import styles from "./Sidebar.module.css";
import MoodSelector from "./MoodSelector.tsx";

type SidebarProps = {
  selectedNode: string | null;
};

export default function Sidebar({ selectedNode }: SidebarProps) {
  if (!selectedNode) return null;

  return (
    <aside className={styles.sidebar}>
      <p>Selected Node: {selectedNode}</p>
      <MoodSelector />
      <div className = {styles.textareaContainer}>
    
    <h2>Explore why you might be feeling this way</h2>
      <textarea className={styles.textarea} placeholder="Write your journal entry here..." />
     </div>
    </aside>
  );
}
  

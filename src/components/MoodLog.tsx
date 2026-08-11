import styles from "./MoodLog.module.css";
import { useState, useEffect } from "react";

export default function MoodLog() {
  const [draftMood, setDraftMood] = useState("");
  const [savedMoods, setSavedMoods] = useState<string[]>([]);

  useEffect(() => {
    const storedMoods = localStorage.getItem("moods");
    if (storedMoods) {
      try {
        const parsed = JSON.parse(storedMoods);
        if (Array.isArray(parsed)) {
          setSavedMoods(parsed);
          setDraftMood("");
        }
      } catch {
        localStorage.removeItem("moods");
      }
    }
  }, []);

  const handleSave = () => {
    if (!draftMood) return;

    const nextMoods = [...savedMoods, draftMood];
    setSavedMoods(nextMoods);
    setDraftMood("");
    localStorage.setItem("moods", JSON.stringify(nextMoods));
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionContent}>
          How are you feeling right now?
          <textarea
            className={styles.textarea}
            placeholder="Describe your mood..."
            value={draftMood}
            onChange={(e) => setDraftMood(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>

        {savedMoods.length > 0 && (
          <div className={styles.moodLogList}>
            {savedMoods.map((mood, index) => (
              <div key={`${mood}-${index}`} className={styles.moodLogItem}>
                {mood}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
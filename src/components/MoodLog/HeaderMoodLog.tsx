import { useState } from "react";
import styles from "./HeaderMoodLog.module.css";

export default function HeaderMoodLog() {
  const [year, setYear] = useState(2027);
  const [month, setMonth] = useState(1);

  const updateMonth = (offset: number) => {
    const total = year * 12 + (month - 1) + offset;
    const nextYear = Math.floor(total / 12);
    const nextMonth = (total % 12) + 1;

    setYear(nextYear);
    setMonth(nextMonth);
  };

  return (
    <div className={styles.header}>
      <button type="button" className={styles.navButton} onClick={() => updateMonth(-1)} aria-label="previous month">
        &lt;
      </button>

      <span className={styles.title}>{year} - {month}</span>

      <button type="button" className={styles.navButton} onClick={() => updateMonth(1)} aria-label="next month">
        &gt;
      </button>
    </div>
  );
}

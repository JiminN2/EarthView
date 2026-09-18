import { useState } from 'react';
import styles from './MoodSelector.module.css';

type Mood = {
  label: string;
  color: string;
};


const moods: Mood[] = [
  { label: 'Calm', color: '#8FBF5A' },
  { label: 'Happy', color: '#F2E14D' },
  { label: 'Energetic', color: '#C7EA46' },
  { label: 'Neutral', color: '#D9DEE3' },
  { label: 'Anxious', color: '#A96BE0' }, 
  { label: 'Sad', color: '#4C7EF3' },
  { label: 'Angry', color: '#E14B3A' },
];

type MoodSelectorProps = {
  onSelectMood: (mood: Mood) => void;
};

export default function MoodSelector({ onSelectMood }: MoodSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelectMood(moods[index]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>How are you feeling today?</h1>
      <hr className={styles.divider} />

      <div className={styles.selectMood}>
        {moods.map((mood, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.moodOption} ${
              selected === idx ? styles.selected : ''
            }`}
            onClick={() => handleSelect(idx)}
          >
            <span
              className={styles.dot}
              style={{ backgroundColor: mood.color }}
            />
            <span className={styles.label}>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
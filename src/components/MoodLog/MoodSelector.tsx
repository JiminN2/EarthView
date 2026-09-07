import { useState } from 'react';
import styles from './MoodSelector.module.css';

type Mood = {
  label: string;
  color: string;
};

const moods: Mood[] = [
  { label: 'Calm', color: '#8FBF5A' },
  { label: 'Happy', color: '#F2E14D' },
  { label: 'Anxious', color: '#C7EA46' },
  { label: 'Neutral', color: '#D9DEE3' },
  { label: 'Anxious', color: '#A96BE0' }, // 예시 이미지엔 중복 라벨이 있어서 실제로는 라벨 겹치지 않게 조정 권장
  { label: 'Sad', color: '#4C7EF3' },
  { label: 'Angry', color: '#E14B3A' },
];

export default function MoodSelector() {
  const [selected, setSelected] = useState<number | null>(null);

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
            onClick={() => setSelected(idx)}
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
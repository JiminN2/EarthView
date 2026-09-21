import { useState } from "react";
import styles from "./SoundOn.module.css";
import WaveCanvas from "./WaveCanvas.tsx";

export default function SoundOn() {
  const [isSoundOn, setIsSoundOn] = useState(false);

  return (
    <div className={styles.container}>
      <WaveCanvas active={isSoundOn} width={28} height={24} color="white" />
      <div className={styles.button} onClick={() => setIsSoundOn(!isSoundOn)}>
        {isSoundOn ? "sound on" : "sound off"}
      </div>
    </div>
  );
}